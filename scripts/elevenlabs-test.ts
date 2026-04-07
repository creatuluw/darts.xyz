/**
 * ElevenLabs 180 Audio Test Script
 *
 * Generates a professional darts caller "ONE HUNDRED AND EIGHTY!" clip
 * using ElevenLabs text-to-speech and saves it to static/audio
 *
 * Run with: npx tsx scripts/elevenlabs-test.ts
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const API_KEY = "sk_8467e84f04f80ac8e98a2a6b63f0f719c8532ba9845e1a7d";
const VOICE_ID = "HXxCKoODRGGczJ39r5SZ";
const OUTPUT_DIR = path.join(process.cwd(), "static", "audio");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "180-test-scottish.mp3");

const TEXT =
  "ONE HUNDRED AND EIGHTY!!! What an absolute SCREAMER from the Oche! The crowd are on their feet FOLKS, this is INCREDIBLE!";

async function generateElevenLabsAudio() {
  console.log("🎯 Darts Caller - ElevenLabs Audio Test");
  console.log("========================================\n");

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    console.log(`Creating directory: ${OUTPUT_DIR}`);
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Text: "${TEXT}"`);
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Output: ${OUTPUT_FILE}\n`);

  try {
    console.log("⏳ Generating audio with ElevenLabs...");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text: TEXT,
          speed: 1.1,
          model_id: "eleven_v3",
          voice_settings: {
            stability: 0.25,
            similarity_boost: 0.85,
            style: 0.8,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`✅ Generated ${audioBuffer.byteLength} bytes of audio`);

    console.log("💾 Saving to disk...");
    await writeFile(OUTPUT_FILE, Buffer.from(audioBuffer));

    console.log(`\n✅ Success! Audio saved to: ${OUTPUT_FILE}`);
    console.log("\nYou can now:");
    console.log("1. Open the file in your browser to preview");
    console.log("2. Or copy it to check the audio quality");
    console.log("\nTo change the voice, update VOICE_ID in this script.");
  } catch (error) {
    console.error("\n❌ Error generating audio:", error);
    process.exit(1);
  }
}

generateElevenLabsAudio();
