import { api } from "@/lib/api"
import type { ApiUser } from "@/types"
import { create } from "zustand"

interface UserState {
    users: ApiUser[]
    loading: boolean
    loadingMore: boolean
    error: string | null
    hasMore: boolean
    currentPage: number
    totalPages: number
    searchTerm: string
    initialized: boolean // Add this flag to track if initial load was done
    fetchUsers: (reset?: boolean, search?: string) => Promise<void>
    loadMoreUsers: () => Promise<void>
    resetUsers: () => void
    setSearchTerm: (term: string) => void
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 0,
    totalPages: 0,
    searchTerm: '',
    initialized: false,

    fetchUsers: async (reset = false, search?: string) => {
        const state = get()
        const searchTerm = search !== undefined ? search : state.searchTerm

        // Prevent multiple simultaneous requests
        if (state.loading || state.loadingMore) {
            return
        }

        // Don't fetch again if already initialized and not explicitly resetting
        if (state.initialized && !reset && state.users.length > 0) {
            return
        }

        if (reset) {
            set({
                users: [],
                currentPage: 0,
                hasMore: true,
                loading: true,
                error: null,
                searchTerm,
                initialized: false
            })
        } else {
            set({ loading: true, error: null })
        }

        try {
            const page = reset ? 0 : state.currentPage
            const response = await api.getUsers(page, 10)
            const { content, pages, total } = response.data

            // Si no hay contenido y no es reset, no hay más páginas
            if (!content || content.length === 0) {
                set({
                    loading: false,
                    loadingMore: false,
                    hasMore: false,
                    initialized: true // Mark as initialized even if no content
                })
                return
            }

            set((state) => ({
                users: reset ? content : [...state.users, ...content],
                loading: false,
                loadingMore: false,
                currentPage: page,
                totalPages: pages,
                hasMore: page + 1 < pages,
                initialized: true,
                error: null
            }))
        } catch (error) {
            console.error('User store: Error fetching users:', error)
            set({
                error: (error as Error).message,
                loading: false,
                loadingMore: false
            })
        }
    },

    loadMoreUsers: async () => {
        const state = get()

        if (!state.hasMore || state.loading || state.loadingMore) {
            return
        }

        set({ loadingMore: true, error: null })

        try {
            const nextPage = state.currentPage + 1
            const response = await api.getUsers(nextPage, 10)
            const { content, pages } = response.data

            // Si no hay contenido, no hay más páginas
            if (!content || content.length === 0) {
                set({
                    loadingMore: false,
                    hasMore: false
                })
                return
            }

            // Ensure we're properly accumulating users
            const currentUsers = get().users // Get fresh state
            set({
                users: [...currentUsers, ...content],
                loadingMore: false,
                currentPage: nextPage,
                totalPages: pages,
                hasMore: nextPage + 1 < pages,
                error: null
            })
        } catch (error) {
            console.error('User store: Error loading more users:', error)
            set({
                error: (error as Error).message,
                loadingMore: false
            })
        }
    },

    resetUsers: () => {
        set({
            users: [],
            loading: false,
            loadingMore: false,
            error: null,
            hasMore: true,
            currentPage: 0,
            totalPages: 0,
            searchTerm: '',
            initialized: false
        })
    },

    setSearchTerm: (term: string) => {
        set({ searchTerm: term })
    }
}))
