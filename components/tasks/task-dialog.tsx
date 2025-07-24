"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useTaskStore } from "@/store/task-store";
import { useUserStore } from "@/store/user-store";
import { type Task, TaskStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  userId: z.array(z.number()).optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  task?: Task;
  projectId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDialog({
  task,
  projectId,
  open,
  onOpenChange,
}: TaskDialogProps) {
  const { createTask, updateTask, loading } = useTaskStore();
  const {
    users,
    fetchUsers,
    loadMoreUsers,
    resetUsers,
    loading: usersLoading,
    loadingMore,
    hasMore,
    initialized
  } = useUserStore();

  // Use refs to track if we've already loaded users to prevent infinite calls
  const hasLoadedUsersRef = useRef(false);
  const isDialogOpenRef = useRef(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const isEditing = !!task;

  // Hook para scroll infinito
  const scrollContainerRef = useInfiniteScroll({
    hasMore,
    loading: usersLoading || loadingMore, // Check both loading states
    onLoadMore: loadMoreUsers,
    threshold: 50
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || TaskStatus.PENDING,
      userId: task?.userId || [],
      dueDate: task?.dueDate || "",
    },
  });

  useEffect(() => {
    if (open && !isDialogOpenRef.current) {
      isDialogOpenRef.current = true
      if (!initialized && !usersLoading && !hasLoadedUsersRef.current) {
        hasLoadedUsersRef.current = true
        fetchUsers(true);
      }
    }

    if (!open) {
      isDialogOpenRef.current = false
      hasLoadedUsersRef.current = false
    }
  }, [open, initialized, usersLoading]); // Include necessary dependencies

  useEffect(() => {
    if (open) {
      const userIds = task?.userId || [];
      setSelectedUserIds(userIds);
      reset({
        title: task?.title || "",
        description: task?.description || "",
        status: task?.status || TaskStatus.PENDING,
        userId: userIds,
        dueDate: task?.dueDate || "",
      });
    }
  }, [open, task, reset]);

  const handleUserToggle = (userId: number) => {
    const newSelectedUserIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter(id => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(newSelectedUserIds);
    setValue('userId', newSelectedUserIds);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        userId: selectedUserIds,
        dueDate: data.dueDate,
        ...(projectId && { projectId: parseInt(projectId) }), // Add projectId if available
      };

      if (isEditing) {
        // For updateTask, send all the fields including status and projectId
        const updateData = {
          title: data.title,
          description: data.description,
          userId: selectedUserIds,
          status: data.status,
          dueDate: data.dueDate,
          projectId: task?.projectId || parseInt(projectId || "0")
        };
        await updateTask(task.idTask.toString(), updateData);
      } else {
        await createTask(taskData);
      }
      onOpenChange(false);
      reset();
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tarea" : "Nueva Tarea"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los detalles de la tarea"
              : "Crea una nueva tarea para el proyecto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="title">Título de la tarea</Label>
            <Input
              id="title"
              placeholder="Ej: Implementar autenticación"
              {...register("title")}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe los detalles de la tarea..."
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as TaskStatus)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.PENDING}>Pendiente</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>
                    En Progreso
                  </SelectItem>
                  <SelectItem value={TaskStatus.COMPLETE}>Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Asignar usuarios</Label>
            {usersLoading && users.length === 0 ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Cargando usuarios...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div
                  ref={scrollContainerRef}
                  className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3"
                  style={{ minHeight: '12rem' }} // Ensure minimum height for scrolling
                >
                  {users.length === 0 && !usersLoading ? (
                    <p className="text-sm text-gray-500">No hay usuarios disponibles</p>
                  ) : (
                    <>
                      {users.map((user) => (
                        <div key={user.idUser} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.idUser}`}
                            checked={selectedUserIds.includes(user.idUser)}
                            onCheckedChange={() => handleUserToggle(user.idUser)}
                            disabled={loading}
                          />
                          <Label
                            htmlFor={`user-${user.idUser}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            <div className="flex items-center justify-between">
                              <span>{user.username}</span>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </Label>
                        </div>
                      ))}

                      {/* Loading indicator for infinite scroll */}
                      {loadingMore && (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm text-gray-500">Cargando más...</span>
                        </div>
                      )}

                      {/* End of list indicator */}
                      {!hasMore && users.length > 0 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-400">No hay más usuarios</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Selected users counter */}
                {selectedUserIds.length > 0 && (
                  <p className="text-sm text-blue-600">
                    {selectedUserIds.length} usuario{selectedUserIds.length !== 1 ? 's' : ''} seleccionado{selectedUserIds.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
