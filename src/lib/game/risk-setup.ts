/** Risk 42 — setup helpers (Fun tab, spec §Screens). */

export type RiskMode = 'domination' | 'clock';

/** Domination is the headline default; the clock is the civilized alt. */
export const RISK_DEFAULT_MODE: RiskMode = 'domination';

/** Branded clock lengths — same ruling as Trebles & Territories (170≈14 turns, 301≈25, 501≈40). */
export const RISK_CLOCK_PRESETS = [170, 301, 501] as const;
export type RiskClockPreset = (typeof RISK_CLOCK_PRESETS)[number];

export const PRESET_TURNS: Record<RiskClockPreset, number> = { 170: 14, 301: 25, 501: 40 };

export const RISK_MIN_PLAYERS = 2;
export const RISK_MAX_PLAYERS = 6;

export interface RiskSetupInput {
    players: unknown[];
    mode: RiskMode;
    clockPreset?: RiskClockPreset;
}

/** Setup errors for the Fun tab; empty array = ready to start. */
export function validateRiskSetup(input: RiskSetupInput): string[] {
    const errors: string[] = [];
    if (input.players.length < RISK_MIN_PLAYERS) errors.push(`Select at least ${RISK_MIN_PLAYERS} players`);
    if (input.players.length > RISK_MAX_PLAYERS) errors.push(`Maximum ${RISK_MAX_PLAYERS} players`);
    if (input.mode === 'clock' && !input.clockPreset) errors.push('Pick a clock length');
    return errors;
}

/** Coarse night-planning estimate: ~1.5 min per turn per player (income turns run 4-6 darts), rounded to 5. */
export function estimateRiskDuration(input: { mode: RiskMode; clockPreset?: RiskClockPreset; players: number }): string {
    if (input.mode === 'domination') return 'open-ended';
    const minutes = PRESET_TURNS[input.clockPreset ?? 301] * input.players * 1.5;
    const rounded = Math.round(minutes / 5) * 5;
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    if (h === 0) return `~${m}m`;
    return m === 0 ? `~${h}h` : `~${h}h ${m}m`;
}
