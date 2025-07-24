import type { PaginatedResponse, ProjectDeleteResponse, ProjectPaginatedResponse, ProjectResponse, Task, TaskListResponse, TaskResponse, User, UsersPaginatedResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const baseHeaders = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
    };

    const additionalHeaders = options.headers as Record<string, string> || {};

    const config: RequestInit = {
      ...options,
      headers: {
        ...baseHeaders,
        ...additionalHeaders,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getProjects() {
    return this.request<ProjectPaginatedResponse>("/projects?userId=1");
  }

  async createProject(data: { name: string; description?: string; dueDate?: string }, userId?: number) {
    // Use hardcoded user ID (1) for now, similar to tasks
    const currentUserId = userId || 1;

    const projectData = {
      name: data.name,
      description: data.description || "",
      owner: currentUserId,
      dueDate: data.dueDate
    };

    return this.request<ProjectResponse>(`/projects?user=${currentUserId}`, {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, data: { name: string; description?: string; dueDate?: string }, userId?: number) {
    // Use hardcoded user ID (1) for now, similar to createProject
    const currentUserId = userId || 1;

    const projectData = {
      name: data.name,
      description: data.description || "",
      owner: currentUserId,
      dueDate: data.dueDate
    };

    return this.request<ProjectResponse>(`/projects/${id}?userId=${currentUserId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string, userId?: number) {
    // Use hardcoded user ID (1) for now, similar to other project methods
    const currentUserId = userId || 1;

    return this.request<ProjectDeleteResponse>(`/projects/${id}?userId=${currentUserId}`, {
      method: "DELETE",
    });
  }

  async getTasks(projectId: string) {
    const url = `/tasks/project/${projectId}`;
    return this.request<TaskListResponse>(url);
  }

  async createTask(data: Partial<Task>, userId?: number) {
    // For now, use a hardcoded admin user ID (1) until proper auth integration
    // TODO: Get this from proper authentication context
    const currentUserId = userId || 1;

    const taskData = {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      status: data.status || "PENDING",
      userId: data.userId || [], // This is the array of assigned user IDs
      dueDate: data.dueDate
    };

    return this.request<TaskResponse>(`/tasks?userId=${currentUserId}`, {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, data: {
    title: string;
    description?: string;
    userId?: number[];
    status?: string;
    projectId?: number;
    dueDate?: string;
  }, userId?: number) {
    // Use hardcoded user ID (1) for now, similar to other methods
    const currentUserId = userId || 1;

    const taskData = {
      title: data.title,
      description: data.description || "",
      projectId: data.projectId || 0,
      userId: data.userId || [], // Array of assigned user IDs
      status: data.status || "PENDING",
      dueDate: data.dueDate
    };

    return this.request<TaskResponse>(`/tasks/${id}?userId=${currentUserId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string) {
    return this.request<void>(`/tasks/${id}?userId=1`, {
      method: "DELETE",
    });
  }

  async getUsers(page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
    });
    return this.request<UsersPaginatedResponse>(`/users?${params}`);
  }

  async getAllUsers(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request<PaginatedResponse<User>>(`/admin/users?${params}`);
  }

  async getUserById(userId: string) {
    return this.request<User>(`/admin/users/${userId}`);
  }
}

export const api = new ApiClient();
