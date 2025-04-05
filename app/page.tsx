"use client"

import { useEffect, useState } from "react"
import { Check, Globe, Lock, Shield, Wallet } from "lucide-react"
import { SelfID } from "@self.id/web"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnect } from "@/components/wallet-connect"
import { AssetList } from "@/components/asset-list"
import { TokenSwap } from "@/components/token-swap"
import { CrossChainMessages } from "@/components/cross-chain-messages"

// Add this at the top of the component
export default function Dashboard() {
  // Add a state to check if MetaMask is installed
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum)
    }
  }, [])

  const { address, isConnected, chainId, ensName } = useWallet()

  const [isVerifiedSelf, setIsVerifiedSelf] = useState(false)
  const [isVerifiedWorldID, setIsVerifiedWorldID] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isVerified = isVerifiedSelf || isVerifiedWorldID

  // Handle Self Protocol verification
  const handleSelfVerify = async () => {
    setIsLoading(true)
    try {
      // Actual Self Protocol integration
      const selfConnection = await SelfID.connect({
        authProvider: "metamask",
        ceramic: "testnet-clay",
        connectNetwork: "testnet-clay",
        address: address,
      })

      if (selfConnection) {
        const selfID = await selfConnection.get("basicProfile")

        // Store the DID for future use
        localStorage.setItem("selfDID", selfConnection.did.id)

        setIsVerifiedSelf(true)
        toast({
          title: "Verification Successful",
          description: "You've been verified with Self Protocol",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Self Protocol verification error:", error)
      toast({
        title: "Verification Failed",
        description: "There was an error verifying with Self Protocol",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle World ID verification (mock)
  const handleWorldIDVerify = () => {
    setIsLoading(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifiedWorldID(true)
      setIsLoading(false)
      toast({
        title: "Verification Successful",
        description: "You've been verified with World ID",
        variant: "success",
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80 dark:from-background dark:via-background/95 dark:to-background/90">
      <Toaster />
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
                Identifi Dashboard
              </h1>
              <p className="text-muted-foreground">Secure identity verification and token swaps</p>
            </div>
            <div className="flex items-center gap-2">
              {isVerified && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1.5 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
                  >
                    <Check className="h-3 w-3" />
                    Verified
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-3 py-1.5 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                  >
                    <Shield className="h-3 w-3" />
                    Trustworthy
                  </Badge>
                </div>
              )}

              <WalletConnect />
            </div>
          </div>

          {isConnected && !isVerified && (
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Verify Your Identity with Identifi</CardTitle>
                <CardDescription>
                  Verification is required to perform token swaps and access all features
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed bg-white/80 dark:bg-black/20 backdrop-blur-sm hover:border-purple-200 transition-all duration-300 hover:shadow-md dark:hover:border-purple-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="h-5 w-5 text-purple-500" />
                        Self Protocol
                      </CardTitle>
                      <CardDescription>Verify with zkPassport</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Securely verify your identity without revealing personal information using zero-knowledge
                        proofs.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={handleSelfVerify}
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify with zkPassport"}
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-2 border-dashed bg-white/80 dark:bg-black/20 backdrop-blur-sm hover:border-cyan-200 transition-all duration-300 hover:shadow-md dark:hover:border-cyan-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-cyan-500" />
                        World ID
                      </CardTitle>
                      <CardDescription>Verify with Worldcoin</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Prove your humanity and uniqueness with World ID, powered by Worldcoin.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        onClick={handleWorldIDVerify}
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify with World ID"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {isConnected && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TokenSwap isVerified={isVerified} className="lg:col-span-2" />

              <CrossChainMessages />
            </div>
          )}

          {isConnected && <AssetList isVerified={isVerified} />}

          {!isConnected && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mb-6">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet to Identifi</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Connect your wallet to access the Identifi dashboard and manage your cross-chain assets.
              </p>
              <WalletConnect variant="default" size="lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

