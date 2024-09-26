'use client'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { logIn, signUp } from '@/actions/actions'
import AuthFormBtn from './auth-form-btn'
import { useFormState } from 'react-dom'


type AuthFormProps = {
  type: 'logIn' | 'signUp'
}


export default function AuthForm({type}: AuthFormProps) {
 const [signUpError,dispatchSignUp ] =  useFormState(signUp,undefined)
 const [logInError,dispatchLogIn] = useFormState(logIn,undefined)



  return (
 
<form 
action={ type === 'logIn' ? dispatchLogIn : dispatchSignUp}

>
    <div  className='space-y-1'>
        <Label>Email</Label>
        <Input type='email' placeholder='Email' name='email' required maxLength={100} />

    </div>
    <div className= ' mb-4 mt-2 space-y-1'>
        <Label>Password</Label>
        <Input type='password' maxLength={100} placeholder='Password' name='password' required />
    </div>
    
    <AuthFormBtn type={type} />
    <div className='p-1'>

    </div>

    {signUpError && <p className='text-red-500 text-sm'>{signUpError.message}</p>}
    {logInError && <p className='text-red-500 text-sm'>{logInError.message}</p>}




</form>
  )
}
