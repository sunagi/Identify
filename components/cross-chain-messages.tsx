"use client"

import { useState, useEffect } from "react"
import { MessageSquare, RefreshCw, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useWallet } from "@/hooks/use-wallet"

interface Message {
  id: number
  title: string
  description: string
  time: string
  read: boolean
  network: string
  messageHash?: string
}

// Hyperlane API client (enhanced)
const HyperlaneClient = {
  async getMessages(address: string, ensName: string | null): Promise<Message[]> {
    try {
      // In a real implementation, this would be an actual API call to Hyperlane
      // For now, we'll simulate the API response

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate random message hashes
      const generateHash = () => {
        return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      }

      const displayName = ensName || address.substring(0, 6) + "..." + address.substring(address.length - 4)

      return [
        {
          id: 1,
          title: "Verified swap completed",
          description: `Your verified Identifi swap from ETH to USDC has been completed for ${displayName}`,
          time: "Just now",
          read: false,
          network: "Ethereum",
          messageHash: generateHash(),
        },
        {
          id: 2,
          title: "Cross-chain transfer complete",
          description: "Your transfer from Polygon to Rootstock has been completed",
          time: "2 minutes ago",
          read: false,
          network: "Polygon → Rootstock",
          messageHash: generateHash(),
        },
        {
          id: 3,
          title: "New token available",
          description: "You can now swap for RIF token on Rootstock",
          time: "1 hour ago",
          read: true,
          network: "Rootstock",
          messageHash: generateHash(),
        },
        {
          id: 4,
          title: "Verification reminder",
          description: "Complete your Identifi verification to unlock all features",
          time: "5 hours ago",
          read: true,
          network: "Ethereum",
          messageHash: generateHash(),
        },
        {
          id: 5,
          title: "Cross-chain message received",
          description: "You've received a new message from a dApp on Rootstock",
          time: "1 day ago",
          read: true,
          network: "Rootstock → Ethereum",
          messageHash: generateHash(),
        },
      ]
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw error
    }
  },

  async markAsRead(messageId: number): Promise<boolean> {
    try {
      // In a real implementation, this would be an actual API call to Hyperlane
      // For now, we'll simulate the API response

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Error marking message as read:", error)
      throw error
    }
  },

  async sendMessage(fromChain: string, toChain: string, message: string): Promise<string> {
    try {
      // In a real implementation, this would be an actual API call to Hyperlane
      // For now, we'll simulate the API response

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate random message hash
      return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },
}

export function CrossChainMessages() {
  const { address, isConnected, ensName } = useWallet()

  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isMarkingAsRead, setIsMarkingAsRead] = useState<number | null>(null)

  // Fetch messages from Hyperlane API
  useEffect(() => {
    const fetchMessages = async () => {
      if (!address) return

      setIsLoading(true)

      try {
        const messageData = await HyperlaneClient.getMessages(address, ensName)
        setMessages(messageData)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error fetching messages",
          description: "Could not load your messages. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      fetchMessages()
    }
  }, [address, isConnected, ensName])

  const markAsRead = async (id: number) => {
    setIsMarkingAsRead(id)

    try {
      const success = await HyperlaneClient.markAsRead(id)

      if (success) {
        setMessages(messages.map((message) => (message.id === id ? { ...message, read: true } : message)))
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
      toast({
        title: "Error",
        description: "Could not mark message as read",
        variant: "destructive",
      })
    } finally {
      setIsMarkingAsRead(null)
    }
  }

  const refreshMessages = async () => {
    if (!address) return

    setIsLoading(true)

    try {
      const messageData = await HyperlaneClient.getMessages(address, ensName)
      setMessages(messageData)
    } catch (error) {
      console.error("Error refreshing messages:", error)
      toast({
        title: "Error refreshing messages",
        description: "Could not refresh your messages. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-black/20 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-950/30 dark:to-cyan-950/30 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Identifi Messages
          </CardTitle>
          <CardDescription>Powered by Hyperlane</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshMessages}
          disabled={isLoading}
          className="relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/5 to-cyan-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-md border">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-3 w-full mt-2" />
                <Skeleton className="h-3 w-20 mt-2" />
              </div>
            ))
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-md border transition-colors duration-200 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/20 relative overflow-hidden group ${
                  message.read
                    ? "bg-background dark:bg-background/5"
                    : "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30"
                }`}
                onClick={() => !message.read && markAsRead(message.id)}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/5 to-cyan-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{message.title}</h4>
                  {!message.read ? (
                    isMarkingAsRead === message.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{message.description}</p>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-muted-foreground">{message.time}</div>
                  <Badge variant="outline" className="text-xs bg-purple-50/50 dark:bg-purple-950/20">
                    {message.network}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">No messages to display</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/10 dark:to-cyan-950/10">
        <Button variant="outline" className="w-full relative overflow-hidden group" size="sm">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/5 to-cyan-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          <MessageSquare className="h-4 w-4 mr-2" />
          View All Messages
        </Button>
      </CardFooter>
    </Card>
  )
}

