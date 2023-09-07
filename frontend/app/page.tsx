"use client"
import React from 'react'
import { Navbar } from './components/Navbar/page'
import { Sidebar } from './components/Sidebar/page'
import  MainContent  from './MainContent/page'
import ProtectedRoute from './components/ProtectedRouter/page'
import generateUserData from './components/ProtectedRouter/route'
import { AppProvider } from './components/AppContext/page'

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function Home() {
  const userData: User = generateUserData()

  return (
    <ProtectedRoute>
      <AppProvider>
        <Navbar />
        <div className='flex h-screen'>
          <Sidebar props={userData}/>
          <main className='bg-gray-100 w-full px-5 overflow-y-auto'>
            <MainContent />
          </main>
        </div>
      </AppProvider>
    </ProtectedRoute>
  )
}
