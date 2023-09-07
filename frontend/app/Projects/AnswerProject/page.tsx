"use client"
import fetchUsers from '@/app/api/users/route';
import React, {useEffect, useState} from 'react'
import {BsHouseCheck} from 'react-icons/bs'
import 'react-quill/dist/quill.snow.css'
import LoadingScreen from '@/app/components/LoadingScreen/page'
import { TasksTable } from '@/app/components/TasksTable/page';
import generateUserData from '@/app/components/ProtectedRouter/route'
import { useAppContext } from '@/app/components/AppContext/page';

interface Params {
    params: string
}

interface Current_Project {
    project: Project
    users: User[]
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

interface User {
    email: string
    id: string
    roles: string
    userName: string
    submittedTickets: number
}


export const AnswerProject = ({params}:Params) => {
    const {setActiveComponent} = useAppContext()
    const userData = generateUserData()
    const [loading, setLoading] = useState<boolean>(true)
    const [project, setProject] = useState<Current_Project | null> (null)
    const [description, setDescription] = useState('')
    const [projectManager, setProjectManager] = useState<User>()
    const [developers, setDevelopers] = useState<User[]>()


    useEffect(() => {
        const fetchCurrentProject = async() => {
            try {
                const response = await fetch("https://localhost:7181/api/Project/" + params, {
                    method: 'GET',
                })

                if (response.ok) {
                    const data: Current_Project = JSON.parse(await response.text())
                    setProject(data)
                    setDescription(data.project.description)

                    let developers: User[] = []
                    data.users.forEach((user:User) => {
                        if (user.roles.toLowerCase() === "project manager")
                            setProjectManager(user)
                        else 
                            developers.push(user)
                    })
                    setDevelopers(developers)
                }

                setTimeout(() => {
                    setLoading(false)
                }, 500)
                
            } catch (error) {
                console.error("Failed to fetch project")
            }
        }
    if (params)
        fetchCurrentProject()
    
    }, [])

    const renderHTMLAsText = () => {
        return { __html: description };
    }
    
    const checkPriority = (prio:string | undefined) => {
        if (!prio)
            return
        switch(prio) {
            case "Urgent":
                return (
                    <div className='text-red-400 hover:text-white text-center font-bold border-solid border-2 border-red-400 hover:bg-red-400 rounded-md px-1'>
                        {prio}
                    </div> 
                )
            case "High":
                return (
                    <div className='text-yellow-500 hover:text-white text-center font-bold border-solid border-2 border-yellow-500 hover:bg-yellow-500 rounded-md px-1'>
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
                    <div className='text-cyan-400 hover:text-white text-center font-bold border-solid border-2 border-cyan-400 hover:bg-cyan-400 rounded-md px-1'>
                        {prio}
                    </div> 
                )
        }
    }

    const checkStatus = (status:string | undefined) => {
        if (!status) 
            return
        switch(status) {
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

    const convertDate = (date:string | undefined) => {
        if (!date)
            return
        const dateObject = new Date(date)
        const day = String(dateObject.getDate()).padStart(2, "0")
        const month = String(dateObject.getMonth() + 1).padStart(2, "0")
        const year = dateObject.getFullYear()

        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
    }

    const handleComplete = async () => {
        try {
           const response = await fetch("https://localhost:7181/api/Project/Complete-Project/" + project?.project.id, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                }
            })
            setActiveComponent("All Projects")
        } catch (error) {   
            console.error(error)
        }
    }

    const handleArchive = async () => {
        try {
           const response = await fetch("https://localhost:7181/api/Project/Archive-Project/" + project?.project.id, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                }
            })
            setActiveComponent("All Projects")
        } catch (error) {   
            console.error(error)
        }
    }

    if (loading)
        return <LoadingScreen />
    
    return (
        <div>
            <div className='flex gap-2 mt-2'>
                <BsHouseCheck 
                    size={25}
                    className="text-blue-500 "
                />
                <span className='font-semibold text-xl'>
                / Project
                </span>
            </div>

            <div className='mt-5 flex gap-8'>
                <div className='block w-1/3'>
                    <div className='bg-white pl-5 rounded-md shadow-lg py-5'>
                        <h1 className='font-bold text-xl mb-2'>{project?.project.title}</h1>
                        <p 
                            dangerouslySetInnerHTML={renderHTMLAsText()}
                            className='font-semibold text-gray-500'
                        >
                        </p>
                        <br />
                        {
                            (project?.project.status === "Development" && 
                            (userData.role === 'ADMIN' || userData.email === project.project.projectManager)) &&
                            <button 
                                onClick={handleComplete}
                                className='text-green-600 font-bold border-solid border-2 border-green-600 hover:bg-green-600 hover:text-white px-1 rounded-md'
                            >
                                Complete Project
                            </button>
                        }
                        {
                            project?.project.status === 'Completed' &&
                            <button
                                onClick={handleArchive} 
                                className='text-green-600 font-bold border-solid border-2 border-green-600 hover:bg-green-600 hover:text-white px-1 rounded-md'
                            >
                                Archive Project
                            </button>
                        }
                        {
                            project?.project.status === 'Archived' &&
                            <button 
                                onClick={handleComplete}
                                className='text-green-600 font-bold border-solid border-2 border-green-600 hover:bg-green-600 hover:text-white px-1 rounded-md'
                            >
                                Unlock Project
                            </button>
                        }

                    </div>

                    <div className='bg-white px-5 rounded-md shadow-lg py-5 mt-5 '>
                        <div className='flex justify-between'>
                            <h1 className='text-gray-500 font-semibold'>
                                Created at
                            </h1>

                            <span className='text-gray-500 font-semibold hover:text-white border-solid border-2 rounded-md border-gray-500 hover:bg-gray-500 px-1'>
                                {convertDate(project?.project.creationDate.toString())}
                            </span>
                        </div>

                        <div className='flex justify-between mt-5'>
                            <h1 className='text-gray-500 font-semibold'>
                                Deadline
                            </h1>

                            <span className='text-gray-500 font-semibold hover:text-white border-solid border-2 rounded-md border-gray-500 hover:bg-gray-500 px-1'>
                            {convertDate(project?.project.deadline.toString())}
                            </span>
                        </div>

                        <div className='flex justify-between mt-5'>
                            <h1 className='text-gray-500 font-semibold'>
                                Priority
                            </h1>

                            <span>
                                {checkPriority(project?.project.priority)}
                            </span>
                        </div>

                        <div className='flex justify-between mt-5'>
                            <h1 className='text-gray-500 font-semibold'>
                                Status
                            </h1>

                            <span>
                                {checkStatus(project?.project.status)}
                            </span>
                        </div>
                    </div>

                    <div className='block p-5 bg-white mt-5'>
                        <div className='mb-3'>
                            <h1 className='text-lg font-semibold '>
                                Project Team
                            </h1>
                            <p className='text-gray-400 font-semibold'>
                                {project?.users? project.users.length : 0}
                                <span className='ml-1 text-gray-400 font-semibold'>
                                    team members
                                </span>
                            </p>
                        </div>
                        <br />
                        <div
                            key={projectManager?.id} 
                            className='block'
                        >
                            <h1 className='text-gray-600 font-semibold mb-1'>
                                {projectManager?.userName}
                            </h1>
                            <span className='text-gray-400 font-semibold'>
                                {projectManager?.email}
                            </span>
                            <p className='text-gray-400 font-semibold mb-1'>
                                {projectManager?.roles}
                            </p>

                            <hr />
                        </div>

                        {developers?.map((user:User) => {
                            return (
                                <div
                                    key={user.id} 
                                    className='mt-3 block'
                                >
                                    <h1 className='text-gray-600 font-semibold mb-1'>
                                        {user?.userName}
                                    </h1>
                                    <span className='text-gray-400 font-semibold'>
                                        {user?.email}
                                    </span>
                                    <p className='text-gray-400 font-semibold mb-1'>
                                        {user?.roles}
                                    </p>
                                   <hr />
                                </div>
                            )
                            })}
                    </div>
                </div>

                <div className='bg-white h-1/3 w-2/3 rounded-md shadow-md'>
                {(userData.role === 'ADMIN' || userData.email === project?.project.projectManager) &&
                    <div className='text-end mr-5 mt-5'> 
                        <button
                        onClick={() => {setActiveComponent("Create-Task/" + project?.project.id)}}
                        className='rounded-md bg-blue-600 text-white p-2'
                        >
                            Add Task
                        </button>
                    </div>
                }
                    <h1>
                        <TasksTable props={project?.project.id}/>
                    </h1>
                </div>
            </div>
        </div>
    )
}
