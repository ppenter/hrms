import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
import Card from './components/card'
import { useNavigate } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  const navigate = useNavigate()

  return (
    <div className="App">
        <div id="header" className=''>
          <h3>
            กรุณาเลือกแอพที่ต้องการใช้
          </h3>
        </div>
        <div>
          <Card id='Att' title={'🕒'} className={'cursor-pointer'} onClick={() => {
            navigate('/iapp/attendance')
          }}>
            โปรแกรมลงเวลางาน
          </Card>
        </div>
    </div>
  )
}

export default App
