<template>
  <div class="pull-to-refresh-container" ref="containerRef">
    <!-- Pull Indicator -->
    <div 
      class="pull-indicator"
      :style="{ 
        transform: `translateY(${pullDistance}px)`,
        opacity: pullProgress 
      }"
    >
      <div class="pull-content">
        <div 
          v-if="!isRefreshing" 
          class="pull-icon"
          :style="{ transform: `rotate(${pullProgress * 180}deg)` }"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div v-else class="spinner"></div>
        <span class="text-sm text-gray-600 mt-2">
          {{ isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh' }}
        </span>
      </div>
    </div>

    <!-- Content Slot -->
    <div class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  onRefresh: () => Promise<void>
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 80
})

const containerRef = ref<HTMLElement | null>(null)

const { isRefreshing, pullDistance, pullProgress } = usePullToRefresh(
  containerRef,
  {
    threshold: props.threshold,
    onRefresh: props.onRefresh
  }
)
</script>

<style scoped>
.pull-to-refresh-container {
  position: relative;
  overflow-y: auto;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}

.pull-indicator {
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--transition-fast);
  z-index: 10;
}

.pull-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pull-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
  transition: transform var(--transition-fast);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content-wrapper {
  position: relative;
  min-height: 100%;
}
</style>
