# Themes

Kline Orderbook Chart supports dark mode and light mode with runtime switching. The chart re-renders immediately when the theme changes — no reload required.

## Built-in themes

### Set at initialization

```javascript
const chart = await createChartBridge(canvas, {
  licenseKey: 'YOUR_KEY',
})

// The chart defaults to dark theme
```

### Switch at runtime

```javascript
chart.setTheme('dark')    // dark mode (default)
chart.setTheme('light')   // light mode
```

### Read the current theme

```javascript
const current = chart.getTheme()   // returns 'dark' or 'light'
```

## Responding to system theme changes

Match the user's OS dark/light preference:

```javascript
const media = window.matchMedia('(prefers-color-scheme: dark)')

chart.setTheme(media.matches ? 'dark' : 'light')

media.addEventListener('change', (e) => {
  chart.setTheme(e.matches ? 'dark' : 'light')
})
```

## Theme toggle button

```javascript
const btn = document.getElementById('theme-toggle')
btn.addEventListener('click', () => {
  const isDark = chart.getTheme() === 'dark'
  chart.setTheme(isDark ? 'light' : 'dark')
  btn.textContent = isDark ? 'Dark Mode' : 'Light Mode'
})
```

## What changes between themes

| Element | Dark | Light |
|---|---|---|
| Background | `#0d1117` | `#ffffff` |
| Candle (bull) | Green | Green |
| Candle (bear) | Red | Red |
| Grid lines | Subtle gray | Subtle gray |
| Axis text | Light gray | Dark gray |
| Crosshair | White, semi-transparent | Black, semi-transparent |
| Pane separators | Dark gray | Light gray |
| Heatmap palette | Adjusted for dark bg | Adjusted for light bg |
| Indicator lines | Optimized per theme | Optimized per theme |

All drawing tools, markers, and custom colors remain unchanged across themes — only the chart chrome adapts.

## Framework integration

### React

```jsx
function Chart({ theme }) {
  const chartRef = useRef(null)

  useEffect(() => {
    chartRef.current?.setTheme(theme)
  }, [theme])

  // ... chart init
}
```

### Vue 3

```vue
<script setup>
import { watch } from 'vue'

const props = defineProps({ theme: String })
let chart = null

watch(() => props.theme, (val) => {
  chart?.setTheme(val)
})
</script>
```

---

## Next steps

- [Getting Started](getting-started.md) — Basic chart setup
- [Indicators](indicators.md) — Enable indicators
- [API Reference](../api/README.md) — Full `setTheme` documentation
