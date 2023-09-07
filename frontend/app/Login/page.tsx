"use client"
import React, {useState} from 'react'
import Image from 'next/image'
import Hacker from '../../public/Hacker.svg'
import Link from 'next/link'
import {
  AiTwotoneMail, 
  AiTwotoneUnlock
} from 'react-icons/ai'
import GoogleLogo from '../../public/google-logo.svg'
import GithubLogo from '../../public/github-logo.svg'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch("https://localhost:7181/api/Auth/login", {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        }),
      })
   
      if (response.ok) {
        const token = await response.text()
        Cookies.set('token', token, {secure: true, sameSite: 'strict', expires: 7})
        router.push('/')
      } else {
        setError('Invalid data!')
      }
      
    } catch (error) {
      console.error("A login error occured: ", error)
      setError("Failed to fetch user data!")
    }
  }

  return (
    <div className='bg-slate-100 min-h-screen flex items-center justify-center'>
        {/* Login container */}
        <div className='bg-gray-100 flex rounded-2xl shadow-2xl max-w-4xl p-5'>
          {/* Login image */}
          <div className='hidden sm:block  w-3/4 mr-10'>
            <h1 className='font-bold text-2xl ml-5 mb-2'>
              <span className='text-sky-600'>
                Bug
              </span>
              Tracker
            </h1>
            <Image 
              src={Hacker} 
              alt="login photo" 
            />
          </div>

          {/* Login form */}
          <div className='w-full sm:w-1/2'>
            <h1 className='font-bold text-2xl text-center mt-5'>
              Welcome Back 
            </h1>
            <p className="text-lg font-semibold mt-4">
              To keep connected with us log in with your personal information by email address and password 🔔
            </p>

            <form 
              onSubmit={handleSubmit}
              className='flex flex-col gap-4 mt-4'>
              <div className='items-center'>
                <div className='bg-white p-2 mt-4 flex items-center rounded-xl w-full'>
                  <AiTwotoneMail 
                    size={20} 
                    className="text-gray-700 mr-2" 
                  />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder='Email Address' 
                    id="email" 
                    autoComplete='off'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='outline-none w-full' 
                  />
                </div>

                <div className='bg-white p-2 mt-4 flex items-center rounded-xl'>
                  <AiTwotoneUnlock
                    size={20}
                    className="text-gray-700 mr-2"
                  />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder='Password' 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='outline-none w-full'  
                  />
                </div>
              </div>
              

              <div className='block justify-center gap-4'>
                <button 
                  type={'submit'}
                  className="bg-blue-500 text-white rounded-2xl w-full lg:px-6 py-2 mb-3"
                >
                  Login Now
                </button>

                <Link href="/Register/">
                  <button 
                    className='bg-gray-900 text-white rounded-2xl w-full lg:px-6 py-2'
                  >
                    Create Account
                  </button>
                </Link>
              </div>
          </form>

          {/* Display registration errors */}
          {error != null && 
            <h1 className='text-red-600 text-center font-bold mt-3'>
              {error}        
            </h1>
          }

        <div className='block mx-auto mt-5 items-center justify-center text-center'>
          <div className='flex gap-2 justify-between'>
            <button
              type="submit"
              onClick={() => {
                setEmail("admin@demo.com")
                setPassword("Parola1@")

              }} 
              className='text-white bg-blue-600 font-semibold rounded-md p-1'
            >
              Demo Admin
            </button>

            <button
              type="submit"
              onClick={() => {
                setEmail("developer@demo.com")
                setPassword("Parola1@")

              }} 
              className='text-white bg-blue-600 font-semibold rounded-md p-1'
            >
              Demo Developer
            </button>

            <button
              type="submit"
              onClick={() => {
                setEmail("project-manager@demo.com")
                setPassword("Parola1@")

              }} 
              className='text-white bg-blue-600 font-semibold rounded-md p-1'
            >
              Demo P.Manager
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Login
