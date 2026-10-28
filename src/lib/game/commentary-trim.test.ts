import { describe, it, expect } from 'vitest';
import { trimToSentences, trimInterview } from './commentary-trim';

describe('trimToSentences', () => {
	it('keeps a 2-sentence input as-is', () => {
		const two = 'Wat een beurt! Prachtig gewoon.';
		expect(trimToSentences(two)).toBe(two);
	});

	it('keeps an exactly-3-sentence input as-is', () => {
		const three = 'Mooi. Sterk gegooid. Dat voelt als een ommezwaai.';
		expect(trimToSentences(three)).toBe(three);
	});

	it('trims a 5-sentence input to the first 3', () => {
		const five = 'Een. Twee! Drie? Vier. Vijf.';
		expect(trimToSentences(five)).toBe('Een. Twee! Drie?');
	});

	it('handles a final sentence without terminal punctuation', () => {
		const text = 'Een. Twee! Drie? Vier';
		expect(trimToSentences(text)).toBe('Een. Twee! Drie?');
	});

	it('keeps a single sentence without punctuation', () => {
		expect(trimToSentences('Wat een worp')).toBe('Wat een worp');
	});

	it('is safe on empty and whitespace-only input', () => {
		expect(trimToSentences('')).toBe('');
		expect(trimToSentences('   ')).toBe('');
	});

	it('treats doubled punctuation as one boundary', () => {
		expect(trimToSentences('Wat een worp!! Toch niet. Nog een. Extra.')).toBe(
			'Wat een worp!! Toch niet. Nog een.'
		);
	});

	it('honours a custom max', () => {
		expect(trimToSentences('Een. Twee. Drie. Vier.', 2)).toBe('Een. Twee.');
	});

	it('returns empty for non-string input (defensive)', () => {
		// @ts-expect-error defensive runtime guard
		expect(trimToSentences(null)).toBe('');
	});
});

describe('trimInterview', () => {
	it('clamps every segment to 3 sentences', () => {
		const long = 'Een. Twee. Drie. Vier. Vijf.';
		const result = trimInterview({
			question: long,
			answer: 'Kort.',
			analysis: long,
			outlook: long
		});
		expect(result.question).toBe('Een. Twee. Drie.');
		expect(result.answer).toBe('Kort.');
		expect(result.analysis).toBe('Een. Twee. Drie.');
		expect(result.outlook).toBe('Een. Twee. Drie.');
	});

	it('leaves an all-short broadcast untouched', () => {
		const input = { question: 'Hoi?', answer: 'Ja.', analysis: 'Prima.', outlook: 'Straks!' };
		expect(trimInterview(input)).toEqual(input);
	});
});
