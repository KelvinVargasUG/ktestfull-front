import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
    hasMore: boolean
    loading: boolean
    onLoadMore: () => void
    threshold?: number
}

export function useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore,
    threshold = 100
}: UseInfiniteScrollOptions) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isLoadingRef = useRef(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (!container || loading || !hasMore || isLoadingRef.current) return

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Debounce scroll handling
        timeoutRef.current = setTimeout(() => {
            if (isLoadingRef.current) return // Double check

            const { scrollTop, scrollHeight, clientHeight } = container
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

            if (isNearBottom) {
                isLoadingRef.current = true
                onLoadMore()
            }
        }, 50) // Reduced debounce time
    }, [loading, hasMore, onLoadMore, threshold])

    // Reset loading ref when loading state changes
    useEffect(() => {
        if (!loading) {
            isLoadingRef.current = false
        }
    }, [loading])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Use passive listeners for better performance
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            container.removeEventListener('scroll', handleScroll)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [handleScroll])

    return containerRef
}
