"use client"
import React, { useEffect } from 'react'
import { useAppContext } from '../components/AppContext/page'
import Dashboard from "../Dashboard/page"
import MyTickets from '../MyTickets/page'
import AllTickets from '../AllTickets/page'
import CreateTicket  from '../CreateTicket/page'
import EditTicket from '../EditTicket/page'
import AnswerTicket from '../AnswearTicket/page'
import ArchivedTickets from '../ArchivedTickets/page'
import { CreateProject } from '../Projects/CreateProject/page'
import { AllProjects } from '../Projects/AllProjects/page'
import { MyProjects } from '../Projects/MyProjects/page'
import { ArchivedProjects } from '../Projects/ArchivedProjects/page'
import { Admin } from '../Admin/page'
import { AnswerProject } from '../Projects/AnswerProject/page'
import { CreateTask } from '../CreateTask/page'

const MainContent: React.FC = () => {
  const {activeComponent} = useAppContext()
  return (
    <>
      {(activeComponent === 'Dashboard' && <Dashboard />) || (activeComponent === null && <Dashboard />)}
      {(activeComponent === 'All Tickets' && <AllTickets />)}
      {activeComponent === 'Create Ticket' && <CreateTicket />}
      {activeComponent?.includes("Edit-Ticket") && <EditTicket params={activeComponent}/>}
      {activeComponent === "All Tickets After Deletion" && <AllTickets />}
      {activeComponent?.includes("Answer-Ticket") && <AnswerTicket params={activeComponent} />}
      {activeComponent === "My Tickets" && <MyTickets />}
      {activeComponent === "Archived Tickets" && <ArchivedTickets />}
      {activeComponent === 'Create Project' && <CreateProject />}
      {activeComponent === "All Projects" && <AllProjects />}
      {activeComponent === "All Projects After Deletion" && <AllProjects />}
      {activeComponent === "My Projects" && <MyProjects />}
      {activeComponent === "Archived Projects" && <ArchivedProjects />}
      {activeComponent === 'Admin' && <Admin />}
      {activeComponent?.includes('Answer-Project') && <AnswerProject params={activeComponent}/>}
      {activeComponent?.includes("Create-Task") && <CreateTask props={activeComponent}/>}
    </>
  )
}

export default MainContent