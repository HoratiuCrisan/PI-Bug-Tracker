import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import {SlPuzzle} from 'react-icons/sl'
import fetchUsers from '@/app/api/users/route'
import CreateProjectApi from '@/app/api/projects/route'
import {AddUserProjectId} from '@/app/api/projects/route'
import ConfirmDialog from '@/app/components/ConfirmationDialog/page'
import { useAppContext } from '@/app/components/AppContext/page'

interface User {
    id: string,
    userName: string,
    email: string,
    roles: string
}

interface projectUser {
    value: string,
    label: string,
}

interface PriorityOptions {
    value: string,
    label: string,
}

const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent'}
]

  
  // Get current date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split('T')[0]

export const CreateProject = () => {
    const {setActiveComponent} = useAppContext()
    const [error, setError] = useState<string | null>(null)
    const [pManagers, setPManagers] = useState<projectUser[]>()
    const [developers, setDevelopers] = useState<projectUser[]>()
    //Project details
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [priority, setPriority] = useState()
    const [projectMembers, setProjectMembers] = useState<projectUser[] | null>(null)
    const [projectManager, setProjectManager] = useState<projectUser | null>(null)
    const [deadline, setDeadline] = useState<string>('')
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
    //Fetch users
    const getUser = async () => {
        const users : User[] = await fetchUsers()
        let developers : projectUser[] = [], pManagers : projectUser[] = []
        users.forEach((user:User)=> {
            if (user.roles.toLowerCase() !== "project manager")
                developers.push({value: user.email, label: user.userName})
            else if (user.roles.toLowerCase() === 'project manager')
                pManagers.push({value: user.email, label: user.userName})
        })
        setDevelopers(developers)
        setPManagers(pManagers)
    }
    
    useEffect(() => {
       getUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (description.length < 17) {
            setError('Project description must be at least 10 characters long!')
            return
        }

        //username of each user
        let current_members = projectMembers?.map((elem:projectUser) => elem['value'])
        current_members?.push(projectManager? projectManager.value : 'None')
        console.log(current_members)
        const project = {
            "title": title,
            "description": description,
            "status": "Development",
            "priority": priority? priority["value"] : 'None',
            "projectManager": projectManager? projectManager.value : 'None',
            "deadline": new Date(deadline),
            "creationDate": new Date(),
            "finishDate": new Date()
        }

        const createPID = {
            pid: title,
            members: current_members
        }
        const projectResponse = await CreateProjectApi({project})
        if (projectResponse) {
          const pidResponse = await AddUserProjectId(createPID)

          if (pidResponse) 
            setConfirmDialog(true)
          
        }
      
       
    }

    return (
        <div className='mx-auto'>
            <div className='flex gap-2 mt-5'>
                <SlPuzzle 
                    size={25}
                    className="text-blue-500"
                />
                <h1 className='text-lg font-semibold'>
                    / Create Project
                </h1>
            </div>

            <div className='block w-4/5 bg-white rounded-lg shadow-md mx-auto my-5'>
                <div className='px-5 py-5'>
                    <div className='pb-5'>
                        <h1 className='text-xl font-semibold'>
                            Create a Project
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label 
                                htmlFor="project-title"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Project Title
                            </label>
                            <input 
                                type="text" 
                                id="project-title"
                                name="project-title"
                                required
                                autoComplete="off"
                                value={title}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        
                        <div className='mb-4'>
                            <label 
                                htmlFor="project-description"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Project Description
                            </label>
                            <ReactQuill
                                theme="snow"
                                id='project-description'
                                value={description}
                                onChange={(e) => setDescription(e)}
                                className="border rounded-md mt-2"
                            />
                        </div>

                        <div className='mb-4'>
                            <label 
                                htmlFor="project-priority"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Project Priority
                            </label>
                            <Select 
                                options={priorityOptions} 
                                id="project-priority" 
                                name="project-priority" 
                                placeholder="Select project priority"
                                required
                                value={priority}
                                onChange={(e:any) => setPriority(e)}
                                className='mt-2'
                            />
                        </div>

                        <div className='mb-4'>
                            <label 
                                htmlFor="project-manager"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Project Manager
                            </label>

                            <Select
                                options={pManagers}
                                id="project-manager"
                                name="project-manager"
                                placeholder="Select project manager"
                                required
                                value={projectManager}
                                onChange={(e:any) => setProjectManager(e)}
                                className='mt-2'
                            />
                        </div>

                        <div className='mb-4'>
                            <label 
                                htmlFor="project-developers"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Project Members
                            </label>

                            <Select 
                                isMulti
                                //options={developers}
                                options={developers}
                                id="project-developers"
                                name="project-developers"
                                value={projectMembers}
                                onChange={(e:any) => setProjectMembers(e)}
                                className='basic-multi-select mt-2'
                                classNamePrefix="select"
                            />
                        </div>

                        <div className='mb-4'>
                            <label 
                                htmlFor="project-deadline"
                                className='block font-bold text-sm text-gray-700'
                            >
                                Deadline
                            </label>
                            <input
                                type="date"
                                min={today} // Set the minimum allowed date to today's date
                                value={deadline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>

                        <button
                            type="submit" 
                            className='w-full bg-indigo-600 hover:bg-indigo-800 text-white text-lg font-semibold rounded-md mt-4 py-2'
                        >
                            Submit Project
                        </button>

                        {
                            error && 
                            <p className=' text-red-500 text-center font-semibold my-5'>
                                {error}
                            </p>
                        }
                    </form>
                </div>
            </div>

            {
                confirmDialog && 
                <ConfirmDialog 
                    onOk={() => {
                        setConfirmDialog(false)
                        setActiveComponent("All Projects")
                    }}
                    text={"Project created successfuly!"}
                />
            }
        </div>
    )
}
