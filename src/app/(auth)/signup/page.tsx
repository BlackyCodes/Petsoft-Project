import AuthForm from '@/components/auth-form'
import H1 from '@/components/h1'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <main>
      <H1 className=' mb-5 text-center'>Sign up</H1>
      <AuthForm type='signUp'   />



        <p className='mt-6  text-sm text-zinc-500'>
          Already have an account?{" "} <Link 
          className=' font-medium '
          href="/login">
            
            Log in</Link>
        </p>

    </main>
  

  )
}




