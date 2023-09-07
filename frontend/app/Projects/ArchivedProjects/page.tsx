import React, {useEffect, useState} from 'react'
import { ProjectsTable } from '@/app/components/ProjectsTable/page'
import { GetArchivedProjects } from '@/app/api/projects/route'
import { TicketCard } from '@/app/components/TicketCard/page'
import { SlPuzzle } from 'react-icons/sl'
import LoadingScreen from '@/app/components/LoadingScreen/page'

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

interface CardDetail {
    id: number,
    text: string,
    color: string,
    value: number,
    progress: number
  }


export const ArchivedProjects = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [projects, setProjects] = useState<Project[] | null>(null)
    const [isOpen, setIsOpen] = useState<number>(0)
    const [isCompleted, setIsCompleted] = useState<number>(0)
    const [isHighPrio, setIsHighPrio] = useState<number>(0)
    const [isUrgent, setIsUrgent] = useState<number>(0)


    const checkValue = (value:number) => {
        return (value * 100) / (projects?.length ? projects.length : 1)
      }

    const fetchProjects = async () => {
        const data : Project[] = await GetArchivedProjects()
        setProjects(data)
        let open = 0, completed = 0, high = 0, urgent = 0
        data.forEach((project:Project) => {
            if (project.status.toLowerCase() === 'development')
                open++
            else if (project.status.toLowerCase() === 'completed')
                completed++

            if (project.priority.toLowerCase() === 'high')
                high++
            else if (project.priority.toLowerCase() === 'urgent')
                urgent++
        })

        setIsCompleted(completed)
        setIsOpen(open)
        setIsHighPrio(high)
        setIsUrgent(urgent)
    }

    useEffect(() => {
        fetchProjects()
        setTimeout(() => {
            setLoading(false)
          }, 500)
        console.log(projects)
    }, [])

    const cardDetails = [
        {
            id: 1,
            text: 'Open Projects',
            color: '',
            value: isOpen,
            progress: checkValue(isOpen)
        }, 
        {
            id: 2,
            text: 'Completed Projects',
            color: '#06b6d4',
            value: isCompleted,
            progress: checkValue(isCompleted)
        },
        {
            id: 3,
            text: 'High Priority',
            color: "#10b981",
            value: isHighPrio,
            progress: checkValue(isHighPrio)
        },
        {
            id: 4,
            text: 'Urgent Projects',
            color: "#ef4444",
            value: isUrgent,
            progress: checkValue(isUrgent)
        },
    ]

    if (loading) 
    return <LoadingScreen />

  return (
    <div className='mt-5'>
        <div className='flex gap-2 mt-5'>
                <SlPuzzle 
                    size={25}
                    className="text-blue-500"
                />
                <h1 className='text-lg font-bold'>
                    / Archived Projects
                </h1>
            </div>

            {
                projects?.length === 0 || projects == null ? 
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="p-8 bg-white rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-4 text-center">There are no projects yet</h1>
                            <p className="text-gray-600 text-center">Please check back later for updates.</p>
                        </div>
                    </div> 
                :
                (
                    <div>
                        <div className='flex gap-4'>
                            {cardDetails.map((card: CardDetail) => {
                                return (
                                    <TicketCard props={card} key={card.id}/>
                                )
                            })}
                        </div>
                        <ProjectsTable props={projects} />
                    </div>
                )
            }
    </div>
  )
}
