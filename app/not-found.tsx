'use client'
import Link from "next/link";

import { usePathname } from 'next/navigation'

export default function NotFound() {
  const path=usePathname();
  const returnPath = path.startsWith('/admin') ? '/admin' : '/';
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-white text-xl font-bold mb-4">Not Found</h2>
      <p className="text-white mb-4">Could not find requested resource</p>
      <Link className="text-blue-500 hover:underline" href={returnPath}>
        Return Home
      </Link>
    </div>
  );
}
