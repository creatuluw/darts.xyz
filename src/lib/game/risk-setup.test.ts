import { describe, expect, it } from 'vitest';
import {
    PRESET_TURNS,
    RISK_CLOCK_PRESETS,
    RISK_DEFAULT_MODE,
    validateRiskSetup,
    estimateRiskDuration,
} from './risk-setup';

describe('Risk 42 — setup (Fun tab)', () => {
    it('presets are branded turn counts (T&T ruling): 170≈14, 301≈25, 501≈40 turns', () => {
        expect(RISK_DEFAULT_MODE).toBe('domination');
        expect(RISK_CLOCK_PRESETS).toEqual([170, 301, 501]);
        expect(PRESET_TURNS).toEqual({ 170: 14, 301: 25, 501: 40 });
    });

    it('validates roster size 2-6', () => {
        expect(validateRiskSetup({ players: ['a', 'b'], mode: 'domination' })).toEqual([]);
        expect(validateRiskSetup({ players: ['a'], mode: 'domination' })).toContain('Select at least 2 players');
        expect(validateRiskSetup({ players: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], mode: 'domination' })).toContain('Maximum 6 players');
    });

    it('clock mode needs a preset', () => {
        expect(validateRiskSetup({ players: ['a', 'b'], mode: 'clock', clockPreset: 301 })).toEqual([]);
        expect(validateRiskSetup({ players: ['a', 'b'], mode: 'clock' })).toContain('Pick a clock length');
    });

    it('estimates duration: ~30s per turn per player', () => {
        expect(estimateRiskDuration({ mode: 'domination', players: 2 })).toBe('open-ended');
        expect(estimateRiskDuration({ mode: 'clock', clockPreset: 301, players: 2 })).toBe('~1h 15m');
        expect(estimateRiskDuration({ mode: 'clock', clockPreset: 170, players: 3 })).toBe('~1h 5m');
    });
});
