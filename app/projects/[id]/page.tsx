"use client";

import { TaskCard } from "@/components/tasks/task-card";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useProjectStore } from "@/store/project-store";
import { useTaskStore } from "@/store/task-store";
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    currentProject,
    fetchProjects,
    setCurrentProjectById,
    loading: projectLoading,
  } = useProjectStore();
  const { tasks, loading: tasksLoading, fetchTasks, filters } = useTaskStore();

  useEffect(() => {
    if (projectId) {
      // If we don't have projects yet, fetch them first
      if (!projects) {
        fetchProjects().then(() => {
          setCurrentProjectById(projectId);
        });
      } else {
        // If we already have projects, just set the current one
        setCurrentProjectById(projectId);
      }
      fetchTasks(projectId);
    }
  }, [projectId]);

  const filteredTasks = tasks
    .filter((task) => !filters.status || task.status === filters.status)
    .sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (filters.sortBy === "title") {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      } else { // status
        aValue = a.status;
        bValue = b.status;
      }

      return filters.sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Show loading while fetching projects or if we don't have the current project yet
  if (projectLoading || (!currentProject && projects)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Proyecto no encontrado
          </h1>
          <Button onClick={() => router.push("/dashboard")}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentProject.name}
          </h1>
          {currentProject.description && (
            <p className="text-gray-600 mb-4">{currentProject.description}</p>
          )}
          <p className="text-sm text-gray-500">
            Creado el {new Date(currentProject.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setShowCreateTaskDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <TaskFilters />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tareas ({filteredTasks.length})
        </h2>

        {tasksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title={
              tasks.length === 0
                ? "No hay tareas aún"
                : "No se encontraron tareas"
            }
            description={
              tasks.length === 0
                ? "Crea la primera tarea para comenzar a trabajar en este proyecto."
                : "Intenta cambiar los filtros para ver más tareas."
            }
            actionLabel={tasks.length === 0 ? "Crear primera tarea" : undefined}
            onAction={
              tasks.length === 0
                ? () => setShowCreateTaskDialog(true)
                : undefined
            }
            icon={<CheckCircle2 className="h-12 w-12" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.idTask} task={task} />
            ))}
          </div>
        )}
      </div>

      <TaskDialog
        projectId={projectId}
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
      />
    </div>
  );
}
