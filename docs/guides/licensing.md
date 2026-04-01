# Licensing & Trial

Kline Orderbook Chart is a commercial library. It includes a free 14-day trial so you can evaluate the full feature set before purchasing.

## Trial mode

If you create a chart without a license key (or with `'trial'`), the library runs in **trial mode**:

```javascript
const chart = await createChartBridge(canvas)   // no licenseKey → trial
```

Trial mode:

- All features are fully functional for **14 days**
- A semi-transparent **watermark** is displayed on the chart
- After 14 days, the chart shows an **expired overlay**

The trial timer is stored in the browser's `localStorage`. Clearing storage resets the trial.

## License key

After purchasing, you receive a license key. Pass it during initialization:

```javascript
const chart = await createChartBridge(canvas, {
  licenseKey: 'MRD-PRO-XXXXXXXX-20270101-XXXXXX',
})
```

With a valid key:

- No watermark
- No expiry overlay
- Full feature access based on your plan tier

### Key format

License keys encode:

| Field | Description |
|---|---|
| **Plan** | `STD` (Standard), `PRO` (Professional), or `ENT` (Enterprise) |
| **Domain** | The domain the key is locked to (or `*` for any domain) |
| **Expiry** | Key expiration date |

### Checking the license at runtime

```javascript
const info = chart.license
// {
//   plan: 'pro',
//   domain: 'yourapp.com',
//   expiry: '2027-01-01',
//   valid: true,
//   expired: false,
//   watermark: false,
// }
```

### Updating the license key

```javascript
chart.setLicenseKey('MRD-PRO-NEW-KEY-20280101-XXXXXX')
```

## License plans

| Feature | Standard | Professional | Enterprise |
|---|---|---|---|
| Candlestick chart | Yes | Yes | Yes |
| Volume, RSI, EMA | Yes | Yes | Yes |
| Drawing tools | Yes | Yes | Yes |
| Dark/light themes | Yes | Yes | Yes |
| **Orderbook Heatmap** | — | Yes | Yes |
| **Footprint Chart** | — | Yes | Yes |
| **OI, CVD, VRVP, TPO** | — | Yes | Yes |
| **Large Trades** | — | Yes | Yes |
| **Liquidation Heatmap** | — | — | Yes |
| **Live Signals** | — | — | Yes |
| **Smart Ranges (SMC)** | — | — | Yes |
| **White-label (no branding)** | — | — | Yes |
| **Priority support** | — | — | Yes |

## Deployment

License keys can be optionally domain-locked. The key validation checks `window.location.hostname`:

- **Domain `*`** — key works on any domain (development + production)
- **Specific domain** — key only works on that domain (e.g., `yourapp.com`)
- **`localhost`** — always allowed for development, regardless of domain lock

## Purchasing

Contact us for pricing and custom license options:

- **Email:** [support@mrd-indicators.com](mailto:support@mrd-indicators.com)
- **Discord:** [discord.gg/buX2h5ZZm](https://discord.gg/buX2h5ZZm)
- **Live demo:** [app.mrd-indicators.com/trading/chart-terminal](https://app.mrd-indicators.com/trading/chart-terminal)

---

## Next steps

- [Getting Started](getting-started.md) — Install and create your first chart
- [API Reference](../api/README.md) — Full license API docs
