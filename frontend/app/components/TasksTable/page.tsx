"use client"
import React, {useState, useEffect} from 'react'
import { useAppContext } from '../AppContext/page'
import Cookies from 'js-cookie'
import Select from 'react-select'
import {BsArrowDown, BsArrowUp, BsPencil, BsTrash, BsWrenchAdjustable} from 'react-icons/bs'
import {BiSolidRightArrow, BiSolidLeftArrow} from 'react-icons/bi'
import generateUserData from '../ProtectedRouter/route'
import DeleteDialog from '../DeleteDialog/page'

interface Tasks {
    id: number
    title: string
    description: string
    response: string
    status: string
    priority: string
    handler: string
    creationDate: string
    deadline: string
    solvedDate: string
}

const displayItems = [
    {value: 5, label: "5"},
    {value: 10, label: "10"},
    {value: 25, label: "25"}
]

interface Props {
    props: number | undefined
}

export const TasksTable = ({props} : Props) => {
    const [tasks, setTasks] = useState<Tasks[]>()
    const userData = generateUserData()
    const {setActiveComponent} = useAppContext()
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null)
     /*Sort method based on the parameter that is sent */
    /* Table pagination */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(5)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = tasks?.slice(indexOfFirstItem, indexOfLastItem)
    
   /* Handle page navigation */
    const nextPage = () => {
        if (indexOfLastItem < (tasks? tasks.length : 1))
            setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage > 1)
            setCurrentPage(currentPage - 1)
    }

    const goToPage = (pageNumber:number) => {
        setCurrentPage(pageNumber)
    }
    

    const checkTicketStatus = (status:string) => {
        switch(status) {
            case "Submitted": 
                return (
                    <div className='text-gray-700 hover:text-white text-center font-semibold border-solid border-2 border-gray-700 hover:bg-gray-700 rounded-md px-1'>
                        {status}
                    </div> 
                )
            case "Development":
                return (
                    <div className='text-blue-400 hover:text-white text-center font-semibold border-solid border-2 border-blue-400 hover:bg-blue-400 rounded-md px-1 px-1'>
                        {status}
                    </div> 
                )
            default:
                return (
                    <div className='text-center text-green-500 hover:text-white font-semibold solid-border border-2 border-green-500 rounded-md hover:bg-green-500 px-1'>
                        {status}
                    </div>
                )
        }
    }

    const checkTicketPrio = (prio:string) => {
        switch(prio) {
            case "Urgent":
                return (
                    <div className='text-red-400 hover:text-white text-center font-bold border-solid border-2 border-red-400 hover:bg-red-400 rounded-md px-1'>
                        {prio}
                    </div> 
                )
            case "High":
                return (
                    <div className='text-yellow-500 hover:text-white text-center font-bold border-solid border-2 border-yellow-500 hover:bg-yellow-500 rounded-md'>
                        {prio}
                    </div> 
                )
            case "Medium":
                return (
                    <div className='text-blue-400 hover:text-white text-center font-bold border-solid border-2 border-blue-400 hover:bg-blue-400 rounded-md px-1'>
                        {prio}
                    </div> 
                )
            default:
                return (
                    <div className='text-gray-400 hover:text-white text-center font-bold border-solid border-2 border-gray-400 hover:bg-gray-400 rounded-md'>
                        {prio}
                    </div> 
                )
        }
    }

    const convertDate = (date:string) => {
        const dateObject = new Date(date)
        const day = String(dateObject.getDate()).padStart(2, "0")
        const month = String(dateObject.getMonth() + 1).padStart(2, "0")
        const year = dateObject.getFullYear()

        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
    }

    const handleDelete = () => {
        try {
            const deleteTicket = async () => {
                await fetch("https://localhost:7181/api/Ticket/Delete-Task/" + itemIdToDelete, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`
                    }
                })
            }
            deleteTicket()
        } catch (error) {
            console.log(`Faild to delete the task!`, error)
        }
        setIsConfirmationOpen(false)
        setItemIdToDelete(null)
        setActiveComponent("Answer-Project/" + props)
    }

    useEffect(() => {
            const fetchTasks = async () => {
                try {
                    const response = await fetch("https://localhost:7181/api/Tasks/Get-Tasks/" + props, {
                        method: 'GET'
                    })

                    if (response.ok) {
                        const data = JSON.parse(await response.text())
                        setTasks(data)
                    }   
                } catch (error) {
                    console.error("Failed to fetch tasks")
                }
            } 
        fetchTasks()
    }, [])

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md ">
      <div className='overflow-x-auto'>
        <div>
            <div className='flex mb-8  justify-between'>
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
                        tasks
                    </span>
                </label>

                <button
                    onClick={() => {setActiveComponent("Create-Task/" + props)}}
                    className='rounded-md bg-blue-600 text-white py-1 px-2'
                >
                    Add Task
                </button>
            </div>
        </div>
        <table className="w-full">
            <thead className="bg-black text-white">
                <tr>
                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Title</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Assigned to</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Status</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Priority</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Creation Date</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        <div className='flex gap-2 justify-center'>
                            <h1>Deadline</h1>
                        </div>
                    </th>

                    <th className='p-2'>
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                {currentItems?.map((object: Tasks) => {
                    return (
                        <tr
                            key={object.id}
                        >
                            <td className='p-2 font-semibold'>
                                {object.title}
                            </td>
                            <td className='p-2 font-semibold'>
                                {object.handler}
                            </td>

                            <td className='p-2 font-semibold'>
                                {checkTicketStatus(object.status)}
                            </td>

                            <td className='p-2 font-semibold'>
                                {checkTicketPrio(object.priority)}
                            </td>

                            <td className='p-2 font-semibold'>
                                {convertDate(object.creationDate)}  
                            </td>

                            <td className='p-2 font-semibold'>
                                {convertDate(object.deadline)}
                            </td>

                            <td className='p-2'>
                            <div className='flex gap-2 justify-center'>
                                {
                                    (userData.role == "ADMIN" || userData.role == "PROJECT MANAGER") && (
                                    <BsPencil 
                                        size={26}
                                        onClick={() => setActiveComponent("Edit-Task/" + object.id)} 
                                        className="text-green-800 font-bold text-lg hover:text-white border-solid border-2 border-green-600 hover:bg-green-600 p-1 cursor-pointer"
                                    />
                                )}
                                {userData.role == "ADMIN" &&  (
                                <BsTrash 
                                    size={26}
                                    onClick={() => {
                                        setItemIdToDelete(object.id),
                                        setIsConfirmationOpen(true)
                                    }}
                                    className="text-red-600 font-bold text-lg hover:text-white border-solid border-2 border-red-600 hover:bg-red-600 p-1 cursor-pointer"
                                />
                                )}
                                {isConfirmationOpen && (
                                    <DeleteDialog
                                    onDelete={handleDelete}
                                    onCancel={() => {
                                        setItemIdToDelete(null)
                                        setIsConfirmationOpen(false)
                                    }}
                                    text={"Are you sure you want to delete this item?"}
                                    deleteButtonText={"Delete"}
                                    />
                                )}
                                {
                                    /* 
                                       Ticket cannot be solved by the same person that submitted it
                                       or is somebody else has already taken it
                                    */
                                    (object.handler == userData.email || object.handler == "") &&
                                    <BsWrenchAdjustable 
                                        size={26}
                                        onClick={() => setActiveComponent("Answer-Task/" + object.id)}
                                        className="text-gray-600 font-bold text-lg hover:text-white border-solid border-2 border-gray-600 hover:bg-gray-600 p-1 cursor-pointer"
                                    />
                                }       
                            </div>
                        </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </div>

        {/* Add pagination */}
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
                        Array.from({length: Math.ceil((tasks? tasks.length: 1) / itemsPerPage)})
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
                        disabled={indexOfLastItem >= (tasks? tasks.length : 1)}
                    >
                        <BiSolidRightArrow 
                            size={20}
                            className="hover:text-gray-500 cursor-pointer"
                        />
                    </button>
                </div>
    </div>
    )
}
