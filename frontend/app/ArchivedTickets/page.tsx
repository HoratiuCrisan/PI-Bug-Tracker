"use client"
import React, { useEffect, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen/page'
import TicketsTable from '../components/TicketsTable/page'
import {BsTicketPerforated} from 'react-icons/bs'
import Cookies from 'js-cookie'

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

const ArchivedTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://localhost:7181/api/Ticket/Get-Archived-Tickets", {
          method: "GET",
          headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${Cookies.get('token')}`
        }
        })

        if (response.ok) {
          const allTickets : Ticket[] = JSON.parse(await response.text())
          setTickets(allTickets)

          setTimeout(() => {
            setLoading(false)
          }, 500)
        }
      } catch (error) {
        console.error("An error occured while fetching tickets: ", error)
        setLoading(false)
      }
    }
    fetchTickets() 
  }, [])

    if (loading) 
      return <LoadingScreen />

  return (
    <div>
      {
        (tickets == null || tickets.length == 0)? 
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">There are no tickets yet</h1>
            <p className="text-gray-600 text-center">Please check back later for updates.</p>
          </div>
        </div> 
        :
        <div>
          <div className='flex gap-2 font-bold my-5'>
            <BsTicketPerforated 
              size={25}
              className="text-blue-700 "
            />
            <h1 className='text-lg'>
              / Archived Tickets
            </h1>
          </div>
          
          <div className='p-auto itmes-center'>
            <TicketsTable props={tickets} />
          </div>
        </div>
      }
    </div>
  )
}

export default ArchivedTickets
