"use client"
import React, {useState, useEffect} from 'react'
import { BsArrowDown, BsArrowUp, BsTrash, BsPencil, BsWrenchAdjustable} from 'react-icons/bs'
import {BiSolidLeftArrow, BiSolidRightArrow} from 'react-icons/bi'
import Select from 'react-select'
import generateUserData from '../ProtectedRouter/route'
import DeleteDialog from '../DeleteDialog/page'
import { DeleteProject, RemovePID } from '@/app/api/projects/route'
import { useAppContext } from '../AppContext/page'
import fetchUsers from '@/app/api/users/route'

interface User {
    email: string
    id: string
    roles: string
    userName: string
    pid: string
    submittedTickets: number
}

interface Project {
    id: number,
    title: string,
    description: string,
    status: string,
    priority: string,
    projectManager: string,
    creationDate: Date,
    deadline: Date,
    finishDate: Date
}

interface Props {
    props: Project[]
}

const convertDate = (date:string) => {
    const dateObject = new Date(date)
    const day = String(dateObject.getDate()).padStart(2, "0")
    const month = String(dateObject.getMonth() + 1).padStart(2, "0")
    const year = dateObject.getFullYear()

    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}

const displayItems = [
    {value: 5, label: "5"},
    {value: 10, label: "10"},
    {value: 25, label: "25"}
]

export const ProjectsTable = ({props}:any) => {
    const userData = generateUserData()
    const {setActiveComponent} = useAppContext()
    const [pids, setPids] = useState<Array<string>>([''])
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null)
    const [itemTitleToDelete, setItemTitleToDelete] = useState<string | null>(null)

    const [sortOrder, setSortOrder] = useState<string>('asc')
    const [sortAttribute, setSortAttribute] = useState<string>('title')
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

    const getUsers = async () => {
        try {
            const data : User[] = await fetchUsers()
       
            data.forEach(element => {
                if (element.email === userData.email)
                    setPids(element.pid.split(','))
            })
        
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUsers()
    })
    
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
    
    
    const checkProjectStatus = (status:string) => {
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

    const checkProjectPrio = (prio:string) => {
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

    const handleDelete = async () => {
        const response = await DeleteProject({itemIdToDelete})
        await RemovePID({itemTitleToDelete})
        
        setIsConfirmationOpen(false)
        setItemTitleToDelete(null)
        setItemIdToDelete(null)
        setActiveComponent("All Projects After Deletion")
    }

    return (
    <div className='w-full p-2 bg-white rounded-lg shadow-md'>
        <div className="overflow-x-auto">
            <div>
                <div className='mb-8 items-center mt-5'>
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
                            tickets
                        </span>
                    </label>
                </div>
            </div>
            <table className='w-full'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>Title</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('title')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('title')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                            </div>
                        </th>
                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>Status</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('status')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('status')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                            </div>
                        </th>
                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>Priority</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('priority')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('priority')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                                
                            </div>
                        </th>

                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>ProjectManager</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('projectManager')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('projectManager')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                            </div>
                        </th>

                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>Creation Date</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('creationDate')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('creationDate')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                                
                            </div>
                        </th>

                        <th className="p-2">
                            <div className='flex gap-2 justify-center'>
                                <h1>Dead Line</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('deadline')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('deadline')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                                
                            </div>
                        </th>
                        <th className='p-2 '>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((project:Project) => {
                        return (
                            <tr 
                                key={project.id} 
                                className='font-normal'
                            >
                                <td className='p-2 text-md font-semibold'>
                                    {project.title}
                                </td>
                                <td className='py-2'>
                                    {checkProjectStatus(project.status)}
                                </td>
                                <td className='p-2'>
                                    {checkProjectPrio(project.priority)}
                                </td>
                                <td className='p-2 text-center font-semibold'>
                                    {project.projectManager}
                                </td>
                                <td className='p-2'>
                                    <div className='p-0.5 border-solid border-2 rounded-md border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-center font-semibold'>
                                    {
                                        convertDate(project.creationDate.toString()) != "01/01/1" &&
                                        convertDate(project.creationDate.toString())
                                    }
                                    </div>
                                </td>
                                <td className='p-2 '>
                                    <div className='p-0.5 border-solid border-2 rounded-md border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white text-center font-bold'>
                                    {
                                        convertDate(project.deadline.toString()) != "01/01/1" &&
                                        convertDate(project.deadline.toString())
                                    }
                                    </div>
                                </td>
                                <td className='p-2'>
                                    <div className='flex gap-2 justify-center'>
                                        {
                                            ((userData.role === "ADMIN" || userData.email === project.projectManager) ||
                                            pids.includes(project.title)) &&
                                            <BsPencil 
                                                size={26}
                                                onClick={() => setActiveComponent("Answer-Project/" + project.id)}
                                                className="text-green-600 font-bold text-lg hover:text-white border-solid border-2 border-green-600 hover:bg-green-600 p-1 cursor-pointer"
                                            />
                                        }
                                        {
                                            userData.role === "ADMIN" && (
                                                <BsTrash
                                                    size={26}
                                                    onClick={() => {
                                                        setItemIdToDelete(project.id),
                                                        setItemTitleToDelete(project.title)
                                                        setIsConfirmationOpen(true)
                                                    }}
                                                    className="text-red-600 font-bold text-lg hover:text-white border-solid border-2 border-red-600 hover:bg-red-600 p-1 cursor-pointer"
                                                />
                                            )
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

                {isConfirmationOpen && (
                    <DeleteDialog
                        onDelete={handleDelete}
                        onCancel={() => {
                            setItemIdToDelete(null)
                            setItemTitleToDelete(null)
                            setIsConfirmationOpen(false)
                        }}
                        text={"Are you sure you want to delete this project?"}
                        deleteButtonText={"Delete"}
                    />
                )}

    </div>
  )
}
