"use client"
import { usePathname } from "next/navigation"
import UserNavbar from "./UserNavbar"
import AdminNavbar from "./AdminNavbar";
export default function Navbar(){
  const path=usePathname()
  if(path.startsWith('/admin')){
    return <AdminNavbar />;
  }
  return <UserNavbar />
}