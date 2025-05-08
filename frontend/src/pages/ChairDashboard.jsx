"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const ChairDashboard = () => {
  const { user } = useContext(AuthContext)
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("committees")

  useEffect(() => {
    const fetchChairData = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call to get chair's committees
        const response = await axios.get(`/api/chairs/${user.user_id}/committees`)
        setCommittees(response.data || [])
      } catch (error) {
        console.error("Error fetching chair data:", error)
        // Fallback mock data
        setCommittees([
          {
            committee_id: 1,
            name: "Security Council",
            topic: "Nuclear Proliferation",
            delegate_count: 15,
            start_date: "2025-05-01",
            end_date: "2025-05-03",
            location: "Room A101",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    if (user?.user_id) {
      fetchChairData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white p-6">
          <h1 className="text-2xl font-bold">Chair Dashboard</h1>
          <p className="mt-2">Welcome back, {user?.full_name}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("committees")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "committees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Your Committees
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Documents
            </button>
            <button
              onClick={() => setActiveTab("scores")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "scores"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Delegate Scores
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "committees" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Committees You Chair</h2>
              </div>

              {committees.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        You are not currently assigned as chair to any committees.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {committees.map((committee) => (
                    <div key={committee.committee_id} className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-600 text-white p-4">
                        <h3 className="text-lg font-semibold">{committee.name}</h3>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Topic</span>
                          <p className="text-gray-800">{committee.topic}</p>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Delegates</span>
                          <p className="text-gray-800">{committee.delegate_count} assigned</p>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Schedule</span>
                          <p className="text-gray-800">
                            {new Date(committee.start_date).toLocaleDateString()} -{" "}
                            {new Date(committee.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Location</span>
                          <p className="text-gray-800">{committee.location}</p>
                        </div>
                        <div className="mt-6 flex space-x-4">
                          <Link
                            to={`/committee/${committee.committee_id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md"
                          >
                            Manage Committee
                          </Link>
                          <Link
                            to={`/committee/${committee.committee_id}/session`}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md"
                          >
                            Start Session
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pending Documents for Review</h2>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">There are no documents pending your review at this time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scores" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delegate Scores</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  Record New Score
                </button>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No scores have been recorded yet. Start scoring delegates to see them here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChairDashboard
