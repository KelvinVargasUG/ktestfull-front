"use client"

import { ProjectCard } from "@/components/projects/project-card"
import { ProjectDialog } from "@/components/projects/project-dialog"
import { ProjectSkeleton } from "@/components/projects/project-skeleton"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { useAuthStore } from "@/store/auth-store"
import { useProjectStore } from "@/store/project-store"
import { FolderOpen, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { projects, loading, fetchProjects } = useProjectStore()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
    fetchProjects()
  }, [checkAuth, fetchProjects])
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
          <p className="text-gray-600 mt-2">Gestiona y organiza todos tus proyectos en un solo lugar</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      ) : !projects?.data?.content || projects.data.content.length === 0 ? (
        <EmptyState
          title="No tienes proyectos aún"
          description="Crea tu primer proyecto para comenzar a organizar tus tareas y colaborar con tu equipo."
          actionLabel="Crear primer proyecto"
          onAction={() => setShowCreateDialog(true)}
          icon={<FolderOpen className="h-12 w-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.data.content.map((project) => (
            <ProjectCard key={project.idProject} project={project} />
          ))}
        </div>
      )}

      <ProjectDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
