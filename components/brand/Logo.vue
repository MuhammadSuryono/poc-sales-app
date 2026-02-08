<template>
  <div class="java-logo" :class="sizeClass">
    <NuxtImg 
      src="/images/logo.png" 
      alt="JAVA.co Logo"
      :width="width"
      :height="height"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClass = computed(() => `logo-${props.size}`)

const dimensions = computed(() => {
  const sizes = {
    xs: { width: 60, height: 60 },
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 160, height: 160 },
    xl: { width: 200, height: 200 }
  }
  return sizes[props.size]
})

const width = computed(() => dimensions.value.width)
const height = computed(() => dimensions.value.height)
</script>

<style scoped>
.java-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo-xs {
  width: 60px;
  height: 60px;
}

.logo-sm {
  width: 80px;
  height: 80px;
}

.logo-md {
  width: 120px;
  height: 120px;
}

.logo-lg {
  width: 160px;
  height: 160px;
}

.logo-xl {
  width: 200px;
  height: 200px;
}

.java-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
