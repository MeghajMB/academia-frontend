"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react"
import { ArrowLeft, Clock, DollarSign, Users } from "lucide-react"
import StatusBadge from "@/features/session/components/session/StatusBadge"

// Mock data based on the provided structure
const mockSessionDetails = {
  id: "session-002",
  title: "Data Structures Fundamentals",
  instructor: {
    name: "Prof. Michael Chen",
    id: "ins-002",
    profilePicure: "/placeholder.svg?height=128&width=128",
  },
  status: "in-progress" as const,
  yourBid: 75,
  participants: [
    { id: "p-001", name: "Alex Johnson", profilePicture: "/placeholder.svg?height=64&width=64" },
    { id: "p-002", name: "Jamie Smith", profilePicture: "/placeholder.svg?height=64&width=64" },
    { id: "p-003", name: "Taylor Brown", profilePicture: "/placeholder.svg?height=64&width=64" },
    { id: "p-004", name: "Morgan Lee", profilePicture: "/placeholder.svg?height=64&width=64" },
  ],
  totalTimeSpent: null,
}

// Mock data for completed session
const mockCompletedSession = {
  id: "session-003",
  title: "Machine Learning Basics",
  instructor: {
    name: "Dr. Emily Rodriguez",
    id: "ins-003",
    profilePicure: "/placeholder.svg?height=128&width=128",
  },
  status: "completed" as const,
  yourBid: 90,
  participants: [
    { id: "p-005", name: "Jordan Wilson", profilePicture: "/placeholder.svg?height=64&width=64" },
    { id: "p-006", name: "Casey Martinez", profilePicture: "/placeholder.svg?height=64&width=64" },
    { id: "p-007", name: "Riley Thompson", profilePicture: "/placeholder.svg?height=64&width=64" },
  ],
  totalTimeSpent: 7200, // 2 hours in seconds
}

export default function SessionDetailPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      // Choose the session based on the ID
      const session = params.sessionId === "session-003" ? mockCompletedSession : mockSessionDetails
      setSessionDetails(session)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.sessionId])

  // Format time spent (convert seconds to hours and minutes)
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md w-full" color="secondary" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading session details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Button variant="light" startContent={<ArrowLeft size={16} />} onPress={() => router.back()} className="mb-4">
          Back to Sessions
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{sessionDetails.title}</h1>
          <StatusBadge status={sessionDetails.status} className="mt-2 sm:mt-0" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-md">
            <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pb-0">
              <Avatar
                src={sessionDetails.instructor.profilePicure}
                className="w-16 h-16"
                fallback={sessionDetails.instructor.name.charAt(0)}
              />
              <div>
                <h2 className="text-xl font-semibold">{sessionDetails.instructor.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Instructor</p>
              </div>
            </CardHeader>

            <CardBody>
              <div className="space-y-6">
                {sessionDetails.status === "completed" && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="text-green-600 dark:text-green-400" size={20} />
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Session Completed</h3>
                    </div>
                    <p className="mt-2 text-green-700 dark:text-green-300">
                      Total time spent:{" "}
                      <span className="font-semibold">{formatTimeSpent(sessionDetails.totalTimeSpent!)}</span>
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">Participants ({sessionDetails.participants.length})</h3>
                  <div className="flex flex-wrap gap-3">
                    {sessionDetails.participants.map((participant: any) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
                      >
                        <Avatar
                          src={participant.profilePicture}
                          className="w-8 h-8"
                          fallback={participant.name.charAt(0)}
                        />
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {sessionDetails.status === "in-progress" && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      duration: 1.5,
                    }}
                  >
                    <Button color="success" size="lg" className="w-full font-bold">
                      Join Session Now
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-md">
            <CardHeader>
              <h3 className="text-lg font-medium">Session Details</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your Bid</p>
                  <div className="flex items-center mt-1">
                    <DollarSign className="text-green-600 dark:text-green-400" size={18} />
                    <span className="text-xl font-bold">{sessionDetails.yourBid}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                  <div className="flex items-center mt-1">
                    <Users className="text-blue-600 dark:text-blue-400" size={18} />
                    <span className="text-xl font-bold ml-1">{sessionDetails.participants.length}</span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Session ID</span>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {sessionDetails.id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Instructor ID</span>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {sessionDetails.instructor.id}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions Card */}
          <Card className="shadow-md mt-4">
            <CardBody>
              <div className="space-y-3">
                <Button color="primary" variant="flat" className="w-full">
                  Contact Instructor
                </Button>

                <Button color="secondary" variant="flat" className="w-full">
                  View Related Sessions
                </Button>

                {sessionDetails.status === "scheduled" && (
                  <Button color="danger" variant="flat" className="w-full">
                    Cancel Session
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
