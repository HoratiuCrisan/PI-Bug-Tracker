"use client"
import React, { useEffect, useState } from 'react'
import profileImgfrom from '../../../public/profileImg.png'
import Image from 'next/image'
import LoadingScreen from '../LoadingScreen/page'

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface Props {
    props: User
}

export const ProfileDescription = ({props}: Props)=> {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User|null>(null)

    useEffect(() => {
        const user:User = props
        setUser(user)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    },[])

    const checkRole = (role:string | undefined) => {
        if (!role)
            return undefined
        if (role.toLowerCase() === "project manager")
            return "P. MANAGER"
        return role
    }

    if (loading)
        return <LoadingScreen />
   
    return (
        <>
            <div className='flex gap-4 mt-5 ml-5 items-center'>
                <Image 
                    src={profileImgfrom} 
                    alt="Profile image" 
                    className='hidden lg:flex rounded-2xl w-20' 
                />
                <div className='block mb-4'>
                    <p className='text-xs'>
                        Welcome,
                    </p>
                    <h1 className='text-xs font-semibold'>
                        {user?.username}
                    </h1>
                    <div className='text-center'>
                        <span className='border-2 border-solid p-0.5 rounded border-cyan-500 text-cyan-500 text-xs font-bold'>
                            {checkRole(user?.role)}
                        </span>
                    </div>
                </div>
            </div>
        <hr className='flex-grow border-t-2 border-gray-200 mt-5' />
    </>
  )
}
