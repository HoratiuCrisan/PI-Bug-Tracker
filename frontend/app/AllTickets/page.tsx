"use client"
import React, { useEffect, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen/page'
import TicketsTable from '../components/TicketsTable/page'
import {BsTicketPerforated} from 'react-icons/bs'
import { TicketCard } from '../components/TicketCard/page'

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

interface TicketCardDetail {
  id: number,
  text: string,
  color: string,
  value: number,
  progress: number
}

const AllTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<number>(0)
  const [isHighPrio, setIsHighPrio] = useState<number>(0)
  const [isUrgentPrio, setIsUrgentPrio] = useState<number>(0)

  const checkValue = (value:number) => {
    return (value * 100) / (tickets?.length ? tickets.length : 1)
  }

  const TicketsCardDetails : TicketCardDetail[] = [
    {
      id: 1,
      text: "Open Tickets",
      color: '',
      value: isOpen,
      progress: checkValue(isOpen)
    },
    
    {
      id: 2,
      text: "Resolved Tickets",
      color: '#06b6d4',
      value: isCompleted,
      progress: checkValue(isCompleted)
    },
    {
      id: 3,
      text: "High Priority",
      color: "#10b981",
      value: isHighPrio,
      progress: checkValue(isHighPrio)
    },
    {
      id: 4,
      text: "Urgent Priority",
      color: "#ef4444",
      value: isUrgentPrio,
      progress: checkValue(isUrgentPrio)
    }
  ]

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://localhost:7181/api/Ticket/Get-Tickets", {
          method: "GET",
          headers: {"Content-Type" : "application/json"}
        })

        if (response.ok) {
          const allTickets : Ticket[] = JSON.parse(await response.text())
          setTickets(allTickets)

          let complete = 0, open = 0, urgent = 0, high = 0
          allTickets.forEach((ticket:Ticket) => {
            if (ticket.status.toLowerCase() == "development")
              open++
            else if (ticket.status.toLowerCase() == "completed")
              complete++

            if (ticket.priority.toLowerCase() == "high")
              high++
            else if (ticket.priority.toLowerCase() == "urgent")
              urgent++
          })
          setIsCompleted(complete)
          setIsOpen(open)
          setIsHighPrio(high)
          setIsUrgentPrio(urgent)

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
        tickets == null? 
        <h1>
          there are no tickets
        </h1> :
        
        <div>
          <div className='flex gap-2 font-bold my-5'>
            <BsTicketPerforated 
              size={25}
              className="text-blue-700 "
            />
            <h1 className='text-lg'>
              / Tickets
            </h1>
          </div>

          <div className='flex gap-4'>
            {
              TicketsCardDetails.map((elem:TicketCardDetail) => {
                return (
                  <TicketCard props={elem} key={elem.id}/>
                )
              })
            }
          </div>
          
          <div className='p-auto itmes-center'>
            <TicketsTable props={tickets} />
          </div>
        </div>
      }
    </div>
  )
}

export default AllTickets
