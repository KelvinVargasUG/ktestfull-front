export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  password?: string
  createdAt: string
  updatedAt: string
}

// New API User interface to match the API response
export interface ApiUser {
  idUser: number
  username: string
  email: string
  status: string
  rol: string[]
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface Project {
  idProject: number  // Changed from string to number to match API response
  name: string
  description?: string
  // userId: string
  createdAt: string
  // updatedAt: string
  // tasks?: Task[]
  status: string
  owner?: ApiUser // Add owner field from API response
  dueDate?: string // Add due date field for projects
}

// Response type for single project creation
export interface ProjectResponse {
  statusCode: number
  status: string
  message: string
  data: Project
}

// Response type for project deletion
export interface ProjectDeleteResponse {
  statusCode: number
  status: string
  message: string
  data: null
}

export interface ResponseBase<T> {
  message: string
  status: string
  statusCode: Number
  data: T
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  total: number
  pages: number
}

export interface Task {
  idTask: number
  title: string
  description?: string
  status: TaskStatus
  projectId: number
  userId: number[]
  assignedUsersTask: AssignedUserTask[]
  dueDate?: string
}

export interface AssignedUserTask {
  idUser: number
  username: string
  email: string
  status: string
  rol: string[]
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export interface ProjectState {
  projects: ProjectPaginatedResponse | null
  currentProject: Project | null
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  setCurrentProjectById: (id: string) => void
  createProject: (data: { name: string; description?: string }) => Promise<void>
  updateProject: (id: string, data: { name: string; description?: string }) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

export type ProjectPaginatedResponse = ResponseBase<PaginatedResponse<Project>>

export type TaskResponse = ResponseBase<Task>

export type TaskListResponse = ResponseBase<Task[]>

export type UsersPaginatedResponse = ResponseBase<PaginatedResponse<ApiUser>>

export interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  filters: {
    status?: TaskStatus
    sortBy: "title" | "status" | "dueDate" | "createdAt"
    sortOrder: "asc" | "desc"
  }
  fetchTasks: (projectId: string) => Promise<void>
  createTask: (data: Partial<Task>, userId?: number) => Promise<Task>
  updateTask: (id: string, data: {
    title: string;
    description?: string;
    userId?: number[];
    status?: string;
    projectId?: number;
  }) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateTaskStatus: (id: string, status: string) => Promise<void>
  setFilters: (filters: Partial<TaskState["filters"]>) => void
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
