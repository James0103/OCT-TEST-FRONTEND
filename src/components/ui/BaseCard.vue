<template>
  <div class="base-card glass" :class="{ clickable: clickable }">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  clickable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.base-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-normal);
  height: 100%;
}

.clickable:hover {
  transform: translateY(-4px);
  border-color: var(--accent-primary);
  cursor: pointer;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--panel-border);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  padding: 1.5rem;
}
</style>
