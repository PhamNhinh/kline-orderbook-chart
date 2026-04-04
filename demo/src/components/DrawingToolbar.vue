<template>
  <div class="drawing-toolbar">
    <div class="toolbar-section">
      <button
        v-for="tool in tools"
        :key="tool.id"
        :class="['tool-btn', { active: activeTool === tool.id }]"
        :title="tool.label"
        @click="$emit('draw', tool.id)"
      >
        <span class="tool-icon" v-html="tool.icon" />
      </button>
    </div>

    <div class="toolbar-divider" />

    <div class="toolbar-section">
      <button class="tool-btn danger" title="Delete selected" @click="$emit('deleteSelected')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
      <button class="tool-btn danger" title="Clear all" @click="$emit('clearAll')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="toolbar-divider" v-if="activeTool" />

    <button v-if="activeTool" class="tool-btn cancel-btn" @click="$emit('cancel')">
      ESC
    </button>
  </div>
</template>

<script setup>
defineProps({
  activeTool: { type: String, default: null },
})

defineEmits(['draw', 'cancel', 'deleteSelected', 'clearAll'])

const tools = [
  { id: 'trendline', label: 'Trendline', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="20" y2="4"/></svg>` },
  { id: 'hline', label: 'Horizontal Line', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12"/></svg>` },
  { id: 'arrow', label: 'Arrow', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/></svg>` },
  { id: 'fib', label: 'Fibonacci', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="4" x2="21" y2="4"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="3" y1="16" x2="21" y2="16"/><line x1="3" y1="20" x2="21" y2="20"/></svg>` },
  { id: 'measure', label: 'Price Range', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>` },
  { id: 'circle', label: 'Circle', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>` },
  { id: 'channel', label: 'Channel', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="18" x2="22" y2="8"/><line x1="2" y1="12" x2="22" y2="2"/></svg>` },
  { id: 'long', label: 'Long Position', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V4m0 0l-6 6m6-6l6 6" stroke="#3fb950"/></svg>` },
  { id: 'short', label: 'Short Position', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="#f85149"/></svg>` },
  { id: 'vwap', label: 'Anchored VWAP', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 17l5-5 4 4 7-10 4 4"/></svg>` },
  { id: 'brush', label: 'Freehand', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17c3-5 6-2 9-7s3-5 9-3"/></svg>` },
  { id: 'path', label: 'Polyline', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 18 8 8 14 14 20 6"/></svg>` },
  { id: 'textnote', label: 'Text Note', icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="5" y="17" font-size="14" font-weight="600" fill="currentColor" stroke="none">T</text></svg>` },
]
</script>

<style scoped>
.drawing-toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  gap: 4px;
  background: #161b22;
  border-right: 1px solid #21262d;
  width: 40px;
  overflow-y: auto;
  overflow-x: hidden;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toolbar-divider {
  width: 24px;
  height: 1px;
  background: #30363d;
  margin: 2px 0;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #8b949e;
  cursor: pointer;
  transition: all 0.12s;
  padding: 0;
}
.tool-btn:hover {
  background: #21262d;
  color: #e6edf3;
}
.tool-btn.active {
  background: #1f6feb;
  color: #fff;
}
.tool-btn.danger:hover {
  background: rgba(248, 81, 73, 0.15);
  color: #f85149;
}

.cancel-btn {
  font-size: 9px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.5px;
  color: #f0883e;
}
.cancel-btn:hover {
  background: rgba(240, 136, 62, 0.15);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
