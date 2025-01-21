'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
    const {courseSlug}=useParams()
  return (
    <div>{courseSlug}</div>
  )
}
