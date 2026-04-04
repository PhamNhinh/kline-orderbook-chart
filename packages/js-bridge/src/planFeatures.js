/**
 * Plan-based feature access control for MRD Chart Engine.
 *
 * Each plan tier unlocks progressively more features.
 * Feature keys correspond to bridge method groups.
 */

const PLAN_FEATURES = {
  trial: {
    candlestick: true,
    volume: true,
    rsi: true,
    drawingBasic: true,
    drawingFull: true,
    heatmap: true,
    footprint: true,
    liqHeatmap: true,
    oi: true,
    fundingRate: true,
    cvd: true,
    largeTrades: true,
    vrvp: true,
    tpo: true,
    smartRanges: true,
    emaStructure: true,
    customIndicators: true,
    forexSignals: true,
    vpin: true,
    stopIceberg: true,
  },

  standard: {
    candlestick: true,
    volume: true,
    rsi: true,
    drawingBasic: true,
    drawingFull: false,
    heatmap: false,
    footprint: false,
    liqHeatmap: false,
    oi: false,
    fundingRate: false,
    cvd: false,
    largeTrades: false,
    vrvp: false,
    tpo: false,
    smartRanges: false,
    emaStructure: false,
    customIndicators: false,
    forexSignals: false,
    vpin: false,
    stopIceberg: false,
  },

  professional: {
    candlestick: true,
    volume: true,
    rsi: true,
    drawingBasic: true,
    drawingFull: true,
    heatmap: true,
    footprint: true,
    liqHeatmap: true,
    oi: true,
    fundingRate: true,
    cvd: true,
    largeTrades: true,
    vrvp: false,
    tpo: false,
    smartRanges: false,
    emaStructure: false,
    customIndicators: false,
    forexSignals: false,
    vpin: false,
    stopIceberg: false,
  },

  enterprise: {
    candlestick: true,
    volume: true,
    rsi: true,
    drawingBasic: true,
    drawingFull: true,
    heatmap: true,
    footprint: true,
    liqHeatmap: true,
    oi: true,
    fundingRate: true,
    cvd: true,
    largeTrades: true,
    vrvp: true,
    tpo: true,
    smartRanges: true,
    emaStructure: true,
    customIndicators: true,
    forexSignals: true,
    vpin: true,
    stopIceberg: true,
  },
}

const FEATURE_LABELS = {
  rsi: 'RSI',
  drawingBasic: 'Basic Drawing Tools',
  heatmap: 'Orderbook Heatmap',
  footprint: 'Footprint Chart',
  liqHeatmap: 'Liquidation Heatmap',
  oi: 'Open Interest',
  fundingRate: 'Funding Rate',
  cvd: 'CVD',
  largeTrades: 'Large Trades',
  vrvp: 'VRVP',
  tpo: 'TPO / Market Profile',
  smartRanges: 'Smart Ranges',
  emaStructure: 'EMA Structure',
  drawingFull: 'All Drawing Tools',
  customIndicators: 'Custom Indicators',
  forexSignals: 'Forex Signals',
  vpin: 'VPIN',
  stopIceberg: 'Stops & Icebergs',
}

const FEATURE_MIN_PLAN = {
  rsi: 'Standard',
  drawingBasic: 'Standard',
  heatmap: 'Professional',
  footprint: 'Professional',
  liqHeatmap: 'Professional',
  oi: 'Professional',
  fundingRate: 'Professional',
  cvd: 'Professional',
  largeTrades: 'Professional',
  drawingFull: 'Professional',
  vrvp: 'Enterprise',
  tpo: 'Enterprise',
  smartRanges: 'Enterprise',
  emaStructure: 'Enterprise',
  customIndicators: 'Enterprise',
  forexSignals: 'Enterprise',
  vpin: 'Enterprise',
  stopIceberg: 'Enterprise',
}

export function getPlanFeatures(plan) {
  return PLAN_FEATURES[plan] || PLAN_FEATURES.trial
}

export function canUseFeature(plan, featureKey) {
  const features = getPlanFeatures(plan)
  return features[featureKey] === true
}

export function getFeatureLabel(featureKey) {
  return FEATURE_LABELS[featureKey] || featureKey
}

export function getMinPlan(featureKey) {
  return FEATURE_MIN_PLAN[featureKey] || null
}

export function createFeatureGate(plan) {
  const features = getPlanFeatures(plan)
  const _warned = new Set()

  return function gate(featureKey) {
    if (features[featureKey]) return true

    if (!_warned.has(featureKey)) {
      _warned.add(featureKey)
      const label = FEATURE_LABELS[featureKey] || featureKey
      const minPlan = FEATURE_MIN_PLAN[featureKey] || 'a higher'
      console.warn(
        `[MRD Chart Engine] "${label}" requires ${minPlan} plan. ` +
        `Current plan: ${plan}. Upgrade at https://mrd-chart.dev/pricing`
      )
    }
    return false
  }
}
