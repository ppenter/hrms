import { useFrappeAuth } from "frappe-react-sdk"
import AuthPage from "../pages/auth"
import { Outlet } from "react-router-dom"

export const AppLayout = ({children}) => {
    const { currentUser,logout } = useFrappeAuth()

    // if(!currentUser){
    //     return <AuthPage/>
    // }
    
    return (
        <>
        {/* Navbar */}
        <div className="flex gap-2 justify-end mb-4 py-2">
            <div className="flex gap-2">
            สวัสดี, {currentUser} <a href='/'>กลับหน้าหลัก</a>
            </div>
        </div>
        {children}
        </>
    )
}