import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { FiHome, FiInfo, FiUser } from 'react-icons/fi'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiUser className="text-blue-500" />
          FastGrade Webapp
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to your Vite + React + TypeScript + Tailwind app with TanStack Query, Firebase, and more!
        </p>
        
        <Routes>
          <Route path="/" element={
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FiHome className="text-green-500" />
                Home Page
              </h2>
              <p className="text-gray-700">This is the home page with all your favorite libraries.</p>
            </div>
          } />
          <Route path="/about" element={
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FiInfo className="text-purple-500" />
                About Page
              </h2>
              <p className="text-gray-700">This page demonstrates React Icons integration.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App