import React, {useState, useEffect, useContext} from 'react'
import LoadingScreen from '../../components/LoadingScreen/page'
import { useAppContext } from '../../components/AppContext/page'
import {BsArrowLeftShort} from 'react-icons/bs'
import Select from 'react-select'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import ConfirmDialog from '../../components/ConfirmationDialog/page'

interface Params {
    props: string
}


const EditTask = ({props}:Params) => {
    const {setActiveComponent} = useAppContext()
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [taskId, setTaskId] = useState<number>(0)
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [taskDescription, setTaskDescription] = useState<string>('')
    const [taskResponse, setTaskResponse] = useState<string>('')
    const [taskPriority, setTaskPriority] = useState(null)
    const [handler, setHandler] = useState<string>("")
    const [solvedDate, setSolvedDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')

    useEffect(() => {
        const fetchTasks = async () => {
            setError(null)
            try {
                const response = await fetch("https://localhost:7181/api/Tasks/" + props, {
                    method: 'GET'
                })

                if (response.ok) {
                    const data = JSON.parse(await response.text())
                    setTaskId(data.id)
                    setTaskTitle(data.title)
                    setTaskDescription(data.description)
                    setTaskResponse(data.response)
                    setTaskPriority(data.priority)
                    setHandler(data.handler)
                    setDeadline(data.deadline)
                    setSolvedDate(data.solvedDate)
                }
            } catch (error) {
                console.log(error)
            }
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        if (props)
            fetchTasks()
    }, [])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(null)
        e.preventDefault()
    
        if (taskDescription.length < 17) {
          setError("Description must be at least 10 characters long!")
          return
        } 

        else {
            try {
                const response = await fetch("https://localhost:7181/api/Tasks/Complete-Task/" + taskId, {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "title": taskTitle,
                        "description": taskDescription,
                        "response": taskResponse,
                        "priority": taskPriority? taskPriority['label'] : "",
                        "handler": handler,
                        "deadline": new Date(deadline),
                        "solvedDate": solvedDate
                    })
                })

                if (response.ok)
                    setConfirmDialog(true)
            } catch(error) {
                console.error(error)
            }
            return
        }
    }

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent'}
      ];

    if (loading)
    return <LoadingScreen />

    return (
        <div className='px-auto'>
            <div className='flex gap-2 font-bold my-5'>
                <BsArrowLeftShort 
                    size={30}
                    onClick={() => setActiveComponent("All Tickets")}
                    className="text-blue-700 cursor-pointer"
                />
                <h1 className='text-bold text-lg'>
                    Edit task
                </h1>
            </div>
            <div className="w-4/5 mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className='flex justify-between'>
                    <h1 className="text-2xl font-semibold mb-4">
                        Edit a Task
                    </h1>
                </div>

            <form>
                <div>
                    <label 
                        htmlFor="title"
                        className='block text-sm font-bold text-gray-700'
                    >   
                        Task Title
                    </label>
                    <input 
                        type="text" 
                        id="title"
                        name="title"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className='mt-1 p-2 w-full border rounded-md'
                    />
                </div>

                <div className="mb-4">
                    <label 
                        htmlFor="description" 
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Task Description
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={taskDescription}
                        onChange={setTaskDescription}
                        className="border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label 
                        htmlFor="response" 
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Task Response
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={taskResponse}
                        onChange={setTaskResponse}
                        className="border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label 
                        htmlFor="priority" 
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Ticket Priority
                    </label>
                    <Select 
                        options={priorityOptions} 
                        id="priority" 
                        name="priority" 
                        required
                        value={priorityOptions.find(option => option.label == taskPriority)}
                        onChange={(e: any) => setTaskPriority(e)}
                    />
                </div>

                <div className="relative w-64 mb-5">
                    <label
                        htmlFor='date'
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Deadline
                    </label>
                    <input
                        type="date"
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        value={deadline}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-700"
                >
                    Save Changes
                </button>

                {/*Ticket errors ?*/}
                {error && 
                    <h1 className='text-bold text-lg text-red-500'>
                        {error}
                    </h1>
                }
            </form>
        </div>
        { 
        /* Confirm dialog when the edit of the ticket was completed */
        confirmDialog &&
        <ConfirmDialog onOk={() => {
            setConfirmDialog(false)
            setActiveComponent("All Tickets")
          }}
          text={'Ticket was edited successfuly!'}
        />
      }
    </div>

  )
}

export default EditTask