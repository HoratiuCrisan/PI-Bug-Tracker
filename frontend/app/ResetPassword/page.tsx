"use client"
import React, {useState} from 'react'
import Image from 'next/image'
import EmailImage from '../../public/send-verification-code-to-email.svg'

const ResetPassword = () => {

    const [email, setEmail] = useState('')

    const handleSubmit = (e:any) => {
        e.preventDefault()
        
        const value = {email}
        console.log(value)
    }
    
    return (
        <div className='bg-slate-600 min-h-screen flex items-center justify-center'>
            <div className='bg-gray-400 flex rounded-2xl shadow-2xl max-w-4xl p-5'>
                <h1 className='font-bold text-2xl '>
                    <span className='text-blue-600'>Bug</span>
                    <span className='text-gray-900'>Tracker</span>
                </h1>
                <div className='w-1/2 m-auto text-center items-center'>
                    <h1 className='font-bold text-xl text-gray-800'>
                        Enter your email address: 
                    </h1>

                    <form 
                        onSubmit={handleSubmit}
                        className='mt-2'
                    >
                        <div className='bg-gray-100 w-64 p-2 mt-4 flex items-center rounded-xl w-full'>
                            <input 
                                type='email'
                                name='email'
                                id='reset-password-email'
                                required
                                autoComplete='off'
                                placeholder='Email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='outline-none bg-gray-100 w-full'
                            />
                        </div>

                        <button 
                            type='submit'
                            className='bg-gray-600 text-white text-xl rounded-2xl w-full px-2 py-1 mt-4'
                        >
                            Confirm
                        </button>

                    </form>
                </div>

                <div className='w-3/4'>
                    <Image src={EmailImage} alt='email verification image'/>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword