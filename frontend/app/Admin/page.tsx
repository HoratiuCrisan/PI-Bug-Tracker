import React, {useState, useEffect} from 'react'
import fetchUsers from '../api/users/route'
import LoadingScreen from '../components/LoadingScreen/page'
import { UsersTable } from '../components/UsersTable/page'
import {IoDiamondOutline} from 'react-icons/io5'
import { AdminTable } from '../components/AdminTable/page'

interface User {
    email: string
    id: string
    roles: string
    userName: string
    pid: string
    submittedTickets: number
}

export const Admin = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[] | null> (null)

    const getUsers = async () => {
        const data : User[] = await fetchUsers()
        setUsers(data)
    }
    useEffect(() => {
        getUsers()
        setTimeout(() =>{
            setLoading(false)
        }, 500)
    })

if (loading)
    return <LoadingScreen />

  return (
    <div className='mt-5'>
        <div className='flex gap-2 mt-5'>
                <IoDiamondOutline 
                    size={25}
                    className="text-blue-500"
                />
                <h1 className='text-lg font-bold'>
                    / Admin
                </h1>
            </div>

            {
                users?.length === 0 || users == null ? 
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="p-8 bg-white rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-4 text-center">There are no users yet</h1>
                            <p className="text-gray-600 text-center">Please check again later for updates.</p>
                        </div>
                    </div> 
                :
                    <AdminTable props={users}/>
            }
    </div>
  )
}
