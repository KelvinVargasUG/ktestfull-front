"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/store/admin-store";
import { useAuthStore } from "@/store/auth-store";
import { UserRole, type ApiUser } from "@/types";
import { AlertTriangle, ArrowLeft, Mail, Shield, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const { users, loading, error, fetchUsers } = useAdminStore();
    const { user: currentUser, checkAuth } = useAuthStore();
    const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (currentUser && currentUser.role !== UserRole.ADMIN) {
            router.push("/dashboard");
            return;
        }

        const foundUser = users.find(user => user.idUser.toString() === userId);

        if (foundUser) {
            setSelectedUser(foundUser);
        } else if (users.length === 0 && !loading) {
            fetchUsers(0, true);
        }
    }, [currentUser, users, userId, router, fetchUsers, loading]);

    useEffect(() => {
        // Buscar de nuevo cuando se actualicen los usuarios
        if (users.length > 0 && !selectedUser) {
            const foundUser = users.find(user => user.idUser.toString() === userId);
            setSelectedUser(foundUser || null);
        }
    }, [users, userId, selectedUser]);

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

    if (loading && !selectedUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Error al cargar el usuario: {error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Usuario no encontrado. Es posible que no esté en la página actual de usuarios.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const isAdmin = selectedUser.rol.includes("ADMIN");

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>

                <h1 className="text-3xl font-bold text-gray-900">Detalle del Usuario</h1>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                        {selectedUser.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">{selectedUser.username}</CardTitle>
                                    <p className="text-muted-foreground">ID: {selectedUser.idUser}</p>
                                </div>
                            </div>

                            <Badge variant={isAdmin ? "default" : "secondary"} className="flex items-center gap-1">
                                {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                {isAdmin ? "Administrador" : "Usuario"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                                <div className="flex items-center text-sm">
                                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {selectedUser.email}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
                                <Badge variant={selectedUser.status === "ACTIVE" ? "default" : "secondary"}>
                                    {selectedUser.status === "ACTIVE" ? "Activo" : selectedUser.status}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium text-sm text-muted-foreground">Roles</h3>
                                <div className="flex gap-2">
                                    {selectedUser.rol.length > 0 ? (
                                        selectedUser.rol.map((role, index) => (
                                            <Badge key={index} variant="outline">
                                                {role}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Sin roles asignados</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
