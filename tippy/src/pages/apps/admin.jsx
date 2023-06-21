import { useFrappeAuth, useFrappeCreateDoc, useFrappeGetDoc, useFrappeGetDocList, useFrappeUpdateDoc } from "frappe-react-sdk"
import { useRecoilState } from "recoil"
import { EmployeeCard } from "../../components/card"
import { format } from "date-fns"
import {supabase} from '../../libs/supabaseClient'
import { toast } from "react-toastify"
import Modal from "../../components/modal"
import {companySelectionState, employeeSelectionState} from '../../states/selection'
import PinPad from "../../components/pinpad"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam";
import Clock from "../../components/clock"
import Button from "../../components/button"
import {b64toBlob} from "../../utils/image"
import Dropdown from '../../components/dropdown'
import { seedsState, triggerState } from "../../states/setting"
import { AppLayout } from "../../components/layout"
import Calendar from "../../components/calendar"
import Input from "../../components/input"
import ObjectTable from "../../components/objectTable"
import {getFirstAndLastOfMonth, getFirstAndLastOfMonthUseMonth, monthLong, monthLongTH} from '../../utils/dates'
import { th } from "date-fns/locale"
import Pagination from "../../components/pagination"

export const MonthModal = ({...rest}) => {

    const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Mock data for activities
  const activities = [
    {
      id: '1',
      date: '2023-06-01',
      value: 'Activity 1',
      description: 'Description for Activity 1',
    },
    {
      id: '2',
      date: '2023-06-05',
      value: 500,
      description: 'เบิก',
    },
    {
      id: '3',
      date: '2023-06-15',
      value: 'Activity 3',
      description: 'Description for Activity 3',
    },
  ];

  // Mock data for holidays
  const holidays = ['2023-06-03', '2023-06-10', '2023-06-17'];
  
    return (
        <div {...rest}>
            <Calendar
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        activities={activities}
        holidays={holidays}
      />
        </div>
    )
}

