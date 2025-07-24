"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore } from "@/store/task-store"
import { TaskStatus } from "@/types"
import { Filter, SortAsc, SortDesc } from "lucide-react"

export function TaskFilters() {
  const { filters, setFilters } = useTaskStore()

  const handleStatusFilter = (status: string) => {
    setFilters({
      status: status === "all" ? undefined : (status as TaskStatus),
    })
  }

  const handleSortChange = (sortBy: string) => {
    setFilters({ sortBy: sortBy as "dueDate" | "createdAt" })
  }

  const toggleSortOrder = () => {
    setFilters({
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value={TaskStatus.PENDING}>Pendiente</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>En Progreso</SelectItem>
          <SelectItem value={TaskStatus.COMPLETE}>Completada</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Fecha de vencimiento</SelectItem>
          <SelectItem value="createdAt">Fecha de creación</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortOrder}
        className="flex items-center space-x-1 bg-transparent"
      >
        {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        <span>{filters.sortOrder === "asc" ? "Ascendente" : "Descendente"}</span>
      </Button>
    </div>
  )
}
