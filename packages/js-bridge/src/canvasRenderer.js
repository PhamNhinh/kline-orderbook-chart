/**
 * Canvas2D command dispatcher.
 * Reads binary commands from WASM memory and dispatches to Canvas2D context.
 * Optimized for high-throughput heatmap rendering.
 */

const CMD = {
  FILL_RECT: 0x01,
  STROKE_RECT: 0x02,
  LINE: 0x03,
  DASHED_LINE: 0x04,
  POLYLINE: 0x05,
  TEXT: 0x06,
  CIRCLE: 0x07,
  TRIANGLE: 0x08,
  SAVE: 0x09,
  RESTORE: 0x0A,
  CLIP_RECT: 0x0B,
  ROTATED_TEXT: 0x0C,
  BUBBLE_3D: 0x0D,
  FILL_POLYGON: 0x0E,
  DASHED_POLYLINE: 0x0F,
  GRADIENT_RECT: 0x10,
  END_FRAME: 0xFF,
}

const ALIGN_MAP = ['left', 'center', 'right']

// Pre-allocated color cache to avoid string creation per command
const colorCache = new Map()
const MAX_CACHE = 4096

function getColorKey(r, g, b, a) {
  return (r << 24) | (g << 16) | (b << 8) | a
}

function getCachedColor(r, g, b, a) {
  const key = getColorKey(r, g, b, a)
  let c = colorCache.get(key)
  if (c) return c
  c = `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`
  if (colorCache.size >= MAX_CACHE) colorCache.clear()
  colorCache.set(key, c)
  return c
}

const decoder = new TextDecoder()

// Snap in device-pixel space for crisp rendering across fractional DPR values.
// Example: at DPR=1.5, snapping in CSS pixels (`Math.round`) still lands on half
// device pixels and looks soft. We snap to device pixels then map back to CSS.
function snapCoord(v, dpr) {
  return Math.round(v * dpr) / dpr
}
function snapLine(v, lw, dpr) {
  const widthDevPx = Math.max(1, Math.round(lw * dpr))
  const base = Math.round(v * dpr) / dpr
  return (widthDevPx & 1) ? (base + 0.5 / dpr) : base
}
function snapRect(x, y, w, h, dpr) {
  const x0 = Math.round(x * dpr)
  const y0 = Math.round(y * dpr)
  const x1 = Math.round((x + w) * dpr)
  const y1 = Math.round((y + h) * dpr)
  return {
    x: x0 / dpr,
    y: y0 / dpr,
    w: (x1 - x0) / dpr,
    h: (y1 - y0) / dpr,
  }
}

