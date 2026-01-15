<template>
  <div class="status-badge" :class="status">
    <div class="status-dot"></div>
    <span class="status-text">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  status: {
    type: String,
    default: 'idle', // idle, sync, success, error
  },
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  border: 1px solid var(--panel-border);
  font-size: 0.8rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.idle .status-dot {
  background: var(--text-secondary);
}
.sync .status-dot {
  background: var(--accent-primary);
  box-shadow: 0 0 8px var(--accent-primary);
  animation: pulse 1.5s infinite;
}
.success .status-dot {
  background: var(--success);
}
.error .status-dot {
  background: var(--error);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
