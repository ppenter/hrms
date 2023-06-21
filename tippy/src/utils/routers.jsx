import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    useNavigate,
  } from "react-router-dom";
import HomePage from "../pages/Home";
import App from "../App"
import AttendancePage from "../pages/apps/attendance";
import AuthPage from "../pages/auth";
import AdminPage from "../pages/apps/admin"
import { AppLayout } from "../components/layout";

export function ErrorBoundary() {
  // Uncaught ReferenceError: path is not defined
  const navigate = useNavigate()
  return (
    <div>
      <h3>Dang!</h3>
      <a href='/'>กลับหน้าแรก</a>
    </div>
  );
}

export const pages = [
    {
      path: "/tippy",
      element: <AttendancePage/>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/tippy/admin",
      element: <AdminPage/>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/tippy/auth",
      element: <AuthPage/>,
      errorElement: <ErrorBoundary />,
    },
  ]

export const router = createBrowserRouter(pages);