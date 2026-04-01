# Drawing Tools

MRD Chart Engine includes 10+ professional drawing tools with full JSON serialization for persistence.

## Setting the Active Tool

```javascript
chart.drawings.setTool('trendline')
```

## Canceling Drawing Mode

```javascript
chart.drawings.setTool(null)
// or
chart.drawings.cancel()
```

## Available Tools

| Tool | ID | Type | Description |
|---|---|---|---|
| **Trendline** | `trendline` | 2-point | Trend line between two points |
| **Horizontal Line** | `hline` | 1-point | Horizontal price level |
| **Horizontal Ray** | `hray` | 1-point | One-directional horizontal ray |
| **Fibonacci Retracement** | `fibonacci` | 2-point | Fibonacci retracement levels |
| **Parallel Channel** | `channel` | 3-point | Parallel price channel |
| **Pitchfork** | `pitchfork` | 3-point | Andrews' pitchfork |
| **Elliott Wave** | `elliott` | N-point | Elliott wave count labels |
| **Brush** | `brush` | Freehand | Freehand drawing |
| **Rectangle** | `rect` | 2-point | Price/time rectangle zone |
| **Path** | `path` | N-point | Multi-segment line |

## Styling

Pass style options when starting a drawing:

```javascript
chart.drawings.setTool('trendline', {
  color: '#ff9800',
  lineWidth: 2,
  lineStyle: 'solid',   // 'solid' | 'dashed' | 'dotted'
  showLabel: true,
})
```

## Events

```javascript
chart.drawings.onComplete((drawing) => {
  console.log('Drawing completed:', drawing.id, drawing.type)
})

chart.drawings.onSelected((drawingId, x, y) => {
  // Show context menu
})

chart.drawings.onDoubleClick((drawingId, sx, sy, cx, cy) => {
  // Open properties dialog
})
```

## Persistence (Export / Import)

All drawings can be serialized to JSON for storage:

```javascript
// Export all drawings
const json = chart.drawings.exportJSON()
localStorage.setItem(`drawings:${symbol}`, json)

// Import drawings
const saved = localStorage.getItem(`drawings:${symbol}`)
if (saved) chart.drawings.importJSON(saved)
```

## Deleting Drawings

```javascript
chart.drawings.remove(drawingId)
chart.drawings.removeAll()
```

## Properties

Update drawing properties after creation:

```javascript
chart.drawings.setProperties(drawingId, {
  color: '#2196f3',
  lineWidth: 3,
})
```
