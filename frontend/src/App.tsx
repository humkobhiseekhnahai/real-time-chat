import { useEffect, useState } from 'react'
import { Send, Bell, Plus } from 'lucide-react'
import axios from 'axios'

interface Message {
  userID: string
  data: string
  isAnnouncement?: boolean
}

export default function MinimalistChat() {
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [msgList, setMsgList] = useState<Message[]>([])
  const [announcements, setAnnouncements] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [currentUserID, setCurrentUserID] = useState<string>('')

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080")
    newSocket.onopen = () => {
      console.log("Socket connected")
      setSocket(newSocket)
    }

    newSocket.onmessage = (event) => {
      console.log("Message received")
      const data = JSON.parse(event.data)
      if (data.message) {
        // This is an announcement
        setAnnouncements(prevAnnouncements => [...prevAnnouncements, data.message])
      } else {
        if (!currentUserID && data.userID) {
          setCurrentUserID(data.userID)
        }
        setMsgList(prevList => [...prevList, data])
      }
    }

    return () => {
      newSocket.close()
      console.log("Socket closed")
    }
  }, [currentUserID])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (socket && message) {
      socket.send(message)
      setMessage('')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-800">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Announcement Input */}
        <div className="bg-blue-50 p-2">
          <div className="flex">
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type an announcement..."
              className="flex-1 text-sm p-2 focus:outline-none bg-white rounded-l-md"
            />
            <button
              type="submit"
              onClick={async()=>{
                await axios.post("http://localhost:8080/announcement",{ "announcement": announcement})
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Announcements Area */}
        <div className="bg-blue-100 p-2 max-h-32 overflow-y-auto">
          <h3 className="font-bold text-sm mb-2 flex items-center">
            <Bell className="w-4 h-4 mr-1" /> Announcements
          </h3>
          {announcements.map((ann, index) => (
            <p key={index} className="text-sm mb-1">{ann}</p>
          ))}
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-3">
  {msgList.map((msg, index) => (
    <div key={index} className={`space-y-1 flex flex-col items-start`}>
      <p className={`text-xs text-gray-500 ${msg.userID === currentUserID ? 'ml-1' : 'ml-1'}`}>
        {msg.userID}
      </p>
      <div className={`p-2 rounded-lg text-sm max-w-[80%] ${
        msg.userID === currentUserID ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <p>{msg.data}</p>
      </div>
    </div>
  ))}
</div>


        {/* Message Input */}
        <div className="border-t border-gray-200 p-2">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm p-2 focus:outline-none"
            />
            <button
              type="submit"
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}