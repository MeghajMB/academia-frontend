"use client"
import { usePathname } from "next/navigation"
import UserNavbar from "./UserNavbar"
import { useEffect, useState } from "react";
export default function Navbar(){
  const path=usePathname()
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{
    setIsLoading(false)
  },[])
  if(isLoading){
    return null
  }
  if(path.startsWith('/admin')){
    return null;
  }
  return <UserNavbar />
}