import { Outlet } from 'react-router-dom'

// Authentication removed — this layout now simply renders children
export default function AuthLayout() {
  return <Outlet />
}