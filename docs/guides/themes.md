# Theming

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/chart-instance](https://mrd-indicators.com/docs/chart-instance)** — this Markdown mirror is kept for offline / GitHub browsing.


kline-orderbook-chart supports dark and light themes with automatic color management for all chart elements — candles, indicators, axes, grid, drawings, and heatmaps.

---

## Setting the Theme

### `chart.setTheme(name)`

Switch between the built-in dark and light themes.

```javascript
chart.setTheme('dark')    // dark background (default)
chart.setTheme('light')   // light background
```

### `chart.getTheme()` → `string`

Returns the current theme name.

```javascript
const theme = chart.getTheme()   // → 'dark' or 'light'
```

---

## Dark Theme (Default)

The default dark theme uses a dark background optimized for financial trading applications:

| Element | Color |
|---|---|
| Background | `#0f0f14` |
| Bull candle (body) | `#26a69a` (teal green) |
| Bear candle (body) | `#ef5350` (red) |
| Candle wick | Same as body color |
| Grid lines | `rgba(255, 255, 255, 0.04)` |
| Axis text | `rgba(255, 255, 255, 0.5)` |
| Crosshair | `rgba(255, 255, 255, 0.3)` |
| Volume bull | `rgba(38, 166, 154, 0.4)` |
| Volume bear | `rgba(239, 83, 80, 0.4)` |

---

## Light Theme

The light theme uses a white background suitable for reports and light-mode applications:

| Element | Color |
|---|---|
| Background | `#ffffff` |
| Bull candle | `#26a69a` |
| Bear candle | `#ef5350` |
| Grid lines | `rgba(0, 0, 0, 0.06)` |
| Axis text | `rgba(0, 0, 0, 0.5)` |
| Crosshair | `rgba(0, 0, 0, 0.3)` |

---

## Framework Theme Sync

### React (with context)

```jsx
function ChartComponent() {
  const { theme } = useTheme()   // your app's theme context
  const chartRef = useRef(null)

  useEffect(() => {
    chartRef.current?.setTheme(theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  // ... chart setup ...
}
```

### Vue 3 (with Vuetify)

```vue
<script setup>
import { watch } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
let chart = null

watch(
  () => vuetifyTheme.global.current.value.dark,
  (isDark) => {
    chart?.setTheme(isDark ? 'dark' : 'light')
  }
)
</script>
```

### Vue 3 (with media query)

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

prefersDark.addEventListener('change', (e) => {
  chart?.setTheme(e.matches ? 'dark' : 'light')
})

// Initial
chart.setTheme(prefersDark.matches ? 'dark' : 'light')
```

### Svelte

```svelte
<script>
  import { darkMode } from '$lib/stores/theme'

  $: if (chart) {
    chart.setTheme($darkMode ? 'dark' : 'light')
  }
</script>
```

---

## Theme Change Behavior

When `setTheme()` is called:

1. The native engine updates all internal color tables
2. The chart marks itself as dirty
3. The next render frame redraws everything with new colors
4. All elements are affected — candles, indicators, axes, grid, drawings, heatmap overlay

The transition is **instant** (single frame). There is no animation between themes.

---

## Watermark (Trial/Expired License)

When running with a trial or expired license, a watermark is rendered on top of the chart. The watermark adapts to the current theme:

- **Dark theme:** Light semi-transparent watermark
- **Light theme:** Dark semi-transparent watermark

The watermark is drawn as the last step in the render pipeline and cannot be removed without a valid license.

---

## Next Steps

| Topic | Link |
|---|---|
| Viewport & interaction | [Viewport & Interaction](./viewport-interaction.md) |
| Events & tooltips | [Events & Tooltips](./tooltip.md) |
| Framework integration | [Framework Integration](../examples/framework-integration.md) |
