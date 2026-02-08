<template>
  <button 
    class="btn btn-secondary"
    :class="[
      sizeClass,
      {
        'btn-disabled': disabled || loading,
        'btn-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot name="icon-left" v-if="!loading" />
    <span v-if="!loading || text">{{ text }}</span>
    <slot name="icon-right" v-if="!loading" />
    <span class="ripple" ref="rippleRef"></span>
  </button>
</template>

<script lang="ts" setup>
interface Props {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  size: 'md',
  disabled: false,
  loading: false
})

const rippleRef = ref<HTMLElement | null>(null)
const { light } = useHaptic()

const sizeClass = computed(() => {
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }
  return sizes[props.size]
})

const handleClick = async (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  
  await light()
  createRipple(event)
  
  if (props.onClick) {
    await props.onClick()
  }
}

const createRipple = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const ripple = rippleRef.value
  
  if (!ripple) return
  
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2
  
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left - radius
  const y = event.clientY - rect.top - radius
  
  ripple.style.width = ripple.style.height = `${diameter}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.classList.add('ripple-active')
  
  setTimeout(() => {
    ripple.classList.remove('ripple-active')
  }, 600)
}
</script>

<style scoped>
.btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all var(--transition-base);
  cursor: pointer;
  outline: none;
  min-height: 44px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-secondary {
  background: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
}

.btn-secondary:hover:not(.btn-disabled) {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:active:not(.btn-disabled) {
  background: var(--color-gray-100);
  transform: translateY(0);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 52px;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  cursor: wait;
}

.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0);
  pointer-events: none;
}

.ripple-active {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>