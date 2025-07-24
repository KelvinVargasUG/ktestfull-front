"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProjectStore } from "@/store/project-store"
import type { Project } from "@/types"
import { Calendar, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ProjectDialog } from "./project-dialog"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const router = useRouter()
  const deleteProject = useProjectStore((state) => state.deleteProject)

  const handleView = () => {
    router.push(`/projects/${project.idProject}`)
  }

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      try {
        await deleteProject(project.idProject.toString())
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  // const taskCount = project.tasks?.length || 0
  // const completedTasks = project.tasks?.filter((task) => task.status === "DONE").length || 0

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1" onClick={handleView}>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description || "Sin descripción"}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent onClick={handleView}>
          <div className="space-y-2">
            {project.dueDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Vence: {new Date(project.dueDate).toLocaleDateString('es-ES')}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {taskCount} tarea{taskCount !== 1 ? "s" : ""}
                </Badge>
                {taskCount > 0 && (
                  <Badge variant="outline">
                    {completedTasks}/{taskCount} completadas
                  </Badge>
                )}
              </div> */}
              <div className="text-sm text-muted-foreground">Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectDialog project={project} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </>
  )
}
