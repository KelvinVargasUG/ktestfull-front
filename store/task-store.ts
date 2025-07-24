import { api } from "@/lib/api"
import type { Task, TaskState } from "@/types"
import { create } from "zustand"

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filters: {
    sortBy: "title",
    sortOrder: "asc",
  },

  fetchTasks: async (projectId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await api.getTasks(projectId)
      const tasks = response.data // Extract tasks array from ResponseBase structure
      set({ tasks, loading: false })
    } catch (error) {
      console.error('Store: Error fetching tasks:', error)
      set({ error: (error as Error).message, loading: false })
    }
  },

  createTask: async (data: Partial<Task>, userId?: number) => {
    set({ loading: true, error: null })
    try {
      const response = await api.createTask(data, userId)
      const newTask = response.data // Extract task from ResponseBase structure
      set((state) => ({
        tasks: [...state.tasks, newTask],
        loading: false,
      }))
      return newTask
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateTask: async (id: string, data: {
    title: string;
    description?: string;
    userId?: number[];
    status?: string;
    projectId?: number;
  }) => {
    set({ loading: true, error: null })
    try {
      const response = await api.updateTask(id, data)
      const updatedTask = response.data

      set((state) => ({
        tasks: state.tasks.map((t) => (t.idTask.toString() === id ? updatedTask : t)),
        loading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await api.deleteTask(id)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.idTask.toString() !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateTaskStatus: async (id: string, status: string) => {
    set({ loading: true, error: null })
    try {
      // Find the current task to get its existing data
      const currentTask = get().tasks.find(t => t.idTask.toString() === id)
      if (!currentTask) {
        throw new Error('Task not found')
      }

      // Use the updateTask method but only change the status
      const response = await api.updateTask(id, {
        title: currentTask.title,
        description: currentTask.description,
        userId: currentTask.assignedUsersTask?.map(user => user.idUser) || [],
        projectId: currentTask.projectId,
        status: status,
        dueDate: currentTask.dueDate
      })

      const updatedTask = response.data // Extract task from ResponseBase structure
      console.log('Task status updated successfully:', updatedTask)

      set((state) => ({
        tasks: state.tasks.map((t) => (t.idTask.toString() === id ? updatedTask : t)),
        loading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },
}))
