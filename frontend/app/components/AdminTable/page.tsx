import React, {useState} from 'react'
import Select from 'react-select'
import {BsArrowUp, BsArrowDown} from 'react-icons/bs'
import {BiSolidRightArrow, BiSolidLeftArrow} from 'react-icons/bi'
import { MakeAdmin, MakeDeveloper, MakeProjectManager } from '@/app/api/users/route'
import ConfirmDialog from '../ConfirmationDialog/page'

interface User {
    email: string
    id: string
    roles: string
    userName: string
    pid: string
    submittedTickets: number
}

interface Props {
    props: User[]
}

const displayItems = [
    {value: 5, label: "5"},
    {value: 10, label: "10"},
    {value: 25, label: "25"}
]

export const AdminTable = ({props}:any) => {
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
    const [confirmationText, setConfirmationText] = useState<string>('')
    const [sortOrder, setSortOrder] = useState<string>('asc')
    const [sortAttribute, setSortAttribute] = useState<string>('userName')
    /* sort method */
    const sortedItems = [...props].sort((a,b) => {
        const aValue = a[sortAttribute]
        const bValue = b[sortAttribute]

        if (sortOrder === 'asc')
            return aValue.localeCompare(bValue)
        return bValue.localeCompare(aValue)
     })

     /* Table pagination */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(5)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem)
    
   /* Handle page navigation */
    const nextPage = () => {
        if (indexOfLastItem < props.length)
            setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage > 1)
            setCurrentPage(currentPage - 1)
    }

    const goToPage = (pageNumber:number) => {
        setCurrentPage(pageNumber)
    }
    

    const checkRole = (role:string) => {
        switch(role.toLowerCase()) {
            case "developer": 
                return (
                    <div className='text-gray-700 hover:text-white text-center font-semibold border-solid border-2 border-gray-700 hover:bg-gray-700 rounded-md px-1'>
                        Developer
                    </div> 
                )
            case "project manager":
                return (
                    <div className='text-blue-500 hover:text-white text-center font-semibold border-solid border-2 border-blue-500 hover:bg-blue-500 rounded-md px-1 px-1'>
                        P.Manager
                    </div> 
                )
            default:
                return (
                    <div className='text-center text-red-500 hover:text-white font-semibold solid-border border-2 border-red-500 rounded-md hover:bg-red-500 px-1'>
                        Admin
                    </div>
                )
        }
    }

    const modifyRole = (role:string, email:string) => {
        switch(role.toLowerCase()) {
            case "admin":
                return (
                    <div className='flex gap-2 text-center justify-center'>
                        <button
                            onClick={async () => {
                               const response = await MakeProjectManager({email})
                               setConfirmationText(`${email} is now a Project Manager`)
                               setConfirmDialog(true)

                            }} 
                            className='lg:ml-2 border-solid border-2 border-blue-700 text-white bg-blue-700 rounded-md p-0.5'
                        >
                            Make P.Manager
                        </button>

                        <button 
                            onClick={async () => {
                                const response = await MakeDeveloper({email})
                                setConfirmationText(`${email} is now a Developer`)
                               setConfirmDialog(true)
                            }}
                            className='border-solid border-2 border-gray-800 text-white bg-gray-800 rounded-md lg:p-1'
                        >
                            Make Develper
                        </button>
                    </div>
                )
            case "developer":
                return (
                    <div className='flex gap-2 text-center justify-center'>
                        <button
                            onClick={async () => {
                                const response = await MakeProjectManager({email})
                                setConfirmationText(`${email} is now a Project Manager`)
                               setConfirmDialog(true)
                            }}  
                            className='border-solid border-2 border-blue-700 text-white bg-blue-700 rounded-md p-0.5'
                        >
                            Make P.Manager
                        </button>

                        <button
                            onClick={async () => {
                                const resonse = await MakeAdmin({email})
                                setConfirmationText(`${email} is now an Admin`)
                               setConfirmDialog(true)
                            }} 
                            className='border-solid border-2 border-red-600 text-white bg-red-600 rounded-md lg:p-1'
                        >
                            Make Admin
                        </button>
                    </div>
                )
            default:
                return (
                    <div className='flex gap-2 text-center justify-center'>
                        <button
                            onClick={async () => {
                                const response = await MakeDeveloper({email})
                                setConfirmationText(`${email} is now a Developer`)
                               setConfirmDialog(true)
                            }} 
                            className='border-solid border-2 border-gray-800 text-white bg-gray-800 rounded-md p-0.5'
                        >
                            Make Developer
                        </button>

                        <button
                            onClick={async () => {
                                const resonse = await MakeAdmin({email})
                                setConfirmationText(`${email} is now an Admin`)
                               setConfirmDialog(true)
                            }}  
                            className='border-solid border-2 border-red-600 text-white bg-red-600 rounded-md lg:p-1'
                        >
                            Make Admin
                        </button>
                    </div>
                )
        }
    }
    
    return (
        <div className='w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-5'>
            <div className='overflow-x-auto'>
                <div className=''>
                    <div className='mb-8 items-center'>
                        <label className='flex gap-2'>
                            <span className='mt-2'>
                                Show
                            </span>
                            <Select
                                options={displayItems}
                                placeholder={itemsPerPage}
                                onChange={(e:any) => setItemsPerPage(e.value)}
                            />
                            <span className='mt-2 ml-1'>
                                users
                            </span>
                        </label>
                    </div>
                </div>
                <table className='w-full'>
                    <thead className='bg-gray-800 text-white'>
                        <tr>
                            <th className='py-2'>
                                <div className='flex gap-2 justify-center'>
                                    <h1>Name</h1>
                                    {
                                        sortOrder === 'asc'
                                        ? <BsArrowUp 
                                            onClick={() => {
                                                setSortOrder('desc')
                                                setSortAttribute('userName')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                        : <BsArrowDown 
                                            onClick={() => {
                                                setSortOrder('asc')
                                                setSortAttribute('userName')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                    }
                                </div>
                            </th>

                            <th className='py-2'>
                                <div className='flex gap-2 justify-center'>
                                    <h1>Email</h1>
                                    {
                                        sortOrder === 'asc'
                                        ? <BsArrowUp 
                                            onClick={() => {
                                                setSortOrder('desc')
                                                setSortAttribute('email')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                        : <BsArrowDown 
                                            onClick={() => {
                                                setSortOrder('asc')
                                                setSortAttribute('email')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                    }
                                </div>
                            </th>

                            <th className='py-2'>
                                <div className='flex gap-2 justify-center'>
                                    <h1>Role</h1>
                                    {
                                        sortOrder === 'asc'
                                        ? <BsArrowUp 
                                            onClick={() => {
                                                setSortOrder('desc')
                                                setSortAttribute('roles')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                        : <BsArrowDown 
                                            onClick={() => {
                                                setSortOrder('asc')
                                                setSortAttribute('roles')
                                            }} 
                                            className="mt-1 cursor-pointer"
                                        />
                                    }
                                </div>
                            </th>

                            <th className='p-2'>
                                <h1>Actions</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user:User) => {
                            return (
                                <tr
                                    key={user.id}
                                    className='font-normal'
                                >   
                                    <td className='p-2 text-md font-semibold text-center'>
                                        {user.userName}
                                    </td>

                                    <td className='p-2 text-md font-semibold text-center'>
                                        {user.email}
                                    </td>

                                    <td className='p-2 text-md font-semibold'>
                                        {checkRole(user.roles)}
                                    </td>

                                    <td className='p-2 text-md font-semibold'>
                                        {modifyRole(user.roles, user.email)}
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/*Add pagination */}
            <div className='pagination flex justify-end mt-5 mr-2'>
                    {/* Do not dispaly for first page */}
                    {
                        currentPage !== 1 &&
                        <button 
                            onClick={prevPage} 
                            disabled={currentPage === 1}
                            className='hover:text-gray-500 cursor-pointer'
                        >
                            <BiSolidLeftArrow size={20}/>          
                        </button>
                    }
                    {
                        Array.from({length: Math.ceil(props.length / itemsPerPage)})
                            .map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToPage(index + 1)}
                                        className={`
          px-3 py-1 rounded-lg
          ${currentPage === index + 1
            ? 'bg-gray-900 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          mr-2 focus:outline-none
        `}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )
                    }
                    <button
                        onClick={nextPage}
                        disabled={indexOfLastItem >= props.length}
                    >
                        <BiSolidRightArrow 
                            size={20}
                            className="hover:text-gray-500 cursor-pointer"
                        />
                    </button>
                </div>

                {
                    confirmDialog &&
                    <ConfirmDialog
                        onOk={() => setConfirmDialog(false)}
                        text={confirmationText}
                    />
                }
        </div>
    )
}
