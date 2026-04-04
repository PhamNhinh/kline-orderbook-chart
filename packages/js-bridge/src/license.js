/**
 * License validation for MRD Chart Engine.
 *
 * Key format: base64-encoded JSON → { p: plan, d: domain, e: expiry, s: signature }
 *
 * Trial protection:
 * - Stored in 4 independent locations (localStorage, sessionStorage, IndexedDB, cookie)
 * - Each record is integrity-sealed with HMAC so value tampering is detected
 * - Cross-validated: earliest legitimate start wins — clearing one store doesn't help
 * - IndexedDB persists even after "Clear site data" in most browsers
 * - Future timestamps are rejected (can't set trial start to tomorrow)
 */

import { getPlanFeatures } from './planFeatures'

const _TD = 14
const _TP = 'trial'
const _FP = 'free'
const _WT = 'MRD Chart Engine \u2014 Free'
const _ET = 'License Expired \u2014 Purchase at mrd-indicators.com'
const _SK = [0x5f, 0x5f, 0x6d, 0x72].map(c => String.fromCharCode(c)).join('') // obfuscated key prefix
const _SEED = 0x4d524443

// ─── Integrity hash ────────────────────────────────────────────────────
function _h(v) {
  const s = `${v}:${_SEED}:${(v ^ 0x1f2e3d) >>> 0}`
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

function _encode(ts) {
  return `${ts}.${_h(ts)}`
}

function _decode(raw) {
  if (!raw || typeof raw !== 'string') return null
  const dot = raw.lastIndexOf('.')
  if (dot < 1) return null
  const ts = parseInt(raw.slice(0, dot), 10)
  if (!ts || ts < 1e9 || ts > 2e9) return null
  if (raw.slice(dot + 1) !== _h(ts)) return null
  return ts
}

// ─── Multi-store: 4 independent persistence layers ─────────────────────
const _K1 = _SK + 'e7x'
const _K2 = _SK + 'p3q'
const _K3 = 'mrd_engine_session_id'
const _DBNAME = 'mrd_ce_db'
const _STORE = 'meta'
const _DBKEY = 'trial_ts'
const _COOKIE = _SK + 'ck'

function _lsGet() {
  try { return _decode(localStorage.getItem(_K1)) } catch { return null }
}
function _lsSet(ts) {
  try { localStorage.setItem(_K1, _encode(ts)) } catch {}
}

function _ls2Get() {
  try { return _decode(localStorage.getItem(_K2)) } catch { return null }
}
function _ls2Set(ts) {
  try { localStorage.setItem(_K2, _encode(ts)) } catch {}
}

function _ssGet() {
  try { return _decode(sessionStorage.getItem(_K3)) } catch { return null }
}
function _ssSet(ts) {
  try { sessionStorage.setItem(_K3, _encode(ts)) } catch {}
}

function _ckGet() {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${_COOKIE}=([^;]+)`))
    return m ? _decode(decodeURIComponent(m[1])) : null
  } catch { return null }
}
function _ckSet(ts) {
  try {
    const v = encodeURIComponent(_encode(ts))
    document.cookie = `${_COOKIE}=${v};path=/;max-age=${86400 * 400};SameSite=Lax`
  } catch {}
}

let _idbCache = null
let _idbReady = false

function _idbInit() {
  if (_idbReady || typeof indexedDB === 'undefined') return
  _idbReady = true
  try {
    const req = indexedDB.open(_DBNAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(_STORE)) db.createObjectStore(_STORE)
    }
    req.onsuccess = () => {
      const db = req.result
      const tx = db.transaction(_STORE, 'readonly')
      const get = tx.objectStore(_STORE).get(_DBKEY)
      get.onsuccess = () => {
        const val = _decode(get.result)
        if (val && (!_idbCache || val < _idbCache)) {
          _idbCache = val
          _reconcileAsync(val)
        }
      }
    }
  } catch {}
}

function _idbSet(ts) {
  _idbCache = ts
  try {
    const req = indexedDB.open(_DBNAME, 1)
    req.onsuccess = () => {
      const db = req.result
      const tx = db.transaction(_STORE, 'readwrite')
      tx.objectStore(_STORE).put(_encode(ts), _DBKEY)
    }
  } catch {}
}

function _reconcileAsync(idbTs) {
  const now = Math.floor(Date.now() / 1000)
  const earliest = _pickEarliest([_lsGet(), _ls2Get(), _ssGet(), _ckGet(), idbTs], now)
  if (earliest && earliest !== idbTs) return
  if (earliest) {
    _lsSet(earliest); _ls2Set(earliest); _ssSet(earliest); _ckSet(earliest)
  }
}

// ─── Core logic ────────────────────────────────────────────────────────

function _pickEarliest(candidates, now) {
  let best = null
  for (const ts of candidates) {
    if (!ts) continue
    if (ts > now + 60) continue
    if (ts < 1700000000) continue
    if (!best || ts < best) best = ts
  }
  return best
}

function _readTrialStart() {
  const now = Math.floor(Date.now() / 1000)
  const candidates = [_lsGet(), _ls2Get(), _ssGet(), _ckGet(), _idbCache]
  return _pickEarliest(candidates, now)
}

function _saveTrialStart(ts) {
  _lsSet(ts); _ls2Set(ts); _ssSet(ts); _ckSet(ts); _idbSet(ts)
}

function _healStores(ts) {
  if (!_lsGet()) _lsSet(ts)
  if (!_ls2Get()) _ls2Set(ts)
  if (!_ssGet()) _ssSet(ts)
  if (!_ckGet()) _ckSet(ts)
  if (!_idbCache) _idbSet(ts)
}

// ─── Public API ────────────────────────────────────────────────────────

_idbInit()

export function validateLicense(keyString) {
  if (!keyString || keyString === 'trial') {
    return _createTrialLicense()
  }

  try {
    const decoded = JSON.parse(atob(keyString))
    const { p, d, e, s } = decoded

    if (!p || !s) {
      return { valid: false, error: 'Invalid license key format' }
    }

    // Verify signature (same HMAC as generate-license.mjs)
    const check = { ...decoded }
    delete check.s
    if (s !== _hmacVerify(check)) {
      return { valid: false, error: 'Invalid license key signature' }
    }

    if (e > 0 && Date.now() / 1000 > e) {
      return {
        valid: true,
        plan: _FP,
        watermark: true,
        trialExpired: true,
        originalPlan: p,
        error: `License expired on ${new Date(e * 1000).toLocaleDateString()}`,
        features: getPlanFeatures(_FP),
      }
    }

    // Platform validation — "web", "mobile", "any"
    const platform = decoded.pl || 'web'

    if (platform === 'web' || platform === 'any') {
      // Domain validation — supports comma-separated list
      if (d && d !== '*' && typeof window !== 'undefined') {
        const host = window.location.hostname
        if (host && host !== 'localhost' && host !== '127.0.0.1' && host !== '0.0.0.0' && host !== '') {
          const domains = d.split(',').map(s => s.trim())
          const matched = domains.some(pattern => _matchDomain(pattern, host))
          if (!matched) {
            return { valid: false, error: `License not valid for domain: ${host}` }
          }
        }
      }
    }

    // Mobile: appId validation (checked by developer passing appId in options)
    if (platform === 'mobile' && decoded.a && typeof window !== 'undefined') {
      const declared = window.__mrd_app_id
      if (declared && declared !== decoded.a) {
        return { valid: false, error: `License not valid for app: ${declared}` }
      }
    }

    return {
      valid: true,
      plan: p,
      domain: d,
      platform,
      appId: decoded.a || null,
      expiry: e,
      watermark: false,
      features: getPlanFeatures(p),
    }
  } catch {
    return { valid: false, error: 'Invalid license key' }
  }
}

function _hmacVerify(payload) {
  const _K = 'mrd-ce-hmac-2024-x9k2m'
  const str = JSON.stringify(payload)
  const raw = _K + ':' + str
  let h1 = 0x811c9dc5 >>> 0
  let h2 = 0x6c62272e >>> 0
  let h3 = 0xdeadbeef >>> 0
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0
    h3 = Math.imul(h3 ^ c, 0x1b873593) >>> 0
  }
  return (h1.toString(36) + h2.toString(36) + h3.toString(36)).slice(0, 24)
}

function _createTrialLicense() {
  let trialStart = _readTrialStart()
  if (!trialStart) {
    trialStart = Math.floor(Date.now() / 1000)
    _saveTrialStart(trialStart)
  } else {
    _healStores(trialStart)
  }

  const trialEnd = trialStart + _TD * 86400
  const now = Date.now() / 1000
  const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / 86400))

  if (now > trialEnd) {
    return {
      valid: true,
      plan: _FP,
      watermark: true,
      trialExpired: true,
      daysLeft: 0,
      features: getPlanFeatures(_FP),
    }
  }

  return {
    valid: true,
    plan: _TP,
    watermark: false,
    daysLeft,
    trialEnd,
    features: getPlanFeatures(_TP),
  }
}

function _matchDomain(pattern, host) {
  if (pattern === '*' || pattern === host) return true
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1)
    return host.endsWith(suffix) || host === pattern.slice(2)
  }
  return false
}

// ─── Branded watermark system ───────────────────────────────────────────
// Daily-seeded pseudo-random position, logo + "MRD-Indicators" brand.
// Rendered as LAST canvas op in RAF loop → cannot be covered by canvas overlays.

const _BRAND = 'MRD-Indicators'
const _BRAND_URL = 'mrd-indicators.com'

const _LOGO_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtNCk7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtMik7CiAgICAgIH0KCiAgICAgIC5jbHMtMiwgLmNscy0zLCAuY2xzLTQsIC5jbHMtNSwgLmNscy02IHsKICAgICAgICBtaXgtYmxlbmQtbW9kZTogbXVsdGlwbHk7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtNCB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtNik7CiAgICAgIH0KCiAgICAgIC5jbHMtNSB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtNSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtNyB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGlzb2xhdGlvbjogaXNvbGF0ZTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB4MT0iOS4xMiIgeTE9IjE1Ljg4IiB4Mj0iMTkuNjMiIHkyPSI1LjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2IzNTA5ZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNWE0YzciLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC0yIiB4MT0iOS4wOCIgeTE9IjYuODEiIHgyPSI5LjA4IiB5Mj0iMTQuNzMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMjM0ZmIzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50LTMiIHgxPSIxNy42NyIgeTE9IjYuMTEiIHgyPSI4LjQxIiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1YTJhOGIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtNCIgeDE9IjIwLjAzIiB5MT0iMTUuODkiIHgyPSIxMC45OCIgeTI9IjE1Ljg5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2Y2YWFjYiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NzJhOGQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC01IiB4MT0iMTkuMDMiIHkxPSIxNi44MiIgeDI9IjE0Ljc5IiB5Mj0iMTIuNTgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2VkMzQ4ZCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50LTYiIHgxPSIxNS4yNyIgeTE9IjE1LjA2IiB4Mj0iMTUuMjciIHkyPSIxOS4zNyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZWU0YzliIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtNyIgeDE9IjUuNTEiIHkxPSItMTI4LjAyIiB4Mj0iLTMuNyIgeTI9Ii0xMjguMDIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOS4xMiAxMC4wMSkgcm90YXRlKDg5LjYpIiB4bGluazpocmVmPSIjbGluZWFyLWdyYWRpZW50LTMiLz4KICA8L2RlZnM+CiAgPGcgY2xhc3M9ImNscy04IiBpZD0iTG9nbyI+CiAgICA8ZyBpZD0iT0JKRUNUUyIgPgogICAgICA8ZyBpZCA9IkxvZ28iPiAKICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik00LjIzLDExYzAsNS4zNiw0LjM3LDkuNzEsOS43Niw5LjcxczkuNzYtNC4zNSw5Ljc2LTkuNzFTMTkuMzksMS4yOSwxNCwxLjI5LDQuMjMsNS42NCw0LjIzLDExWk0xMC4yNiwxMC4wN2MwLTEuNTQsMS4yNS0yLjc4LDIuOC0yLjc4aDEuODdjMS41NSwwLDIuOCwxLjI1LDIuOCwyLjc4djEuODZjMCwxLjU0LTEuMjUsMi43OC0yLjgsMi43OGgtMS4yMmMtLjQ1LDAtLjg4LjE1LTEuMjIuNDRsLTIuMjMsMS44NHYtNi45MloiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMC4yNiwxNi45OXYtNi45MnMwLS4wMiwwLS4wM2MuMDItMS41MiwxLjI2LTIuNzUsMi44LTIuNzVoLTUuMDljLTIuMDUsMC0zLjczLDEuNjQtMy43NCwzLjY4LDAsLjAxLDAsLjAzLDAsLjA0LDAsLjA4LDAsLjE2LDAsLjI0LDAsLjA0LDAsLjA4LDAsLjEyLDAsLjA0LDAsLjA4LDAsLjEyLDAsLjA2LDAsLjExLjAxLjE3LDAsLjAyLDAsLjA1LDAsLjA3LDAsLjA2LjAxLjEzLjAyLjE5LDAsLjAxLDAsLjAzLDAsLjA0LDAsLjA3LjAxLjE0LjAyLjIxLDAsMCwwLC4wMSwwLC4wMiwwLC4wNy4wMi4xNS4wMy4yMiwwLDAsMCwwLDAsMCwuNjgsNC42OCw0LjcxLDguMjcsOS42LDguMy0yLjA0LS4wMi0zLjY3LTEuNjktMy42Ny0zLjcyWiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE0LjA0LDEuMjlzLS4wMywwLS4wNCwwYy0uMDgsMC0uMTYsMC0uMjQsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDYsMC0uMTEsMC0uMTcsMC0uMDIsMC0uMDUsMC0uMDcsMC0uMDYsMC0uMTMuMDEtLjE5LjAyLS4wMSwwLS4wMywwLS4wNCwwLS4wNywwLS4xNC4wMS0uMjEuMDIsMCwwLS4wMSwwLS4wMiwwLS4wNywwLS4xNS4wMi0uMjIuMDMsMCwwLDAsMCwwLDAtNC43LjY4LTguMzIsNC42OS04LjM1LDkuNTQuMDItMi4wMiwxLjctMy42NSwzLjc0LTMuNjVoNi45NnMuMDIsMCwuMDMsMGMxLjUzLjAyLDIuNzcsMS4yNiwyLjc3LDIuNzh2LTUuMDZjMC0yLjA0LTEuNjUtMy43MS0zLjctMy43MloiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNC45MywxNC43MWg1LjA5YzIuMDQsMCwzLjcyLTEuNjMsMy43NC0zLjY1LS4wMyw0Ljg2LTMuNjUsOC44Ny04LjM1LDkuNTQsMCwwLDAsMCwwLDAtLjA3LjAxLS4xNS4wMi0uMjIuMDMsMCwwLS4wMSwwLS4wMiwwLS4wNywwLS4xNC4wMi0uMjEuMDItLjAxLDAtLjAzLDAtLjA0LDAtLjA2LDAtLjEzLjAxLS4xOS4wMi0uMDIsMC0uMDUsMC0uMDcsMC0uMDYsMC0uMTEsMC0uMTcsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDgsMC0uMTYsMC0uMjQsMC0uMDEsMC0uMDMsMC0uMDQsMC0yLjA1LDAtMy43LTEuNjgtMy43LTMuNzJsMi4yMy0xLjg0Yy4zNC0uMjguNzgtLjQ0LDEuMjItLjQ0aDEuMjJaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy01IiBkPSJNMTQuOTMsMTQuNzFoNS4wOWMyLjA0LDAsMy43Mi0xLjYzLDMuNzQtMy42NS0uMDMsNC44Ni0zLjY1LDguODctOC4zNSw5LjU0LDAsMCwwLDAsMCwwLS4wNy4wMS0uMTUuMDItLjIyLjAzLDAsMC0uMDEsMC0uMDIsMC0uMDcsMC0uMTQuMDItLjIxLjAyLS4wMSwwLS4wMywwLS4wNCwwLS4wNiwwLS4xMy4wMS0uMTkuMDItLjAyLDAtLjA1LDAtLjA3LDAtLjA2LDAtLjExLDAtLjE3LDAtLjA0LDAtLjA4LDAtLjEyLDAtLjA0LDAtLjA4LDAtLjEyLDAtLjA4LDAtLjE2LDAtLjI0LDAtLjAxLDAtLjAzLDAtLjA0LDAtMi4wNSwwLTMuNy0xLjY4LTMuNy0zLjcybDIuMjMtMS44NGMuMzQtLjI4Ljc4LS40NCwxLjIyLS40NGgxLjIyWiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIwLjI4LDE0LjcxYy0uMDgsMC0uMTcsMC0uMjUsMGgtNi4zMWMtLjQ1LDAtLjg4LjE1LTEuMjIuNDRsLTIuMjMsMS44NGMwLC4wOCwwLC4xNywwLC4yNSwxLjA5LjY1LDIuMzcsMS4wMiwzLjczLDEuMDIsMi42NywwLDUuMDEtMS40Myw2LjI4LTMuNTVaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy02IiBkPSJNMjMuNzcsMTAuOTdzMC0uMDMsMC0uMDRjMC0uMDgsMC0uMTYsMC0uMjQsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDQsMC0uMDgsMC0uMTIsMC0uMDYsMC0uMTEtLjAxLS4xNywwLS4wMiwwLS4wNSwwLS4wNywwLS4wNi0uMDEtLjEzLS4wMi0uMTksMC0uMDEsMC0uMDMsMC0uMDQsMC0uMDctLjAyLS4xNC0uMDItLjIxLDAsMCwwLS4wMSwwLS4wMiwwLS4wNy0uMDItLjE1LS4wMy0uMjIsMCwwLDAsMCwwLDAtLjcxLTQuNjctNC43Ny04LjI0LTkuNjYtOC4yNCwyLjA0LDAsMy42OCwxLjY2LDMuNywzLjY5bC4wNCw1LjA2djEuODZzLjAxLjAyLjAxLjAzYzAsMS41Mi0xLjI1LDIuNzYtMi43OCwyLjc3bDUuMDktLjA0YzIuMDUtLjAxLDMuNzItMS42NiwzLjcxLTMuN1oiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+'

let _logoImg = null
let _logoLoading = false

function _ensureLogo() {
  if (_logoImg || _logoLoading) return _logoImg
  _logoLoading = true
  const img = new Image()
  img.onload = () => { _logoImg = img }
  img.src = _LOGO_SVG
  return null
}

function _daySeed() {
  return Math.floor(Date.now() / 86400000)
}

function _prng(seed) {
  let s = (seed ^ 0x9e3779b9) >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

function _drawBrandBadge(ctx, x, y, text, subtext, isLight) {
  const logo = _ensureLogo()

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  ctx.font = 'bold 10px Inter, system-ui, sans-serif'
  const textM = ctx.measureText(text)
  ctx.font = '8px Inter, system-ui, sans-serif'
  const subM = ctx.measureText(subtext)

  const logoW = logo ? 18 : 0
  const logoH = logo ? 14 : 0
  const padX = 7
  const padY = 5
  const gap = logo ? 5 : 0
  const contentW = logoW + gap + Math.max(textM.width, subM.width)
  const bw = contentW + padX * 2
  const bh = Math.max(logoH, 20) + padY * 2
  const bx = Math.round(x - bw / 2)
  const by = Math.round(y - bh / 2)

  ctx.globalAlpha = 0.45
  ctx.fillStyle = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(18,18,28,0.8)'
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 1
  ctx.beginPath()
  ctx.roundRect(bx, by, bw, bh, 6)
  ctx.fill()
  ctx.shadowColor = 'transparent'

  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  let tx = bx + padX
  const cy = by + bh / 2

  if (logo) {
    ctx.globalAlpha = 0.5
    ctx.drawImage(logo, tx, cy - logoH / 2, logoW, logoH)
    tx += logoW + gap
  }

  ctx.globalAlpha = 0.5
  ctx.font = 'bold 10px Inter, system-ui, sans-serif'
  ctx.fillStyle = isLight ? '#1a1a2e' : '#ededf5'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, tx, cy - 1)

  ctx.font = '8px Inter, system-ui, sans-serif'
  ctx.fillStyle = isLight ? '#777790' : '#8080a0'
  ctx.textBaseline = 'top'
  ctx.fillText(subtext, tx, cy + 2)

  ctx.restore()
}

/**
 * Branded watermark — rendered as the LAST canvas operation.
 * Position changes once per day (seeded PRNG) so it cannot be masked at a fixed spot.
 */
export function drawWatermark(ctx, canvas, licenseInfo, isLightTheme) {
  _ensureLogo()

  const w = canvas.width
  const h = canvas.height
  if (w < 100 || h < 80) return

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const rand = _prng(_daySeed())

  const margin = 100
  const zoneW = Math.max(w - margin * 2, 60)
  const zoneH = Math.max(h - margin * 2, 40)
  const bx = margin + rand() * zoneW
  const by = margin + rand() * zoneH

  const isFree = licenseInfo.trialExpired || licenseInfo.plan === _FP
  const badgeMain = _BRAND
  const badgeSub = isFree
    ? `Free \u2014 ${_BRAND_URL}/pricing`
    : `Trial: ${licenseInfo.daysLeft || 0}d left \u2014 ${_BRAND_URL}`

  _drawBrandBadge(ctx, bx, by, badgeMain, badgeSub, isLightTheme)

  ctx.restore()
}

/**
 * Generates a license key (for admin/backend use).
 * Prefer using: node scripts/generate-license.mjs
 */
export function generateLicenseKey({ plan, domain = '*', expiryDays = 365, name, email }) {
  const e = expiryDays > 0
    ? Math.floor(Date.now() / 1000) + expiryDays * 86400
    : 0
  const payload = {
    p: plan,
    d: domain,
    e,
    ...(name ? { n: name } : {}),
    ...(email ? { m: email } : {}),
    i: Date.now(),
  }
  payload.s = _hmacVerify(payload)
  return btoa(JSON.stringify(payload))
}
