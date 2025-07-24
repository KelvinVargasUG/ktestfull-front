"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjectStore } from "@/store/project-store"
import type { Project } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectDialogProps {
  project?: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  const { createProject, updateProject, loading } = useProjectStore()
  const isEditing = !!project

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      dueDate: project?.dueDate || "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: project?.name || "",
        description: project?.description || "",
        dueDate: project?.dueDate || "",
      })
    }
  }, [open, project, reset])

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateProject(project.idProject.toString(), data)
      } else {
        await createProject(data)
      }
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica los detalles del proyecto" : "Crea un nuevo proyecto para organizar tus tareas"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre del proyecto</Label>
            <Input id="name" placeholder="Ej: Desarrollo de aplicación web" {...register("name")} disabled={loading} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente el proyecto..."
              rows={3}
              {...register("description")}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dueDate">Fecha de vencimiento (opcional)</Label>
            <Input
              id="dueDate"
              type="date"
              className="w-48"
              {...register("dueDate")}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear proyecto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
