<template>
  <div class="result-card glass">
    <div class="engine-header">
      <div class="engine-info">
        <img :src="icon" :alt="name" class="engine-icon" />
        <h3 class="engine-name">{{ name }}</h3>
      </div>
      <div v-if="speed" class="engine-speed">
        <span class="speed-value">{{ speed }}</span>
        <span class="speed-unit">ms</span>
      </div>
    </div>

    <div class="result-content" :class="{ loading: loading }">
      <div v-if="loading" class="skeleton-loader">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line" style="width: 70%"></div>
      </div>
      <div v-else-if="text" class="text-output">
        <pre>{{ text }}</pre>
      </div>
      <div v-else class="empty-placeholder">No result yet</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  icon: String,
  text: String,
  speed: Number,
  loading: Boolean,
})
</script>

<style scoped>
.result-card {
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  height: 500px;
}

.engine-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--panel-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.engine-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.engine-icon {
  width: 24px;
  height: 24px;
}

.engine-name {
  font-size: 1rem;
  font-weight: 600;
}

.engine-speed {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
}

.speed-value {
  color: var(--accent-primary);
  font-weight: 600;
}

.result-content {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.text-output pre {
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-style: italic;
  font-family: inherit;
}

/* Skeleton loader */
.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
