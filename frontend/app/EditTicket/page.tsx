"use client"
import React, { useEffect, useState } from 'react'
import { BsArrowLeftShort} from 'react-icons/bs'
import {AiOutlineLock, AiOutlineUnlock} from 'react-icons/ai'
import Select from 'react-select'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { useAppContext } from '../components/AppContext/page'
import LoadingScreen from '../components/LoadingScreen/page'
import ConfirmDialog from '../components/ConfirmationDialog/page'
import Cookies from 'js-cookie'

interface Params {
  params: string
}

const EditTicket = ({params} : Params) => {
  const {setActiveComponent} = useAppContext()
  /* 
    Since almost every detail about the ticket can be modified
    we use use state to make it easier to change
  */
  const [ticketId, setTicketId] = useState<number>()
  const [ticketTitle, setTicketTitle] = useState<string>('')
  const [ticketDescription, setTicketDescription] = useState<string>('')
  const [ticketResponse, setTicketResponse] = useState<string>('')
  const [ticketPrioirty, setTicketPriority] = useState(null)
  const [ticketType, setTicketType] = useState(null)
  const [ticketStatus, setTicketStatus] = useState<string>('')
  const [endDate, setEndDate] = useState<string>("")
  const [ticketIsActive,setTicketIsActive] = useState<boolean>()
  const [ticketHandler, setTicketHandler] = useState<string>('')
  const [ticketSubmitter, setTicketSubmitter] = useState<string>('')
  const [solvedDate, setSolvedDate] = useState<string>('')
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const token = Cookies.get('token')
  
  useEffect(() => {
    const fetchTicketDetails = async () => {
      setError(null)
      try {
        const response = await fetch("https://localhost:7181/api/Ticket/" + params,{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const ticketData = JSON.parse(await response.text())
          setTicketId(ticketData.id)
          setTicketTitle(ticketData.title)
          setTicketDescription(ticketData.description)
          setTicketResponse(ticketData.response)
          setTicketPriority(ticketData.priority)
          setTicketType(ticketData.type)
          setTicketStatus(ticketData.status)
          setTicketIsActive(ticketData.isActive)
          setTicketHandler(ticketData.handler)
          setTicketSubmitter(ticketData.submitter)
          setSolvedDate(ticketData.solvedDate)
          setEndDate(new Date(ticketData.endDate).toISOString().split('T')[0])
        }  
      } catch (error) {
        setError("Failed to fetch ticket details!")
        console.error("Error at fetching ticket " +  params, error)
      }
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
    if (params)
      fetchTicketDetails()
    }, [])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    e.preventDefault()

    if (ticketDescription.length < 17) {
      setError("Description must be at least 10 characters long!")
      return
    } 
    else {
      try {
        const response = await fetch("https://localhost:7181/api/Ticket/Complete-Ticket/" + ticketId, {
          method: 'PUT',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            "title": ticketTitle,
            "description": ticketDescription,
            "response": ticketResponse,
            "type": ticketType != null? ticketType["label"] : "",
            "priority": ticketPrioirty != null?  ticketPrioirty["label"] : "",
            "status": ticketStatus,
            "isActive": ticketIsActive,
            "submitter": ticketSubmitter,
            "handler": ticketHandler,
            "endDate": new Date(endDate),
            "solvedDate": solvedDate
          })
        })
        if (response.ok)
          setConfirmDialog(true)
      } catch (error) {
        setError("Failed to submit ticket!")
        console.error(error)
      }
      return 
    }
  }

  // Select data for ticekt priority
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent'}
  ];
  
  // Select data for ticket type
  const typeOptions = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'question', label: 'Question' },
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
          Edit ticket
        </h1>
      </div>

      <div className="w-4/5 mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className='flex justify-between'>
          <h2 className="text-2xl font-semibold mb-4">
            Create a Ticket
          </h2>
          {
            ticketStatus.toLowerCase() === "completed"?
              <AiOutlineUnlock 
                size={35}
                alt={"Archive ticket"}
                onClick={() => setTicketStatus("Archived")}
                className="border-solid border-2 border-green-600 rounded-md text-green-700 hover:text-gray-200 hover:bg-green-600 p-1 cursor-pointer"
              />
            : 
            ticketStatus.toLowerCase() === "archived"?
              <AiOutlineLock
              size={35}
              alt={"Archive ticket"}
              onClick={() => setTicketStatus("Completed")}
              className="border-solid border-2 border-green-600 rounded-md text-green-700 hover:text-gray-200 hover:bg-green-600 p-1 cursor-pointer"
              />
            : ''
          }
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-bold text-gray-700"
            >
              Ticket Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="description" 
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Ticket Description
            </label>
            <ReactQuill
              theme="snow"
              value={ticketDescription}
              onChange={setTicketDescription}
              className="border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="response" 
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Ticket Response
            </label>
            <ReactQuill
              theme="snow"
              value={ticketResponse}
              onChange={setTicketResponse}
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
              value={priorityOptions.find(option => option.label == ticketPrioirty)}
              onChange={(e: any) => setTicketPriority(e)}
            />
          </div>

          <div className="mb-5">
            <label 
              htmlFor="type" 
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Ticket Type
            </label>
            <Select 
              options={typeOptions} 
              id="type" 
              name="type"
              required
              value={typeOptions.find(option => option.label == ticketType)}
              onChange={(e: any) => setTicketType(e)}
            />
          </div>

          <div className="relative w-64 mb-5">
            <label
              htmlFor='date'
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              End date
            </label>
            <input
              type="date"
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
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

export default EditTicket
