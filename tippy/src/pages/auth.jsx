import { useFrappeAuth } from "frappe-react-sdk"
import { useState } from "react"
import Input from "../components/input"
import Button from "../components/button"

const AuthPage = props => {
    const {login, logout, currentUser, updateCurrentUser} = useFrappeAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    return(
        <div style={{
            width: '90%'
        }} className="flex flex-start flex-col gap-2 p-4">
        {currentUser}
        <Input label='Username' type='text' value={username} onChange={(e) => {
            setUsername(e.target.value)
        }} />
        <Input label='Password' type='password' value={password} onChange={(e) => {
            setPassword(e.target.value)
        }} />
        <Button onClick={e => {
            login(username, password)
            updateCurrentUser()
        }}>Login</Button>
        </div>
    )
}

export default AuthPage