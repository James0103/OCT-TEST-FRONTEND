<template>
  <div class="metric-widget glass">
    <div class="metric-icon" :style="{ color: color }">
      <slot name="icon"></slot>
    </div>
    <div class="metric-content">
      <h4 class="metric-label">{{ label }}</h4>
      <div class="metric-value-container">
        <span class="metric-value">{{ value }}</span>
        <span class="metric-unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  unit: String,
  color: {
    type: String,
    default: 'var(--accent-primary)',
  },
})
</script>

<style scoped>
.metric-widget {
  padding: 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 180px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-unit {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}
</style>
