"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ApiUser } from "@/types"
import { Mail, Shield, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserCardProps {
  user: ApiUser
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter()
  const isAdmin = user.rol.includes("ADMIN")

  const handleClick = () => {
    router.push(`/admin/users/${user.idUser}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{user.username}</h3>
              <p className="text-xs text-muted-foreground">ID: {user.idUser}</p>
            </div>
          </div>

          <Badge variant={isAdmin ? "default" : "secondary"} className="flex items-center gap-1">
            {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isAdmin ? "Admin" : "Usuario"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-3 w-3" />
            {user.email}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
              {user.status}
            </Badge>
            <div className="flex gap-1">
              {user.rol.map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
