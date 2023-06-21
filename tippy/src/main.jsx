import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { router } from './utils/routers';
import { FrappeProvider } from 'frappe-react-sdk';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FrappeProvider>
    <ToastContainer
      hideProgressBar={false}
      theme='dark'
       />
    <RecoilRoot>
    <RouterProvider router={router} />
    </RecoilRoot>
    </FrappeProvider>
  </React.StrictMode>,
)
