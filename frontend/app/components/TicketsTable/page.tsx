"use client"
import React, {useState} from 'react'
import {BsPencil, BsTrash, BsWrenchAdjustable} from 'react-icons/bs'
import {BiSolidLeftArrow, BiSolidRightArrow} from 'react-icons/bi'
import {BsArrowDown, BsArrowUp} from 'react-icons/bs'
import { useAppContext } from '../AppContext/page'
import Cookies from 'js-cookie'
import DeleteDialog from '../../components/DeleteDialog/page'
import generateUserData from '../ProtectedRouter/route'
import Select from 'react-select'

interface Ticket {
    id: number,
    title: string,
    description: string,
    response: string,
    type: string,
    priority: string,
    status: string,
    isActive: boolean,
    submitter: string,
    handler: string,
    creationDate: string,
    endDate: string,
    solvedDate: string
}

interface Props {
    props: Ticket[]
}

interface User {
    id: string,
    username: string,
    email: string,
    role: string
}

const displayItems = [
    {value: 5, label: "5"},
    {value: 10, label: "10"},
    {value: 25, label: "25"}
]

interface Option {
    title: string
    submitter: string
    handler: string
    priority: string
    status: string

}

const TicketsTable = ( {props}  : Props) => {
    const userData : User = generateUserData()
    const {setActiveComponent} = useAppContext()
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null)
     /*Sort tickets */
     const [sortAttribute, setSortAttribute] = useState<'title' | 'submitter' |'status' | 'priority' | 'type' | 'handler' | 'creationDate' | 'endDate' | 'solvedDate'>('status')
     const [sortOrder, setSortOrder] = useState<string>('asc')
     /*Sort method based on the parameter that is sent */
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

    const checkTicketType = (type:string) => {
        switch(type) {
            case "Feature": 
                return (
                    <div className='text-center text-blue-400 hover:text-white font-semibold solid-border border-2 border-blue-400 rounded-md hover:bg-blue-400 px-1'>
                        {type}
                    </div>
                )
            case "Question":
                return (
                    <div className='text-center text-gray-600 hover:text-white font-semibold solid-border border-2 border-gray-600 rounded-md hover:bg-gray-600 px-1'>
                        {type}
                    </div>
                )
            default:
                return (
                    <div className='text-center text-green-500 hover:text-white font-semibold solid-border border-2 border-green-500 rounded-md hover:bg-green-500 px-1'>
                        {type}
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
                await fetch("https://localhost:7181/api/Ticket/Delete-Ticket/" + itemIdToDelete, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`
                    }
                })
            }
            deleteTicket()
        } catch (error) {
            console.log(`Faild to delete the ticket!`, error)
        }
        setIsConfirmationOpen(false)
        setItemIdToDelete(null)
        setActiveComponent("All Tickets After Deletion")
      }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md ">
      <div className='overflow-x-auto'>
        <div>
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
                        tickets
                    </span>
                </label>
            </div>
        </div>
        <table className="w-full">
            <thead className="bg-black text-white">
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
                    <th className="hidden 2xl:table-cell p-2">
                        <div className='flex gap-2 justify-center'>
                            <h1>Assigned by</h1>
                            {
                            sortOrder === 'asc'
                            ? <BsArrowUp 
                                onClick={() => {
                                    setSortOrder('desc')
                                    setSortAttribute('submitter')
                                }} 
                                className="mt-1 cursor-pointer"
                              />
                            : <BsArrowDown 
                                onClick={() => {
                                    setSortOrder('asc')
                                    setSortAttribute('submitter')
                                }} 
                                className="mt-1 cursor-pointer"
                               />
                            }
                        </div>
                    </th>
                    <th className="p-2 ">
                        <div className='flex gap-2 justify-center'>
                                <h1>Assigned to</h1>
                                {
                                sortOrder === 'asc'
                                ? <BsArrowUp 
                                    onClick={() => {
                                        setSortOrder('desc')
                                        setSortAttribute('handler')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                : <BsArrowDown 
                                    onClick={() => {
                                        setSortOrder('asc')
                                        setSortAttribute('handler')
                                    }} 
                                    className="mt-1 cursor-pointer"
                                />
                                }
                            </div>
                    </th>
                    <th className="p-2 hidden lg:table-cell">
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
                    <th className="p-2 hidden md:table-cell">
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
                    <th className='p-2 hidden lg:table-cell'>
                    <div className='flex gap-2 justify-center'>
                            <h1>Type</h1>
                            {
                            sortOrder === 'asc'
                            ? <BsArrowUp 
                                onClick={() => {
                                    setSortOrder('desc')
                                    setSortAttribute('type')
                                }} 
                                className="mt-1 cursor-pointer"
                              />
                            : <BsArrowDown 
                                onClick={() => {
                                    setSortOrder('asc')
                                    setSortAttribute('type')
                                }} 
                                className="mt-1 cursor-pointer"
                               />
                            }
                        </div>
                    </th>
                    <th className='p-2 hidden 2xl:table-cell'>
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
                    <th className="p-2 hidden md:table-cell">
                    <div className='flex gap-2 justify-center'>
                            <h1>End Date</h1>
                            {
                            sortOrder === 'asc'
                            ? <BsArrowUp 
                                onClick={() => {
                                    setSortOrder('desc')
                                    setSortAttribute('endDate')
                                }} 
                                className="mt-1 cursor-pointer"
                              />
                            : <BsArrowDown 
                                onClick={() => {
                                    setSortOrder('asc')
                                    setSortAttribute('endDate')
                                }} 
                                className="mt-1 cursor-pointer"
                               />
                            }
                        </div>
                    </th>
                    <th className='p-2 hidden 2xl:table-cell'>
                    <div className='flex gap-2 justify-center'>
                            <h1>Finish Date</h1>
                            {
                            sortOrder === 'asc'
                            ? <BsArrowUp 
                                onClick={() => {
                                    setSortOrder('desc')
                                    setSortAttribute('solvedDate')
                                }} 
                                className="mt-1 cursor-pointer"
                              />
                            : <BsArrowDown 
                                onClick={() => {
                                    setSortOrder('asc')
                                    setSortAttribute('solvedDate')
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
                {currentItems.map((object:Ticket, index:number) => (
                    <tr key={index}>
                        <td className="p-2 font-semibold">
                            {object.title}
                        </td>
                        <td className="p-2 hidden 2xl:table-cell text-center">
                            {object.submitter}
                        </td>
                        <td className="p-2 text-center">
                            {object.handler}
                        </td>
                        <td className="p-2 text-center hidden lg:table-cell">
                            {checkTicketStatus(object.status)}
                        </td>
                        <td className="p-2 hidden md:table-cell">
                            {checkTicketPrio(object.priority)}
                        </td>
                        <td className='p-2 hidden lg:table-cell'>
                            {checkTicketType(object.type)}
                        </td>
                        <td className='p-2 text-center font-semibold hidden 2xl:table-cell'>
                            {convertDate(object.creationDate)}
                        </td>
                        <td className="p-2 text-center font-semibold hidden md:table-cell">
                            {convertDate(object.endDate)}
                        </td>
                        <td className='p-2 text-center hidden font-semibold 2xl:table-cell'>
                            {
                                convertDate(object.solvedDate) != "01/01/1" &&
                                convertDate(object.solvedDate)
                            }
                        </td>
                        <td className='p-2'>
                            <div className='flex gap-2 justify-center'>
                                {
                                    userData.role == "ADMIN" && (
                                    <BsPencil 
                                        size={26}
                                        onClick={() => setActiveComponent("Edit-Ticket/" + object.id)} 
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
                                    (((object.handler == "") || (object.handler == userData.email)) && object.submitter != userData.email) &&
                                    <BsWrenchAdjustable 
                                        size={26}
                                        onClick={() => setActiveComponent("Answer-Ticket/" + object.id)}
                                        className="text-gray-600 font-bold text-lg hover:text-white border-solid border-2 border-gray-600 hover:bg-gray-600 p-1 cursor-pointer"
                                    />
                                }       
                            </div>
                        </td>
                    </tr>
                ))}
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
    </div>
  )
}

export default TicketsTable;

