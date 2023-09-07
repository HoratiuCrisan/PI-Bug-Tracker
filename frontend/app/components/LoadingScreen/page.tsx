import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-100 z-50">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 h-14 w-14">
      </div>
    </div>
  )
}

export default LoadingScreen
