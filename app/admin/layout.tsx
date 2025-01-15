import React from 'react'
import AdminNavbar from '@/components/navbar/AdminNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({children}:{children:React.ReactNode}) {

  return <>
  <div className='flex'>
    <AdminNavbar/>

    {children}

  </div>
  </>
  
}
