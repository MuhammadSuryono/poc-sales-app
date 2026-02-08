import { Haptics, ImpactStyle } from '@capacitor/haptics'

export const useHaptic = () => {
    const isAvailable = ref(true)

    // Check if haptics is available
    onMounted(async () => {
        try {
            // Try to perform a light haptic to check availability
            await Haptics.impact({ style: ImpactStyle.Light })
        } catch (error) {
            isAvailable.value = false
            console.warn('Haptics not available on this device')
        }
    })

    const light = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.impact({ style: ImpactStyle.Light })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    const medium = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.impact({ style: ImpactStyle.Medium })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    const heavy = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.impact({ style: ImpactStyle.Heavy })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    const success = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.notification({ type: 'SUCCESS' })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    const warning = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.notification({ type: 'WARNING' })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    const error = async () => {
        if (!isAvailable.value) return
        try {
            await Haptics.notification({ type: 'ERROR' })
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }

    return {
        light,
        medium,
        heavy,
        success,
        warning,
        error,
        isAvailable
    }
}
