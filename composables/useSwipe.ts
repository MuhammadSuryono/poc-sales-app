import { ref, onMounted, onUnmounted } from 'vue'

interface SwipeOptions {
    threshold?: number
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
}

/**
 * Swipe gesture detection composable
 * Detects swipe directions for mobile navigation and interactions
 */
export const useSwipe = (el: Ref<HTMLElement | null>, options: SwipeOptions = {}) => {
    const {
        threshold = 50,
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown
    } = options

    const startX = ref(0)
    const startY = ref(0)

    const onTouchStart = (e: TouchEvent) => {
        startX.value = e.touches[0].clientX
        startY.value = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY

        const diffX = endX - startX.value
        const diffY = endY - startY.value

        // Determine direction
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    onSwipeRight?.()
                } else {
                    onSwipeLeft?.()
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    onSwipeDown?.()
                } else {
                    onSwipeUp?.()
                }
            }
        }
    }

    onMounted(() => {
        if (el.value) {
            el.value.addEventListener('touchstart', onTouchStart, { passive: true })
            el.value.addEventListener('touchend', onTouchEnd, { passive: true })
        }
    })

    onUnmounted(() => {
        if (el.value) {
            el.value.removeEventListener('touchstart', onTouchStart)
            el.value.removeEventListener('touchend', onTouchEnd)
        }
    })

    return {
        startX,
        startY
    }
}
