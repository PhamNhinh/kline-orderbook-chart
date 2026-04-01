export declare function createChartBridge(canvas: HTMLCanvasElement): Promise<MrdChart>;
export declare function prefetchWasm(): void;
export declare function dispatchCommands(ctx: CanvasRenderingContext2D, memory: WebAssembly.Memory, ptr: number, len: number): void;
export declare function setupEvents(canvas: HTMLCanvasElement, engine: any, callbacks: any): () => void;
export declare function createCustomIndicatorManager(engine: any, memory: WebAssembly.Memory, dispatch: any): any;

export interface MrdChart {
  engine: any;
  start(): void;
  stop(): void;
  resize(retries?: number): void;
  destroy(): void;
  pause(): void;
  resume(): void;
  readonly isPaused: boolean;

  // Data
  setKlines(klines: any[]): void;
  updateLastKline(t: number, o: number, h: number, l: number, c: number, v: number): void;
  appendKline(t: number, o: number, h: number, l: number, c: number, v: number): void;
  setHeatmap(data: Float32Array, rows: number, cols: number, priceMin: number, priceMax: number, timeStart: number, timeEnd: number): void;

  // Indicators
  enableVolume(on: boolean): void;
  enableRsi(on: boolean, period?: number): void;
  enableOi(on: boolean): void;
  enableFootprint(on: boolean): void;
  enableHeatmap(on: boolean): void;

  // Drawing
  startDrawing(tool: string, style?: any): void;
  cancelDrawing(): void;

  // Settings
  setPrecision(decimals: number): void;
  setCandleInterval(seconds: number): void;
  setTheme(name: 'dark' | 'light'): void;
  getTheme(): 'dark' | 'light';

  // Events
  onTooltip(cb: (json: string | null, sx: number, sy: number) => void): void;

  // Custom Indicators
  addIndicator(config: any): string;
  removeIndicator(id: string): void;
  updateIndicatorParams(id: string, params: any): void;
  setIndicatorEnabled(id: string, enabled: boolean): void;
  listIndicators(): any[];
}
