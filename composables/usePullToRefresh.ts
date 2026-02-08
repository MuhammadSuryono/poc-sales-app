interface PullToRefreshOptions {
    threshold?: number
    onRefresh: () => Promise<void>
    resistance?: number
}

export const usePullToRefresh = (
    containerRef: Ref<HTMLElement | null>,
    options: PullToRefreshOptions
) => {
    const {
        threshold = 80,
        onRefresh,
        resistance = 2.5
    } = options

    const isRefreshing = ref(false)
    const pullDistance = ref(0)
    const startY = ref(0)
    const isPulling = ref(false)

    const canPull = computed(() => {
        const container = containerRef.value
        if (!container) return false
        return container.scrollTop === 0
    })

    const pullProgress = computed(() => {
        return Math.min(pullDistance.value / threshold, 1)
    })

    const handleTouchStart = (e: TouchEvent) => {
        if (!canPull.value || isRefreshing.value) return
        startY.value = e.touches[0].clientY
        isPulling.value = true
    }

    const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling.value || isRefreshing.value) return

        const currentY = e.touches[0].clientY
        const distance = currentY - startY.value

        if (distance > 0 && canPull.value) {
            // Apply resistance to make it feel more natural
            pullDistance.value = distance / resistance

            // Prevent default scroll when pulling
            if (pullDistance.value > 10) {
                e.preventDefault()
            }
        }
    }

    const handleTouchEnd = async () => {
        if (!isPulling.value || isRefreshing.value) return

        isPulling.value = false

        if (pullDistance.value >= threshold) {
            isRefreshing.value = true
            pullDistance.value = threshold

            try {
                await onRefresh()
            } catch (error) {
                console.error('Refresh failed:', error)
            } finally {
                isRefreshing.value = false
                pullDistance.value = 0
            }
        } else {
            // Animate back to 0
            const startDistance = pullDistance.value
            const duration = 200
            const startTime = Date.now()

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                pullDistance.value = startDistance * (1 - progress)

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    pullDistance.value = 0
                }
            }

            animate()
        }
    }

    onMounted(() => {
        const container = containerRef.value
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, { passive: true })
            container.addEventListener('touchmove', handleTouchMove, { passive: false })
            container.addEventListener('touchend', handleTouchEnd, { passive: true })
        }
    })

    onUnmounted(() => {
        const container = containerRef.value
        if (container) {
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchmove', handleTouchMove)
            container.removeEventListener('touchend', handleTouchEnd)
        }
    })

    return {
        isRefreshing,
        pullDistance,
        isPulling,
        pullProgress
    }
}
