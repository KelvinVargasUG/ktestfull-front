"use client";

import { UserList } from "@/components/admin/user-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminStore } from "@/store/admin-store";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    clearSelectedUser,
    clearUsers,
  } = useAdminStore();
  const { user: currentUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      router.push("/dashboard");
      return;
    }

    if (currentUser?.role === UserRole.ADMIN) {
      clearSelectedUser();
      clearUsers();
      fetchUsers(0, true);
    }
  }, [currentUser, fetchUsers, router, clearSelectedUser, clearUsers]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los
            administradores pueden gestionar usuarios.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 mt-2"></p>
      </div>

      <div className="space-y-8">
        <UserList />
      </div>
    </div>
  );
}