export function dispatchCommands(ctx, wasmMemory, ptr, len) {
  const buf = wasmMemory.buffer
  if (ptr + len > buf.byteLength) return
  const view = new DataView(buf, ptr, len)
  const bytes = new Uint8Array(buf, ptr, len)
  let offset = 0
  let lastFillColor = ''
  let lastStrokeColor = ''
  let lastLineWidth = -1
  let lastFont = ''
  const dpr = Math.max(1, Math.abs(ctx.getTransform?.().a || (window.devicePixelRatio || 1)))

  while (offset < len) {
    const type = bytes[offset]
    offset += 1

    if (type === CMD.END_FRAME) break

    switch (type) {
      case CMD.FILL_RECT: {
        const x = view.getFloat32(offset, true); offset += 4
        const y = view.getFloat32(offset, true); offset += 4
        const w = view.getFloat32(offset, true); offset += 4
        const h = view.getFloat32(offset, true); offset += 4
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        if (c !== lastFillColor) { ctx.fillStyle = c; lastFillColor = c }
        const r = snapRect(x, y, w, h, dpr)
        ctx.fillRect(r.x, r.y, r.w, r.h)
        break
      }

      case CMD.STROKE_RECT: {
        const x = view.getFloat32(offset, true); offset += 4
        const y = view.getFloat32(offset, true); offset += 4
        const w = view.getFloat32(offset, true); offset += 4
        const h = view.getFloat32(offset, true); offset += 4
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        if (c !== lastStrokeColor) { ctx.strokeStyle = c; lastStrokeColor = c }
        if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
        const sx = snapLine(x, lw, dpr)
        const sy = snapLine(y, lw, dpr)
        const sw = Math.round(w * dpr) / dpr
        const sh = Math.round(h * dpr) / dpr
        ctx.strokeRect(sx, sy, sw, sh)
        break
      }

      case CMD.LINE: {
        const x1 = view.getFloat32(offset, true); offset += 4
        const y1 = view.getFloat32(offset, true); offset += 4
        const x2 = view.getFloat32(offset, true); offset += 4
        const y2 = view.getFloat32(offset, true); offset += 4
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        ctx.beginPath()
        if (c !== lastStrokeColor) { ctx.strokeStyle = c; lastStrokeColor = c }
        if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
        ctx.setLineDash([])
        ctx.moveTo(snapLine(x1, lw, dpr), snapLine(y1, lw, dpr))
        ctx.lineTo(snapLine(x2, lw, dpr), snapLine(y2, lw, dpr))
        ctx.stroke()
        break
      }

      case CMD.DASHED_LINE: {
        const x1 = view.getFloat32(offset, true); offset += 4
        const y1 = view.getFloat32(offset, true); offset += 4
        const x2 = view.getFloat32(offset, true); offset += 4
        const y2 = view.getFloat32(offset, true); offset += 4
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        const dash = view.getFloat32(offset, true); offset += 4
        const gap = view.getFloat32(offset, true); offset += 4
        ctx.beginPath()
        if (c !== lastStrokeColor) { ctx.strokeStyle = c; lastStrokeColor = c }
        if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
        ctx.setLineDash([dash, gap])
        ctx.moveTo(snapLine(x1, lw, dpr), snapLine(y1, lw, dpr))
        ctx.lineTo(snapLine(x2, lw, dpr), snapLine(y2, lw, dpr))
        ctx.stroke()
        ctx.setLineDash([])
        break
      }

      case CMD.POLYLINE: {
        const count = view.getUint16(offset, true); offset += 2
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        if (count > 0) {
          const pts = new Float32Array(count * 2)
          for (let i = 0; i < count; i++) {
            pts[i * 2]     = view.getFloat32(offset, true); offset += 4
            pts[i * 2 + 1] = view.getFloat32(offset, true); offset += 4
          }
          ctx.beginPath()
          if (c !== lastStrokeColor) { ctx.strokeStyle = c; lastStrokeColor = c }
          if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
          ctx.setLineDash([])
          ctx.lineJoin = 'round'
          ctx.lineCap = 'round'
          if (count === 2) {
            ctx.moveTo(pts[0], pts[1])
            ctx.lineTo(pts[2], pts[3])
          } else {
            // Uniform Catmull-Rom spline → cubic Bezier segments.
            // Produces a C1-continuous curve that passes through every
            // sample point, yielding a truly smooth stroke (no visible
            // polygonal corners) even when the stored sample points are
            // sparse. Endpoints are duplicated (P[-1]=P[0], P[n]=P[n-1])
            // so the curve starts/ends with zero tangent at the boundaries.
            ctx.moveTo(pts[0], pts[1])
            for (let i = 0; i < count - 1; i++) {
              const i0 = i > 0 ? i - 1 : 0
              const i1 = i
              const i2 = i + 1
              const i3 = i < count - 2 ? i + 2 : count - 1
              const p0x = pts[i0 * 2],     p0y = pts[i0 * 2 + 1]
              const p1x = pts[i1 * 2],     p1y = pts[i1 * 2 + 1]
              const p2x = pts[i2 * 2],     p2y = pts[i2 * 2 + 1]
              const p3x = pts[i3 * 2],     p3y = pts[i3 * 2 + 1]
              const c1x = p1x + (p2x - p0x) / 6
              const c1y = p1y + (p2y - p0y) / 6
              const c2x = p2x - (p3x - p1x) / 6
              const c2y = p2y - (p3y - p1y) / 6
              ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2x, p2y)
            }
          }
          ctx.stroke()
        }
        break
      }

      case CMD.TEXT: {
        const x = view.getFloat32(offset, true); offset += 4
        const y = view.getFloat32(offset, true); offset += 4
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const fontSize = view.getFloat32(offset, true); offset += 4
        const align = bytes[offset]; offset += 1
        const strLen = view.getUint16(offset, true); offset += 2
        const text = decoder.decode(new Uint8Array(wasmMemory.buffer, ptr + offset, strLen))
        offset += strLen
        if (c !== lastFillColor) { ctx.fillStyle = c; lastFillColor = c }
        const font = `${Math.round(fontSize)}px "IBM Plex Mono",monospace`
        if (font !== lastFont) { ctx.font = font; lastFont = font }
        ctx.textAlign = ALIGN_MAP[align] || 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, snapCoord(x, dpr), snapCoord(y, dpr))
        break
      }

      case CMD.CIRCLE: {
        const cx = view.getFloat32(offset, true); offset += 4
        const cy = view.getFloat32(offset, true); offset += 4
        const radius = view.getFloat32(offset, true); offset += 4
        const fill = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const stroke = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        if (fill !== lastFillColor) { ctx.fillStyle = fill; lastFillColor = fill }
        ctx.fill()
        if (lw > 0) {
          if (stroke !== lastStrokeColor) { ctx.strokeStyle = stroke; lastStrokeColor = stroke }
          if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
          ctx.stroke()
        }
        break
      }

      case CMD.TRIANGLE: {
        const tx1 = view.getFloat32(offset, true); offset += 4
        const ty1 = view.getFloat32(offset, true); offset += 4
        const tx2 = view.getFloat32(offset, true); offset += 4
        const ty2 = view.getFloat32(offset, true); offset += 4
        const tx3 = view.getFloat32(offset, true); offset += 4
        const ty3 = view.getFloat32(offset, true); offset += 4
        const tc = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        ctx.beginPath()
        ctx.moveTo(tx1, ty1)
        ctx.lineTo(tx2, ty2)
        ctx.lineTo(tx3, ty3)
        ctx.closePath()
        if (tc !== lastFillColor) { ctx.fillStyle = tc; lastFillColor = tc }
        ctx.fill()
        break
      }

      case CMD.SAVE: {
        ctx.save()
        break
      }

      case CMD.RESTORE: {
        ctx.restore()
        lastFillColor = ''
        lastStrokeColor = ''
        lastLineWidth = -1
        lastFont = ''
        break
      }

      case CMD.CLIP_RECT: {
        const x = view.getFloat32(offset, true); offset += 4
        const y = view.getFloat32(offset, true); offset += 4
        const w = view.getFloat32(offset, true); offset += 4
        const h = view.getFloat32(offset, true); offset += 4
        const r = snapRect(x, y, w, h, dpr)
        ctx.beginPath()
        ctx.rect(r.x, r.y, r.w, r.h)
        ctx.clip()
        break
      }

      case CMD.ROTATED_TEXT: {
        const rx = view.getFloat32(offset, true); offset += 4
        const ry = view.getFloat32(offset, true); offset += 4
        const rc = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const rfs = view.getFloat32(offset, true); offset += 4
        const angle = view.getFloat32(offset, true); offset += 4
        const rlen = view.getUint16(offset, true); offset += 2
        const rtxt = decoder.decode(bytes.subarray(offset, offset + rlen)); offset += rlen
        const rfont = `${rfs}px sans-serif`
        if (rfont !== lastFont) { ctx.font = rfont; lastFont = rfont }
        if (rc !== lastFillColor) { ctx.fillStyle = rc; lastFillColor = rc }
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.save()
        ctx.translate(rx, ry)
        ctx.rotate(angle)
        ctx.fillText(rtxt, 0, 0)
        ctx.restore()
        break
      }

      case CMD.BUBBLE_3D: {
        const cx = view.getFloat32(offset, true); offset += 4
        const cy = view.getFloat32(offset, true); offset += 4
        const radius = view.getFloat32(offset, true); offset += 4
        const br = bytes[offset]; const bg = bytes[offset+1]; const bb = bytes[offset+2]; const ba = bytes[offset+3]; offset += 4
        const hr = bytes[offset]; const hg = bytes[offset+1]; const hb = bytes[offset+2]; const ha = bytes[offset+3]; offset += 4
        const rr = bytes[offset]; const rg = bytes[offset+1]; const rb = bytes[offset+2]; const ra = bytes[offset+3]; offset += 4
        const lw = view.getFloat32(offset, true); offset += 4

        const r = radius

        if (r < 10) {
          // Tiny bubble: solid fill, no gradients
          const c = `rgba(${br},${bg},${bb},${(ba / 255).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fillStyle = c
          ctx.fill()
          lastFillColor = ''
        } else if (r < 18) {
          // Medium bubble: single gradient body, no glow/specular
          const hlX = cx - r * 0.25
          const hlY = cy - r * 0.25
          const body = ctx.createRadialGradient(hlX, hlY, r * 0.08, cx, cy, r)
          body.addColorStop(0, `rgba(${hr},${hg},${hb},${(ha / 255).toFixed(3)})`)
          body.addColorStop(1, `rgba(${br},${bg},${bb},${(ba / 255).toFixed(3)})`)
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fillStyle = body
          ctx.fill()
          lastFillColor = ''
        } else {
          // Large bubble: full 3D effect
          const hlX = cx - r * 0.25
          const hlY = cy - r * 0.25

          const glow = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.2)
          glow.addColorStop(0, `rgba(${rr},${rg},${rb},${(ra / 255 * 0.5).toFixed(3)})`)
          glow.addColorStop(1, `rgba(${rr},${rg},${rb},0)`)
          ctx.beginPath()
          ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          const body = ctx.createRadialGradient(hlX, hlY, r * 0.08, cx, cy, r)
          body.addColorStop(0, `rgba(${hr},${hg},${hb},${(ha / 255).toFixed(3)})`)
          body.addColorStop(1, `rgba(${br},${bg},${bb},${(ba / 255).toFixed(3)})`)
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fillStyle = body
          ctx.fill()

          const specR = r * 0.20
          const spec = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, specR)
          spec.addColorStop(0, 'rgba(255,255,255,0.22)')
          spec.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(hlX, hlY, specR, 0, Math.PI * 2)
          ctx.fillStyle = spec
          ctx.fill()
          lastFillColor = ''
        }
        break
      }

      case CMD.FILL_POLYGON: {
        const count = view.getUint16(offset, true); offset += 2
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        if (count > 2) {
          ctx.beginPath()
          const x0 = view.getFloat32(offset, true); offset += 4
          const y0 = view.getFloat32(offset, true); offset += 4
          ctx.moveTo(x0, y0)
          for (let i = 1; i < count; i++) {
            ctx.lineTo(view.getFloat32(offset, true), view.getFloat32(offset + 4, true))
            offset += 8
          }
          ctx.closePath()
          if (c !== lastFillColor) { ctx.fillStyle = c; lastFillColor = c }
          ctx.fill()
        } else {
          offset += count * 8
        }
        break
      }

      case CMD.DASHED_POLYLINE: {
        const count = view.getUint16(offset, true); offset += 2
        const c = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const lw = view.getFloat32(offset, true); offset += 4
        const dash = view.getFloat32(offset, true); offset += 4
        const gap = view.getFloat32(offset, true); offset += 4
        if (count > 1) {
          ctx.beginPath()
          if (c !== lastStrokeColor) { ctx.strokeStyle = c; lastStrokeColor = c }
          if (lw !== lastLineWidth) { ctx.lineWidth = lw; lastLineWidth = lw }
          ctx.setLineDash([dash, gap])
          ctx.lineJoin = 'round'
          const x0 = view.getFloat32(offset, true); offset += 4
          const y0 = view.getFloat32(offset, true); offset += 4
          ctx.moveTo(x0, y0)
          for (let i = 1; i < count; i++) {
            ctx.lineTo(view.getFloat32(offset, true), view.getFloat32(offset + 4, true))
            offset += 8
          }
          ctx.stroke()
          ctx.setLineDash([])
        } else {
          offset += count * 8
        }
        break
      }

      case CMD.GRADIENT_RECT: {
        const x = view.getFloat32(offset, true); offset += 4
        const y = view.getFloat32(offset, true); offset += 4
        const w = view.getFloat32(offset, true); offset += 4
        const h = view.getFloat32(offset, true); offset += 4
        const c1 = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const c2 = getCachedColor(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]); offset += 4
        const r = snapRect(x, y, w, h, dpr)
        const grad = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h)
        grad.addColorStop(0, c1)
        grad.addColorStop(1, c2)
        ctx.fillStyle = grad
        lastFillColor = ''
        ctx.fillRect(r.x, r.y, r.w, r.h)
        break
      }

      default:
        return
    }
  }
}
