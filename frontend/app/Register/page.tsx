"use client"
import React, { useState} from 'react'
import Image from 'next/image'
import RegisterImage from '../../public/register-image.svg'
import {
    AiTwotoneMail, 
    AiTwotoneUnlock, 
    AiTwotoneEye, 
    AiTwotoneEyeInvisible,
} from 'react-icons/ai'
import {BiSolidUser} from "react-icons/bi"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Register = () => {
    const router = useRouter()
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false)
    const [error, setError] = useState<string|null>(null)

    //Change the password visibility icon when clicking on it
    //In order to see or hide the password
    const ConfirmPasswordIcon = confirmPasswordVisible == true ? AiTwotoneEyeInvisible : AiTwotoneEye
    const PasswordIcon = passwordVisible == true ? AiTwotoneEyeInvisible : AiTwotoneEye

    const togglePasswordVisiblility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const toggleConfrimPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(null)
        e.preventDefault()

        if (password != confirmPassword) {
            setError('Passwords are not matching!');
            return;
        }

        /*
            Check if username includes whitespaces
            And combine each word with an upper case first letter
            Else alter the first letter to upper case 
            
            The rest of the word will be in lower case
        */
        const checkUsername = userName.split(' ')
        let verifiedUsername = ""
        if (checkUsername.length > 1) {
            checkUsername.forEach(element => {
                verifiedUsername = verifiedUsername + element[0].toUpperCase() + element.slice(1).toLowerCase()
            })
        }
        else 
            verifiedUsername = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()

        try {
            const response = await fetch("https://localhost:7181/api/Auth/register", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "userName": verifiedUsername,
                    "email": email,
                    "password": password
                })
            });
            /* 
                Redirect to the login page if the resonse is OK 
                Else check if the email is already taken
                Or check if the username is already taken
            */
            if (response.ok)
                window.location.href = "/"
            else if ((await response.text()).slice(0) == "Email already exists!")
                setError('Email is already taken!')
            else 
                setError('Username is already taken!')
                
        } catch(error) {
            console.error('Registration error occured: ', error);
            
        }
        
    }

  return (
    <div className='bg-slate-100 min-h-screen flex items-center justify-center'>
        {/* Register Form */}
        <div className='bg-gray-100 flex rounded-2xl shadow-2xl max-w-4xl p-5'>
            <div className='w-full lg:w-1/2 mr-10 mt-5'>
                <div className='flex items-center'>
                    <hr className='flex-grow border-t-2 border-gray-400'/>
                    <span className='px-4 text-sky-600 font-bold text-2xl'>Registration</span>
                    <hr className='flex-grow border-t-2 border-gray-400' />
                </div>

                <p className='text-sm text-center font-semibold text-gray-500 mt-2'>
                        Start your journey with us today by filling in your personal information
                </p>
                
                <form 
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-4 mt-2'>
                    <div className='items-center justify-center'>
                        <div className='bg-white p-2 flex items-center rounded-xl w-full'>
                                <BiSolidUser
                                    className="text-gray-700 mr-2"
                                    size={20}
                                />
                                <input 
                                    type='text' 
                                    placeholder='Username' 
                                    autoComplete='off'
                                    required
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className='outline-none w-full'
                                />
                            </div>


                        <div className='bg-white p-2  flex items-center rounded-xl w-full mt-3'>
                        <AiTwotoneMail 
                            className="text-gray-700 mr-2"
                            size={20}  
                        />

                        <input 
                            type="email" 
                            name="email" 
                            placeholder='Email Address' 
                            id="email" 
                            autoComplete='off'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='outline-none w-full' 
                        />

                        </div>

                        <div className='bg-white p-2 mt-4 flex items-center rounded-xl'>
                            <AiTwotoneUnlock
                                className="text-gray-700 mr-2"
                                size={25}
                            />

                            <input 
                                type={(passwordVisible === false? 'password' : 'text' )}
                                name="password" 
                                placeholder='Password' 
                                id="password"
                                required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                className='outline-none w-full'  
                            />

                            <PasswordIcon
                                className="text-gray-700 toggle-password ml-8"
                                size={25}
                                onClick={togglePasswordVisiblility}
                            />

                        </div>

                        <div className='bg-white p-2 mt-4 flex items-center rounded-xl'>
                            <AiTwotoneUnlock
                                className="text-gray-700 mr-2"
                                size={25}
                            />

                            <input 
                                type={(confirmPasswordVisible === false? 'password' : 'text' )}
                                name="password" 
                                placeholder='Confirm password' 
                                id="confirm-password"
                                required
                                value={confirmPassword}
                                onChange={(e)=> setConfirmPassword(e.target.value)}
                                className='outline-none w-full'  
                            />

                            <ConfirmPasswordIcon
                                className="text-gray-700 toggle-password ml-8"
                                size={25}
                                onClick={toggleConfrimPasswordVisibility}
                            />
                        </div>
                            
                        <button 
                            type='submit'
                            className='bg-gray-800 text-white font-bold rounded-xl px-2 py-1 mt-5 w-full'
                        >
                            Create Account
                        </button>

                        {/* Display registration errors */}
                        {error != null && 
                            <h1 className='text-red-600 text-center font-bold mt-3'>
                                {error}        
                            </h1>
                        }
                    </div>
                </form>
                

                <div className='justify-block mt-3'>
                    <p className='font-semibold text-sm text-center text-gray-800'>
                        Already an user?
                    </p>

                    <Link href="/">
                        <button className='bg-blue-500 text-white font-bold rounded-xl px-2 py-1 w-full mt-2'>
                            Connect to your account
                        </button>
                    </Link>
                </div>
            </div>

            <div className='lg:block hidden lg:w-3/4 mr-2'>
                <h1 className='text-end font-bold text-2xl'>
                    <span className='text-sky-600'>Bug</span>Tracker
                </h1>

                <Image 
                    src={RegisterImage} 
                    alt="Register image" 
                    width={1000} 
                />
            </div>
        </div>
    </div>
  )
}

export default Register