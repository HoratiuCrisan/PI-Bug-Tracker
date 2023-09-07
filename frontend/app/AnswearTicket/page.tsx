"use client"
import React, { useEffect, useState } from 'react'
import { BsArrowLeftShort} from 'react-icons/bs'
import Select from 'react-select'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css'
import { useAppContext } from '../components/AppContext/page'
import generateUserData from '../components/ProtectedRouter/route'
import LoadingScreen from '../components/LoadingScreen/page'
import DeleteDialog from '../components/DeleteDialog/page'
import ConfirmDialog from '../components/ConfirmationDialog/page'

/*
  The user that take the ticket has no acces to edit 
  the details, only to give a response to the ticket
*/

interface User {
  id: string,
  username: string,
  email: string,
  role: string
}

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

interface Params {
  params: string
}

const AnswerTicket = ({params} : Params) => {
  const userData : User = generateUserData()
  const {setActiveComponent} = useAppContext()
  const [discardChangesDialog, setDiscardChangesDialog] = useState<boolean>(false)
  const [confirmSave, setConfirmSave] = useState<boolean>(false)
  const [confirmDiscard, setConfirmDiscard] = useState<boolean>(false)
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false)

  const [ticket, setTicket] = useState<Ticket|null>(null)
  const [ticketResponse, setTicketResponse] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get current date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split('T')[0]
  //Fetch Ticket properties
    useEffect(() => {
      const fetchTicketDetails = async () => {
        try {
          const response = await fetch("https://localhost:7181/api/Ticket/" + params,{
            method: 'GET',
          })
          if (response.ok) {
            const ticketData:Ticket = JSON.parse(await response.text())
            
            setTicket(ticketData)
            setTicketResponse(ticketData.response)
            setEndDate(new Date(ticketData.endDate).toISOString().split('T')[0])
          }
        } catch (error) {
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
    e.preventDefault()
    setError(null)
    
    if (!ticket) {
      setError("Ticket could not be fetched!")
      return
    }

    if (ticketResponse.length < 17) {
      setError("The response must be at least 10 characters long!")
      return 
    }

    else {
      console.log(userData.email)
      const response = await fetch("https://localhost:7181/api/Ticket/Complete-Ticket/" + ticket.id, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          "title": ticket.title,
          "description": ticket.description,
          "response": ticketResponse,
          "type": ticket.type,
          "priority": ticket.priority,
          "status": "Completed",
          "isActive": false,
          "submitter": ticket.submitter,
          "handler": userData.email,
          "creationDate": ticket.creationDate,
          "endDate": new Date(endDate),
          "solvedDate": new Date()
        })
      })
      if (response.ok) 
        setConfirmSubmit(true)
      else {
        setError("Ticket could not be submitted!")
        return
      }
    } 
  }

  /* 
    The save method allows the user to take a ticket
    The user does not need to add a response in order to take the ticket
  */

  const saveTicketDetails = async () => {
    if (!ticket) 
      return

    const response = await fetch("https://localhost:7181/api/Ticket/Complete-Ticket/" + ticket?.id, {
      method: "PUT",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        "title": ticket.title,
        "description": ticket.description,
        "response": ticketResponse,
        "type": ticket.type,
        "priority": ticket.priority,
        "status": ticket.status == "Completed" ? ticket.status : "Development",
        "isActive": ticket.isActive,
        "submitter": ticket.submitter,
        "handler": userData.email,
        "creationDate": ticket.creationDate,
        "endDate": new Date(endDate),
        "solvedDate" : new Date()
      })
    })
    if (response.ok)
      setConfirmSave(true)
    else {
      setError("Failed to save changes!")
      return 
    }
  }

  /* 
    The discard button resets the response back to empty string,
    the handler will be now null,
    ticket status should be back to submitted since it has no handler 
    Other fields remail the same
  */

  const discardChanges = async () => {
    if (!ticket)
      return

    const response = await fetch("https://localhost:7181/api/Ticket/Discard-Ticket-Changes/" + ticket.id, {
      method: "PUT",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        "title": ticket.title,
        "description": ticket.description,
        "response": "",
        "type": ticket.type,
        "priority": ticket.priority,
        "status": "Submitted",
        "isActive": true,
        "submitter": ticket.submitter,
        "handler": "",
        "creationDate": ticket.creationDate,
        "endDate": new Date(endDate),
      })
    })
    if (response.ok)
      setConfirmDiscard(true)
    else {
      setError("Failed to discard changes!")
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
  ]

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
        <h1 className='text-bold text-lg'>Solve ticket</h1>
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
              value={ticket?.title}
              readOnly
              className="mt-1 p-2 w-full border rounded-md bg-gray-100 outline-none"
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
            value={ticket?.description}
            readOnly
            className="border rounded-md bg-gray-100"
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
            placeholder={'Add a response...'}
            onChange={setTicketResponse}
            
            className="border rounded-md text-gray-700"
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
              isOptionDisabled={(option:any)=>option.disabled}
              id="priority" 
              name="priority" 
              required
              value={priorityOptions.find(option => option.label == ticket?.priority)}
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
              isOptionDisabled={(option:any)=>option.disabled}
              id="type" 
              name="type"
              required
              value={typeOptions.find(option => option.label == ticket?.type)}
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
              readOnly
              className="bg-gray-100 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <div className='flex gap-2'>
            <button 
              type="button"
              onClick={saveTicketDetails}
              className='w-1/3 bg-teal-500 hover:bg-teal-600 text-gray-100 font-semibold rounded-md py-2'  
            >
              Save Changes
            </button>

          {ticketResponse != "" &&
            <button
              type="button"
              onClick={() => {setDiscardChangesDialog(true)}}
              className='w-1/3 bg-rose-500 hover:bg-rose-600 text-gray-100 font-semibold rounded-md py-2 '
            >
              Discard Changes
            </button>
            }
            {
              discardChangesDialog && 
              (
                <DeleteDialog
                  onDelete={discardChanges}
                  onCancel={() => {setDiscardChangesDialog(false)}}
                  text={"Are you sure you want to discard the changes?"}
                  deleteButtonText={"Discard"}
                />
              )
            }
            <button
              type="submit"
              className='w-1/3 bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-semibold rounded-md py-2 '
            >
              Submit Ticket
            </button>
          </div>

          {/*Ticket errors ?*/}
          {error && 
            <h1 className='text-bold text-lg text-red-500 mt-2'>
              {error}
            </h1>
          }
        </form>
      </div>

      {/* Confirmation dialogs */}
      {
        confirmSave &&
        <ConfirmDialog 
          onOk={() => {
            setConfirmSave(false)
            setActiveComponent("All Tickets")
          }}
          text={"Ticket data updated successfuly!"}
        />
      }

      {
        confirmDiscard &&
        <ConfirmDialog 
          onOk={() => {
            setConfirmDiscard(false)
            setActiveComponent("All Tickets")
          }}
          text={"Ticket data has been discarded successfuly!"}
        />
      }

      {
        confirmSubmit &&
        <ConfirmDialog 
          onOk={() => {
            setConfirmSubmit(false)
            setActiveComponent("All Tickets")
          }}
          text={"Ticket data submitted successfuly!"}
        />
      }
    </div>
  )
}

export default AnswerTicket
