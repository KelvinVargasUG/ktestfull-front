"use client"

import { useRef, useCallback } from "react"
import { UserCard } from "./user-card"
import { UserCardSkeleton } from "./user-card-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, AlertTriangle } from "lucide-react"
import { useAdminStore } from "@/store/admin-store"

export function UserList() {
  const { users, pagination, loading, loadingMore, error, loadMoreUsers, searchQuery } = useAdminStore()

  const observerRef = useRef<IntersectionObserver>()
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination?.hasNext) {
          loadMoreUsers()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, loadingMore, pagination?.hasNext, loadMoreUsers],
  )

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Error al cargar los usuarios: {error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title={searchQuery ? "No se encontraron usuarios" : "No hay usuarios registrados"}
        description={
          searchQuery
            ? `No se encontraron usuarios que coincidan con "${searchQuery}"`
            : "Aún no hay usuarios en el sistema."
        }
        icon={<Users className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div key={user.id} ref={index === users.length - 1 ? lastUserElementRef : null}>
            <UserCard user={user} />
          </div>
        ))}
      </div>

      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <UserCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {pagination && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Mostrando {users.length} de {pagination.total} usuarios
          {pagination.hasNext && !loadingMore && <p className="mt-1">Desplázate hacia abajo para cargar más</p>}
        </div>
      )}
    </div>
  )
}
