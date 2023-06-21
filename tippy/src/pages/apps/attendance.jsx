import { useFrappeAuth, useFrappeCreateDoc, useFrappeGetDocList } from "frappe-react-sdk"
import { useRecoilState } from "recoil"
import {companySelectionState} from '../../states/selection'
import { EmployeeCard } from "../../components/card"
import { format } from "date-fns"
import {supabase} from '../../libs/supabaseClient'
import { toast } from "react-toastify"
import Modal from "../../components/modal"
import PinPad from "../../components/pinpad"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam";
import Clock from "../../components/clock"
import Button from "../../components/button"
import {b64toBlob} from "../../utils/image"
import Dropdown from '../../components/dropdown'
import { seedsState, triggerState } from "../../states/setting"
import { AppLayout } from "../../components/layout"

const AttendancePage = props => {
    // frappe
    const companies = useFrappeGetDocList('Company')
    const employees = useFrappeGetDocList('Employee', {
        fields: ['name', "first_name", "last_name", "kiosk_pin"],
        limit_start: 0,
        limit: 2000,
        filters: {
            // company: selectedCompany
        }
    })

    // useState
    const [isPinPadOpen, setIsPinPadOpen] = useState(false)
    const [isClockTab, setIsClockTab] = useState(false)
    const [trigger, setTrigger] = useRecoilState(triggerState)

    const {currentUser} = useFrappeAuth()

    // selected
    const [selectedCompany, setSelectedCompany] = useRecoilState(companySelectionState)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // webcam
    const webcamRef = useRef(null);
    const videoConstraints = {
        facingMode: "user",
    };

    const capture = () => {
        return webcamRef?.current?.getScreenshot();
    };

    const upload = async () => {
        try{
            const imageSrc = capture();
        const image = await b64toBlob(imageSrc.split(",")[1], "image/jpg");
        const uploadFile = await supabase.storage
          .from("attendance_images")
          .upload(`${selectedEmployee?.name}-${Date.now()}.jpg`, image, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadFile.error) {
          toast.error(`เกิดข้อผิดผลาด\n${uploadFile.error.message}`);
          return null
        }else{
          return uploadFile.data?.path
        }
        }catch(e){
            console.log(e)
        }
        
    }

    // clocking log

    const [clockingLog, setClockingLog] = useState(undefined)
    const [allClockingLog, setAllClockingLog] = useState(undefined)

  const fetchAllClockingLog = async (_date) => {
    try{
        setIsLoading(true)
        const log = await supabase.from('attendance_record').select('*')
        .eq('date',format(_date, 'yyy-LL-dd').toString())
        if(log?.data?.[0]?.employee){
            var obj = log?.data?.reduce(function(acc, cur, i) {
                if(!employeeList.includes(cur?.employee)) return acc
                acc[cur?.employee] = cur;
                return acc;
              }, {});
              setClockingLog(p => ({...p, ...obj}))
        }
        
    }catch (e) {
        console.log(e)
    }finally {
      setIsLoading(false)
    }
};

const [seeds, setSeeds] = useRecoilState(seedsState)

const fetchAllSeed = async (_date) => {
    try{
        setIsLoading(true)
        const log = await supabase.from('seed').select('*')
        console.log(log)
        if(log?.data?.[0]?.employee){
            var obj = log?.data?.reduce(function(acc, cur, i) {
                if(!employeeList.includes(cur?.employee)) return acc
                acc[cur?.employee] = cur;
                return acc;
              }, {});
              setSeeds(p => ({...p, ...obj}))
        }
        
    }catch (e) {
        console.log(e)
    }finally {
      setIsLoading(false)
    }
};

  const fetchClockingLog = async (employee_name, _date) => {
    try{
        setIsLoading(true)
        const log = await supabase.from('attendance_record').select('*')
        .eq('date',format(_date, 'yyy-LL-dd').toString())
        .eq('employee', employee_name)
        .single()
        if(log?.data){
            setClockingLog(p => ({...p, [employee_name]: log?.data}))
        }
        
    }catch (e) {
        console.log(e)
    }finally {
      setIsLoading(false)
    }
};

const [employeeList, setEmployeeList] = useState([])

    useEffect(() => {
        var obj = employees?.data?.reduce(function(acc, cur, i) {
            acc[i] = cur.name;
            return acc;
          }, []);
          setEmployeeList(obj)
    },[employees?.data])


    const clock_out = async (person_id, timestamp) => {
        try{
          setIsLoading(true);
          const path = await upload()
          if(path){
            const { data, error } = await supabase
            .from('attendance_record')
            .upsert({ 
              employee: person_id, 
              date: format(timestamp, 'yyyy-LL-dd'), 
              clock_out_image: path,
              clock_out: format(timestamp, 'HH:mm:ss').toString(),
              kiosk: currentUser
          })
            toast("ออกงานงานสำเร็จ");
            setIsPinPadOpen(false)
            setIsClockTab(false)
            setIsLoading(false);
          }else{
    
          }
        }catch(e) {
    
        }finally{
          setIsLoading(false);
          setTrigger(!trigger)
        }
      }

    const clock_in = async (person_id, timestamp) => {
        try{
          setIsLoading(true);
          const path = await upload()
          if(path){
            const { data, error } = await supabase
            .from('attendance_record')
            .upsert({ 
              employee: person_id, 
              date: format(timestamp, 'yyyy-LL-dd'), 
              clock_in: format(timestamp, 'HH:mm:ss').toString(),
              clock_in_image: path,
              clock_out: null,
              kiosk: currentUser
          })
            toast("เข้างานสำเร็จ");
            setIsPinPadOpen(false)
            setIsClockTab(false)
            setIsLoading(false);
          }else{
    
          }
        }catch(e) {
    
        }finally{
          setIsLoading(false);
          setTrigger(!trigger)
        }
      }

    const onPinPadSubmitHandler = (pin) => {
        console.log(pin)
        if(pin == selectedEmployee?.kiosk_pin){
            setIsClockTab(true)
        }else{
            toast.error('รหัสไม่ถูกต้อง')
            setIsClockTab(false)
        }
       
    }

    useEffect(() => {
        fetchClockingLog(selectedEmployee?.name, new Date())
      },[selectedEmployee, isClockTab])
    
      useEffect(() => {
        console.log(employeeList)
        fetchAllClockingLog(Date.now())
        fetchAllSeed()
      },[trigger, employeeList])
    
      useEffect(() => {
        console.log(seeds)
      },[seeds])
    

    return (
        <AppLayout>
            <div style={{
            width: '100%',
            padding: '0px 12px 12px 24px'
        }} className="flex flex-col gap-2">
            <Modal title={`${isClockTab ? '' : 'กรุณาใส่รหัส'} คุณ ${selectedEmployee?.first_name}`} isOpen={isPinPadOpen} onClose={e=> {
                setIsPinPadOpen(false)
                setIsClockTab(false)
            }} className='min-w-xl w-full max-w-lg'>
                {
                    isClockTab ? 
                    <div>
                        <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <div className="flex gap-2 justify-center p-4">
            เวลา <Clock /> น.
          </div>
          <div className="flex gap-4 justify-end">
          {!isLoading && (
            <>
            {
            !clockingLog?.[selectedEmployee?.name]?.clock_in && 
            <Button
            variant={'primary'}
            onClick={async () => {
              await clock_in(selectedEmployee?.name, new Date())
            }}
          >
            เข้างาน
          </Button>
            }
              {
                clockingLog?.[selectedEmployee?.name]?.clock_in && 
                <Button
                variant={'danger'}
                onClick={() => {
                    clock_out(selectedEmployee?.name, new Date())
                }}
              >
                ออกงาน
              </Button>
              }
              
            </>
          )}
          <Dropdown
          label='แก้ไข'
            options={[
                { value: 'clock-in', label: 'เข้างาน' },
                { value: 'clock-out', label: 'ออกงาน' },
              ]}
              onSelect={(e) => {
                console.log(e)
                if(e.value == 'clock-in'){
                    const res = confirm('ยืนยันแก้ไข้การเข้างาน')
                    if(res){
                        clock_in(selectedEmployee?.name, new Date())
                    }
                }else if(e.value == 'clock-out'){
                    const res = confirm('ยืนยันแก้ไข้การออกงาน')
                    if(res){
                        clock_out(selectedEmployee?.name, new Date())
                    }
                }
              }}
          />
          </div>
                    </div>
                    :
                    <PinPad onSubmit={e => {
                        onPinPadSubmitHandler(e)
                    }} />
                }
                
            </Modal>
            <div style={{
              fontWeight: 'bold',
              fontSize: '48px'
            }} className="tracking-widest">
              <Clock/>
            </div>
            <div className="flex w-full ">
              <h4>
                รายชื่อพนักงาน
              </h4>
            </div>
            {employees?.data?.map(employee => (
                <EmployeeCard changeAvatar seed={seeds?.[employee?.name]?.seed} clockIn={clockingLog?.[employee?.name]?.clock_in?.substring(0,5)} clockOut={clockingLog?.[employee?.name]?.clock_out?.substring(0,5)} employee={employee} onClock={async () => {
                    if(!employee?.kiosk_pin){
                        setSelectedEmployee(employee)
                        setIsPinPadOpen(true)
                        setIsClockTab(true)
                    }else{
                        setSelectedEmployee(employee)
                        setIsPinPadOpen(true)
                        setIsClockTab(false)
                    }
                }} />
            ))}
        </div>
        </AppLayout>
    )
}
export default AttendancePage