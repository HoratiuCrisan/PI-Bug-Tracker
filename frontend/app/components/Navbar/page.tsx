import React from 'react'
import {IoBugSharp} from 'react-icons/io5'
import {GrLogout} from 'react-icons/gr'
import {CiSettings} from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useAppContext } from '../AppContext/page'


export const Navbar = () => {
    const {setActiveComponent} = useAppContext()
    const router = useRouter()
    
    return (
        <nav className='flex gap-2 justify-between py-3 bg-gray-50'>
            <div className='flex gap-1 pl-2'>
                <IoBugSharp 
                    size={40}
                    className="text-sky-600 mt-1"    
                />
                <div className='font-bold'>
                    <h1 className='text-lg '>
                        BUGTRACKER
                    </h1>
                    <h6 className='text-blue-500 text-xs'>
                        TEAM DEVELOPMENT
                    </h6>
                </div>
            </div>
            <div className='flex inline-flex mr-2 gap-4'>
                <button
                    onClick={() => setActiveComponent('Create Ticket')} 
                    className='solid bg-blue-600 text-white text-xs rounded-lg px-4'
                >
                    New Ticket
                </button>
                <CiSettings
                    size={25}
                    className='mt-2'
                />

                <GrLogout 
                    size={18}
                    onClick = {() => {
                        Cookies.remove('token')
                        router.push('/Login')
                    }}
                    className="mt-3 cursor-pointer"
                />
            </div>
        </nav>
  )
}


