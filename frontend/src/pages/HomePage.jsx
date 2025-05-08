"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import committeesAPI from "../api/committees"

const HomePage = () => {
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const data = await committeesAPI.getCommittees()
        setCommittees(data)
      } catch (error) {
        console.error("Error fetching committees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommittees()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Model United Nations Management System</h1>
            <p className="text-xl md:text-2xl mb-8">
              A comprehensive platform for organizing and participating in Model UN conferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-center py-3 px-6 text-lg">
                Register Now
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-800 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors text-center text-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full md:w-1/3 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <path
              fill="#FFFFFF"
              d="M42.8,-68.7C54.9,-62.3,63.6,-49.3,69.7,-35.5C75.8,-21.7,79.3,-7.2,77.4,6.5C75.5,20.2,68.1,33.1,58.7,44.3C49.3,55.5,37.8,65,24.6,70.1C11.4,75.2,-3.5,76,-17.9,73.1C-32.3,70.2,-46.2,63.7,-56.3,53.2C-66.4,42.7,-72.7,28.2,-75.1,13.1C-77.5,-2,-76,-17.7,-69.8,-30.9C-63.6,-44.1,-52.7,-54.8,-40.2,-61.1C-27.7,-67.4,-13.8,-69.3,0.9,-70.8C15.7,-72.3,30.7,-75.1,42.8,-68.7Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* Featured Committees Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Committees</h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.map((committee) => (
              <div key={committee.committee_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-700 text-white p-4">
                  <h3 className="text-xl font-bold">{committee.name}</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Topic</span>
                    <p className="text-gray-800">{committee.topic}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Difficulty</span>
                    <p className="capitalize text-gray-800">{committee.difficulty}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Chair</span>
                    <p className="text-gray-800">{committee.chair_name}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Capacity</span>
                    <p className="text-gray-800">{committee.capacity} delegates</p>
                  </div>
                  <Link
                    to={`/committee/${committee.committee_id}`}
                    className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Delegate Management</h3>
              <p className="text-gray-600">
                Register delegates, assign countries, and track participation across committees.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Handling</h3>
              <p className="text-gray-600">
                Submit, review, and vote on position papers, working papers, and resolutions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Score delegates, track participation, and generate awards based on performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform today and experience the best way to manage your Model UN conferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors text-lg"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="border border-white text-white hover:bg-blue-800 font-medium py-3 px-6 rounded-md transition-colors text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