const AdminPage = props => {
    // frappe
    // const companies = useFrappeGetDocList('Company')
    const employees = useFrappeGetDocList('Employee', {
        fields: ['name', "first_name", "last_name", "kiosk_pin", "branch", "employee_name","company", "holiday_list", "employment_type"],
        limit_start: 0,
        limit: 100,
        filters: {
            // company: selectedCompany
        }
    })

    // useState
    // const [isPinPadOpen, setIsPinPadOpen] = useState(false)
    const [isClockTab, setIsClockTab] = useState(false)
    const [trigger, setTrigger] = useRecoilState(triggerState)

    const {currentUser} = useFrappeAuth()

    // selected
    const [selectedCompany, setSelectedCompany] = useRecoilState(companySelectionState)
    const [selectedEmployee, setSelectedEmployee] = useRecoilState(employeeSelectionState)
    const [isLoading, setIsLoading] = useState(false)

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

const [selectedDate, setSelectedDate] = useState(null)
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
const [attendances, setAttendances] = useState([])

useEffect(() => {
    setAttendances(null)
    if(selectedEmployee && selectedMonth && selectedYear){
        fetchAttendanceForThisMonth(selectedMonth, selectedYear, selectedEmployee)
    }
},[selectedEmployee, selectedMonth])

const fetchAttendanceForThisMonth = async (_month,_year, employee) => {
    try{
        const month = getFirstAndLastOfMonthUseMonth(_month, _year)
        const {data, error} = await supabase.from('attendance_record').select('*')
        .lt('date', format(month.lastDay, 'yyyy-MM-dd'))
        .gt('date', format(month.firstDay, 'yyyy-MM-dd'))
        .eq('employee', employee?.name)
        if(data){
            setAttendances(p => ({...p, [employee?.name]: data}))
        }
    }catch(e){
        console.log(e)
    }
}

const [employeeList, setEmployeeList] = useState([])

    useEffect(() => {
        var obj = employees?.data?.reduce(function(acc, cur, i) {
            acc[i] = cur.name;
            return acc;
          }, []);
          setEmployeeList(obj)
    },[employees?.data])

    useEffect(() => {
        fetchClockingLog(selectedEmployee?.name, new Date())
      },[selectedEmployee, isClockTab])
    
      useEffect(() => {
        fetchAllClockingLog(Date.now())
        fetchAllSeed()
      },[trigger, employeeList])
    
      useEffect(() => {
      },[seeds])

      const [filterByBranch, setFilterByBranch] = useState('')
      const [filterByName, setFilterByName] = useState('search')

      const { createDoc } = useFrappeCreateDoc()
      const { updateDoc } = useFrappeUpdateDoc()

      const payrolls = useFrappeGetDocList('Custom Payroll', {
        fields: ['name', "employee", "amount", "posting_date"],
        limit_start: 0,
        limit: 100,
        filters: {
            'posting_date': ['between', [getFirstAndLastOfMonthUseMonth(selectedMonth, selectedYear).firstDay, getFirstAndLastOfMonthUseMonth(selectedMonth, selectedYear).lastDay]],
            'employee': selectedEmployee?.name || 'This is an random text'
        }
      })

      const payrollSum = payrolls?.data?.reduce((acc,cur) => {
        return acc + cur?.amount
      }, 0)

      const [isPayrollDialog, setIsPayrollDialog] = useState(false)
      const [isStatusDialog, setIsStatusDialog] = useState(false)
      const [statusMode, setStatusMode] = useState('update')

      const {data: erp_attendances} = useFrappeGetDocList('Attendance', {
        fields: ['name', "employee", "employee_name", "attendance_date", "status"],
        limit_start: 0,
        limit: 2000,
        filters: {
            'attendance_date': ['between', [getFirstAndLastOfMonthUseMonth(selectedMonth, selectedYear).firstDay, getFirstAndLastOfMonthUseMonth(selectedMonth, selectedYear).lastDay]],
            'employee': selectedEmployee?.name || 'This is an random text'
        }
      })

      const dateColors = erp_attendances?.reduce((acc,cur) => {
        let color = 'white'
        switch(cur?.status) {
            case 'Present':
              // code block
              color = 'lightgreen'
              break;
            case 'On Leave':
                color = 'lightblue'
              break;
            case 'Absent':
                color = 'red'
            break;
            case 'Half Day':
                color = 'lightyellow'
            break;
            default:
                color = 'white'
          }

        return {...acc, [cur?.attendance_date]: color}
      },{})

      const {data: holiday_list} = useFrappeGetDoc('Holiday List', selectedEmployee?.holiday_list)
      const holidays = holiday_list?.holidays?.map(h => h.holiday_date)

      const {data: salary_structure} = useFrappeGetDocList('Custom Salary Structure', {
        fields: ['name', "employee", "month", "year", "amount"],
        limit_start: 0,
        limit: 1,
        filters: {
            'month': selectedMonth,
            'year': selectedYear,
            'employee': selectedEmployee?.name || 'This is an random text'
        }
      })

      const {data: last_salary_structure} = useFrappeGetDocList('Custom Salary Structure', {
        fields: ['name', "employee", "month", "year", "amount"],
        limit_start: 0,
        limit: 1,
        filters: {
            'month': selectedMonth - 1,
            'year': selectedYear,
            'employee': selectedEmployee?.name || 'This is an random text'
        }
      })
    

    const holidayInMonth = holidays?.reduce((acc, cur) => {
        if(parseInt(cur.split('-')?.[1] || 0) == selectedMonth && parseInt(cur.split('-')?.[0] || 0) == selectedYear){
            return acc + 1
        }else{
            return acc
        }
    },0)

    const daysInMonth = getFirstAndLastOfMonthUseMonth(selectedMonth, selectedYear)?.daysAmount

    const paymentDays = daysInMonth - holidayInMonth

    const workingDays = erp_attendances?.reduce((acc,cur) => {
        if(cur?.status == 'Present'){
            return acc + 1
        }else if(cur?.status == 'Half Day'){
            return acc + 0.5
        }else if(cur?.status == 'On Leave'){
            return acc + 1
        }else{
            return acc
        }
    },0)

    const remain = () => {
        if(selectedEmployee && salary_structure){
            let remaining = 0
            const amount = salary_structure?.[0]?.amount || 0
            switch (selectedEmployee?.employment_type) {
                case 'รายวัน':
                    remaining = workingDays * amount
                    break;
                case 'รายเดือน':
                    remaining = amount
                    break;
                case 'รายเดือนหักรายวัน':
                    const leaveDays = paymentDays - workingDays
                    remaining = amount - (leaveDays * (amount / 30)) 
                    break;
                default:
                    break;
            }
            return remaining
        }
        
        return 0
    }

    const att_status = ['Present', 'Absent', 'On Leave', 'Half Day']
    var path = location.protocol + '//' + location.host + '/someting';

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 8

    const filteredEmployee = employees?.data?.map(employee => {
        let none = false
        const full_name = employee?.employee_name
        if(filterByBranch != ''){
            if(!employee?.branch?.includes(filterByBranch)){
                none = true
            }
        }
        if(filterByName != ''){
            if(!full_name?.includes(filterByName)){
                none = true
            }
        }
        if(none) return
        return employee
    }).filter(e => !!e)

    return (
        <AppLayout>
            <div style={{
            width: '90vw',
            maxWidth: '100%'
        }} className="flex flex-col gap-2 pb-24">
            <EmployeeCard onClock={e => {
                e.stopPropagation()
                setIsClockTab(true)
            }} seed={seeds?.[selectedEmployee?.name]?.seed} clockIn={clockingLog?.[selectedEmployee?.name]?.clock_in?.substring(0,5)} clockOut={clockingLog?.[selectedEmployee?.name]?.clock_out?.substring(0,5)} employee={selectedEmployee} />

<ObjectTable _headers={['name','employee_name', 'branch', 'company', 'employment_type']} data={[selectedEmployee]} />
<div className='flex gap-2 justify-end p-4'>
            <a href={`${window.location.origin.toString()}/app/employee?name=${selectedEmployee?.name}`} target="_blank">เปิดบนโต๊ะทำงาน</a>
</div>
        <Calendar
            onDateSelect={(e) => {
                setSelectedDate(e)
            }}
            selectedDate={selectedDate}
            onMonthYearChange={(e, o) => {
                setSelectedMonth(o?.month)
                setSelectedYear(o?.year)
            }}
            dateColors={dateColors}
            // activities={activities}
            holidays={holidays}
        />
        
        <Modal style={{
            width: '80%',
        }} isOpen={isClockTab} onClose={e => {
            setIsClockTab(false)
        }}>
            <div className="flex gap-2 mb-4">
            <Input value={filterByBranch} onChange={e => {
                setFilterByBranch(e.target.value)
            }} label='สาขา' />
            <Input value={filterByName} onChange={e => {
                setFilterByName(e.target.value)
            }} label='ชื่อ' />
            </div>
            
        <div className="flex gap-2 flex-wrap justify-evenly">
        {filteredEmployee?.map((employee, index) => {
            const start = (currentPage - 1) * perPage
            const end = (currentPage) * perPage
            if(index < start || index >= end) return null
            return(
                <div className="flex-1" >
                    <EmployeeCard seed={seeds?.[employee?.name]?.seed} clockIn={employee?.branch} clockOut={employee?.company} employee={employee} onClick={() => {
                        setSelectedEmployee(employee)
                        setIsClockTab(false)
                    }} />
                    </div>
                )
        })}
        </div>
        <Pagination totalItems={filteredEmployee?.length || 0} perPage={perPage} currentPage={currentPage} onChange={e => {
            setCurrentPage(e)
        }} />
        </Modal>

        <Modal title='เบิกเงิน' isOpen={isPayrollDialog} onClose={e => {
            setIsPayrollDialog(false)
        }}>
            <div className="flex flex-col gap-4">
            <Input label='จำนวน' id='payroll_amount_text' />
            <Button variant='danger' onClick={async e => {
                const amount = document.getElementById('payroll_amount_text')?.value || 0
                if(amount <= 0) return
                await createDoc('Custom Payroll',{
                    employee: selectedEmployee?.name,
                    employee_name: selectedEmployee?.employee_name,
                    posting_date: selectedDate,
                    amount: amount,
                    company: selectedEmployee?.company
                })
                setIsPayrollDialog(false)
            }}>
                จ่ายเงิน
            </Button>
            </div>
        </Modal>

        <Modal title={`${statusMode?.toLocaleUpperCase()}`} isOpen={isStatusDialog} onClose={e => {
            setIsStatusDialog(false)
        }}>
            <div className="flex gap-2">
            {att_status?.map(status => (
                <Button onClick={async e => {
                    const res = confirm('ยืนยัน​?')
                    if(res){
                        if(statusMode == 'update'){
                            const doc = erp_attendances.find(att => att.attendance_date == selectedDate)
                            const r = await updateDoc('Attendance', doc?.name, {
                                status: status
                            })
                            setIsStatusDialog(false)
                        }else if(statusMode == 'new'){
                            const r = await createDoc('Attendance', {
                                employee: selectedEmployee?.name,
                                employee_name: selectedEmployee?.employee_name,
                                status: status,
                                attendance_date: selectedDate,
                                company: selectedEmployee?.company,
                                docstatus: 1
                            })
                            setIsStatusDialog(false)
                        }
                    }
                }}>
                    {status}
                </Button>
            ))}
            </div>
        </Modal>

        <div className="flex justify-evenly gap-2">

        <div className="flex flex-1 flex-col gap-4 max-w-sm p-4 border border-zinc-300 rounded-xl">
            <div className="flex gap-2">
                <p>
                {`ฐานเงินเดือน: ${salary_structure?.[0]?.amount?.toLocaleString()}`}
                </p>
                <a href={`${window.location.origin.toString()}/app/custom-salary-structure?employee=${selectedEmployee?.name}`} target="_blank">📄</a>
            </div>

           <div>
            เบิกแล้ว ({monthLongTH?.[selectedMonth - 1]})
            <a href={`${window.location.origin.toString()}/app/custom-payroll?employee=${selectedEmployee?.name}`} target="_blank">📄</a>
           </div>
           <div>
            {(payrollSum || 0)?.toLocaleString()} / {remain()?.toLocaleString()}
           </div>
           <Button className={`${!!salary_structure?.[0] ? 'hidden' : ''}`} variant='danger' onClick={async e => {
                const amount = prompt('เงินเดือน', last_salary_structure?.[0]?.amount || 0)
                if(parseFloat(amount) <= 0) return
                if(amount){
                    await createDoc('Custom Salary Structure',{
                        employee: selectedEmployee?.name,
                        month: selectedMonth,
                        year: selectedYear,
                        amount: parseFloat(amount)
                    })
                }
            }}>
                สร้างฐานเงินเดือน
            </Button>
        </div>

        <div className={`flex flex-1 flex-col gap-4 max-w-sm p-4 border border-zinc-300 rounded-xl ${selectedDate ? '' : 'hidden'}`}>
           <div>
            {format(new Date(selectedDate), 'd LLLL yyyy', {locale: th})}
           </div>
           <div className='flex gap-2'>
            {erp_attendances?.find(att => att.attendance_date == selectedDate)?.status}
            <a href={`${window.location.origin.toString()}/app/attendance?employee=${selectedEmployee?.name}`} target="_blank">📄</a>
           </div>
           {!!erp_attendances?.find(att => att.attendance_date == selectedDate)?.status ? 
           <Button variant={'primary'} onClick={e => {
            setIsStatusDialog(true)
            setStatusMode('update')
           }}>
            แก้ไข
        </Button>
    :    
    <Button variant={'primary'} onClick={e => {
        setIsStatusDialog(true)
        setStatusMode('new')
       }}>
        เพิ่ม
    </Button>
    }
    <Button variant={'danger'} onClick={e => {
            setIsPayrollDialog(true)
           }}>
            เบิกเงินเดือน
        </Button>
        </div>

        </div>
        <ObjectTable _headers={['clock_in', 'clock_out', 'clock_in_image', 'clock_out_image']} data={[attendances?.[selectedEmployee?.name]?.find(a => a.date == selectedDate)]} />
        </div>
        </AppLayout>
    )
}
export default AdminPage