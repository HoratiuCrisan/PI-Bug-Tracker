"use client"
import React, {useEffect, useState} from 'react'
import {BsHouseDoor} from 'react-icons/bs'
import {DashboardCards} from '../components/DashboardCards/page'
import { UsersTable } from '../components/UsersTable/page'
import {FaUsers, FaKeyboard, FaFolder} from 'react-icons/fa'
import {PiProjectorScreenChartFill} from 'react-icons/pi'
import {IoTicketOutline} from 'react-icons/io5'
import { DashboardDataCards } from '../components/DashboardDataCards/page'
import { DashboardCompanyData } from '../components/DashboarcCompanyData/page'
import { GetProjects } from '../api/projects/route'
import PieChart from '../components/PieChart/page'
import LoadingScreen from '../components/LoadingScreen/page'

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

interface User {
    email: string
    id: string
    roles: string
    userName: string
    pid: string
    submittedTickets: number
}

interface CompanyData {
    text: string,
    icon: Element,
    value: number
}

interface Project {
    title: string,
    description: string,
    status: string,
    priority: string,
    projectManager: string,
    deadline: Date,
    finishDate: Date,
    creationDate: Date
}


const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [tickets, steTickets] = useState<Ticket[] | null>(null)
    const [projects, setProjects] = useState<Project[] | null>(null)
    const [activeProjects, setActiveProjects] = useState<number>(0)
    const [projectIsLow, setProjectIsLow] = useState<number>(0)
    const [projectIsMedium, setProjectIsMedium] = useState<number>(0)
    const [projectIsHigh, setProjectIsHigh] = useState<number>(0)
    const [projectIsUrgent, setProjectIsUrgent] = useState<number>(0)
    const [assignedTickets, setAssignedTickets] = useState<number>(0)
    const [users, setUsers] = useState<User[] | null>(null)
    const [developers, setDevelopers] = useState<number>(0)
    const [projectManagers, setPorjectManagers] = useState<number>(0)
    const [completedTickets, setCompletedTickets] = useState<number>(0)
    //Fetch tickets data

    const fetchProjects = async () => {
        const data = await GetProjects()
        setProjects(data)
        let active = 0, low = 0, medium = 0, hight = 0, urgent = 0
        data.map((project:Project) => {
            if (project.status.toLowerCase() === "development")
                active++

            switch(project.priority.toLowerCase()) {
                case "low":
                    low++
                    break
                case "medium":
                    medium++
                    break
                case "high":
                    hight++
                    break
                default:
                    urgent++
                    break
            }
            setProjectIsLow(low)
            setProjectIsMedium(medium)
            setProjectIsHigh(hight)
            setProjectIsUrgent(urgent)
        })
        setActiveProjects(active)
    }

    useEffect(()=> {
        const fetchTickets = async () => {
            const response = await fetch("https://localhost:7181/api/Ticket/Get-Tickets", {
                method: 'GET',
                headers: {
                    "content-type": "application/json"
                }
            })
            if (response.ok) {
                const data : Ticket[] = JSON.parse(await response.text())
                steTickets(data)

                let assignedTickets = 0
                data.forEach((ticket:Ticket) => {
                    if (ticket.handler != "")
                        assignedTickets++
                })
                setAssignedTickets(assignedTickets)

                // get completed tickets
                let completedTickets = 0
                data.forEach((ticket: Ticket) => {
                    if (ticket.status.toLowerCase() === 'completed')
                        completedTickets++
                })
                setCompletedTickets(completedTickets)
            }
        }
        //Fetch UserData
        const fetchUsers = async () => {
            const response = await fetch("https://localhost:7181/api/User/Get-Users", {
                method: 'GET',
                headers: {
                    "content-type" : "application/json"
                }
            })

            if (response.ok) {
                const data : User[] = JSON.parse(await response.text())
                setUsers(data)

                let countDevelopers = 0, countProjectManagers = 0
                data.forEach((elem:User) => {
                    if (elem.roles.toLowerCase() === "developer")
                        countDevelopers++
                    else if (elem.roles.toLowerCase() === "project manager")
                        countProjectManagers++
                })
                setDevelopers(countDevelopers)
                setPorjectManagers(countProjectManagers)
            }
        }
        fetchTickets()
        fetchUsers()
        fetchProjects()
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])


    const props = [
        {
            id: 1,
            value: activeProjects,
            text: 'Active Projects',
            color: 'bg-cyan-500'
        },
        {
            id: 2,
            value: tickets? tickets.length : 0,
            text: 'Total Tickets',
            color: 'bg-gray-500'
        },
        {
            id: 3,
            value: tickets? tickets.length - assignedTickets: 0,
            text: 'Unassigned Tickets',
            color: 'bg-amber-400'
        },
        {
            id: 4,
            value: assignedTickets,
            text: 'Assigned Tickets',
            color: 'bg-gray-800'
        },
    ]

    const companyData1 = [
        {
            id: 1,
            text: 'Total Users',
            icon: <FaUsers />,
            value: users? users.length : 0
        }, 
        {
            id: 2,
            text: 'Total Developers',
            icon: <FaKeyboard />,
            value: developers
        },
        {
            id: 3,
            text: 'Total P. Managers',
            icon: <PiProjectorScreenChartFill />,
            value: projectManagers
        }
    ]

    const companyData2 = [
        {
            id: 2,
            text: 'Projects',
            icon: <FaFolder />,
            value: projects? projects.length : 0
        },
        {
            id: 3,
            text: 'Completed Tickets',
            icon: <IoTicketOutline />,
            value: completedTickets
        },
    ]

    const PieChartData = {
        labels: ['Low', 'Medium', 'High', 'Urgent'],
        series: [projectIsLow, projectIsMedium, projectIsHigh, projectIsUrgent]
    }

    if (loading)
        return <LoadingScreen />
    
    return (
        <>
            <div className='flex gap-2 font-bold my-5'>
                <BsHouseDoor 
                    size={25}
                    className="text-blue-700 "
                />
                <h1 className='text-lg'>/ Dashboard</h1>
            </div>
            
            <div className='flex gap-4'>
                {
                    props.map((elem) => {
                        return (
                            <DashboardCards props={elem} key={elem.id}/>
                        )
                    })
                }
            </div>

           
            <div className='mt-5 flex gap-4'>
                <DashboardDataCards props={companyData1} />
                <DashboardCompanyData props={companyData2}/>
                <div className='bg-gray-50 w-2/4 rounded-md shadow-lg'>
                    <div className='overflow-x-auto'>
                        <h1 className='ml-5 mt-2 font-semibold'>Project Priority</h1>
                        <PieChart props={PieChartData} />
                    </div>
                </div>
            </div>
            {
            (users?.length != 0 && users != null) &&
                <UsersTable props={users}/> 
            }
        </>
    )
}

export default Dashboard
