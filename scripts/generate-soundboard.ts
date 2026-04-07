/**
 * Darts Soundboard Generator - Configurable Version
 *
 * Generates audio clips for a darts championship caller with custom voice and prefix.
 *
 * Usage:
 *   npx tsx scripts/generate-soundboard.ts <voice_id> <prefix>
 *
 * Example:
 *   npx tsx scripts/generate-soundboard.ts wo6udizrrtpIxWGp2qJk scotty-
 *
 * Output files will be named: <prefix>score-0.mp3, <prefix>bust.mp3, etc.
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Get voice ID and prefix from command line arguments
const VOICE_ID = process.argv[2] || "HXxCKoODRGGczJ39r5SZ";
const PREFIX = process.argv[3] || "";
const OUTPUT_DIR = path.join(process.cwd(), "static", "audio");

// ElevenLabs API key
const API_KEY = "sk_8467e84f04f80ac8e98a2a6b63f0f719c8532ba9845e1a7d";

// ElevenLabs voice settings for dramatic darts caller
const VOICE_SETTINGS = {
  stability: 0.25,
  similarity_boost: 0.85,
  style: 0.8,
  use_speaker_boost: true,
};
const MODEL_ID = "eleven_v3";

// ============================================================================
// Number to Words Conversion
// ============================================================================

function numberToWords(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return "minus " + numberToWords(Math.abs(num));

  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) {
      return hundreds === 1 ? "one hundred" : hundreds + " hundred";
    }
    const hundredsWord = hundreds === 1 ? "one hundred" : hundreds + " hundred";
    return hundredsWord + " and " + numberToWords(remainder);
  }

  if (num >= 20) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const teenWords: Record<number, string> = {
      20: "twenty",
      30: "thirty",
      40: "forty",
      50: "fifty",
      60: "sixty",
      70: "seventy",
      80: "eighty",
      90: "ninety",
    };
    const tensWord = teenWords[tens * 10];
    if (ones === 0) return tensWord;
    return tensWord + " " + numberToWords(ones);
  }

  const singleWords: Record<number, string> = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
  };

  return singleWords[num] || num.toString();
}

// ============================================================================
// Audio Generation
// ============================================================================

interface GenerationResult {
  filename: string;
  text: string;
  success: boolean;
  size?: number;
  error?: string;
}

function getScoreConfig(score: number): {
  filename: string;
  text: string;
  speed: number;
} {
  const is180 = score === 180;
  const isHigh = score >= 140;
  const isGood = score >= 100;
  const isModerate = score >= 60;

  let text: string;
  let speed = 1.0;

  if (is180) {
    text = "ONE HUNDRED AND EIGHTY!!!";
    speed = 1.15;
  } else if (isHigh) {
    text = numberToWords(score).toUpperCase() + "!";
    speed = 1.1;
  } else if (isGood) {
    text = numberToWords(score).toUpperCase();
    speed = 1.05;
  } else if (isModerate) {
    text = numberToWords(score);
    speed = 1.0;
  } else {
    text = numberToWords(score);
    speed = 0.95;
  }

  return {
    filename: PREFIX + "score-" + score + ".mp3",
    text: text,
    speed: speed,
  };
}

const STATIC_EVENT_SOUNDS: Record<
  string,
  { filename: string; text: string; speed: number }
> = {
  bust: { filename: PREFIX + "bust.mp3", text: "BUST!", speed: 1.2 },
  gameOn: { filename: PREFIX + "game-on.mp3", text: "GAME ON!", speed: 1.1 },
  century: { filename: PREFIX + "century.mp3", text: "CENTURY!", speed: 1.15 },
  highTon: {
    filename: PREFIX + "high-ton.mp3",
    text: "ONE FORTY PLUS!",
    speed: 1.15,
  },
  ton80: {
    filename: PREFIX + "ton-80.mp3",
    text: "ONE HUNDRED AND EIGHTY!!!",
    speed: 1.2,
  },
  nextLeg: {
    filename: PREFIX + "next-leg.mp3",
    text: "Next leg!",
    speed: 1.0,
  },
  nextSet: {
    filename: PREFIX + "next-set.mp3",
    text: "Next set!",
    speed: 1.0,
  },
  changeOfThrow: {
    filename: PREFIX + "change-of-throw.mp3",
    text: "Change of throw",
    speed: 1.0,
  },
  player1Starting: {
    filename: PREFIX + "player1-starting.mp3",
    text: "Player one starts!",
    speed: 1.1,
  },
  player2Starting: {
    filename: PREFIX + "player2-starting.mp3",
    text: "Player two starts!",
    speed: 1.1,
  },
  checkout: {
    filename: PREFIX + "checkout.mp3",
    text: "GAME SHOT!",
    speed: 1.15,
  },
  legWinner: {
    filename: PREFIX + "leg-winner.mp3",
    text: "Wins the leg!",
    speed: 1.1,
  },
  setWinner: {
    filename: PREFIX + "set-winner.mp3",
    text: "Wins the set!",
    speed: 1.15,
  },
  matchWinner: {
    filename: PREFIX + "match-winner.mp3",
    text: "Wins the match!",
    speed: 1.2,
  },
  firstThrow: {
    filename: PREFIX + "first-throw.mp3",
    text: "To throw first",
    speed: 0.95,
  },
};

async function generateAudio(
  text: string,
  filename: string,
  speed: number = 1.0,
): Promise<GenerationResult> {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text: text,
          speed: speed,
          model_id: MODEL_ID,
          voice_settings: VOICE_SETTINGS,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("API error " + response.status + ": " + errorText);
    }

    const arrayBuffer = await response.arrayBuffer();
    const outputPath = path.join(OUTPUT_DIR, filename);
    await writeFile(outputPath, Buffer.from(arrayBuffer));

    return {
      filename: filename,
      text: text,
      success: true,
      size: arrayBuffer.byteLength,
    };
  } catch (error) {
    return {
      filename: filename,
      text: text,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function ensureDirectory() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }
}

async function generateAllSounds() {
  console.log("Darts Soundboard Generator - Custom Voice");
  console.log("=========================================\n");
  console.log("Voice ID: " + VOICE_ID);
  console.log("Prefix: '" + PREFIX + "'");
  console.log("Output: " + OUTPUT_DIR + "\n");

  await ensureDirectory();

  const results: GenerationResult[] = [];
  let successCount = 0;
  let failCount = 0;

  // Generate score sounds 0-180
  console.log("Generating score announcements (0-180)...");
  for (let score = 0; score <= 180; score++) {
    const config = getScoreConfig(score);
    const result = await generateAudio(
      config.text,
      config.filename,
      config.speed,
    );
    results.push(result);
    if (result.success) {
      successCount++;
      process.stdout.write("\r  Progress: " + score + "/180");
    } else {
      failCount++;
      console.log("\n  Failed " + config.filename + ": " + result.error);
    }
  }
  console.log("\n  Completed: " + successCount + "/181 score files\n");

  // Generate static event sounds
  console.log("Generating event sounds...");
  for (const key of Object.keys(STATIC_EVENT_SOUNDS)) {
    const config = STATIC_EVENT_SOUNDS[key];
    const result = await generateAudio(
      config.text,
      config.filename,
      config.speed,
    );
    results.push(result);
    if (result.success) {
      successCount++;
      console.log("  OK: " + config.filename);
    } else {
      failCount++;
      console.log("  FAIL: " + key + ": " + result.error);
    }
  }
  console.log("  Completed event files\n");

  // Summary
  console.log("=========================================");
  console.log("Generation Summary");
  console.log("=========================================");
  console.log("Voice ID: " + VOICE_ID);
  console.log("Prefix: '" + PREFIX + "'");
  console.log("Total files: " + results.length);
  console.log("Success: " + successCount);
  console.log("Failed: " + failCount);

  if (failCount > 0) {
    console.log("\nFailed files:");
    for (const r of results) {
      if (!r.success) {
        console.log("  - " + r.filename + ": " + r.error);
      }
    }
  }

  console.log("\nGenerated files in static/audio/ with prefix: " + PREFIX);
  console.log(
    "  " + PREFIX + "score-0.mp3 through " + PREFIX + "score-180.mp3",
  );
  console.log("  " + PREFIX + "bust.mp3, " + PREFIX + "game-on.mp3, etc.");
}

generateAllSounds().catch(console.error);
