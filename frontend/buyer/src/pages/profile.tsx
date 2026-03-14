import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser, getOrders, removeAllSessions, removeSession } from "@/services"
import { decryptPayload } from "@/lib/utils"
import BeatLoader from "react-spinners/BeatLoader"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const getUserDetails = async () => {
    try {
      const response = await getCurrentUser()

      if (response.success) {
        const payload = decryptPayload(response.data)
        setUser(payload)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message
      console.error("Error while fetching current user", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection user={user} />
      case "orders":
        return <OrdersSection />
      case "sessions":
        return <SessionsSection sessions={user?.sessions || []} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-4 space-y-2 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left px-3 py-2 rounded cursor-pointer ${activeTab === "profile" ? "bg-gray-200" : ""
            }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full text-left px-3 py-2 rounded cursor-pointer ${activeTab === "orders" ? "bg-gray-200" : ""
            }`}
        >
          Orders
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`w-full text-left px-3 py-2 rounded cursor-pointer ${activeTab === "sessions" ? "bg-gray-200" : ""
            }`}
        >
          Sessions
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 flex justify-center items-start">
        {loading ? <BeatLoader /> : renderContent()}
      </div>
    </div>
  )
}


function ProfileSection({ user }: any) {
  return (
    <Card className="w-full max-w-xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Profile</h2>

        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </CardContent>
    </Card>
  )
}

function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([])

  const getOrder = async () => {
    try {
      const response = await getOrders()
      if (response.success) {
        const payload = decryptPayload(response.data)
        setOrders(payload)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message
      console.error("Error while fetching orders", errorMessage)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getOrder()
  }, [])

  console.log(orders)

  return (

    orders?.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      orders.map((order: any) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Product:</strong> {order.product?.name}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total Price:</strong> ₹ {order.price * order.quantity}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Created At:</strong> {order.createdAt?.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))
    )
  )
}


function SessionsSection({ sessions }: any) {
  const [sessionList, setSessionList] = useState(sessions || [])

  const deleteSession = async (id: string) => {
    try {
      const res = await removeSession(id)
      if (res.success) {
        setSessionList(sessionList.filter((s: any) => s.sessionId !== id))
        toast.success("Session removed successfully")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message
      console.error("Error while removing session", errorMessage)
    }
  }

  const deleteAllSessions = async () => {
    try {
      const res = await removeAllSessions()
      if (res.success) {
        window.location.href = '/login';
        toast.success("All sessions removed successfully")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message
      console.error("Error while removing all sessions", errorMessage)
    }
  }

  return (
    <div className="space-y-4 w-full max-w-xl">
      {sessionList.length === 0 ? (
        <p>No active sessions</p>
      ) : (
        sessionList.map((session: any) => (
          <Card key={session.sessionId}>
            <CardContent className="p-4 flex justify-between items-start">

              <div className="space-y-1">
                <p><strong>Session ID:</strong> {session.sessionId}</p>
                <p><strong>Device:</strong> {session?.userAgent}</p>
                <p><strong>IP Address:</strong> {session?.ipAddress}</p>
                <p><strong>Created At:</strong> {session.createdAt}</p>
                <p><strong>Last Active:</strong> {session.updatedAt}</p>
              </div>

              {/* REMOVE BUTTON */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSession(session.sessionId)}
                className="cursor-pointer"
              >
                Remove
              </Button>

            </CardContent>
          </Card>
        ))
      )}

      {/* REMOVE ALL BUTTON */}
      {sessionList.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button
            variant="destructive"
            onClick={deleteAllSessions}
          >
            Remove All Sessions
          </Button>
        </div>
      )}

    </div>
  )
}