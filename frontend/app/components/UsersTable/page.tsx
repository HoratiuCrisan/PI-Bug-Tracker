"use client"
import React, {useState, useEffect} from "react"
import Select from 'react-select'
import {BsArrowUp, BsArrowDown} from 'react-icons/bs'
import {BiSolidRightArrow, BiSolidLeftArrow} from 'react-icons/bi'

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


export const UsersTable = ({props}:any) => {
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


    return (
        <div className="w-full p-2 bg-white rounded-lg shadow-md mt-5">
            <div className="overflow-x-auto">
                <div>
                    <div className="mb-8 items-center">
                        <label className="flex gap-2">
                            <span className="mt-2">
                                Show
                            </span>
                            <Select
                                options={displayItems}
                                placeholder={itemsPerPage}
                                onChange={(e:any) => setItemsPerPage(e.value)}
                            />
                            <span className="mt-2 ml-1">
                                users
                            </span>
                        </label>
                    </div>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-2">
                                <div className="flex gap-2 justify-center">
                                    <h1>Username</h1>
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

                            <th className="p-2">
                                <div className="flex gap-2 justify-center">
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

                            <th className="">
                                <div className="flex gap-2 justify-center">
                                    <h1>Tickets</h1>
                                </div>
                            </th>

                            <th className="p-2">
                                <div className="flex gap-2 justify-center">
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user:User) => {
                            return (
                                <tr
                                    key={user.id}
                                    className="font-normal"
                                >
                                    <td className="p-2 text-md font-semibold text-center">
                                        {user.userName}
                                    </td>

                                    <td className="p-2 text-md font-semibold text-center">
                                        {user.email}
                                    </td>

                                    <td className="p-2 text-md font-semibold text-center">
                                        {user.submittedTickets}
                                    </td>

                                    <td className="p-2 text-md font-semibold text-gray-400 text-center">
                                        <div className="border-solid border-2 border-gray-400 rounded-md px-0.5">
                                            {user.roles.toLowerCase() === "project manager" ?
                                            `P.Manager`
                                            :
                                            user.roles.charAt(0).toUpperCase() + user.roles.slice(1).toLowerCase()}
                                        </div>
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

        </div>
    )
}