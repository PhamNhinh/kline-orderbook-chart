# Theming

MRD Chart Engine supports dark mode, light mode, and fully custom themes.

## Built-in Themes

```javascript
// Set at creation
const chart = await MrdChart.create(canvas, {
  theme: 'dark',   // 'dark' | 'light'
})

// Switch at runtime
chart.setTheme('light')
chart.setTheme('dark')
```

## Custom Theme

Pass a theme configuration object:

```javascript
chart.setTheme({
  background: '#1a1a2e',
  text: '#e0e0e0',
  textSecondary: '#6b7280',

  bullCandle: '#00d4aa',
  bearCandle: '#ff6b6b',
  bullVolume: 'rgba(0, 212, 170, 0.3)',
  bearVolume: 'rgba(255, 107, 107, 0.3)',

  grid: '#252540',
  crosshair: 'rgba(255, 255, 255, 0.12)',
  separator: '#2a2a45',

  priceTag: {
    bull: { bg: '#00d4aa', text: '#ffffff' },
    bear: { bg: '#ff6b6b', text: '#ffffff' },
  },

  indicators: {
    rsi: { line: '#3b82f6', overbought: 'rgba(255,107,107,0.08)', oversold: 'rgba(0,212,170,0.08)' },
    oi: { line: '#f59e0b' },
    cvd: { positive: '#00d4aa', negative: '#ff6b6b' },
  },

  pane: {
    background: '#1a1a2e',
    dragDot: '#4a4a6a',
    separator: '#2a2a45',
  },
})
```

## Theme Properties Reference

| Property | Type | Description |
|---|---|---|
| `background` | `string` | Main chart background color |
| `text` | `string` | Primary text color |
| `textSecondary` | `string` | Secondary/axis text color |
| `bullCandle` | `string` | Bullish candle body color |
| `bearCandle` | `string` | Bearish candle body color |
| `bullVolume` | `string` | Bullish volume bar color |
| `bearVolume` | `string` | Bearish volume bar color |
| `grid` | `string` | Grid line color |
| `crosshair` | `string` | Crosshair color |
| `separator` | `string` | Pane separator color |

## White-label (Enterprise)

Enterprise license holders can fully remove the MRD branding:

```javascript
const chart = await MrdChart.create(canvas, {
  licenseKey: 'MRD-ENT-...',
  whiteLabel: {
    removeBranding: true,
    customLogo: '/path/to/logo.svg',
    companyName: 'Your Platform',
  },
})
```
