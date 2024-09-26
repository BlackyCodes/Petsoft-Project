'use client'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
const routes = [
    {
        label: 'Dashboard',
        path: '/app/dashboard',
    },
    {
        label: 'Account',
        path: '/app/account',
    },
 
    
]

export default function AppHeader() {
  const activePathName = usePathname()
  return (
    <header className='flex  justify-between items-center border-b border-white/10  py-2'>
 <Logo/>
 <nav className=''>
    <ul className='flex gap-2 text-sm '>
      {
        routes.map((route => (
          <li key={route.path}>
            <Link href={route.path}
            className={cn('text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition', {
              'bg-black/10  text-white': activePathName === route.path

            })}
            
            >{route.label}</Link>

          </li>
        )))
      }
    </ul>
 </nav>
        
        
        </header>
  )
}
