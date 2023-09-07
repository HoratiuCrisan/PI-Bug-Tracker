"use client"
import React,  {useState } from 'react'
import {BsTicketPerforated} from 'react-icons/bs'
import Select from 'react-select'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css'
import { useAppContext } from '../components/AppContext/page'
import generateUserData from '../components/ProtectedRouter/route'

interface User {
  id: string,
  username: string,
  email: string,
  role: string
}

const CreateTicket = () => {
  const userData : User = generateUserData()
  const {setActiveComponent} = useAppContext()
  const [ticketTitle, setTicketTitle] = useState<string>('')
  const [ticketDescription, setTicketDescription] = useState<string>('')
  const [ticketPrioirty, setTicketPriority] = useState(null)
  const [ticketType, setTicketType] = useState(null)
  const [endDate, setEndDate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // Get current date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split('T')[0] 
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    e.preventDefault()

    if (ticketDescription.length < 17) {
      setError("Description must be at least 10 characters long!")
      return
    } 
    else {
      const Ticket = {
        title: ticketTitle,
        descritption: ticketDescription,
        priority: ticketPrioirty != null? ticketPrioirty['label'] : "None",
        type: ticketType != null? ticketType['label'] : "None",
        startDate: new Date(),
        endDate: new Date(endDate),
        submitter: userData.email
      }
      
      try {
        const response = await fetch("https://localhost:7181/api/Ticket/create-ticket", {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            "title": ticketTitle,
            "description": ticketDescription,
            "type": ticketType != null? ticketType['label'] : "None",
            "priority": ticketPrioirty != null? ticketPrioirty['label'] : "None",
            "submitter": userData.email,
            "creationDate": new Date(),
            "endDate": new Date(endDate)
          })
        })
        setActiveComponent(null)
        return
      } catch (error) {
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
  ]
  
  // Select data for ticket type
  const typeOptions = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'question', label: 'Question' },
  ];

  return (
    <div className='px-auto'>
      <div className='flex gap-2 font-bold my-5'>
        <BsTicketPerforated 
          className="text-blue-700 "
          size={25}
        />
        <h1 className='text-lg'>
          / Create Ticket
        </h1>
      </div>

      <div className="w-4/5 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Create a Ticket
        </h2>
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
              value={ticketPrioirty}
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
              value={ticketType}
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
              min={today} // Set the minimum allowed date to today's date
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-700"
          >
            Submit Ticket
          </button>

          {/*Ticket errors ?*/}
          {error && 
            <h1 className='text-bold text-lg text-red-500'>
              {error}
            </h1>
          }
        </form>
      </div>
    </div>
  )
}

export default CreateTicket
