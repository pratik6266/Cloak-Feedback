'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

  const {data: session} = useSession();
  const user: User = session?.user as User

  return (
    <>  
      <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container flex justify-between items-center">
        <a href="/dashboard" className="sm: text-xl font-bold mb-4 md:mb-0 text-gray-300 hover:text-gray-100 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
          Cloak Feedback
        </a>
        {session ? (
          <>
            <Link href='/profile'>
              <span className="mr-4">
                Welcome, {user.userName || user.email}
              </span>
            </Link>
            <Button onClick={() => signOut()} className="bg-slate-100 text-black px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-100 hover:text-base hover:bg-red-600 hover:text-white" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-slate-100 text-black px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-100 hover:text-base hover:bg-gray-700 hover:text-white" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
    </>
  )
}

export default Navbar