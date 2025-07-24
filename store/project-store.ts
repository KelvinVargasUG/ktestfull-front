import { api } from "@/lib/api"
import type { ProjectState } from "@/types"
import { } from 'types/index'
import { create } from "zustand"
export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: null,
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const projects = await api.getProjects()
      set({ projects, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  setCurrentProjectById: (id: string) => {
    const state = get()
    if (state.projects?.data?.content) {
      // Convert string ID to number for comparison
      const numericId = parseInt(id, 10);
      const project = state.projects.data.content.find(p => p.idProject === numericId);
      set({ currentProject: project || null })
    }
  },

  createProject: async (data: { name: string; description?: string; dueDate?: string }) => {
    set({ loading: true, error: null })
    try {
      const response = await api.createProject(data)
      const newProject = response.data // Extract the project from the response.data

      set((state) => {
        if (!state.projects?.data?.content) {
          return { loading: false }
        }

        const updatedContent = [...state.projects.data.content, newProject]
        const updatedProjects = {
          ...state.projects,
          data: {
            ...state.projects.data,
            content: updatedContent,
            total: state.projects.data.total + 1
          }
        }

        return {
          projects: updatedProjects,
          loading: false,
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateProject: async (id: string, data: { name: string; description?: string; dueDate?: string }) => {
    set({ loading: true, error: null })
    try {
      const numericId = parseInt(id, 10)
      const response = await api.updateProject(id, data)
      const updatedProject = response.data // Extract the project from the response.data

      set((state) => {
        if (!state.projects?.data?.content) {
          return { loading: false }
        }

        const updatedContent = state.projects.data.content.map((p) =>
          p.idProject === numericId ? updatedProject : p
        )
        const updatedProjects = {
          ...state.projects,
          data: {
            ...state.projects.data,
            content: updatedContent
          }
        }

        return {
          projects: updatedProjects,
          currentProject: state.currentProject?.idProject === numericId ? updatedProject : state.currentProject,
          loading: false,
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteProject: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const numericId = parseInt(id, 10)
      const response = await api.deleteProject(id)

      set((state) => {
        if (!state.projects?.data?.content) {
          return { loading: false }
        }

        const updatedContent = state.projects.data.content.filter((p) => p.idProject !== numericId)
        const updatedProjects = {
          ...state.projects,
          data: {
            ...state.projects.data,
            content: updatedContent,
            total: state.projects.data.total - 1
          }
        }

        return {
          projects: updatedProjects,
          currentProject: state.currentProject?.idProject === numericId ? null : state.currentProject,
          loading: false,
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },
}))
