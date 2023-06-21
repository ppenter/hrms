import React, { useState } from 'react';
import RandomAvatar from './avatar';
import { format } from 'date-fns';
import Button from './button';
import Modal from './modal';
import { randomSeedArray } from '../libs/helper';
import { triggerState } from '../states/setting';
import { supabase } from '../libs/supabaseClient';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

export const EmployeeCard = ({employee, className ,clockIn, clockOut, onClock, seed, changeAvatar ,...props}) => {

  const [trigger, setTrigger] = useRecoilState(triggerState)
  const [isEditAvatar, setIsEditAvatar] = useState(false)

  const upsertAvatar = async (employee_name, _seed) => {
    try{
        const { data, error } = await supabase
        .from('seed')
        .upsert({ 
          employee: employee_name, 
          seed: _seed
      })
      toast("สำเร็จ");
    }catch(e) {
      toast.error("ไม่สำเร็จ");
    }finally{
      setTrigger(!trigger)
    }
  }

  return(
    <div className={`w-full flex gap-4 p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 ${onClock ? 'justify-between' : 'justify-start'} ${props?.onClick ? 'cursor-pointer hover:opacity-50': ''} ${className || ''}`} {...props}>
      <Modal style={{
        maxHeight: '80vh',
        width: '100%',
        maxWidth: '640px'
      }} className={'overflow-auto'} onClose={e => {
        setIsEditAvatar(false)
      }} isOpen={isEditAvatar} title='เลือกรูปโปรไฟล์'>
        <div className='flex justify-center gap-4 w-full overflow-auto flex-wrap'>
            {
              randomSeedArray.map(_seed => {
                return(
                  <RandomAvatar className='cursor-pointer' seed={_seed} onClick={async e => {
                    await upsertAvatar(employee?.name, _seed)
                  }} />
                )
              })
            }
        </div>
      </Modal>
      <RandomAvatar className='cursor-pointer' seed={seed ?? (employee?.first_name + ' ' + employee?.last_name)} onClick={e => {
        if(!changeAvatar) return
        const res = prompt('กรุณาใส่รหัสผ่านของคุณ')
        if(res == employee?.kiosk_pin && res){
          setIsEditAvatar(true)
        }else if(res == ''){
          if(employee?.kiosk_pin == null){
            setIsEditAvatar(true)
          }else{
            setIsEditAvatar(false)
          }
        }
      }} />
      <div className='flex flex-col gap-2 flex-1 whitespace-nowrap'>
        <div className='flex'>
        {employee?.first_name} {employee?.last_name}
        </div>
        <div className='flex gap-2'>
          <p className='text-green-500'>
            {clockIn ? clockIn : null}
          </p>
          <p className='text-red-500'>
            {clockOut ? clockOut : null}
          </p>
        </div>
      </div>
        {
          onClock && (
            <Button onClick={onClock} className="w-16 h-16 text-2xl">🕒</Button>
          )
        }
    </div>
  )
}

const Card = ({ title, description, imageUrl, children, className, ...props }) => {
  return (
    <div className={`max-w-xs rounded-lg shadow-lg bg-white dark:bg-gray-800 ${className}`} {...props}>
      {
      imageUrl && <img className="w-full" src={imageUrl} alt={title} />
      }
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default Card;