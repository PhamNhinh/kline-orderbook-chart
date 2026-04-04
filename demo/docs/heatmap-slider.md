# Heatmap Slider

The Heatmap Slider controls the colormap intensity range of the orderbook heatmap visualization. It allows users to adjust the sensitivity of the heatmap colors to highlight different levels of order book depth.

## Location

The slider is rendered as a horizontal bar between the Control Bar and the chart area, spanning the full width of the page.

## How It Works

The orderbook heatmap renders depth quantity values as colors on a gradient scale:

```
Low volume ──────────────────────────────────── High volume
   Dark        Blue       Teal      Green      Yellow     Red
```

The slider controls the **maximum value** of this color scale. By adjusting the maximum:

- **Slider at 100% (default)** — The full data range is used. Large orders dominate the color map, smaller orders appear dark.
- **Slider at 50%** — The colormap is compressed to half the actual data range. Medium-sized orders now appear as warm colors, making mid-level liquidity more visible.
- **Slider at 10%** — Only small order quantities saturate the scale. Even minor limit orders become visible. Large orders all appear as the maximum color (red).

This is equivalent to adjusting the "exposure" or "brightness" of the heatmap.

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bridge` | `Object` | `null` | The chart engine bridge instance from `useChart()` |

### Internal State

| State | Description |
|-------|-------------|
| `sliderValue` | Range input value (0–1000), maps to 0%–100% of data range |
| `actualMin` | Actual minimum quantity in the heatmap data |
| `actualMax` | Actual maximum quantity in the heatmap data |
| `userMax` | The computed maximum threshold applied to the colormap |

### Chart Engine Methods Used

| Method | Description |
|--------|-------------|
| `bridge.getHeatmapDataRange()` | Returns `{ min, max }` — the actual value range in the current heatmap matrix |
| `bridge.setHeatmapRange(min, max)` | Sets the colormap normalization range. Values outside this range are clamped. |

## Data Range Polling

The component polls the chart engine every 3 seconds to get the current data range:

```javascript
const range = bridge.getHeatmapDataRange()
// range = { min: 0, max: 542.8 }  (quantity in base asset)
```

This accounts for the heatmap data changing as new depth updates arrive and old columns scroll off-screen.

## Applying the Range

When the user moves the slider:

```javascript
const pct = sliderValue / 1000        // 0.0 – 1.0
const newMax = actualMax * max(pct, 0.01)  // minimum 1% to avoid division by zero
bridge.setHeatmapRange(0, newMax)
```

The chart engine then normalizes all heatmap cell values to the `[0, newMax]` range for color mapping.

## Integration Example

```vue
<template>
  <HeatmapSlider :bridge="chart.bridge.value" />
</template>

<script setup>
import HeatmapSlider from './components/HeatmapSlider.vue'
import { useChart } from './composables/useChart.js'

const chart = useChart()
</script>
```

## Display Elements

| Element | Description |
|---------|-------------|
| **HEATMAP** label | Fixed label on the left |
| **Gradient bar** | Visual representation of the color scale with a draggable thumb |
| **Value display** | The current threshold value (formatted as K/M for large numbers) |
| **Range display** | Shows the actual min–max range from the data |

## Formatting

Quantity values are formatted for readability:

| Value | Display |
|-------|---------|
| >= 1,000,000 | `1.5M` |
| >= 1,000 | `42.3K` |
| >= 1 | `8.7` |
| < 1 | `0.042` |

## Customization

To modify the gradient colors, edit the CSS `background` property of `.gradient-fill` in `HeatmapSlider.vue`:

```css
.gradient-fill {
  background: linear-gradient(90deg, #0d1117, #1a3a5c, #2d7d9a, #48c774, #ffd43b, #ff6b6b);
}
```

The 6-stop gradient matches the chart engine's internal colormap. If you change the engine's heatmap colormap, update this gradient to match.
