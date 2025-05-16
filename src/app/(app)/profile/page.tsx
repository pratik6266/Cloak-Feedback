"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Edit, Key } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


export default function ProfilePage() {

  const { data: session } = useSession();
  const loggedUser = session?.user;

  const router = useRouter();

  const userName =  loggedUser?.userName || ""
  const email =  loggedUser?.email || ""

  const editProfile = () => {
    router.replace('/profile/editProfile')
  }
  const changePassword = () => {
    router.replace('/profile/changePassword')
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={''} alt={userName} />
                  <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userName}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p>{userName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{email}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={editProfile} className="px-6 py-2 rounded-sm shadow-md transition-all duration-100 ease-in-out transform hover:scale-105 hover:shadow-lg">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button onClick={changePassword} variant="outline" className="px-6 py-2 rounded-sm shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                  <Key className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
