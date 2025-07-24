"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTaskStore } from "@/store/task-store"
import { type Task, TaskStatus } from "@/types"
import { Edit, MoreHorizontal, Trash2, User, Calendar } from "lucide-react"
import { useState } from "react"
import { TaskDialog } from "./task-dialog"

interface TaskCardProps {
  task: Task
}

const statusColors = {
  [TaskStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TaskStatus.COMPLETE]: "bg-green-100 text-green-800",
}

const statusLabels = {
  [TaskStatus.PENDING]: "Pendiente",
  [TaskStatus.IN_PROGRESS]: "En Progreso",
  [TaskStatus.COMPLETE]: "Completada",
}

export function TaskCard({ task }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { deleteTask, updateTaskStatus } = useTaskStore()

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await deleteTask(task.idTask.toString())
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(task.idTask.toString(), newStatus)
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-medium text-sm">{task.title}</h3>
              {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                {task.status !== TaskStatus.COMPLETE && (
                  <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.COMPLETE)}>
                    Marcar como completada
                  </DropdownMenuItem>
                )}
                {task.status !== TaskStatus.IN_PROGRESS && (
                  <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}>
                    Marcar en progreso
                  </DropdownMenuItem>
                )}
                {task.status !== TaskStatus.PENDING && (
                  <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.PENDING)}>
                    Marcar como pendiente
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
          </div>

          {task.dueDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
            </div>
          )}

          <div className="space-y-2">
            {task.assignedUsersTask && task.assignedUsersTask.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Asignada a:</p>
                {task.assignedUsersTask.map((user) => (
                  <div key={user.idUser} className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    {user.username} ({user.email})
                    <Badge variant="outline" className="ml-2 text-xs">
                      {user.rol.join(", ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDialog task={task} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </>
  )
}
