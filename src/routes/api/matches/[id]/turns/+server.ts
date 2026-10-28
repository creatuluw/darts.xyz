import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { dbService } from "$lib/db/database-service";
import {
	computeEditedTurnOutcome,
	validateEditedDarts,
} from "$lib/game/turn-edit";

export const GET: RequestHandler = async ({ params, url }) => {
  const legId = url.searchParams.get("legId");

  if (legId) {
    // Return turns for a specific leg
    const turns = await dbService.getLegTurns(legId);
    return json(turns);
  }

  // Return all turns for the entire match
  const legs = await dbService.getMatchLegs(params.id);
  const legIds = legs.map((l: any) => l.id);
  if (legIds.length === 0) return json([]);
  const turns = await dbService.getTurnsForLegs(legIds);
  return json(turns);
};

export const POST: RequestHandler = async ({ request }) => {
  const turnData = await request.json();
  const turn = await dbService.addTurn(turnData);
  return json(turn, { status: 201 });
};

export const DELETE: RequestHandler = async ({ url }) => {
  // NOTE: on this route `params.id` is the MATCH id — the turn id must come
  // exclusively from the query param (falling back to params.id silently
  // deleted nothing while returning 200).
  const turnId = url.searchParams.get("id");
  if (!turnId) return json({ error: "turnId required" }, { status: 400 });
  await dbService.deleteTurn(turnId);
  return json({ success: true });
};

/**
 * Edit the darts of the latest turn of an in-progress leg.
 *
 * The server recomputes totalScore/remainingScore/isBust from the submitted
 * darts (scoring engine) — client values are never trusted. Edits that would
 * check out (finish the leg) are rejected: leg completion is the submit
 * flow's job (winnerId, next leg, counters), not a row update.
 */
export const PATCH: RequestHandler = async ({ params, request, url }) => {
  const body = await request.json().catch(() => null);
  const turnId =
    body && typeof body === "object" && typeof body.turnId === "string"
      ? body.turnId
      : url.searchParams.get("turnId");
  if (!turnId) return json({ error: "turnId required" }, { status: 400 });

  const turn = await dbService.getTurn(turnId);
  if (!turn) return json({ error: "Turn not found" }, { status: 404 });

  const leg = await dbService.getLeg(turn.legId);
  if (!leg) return json({ error: "Leg not found" }, { status: 404 });
  if (leg.winnerId) {
    return json(
      { error: "This leg is finished — its turns can no longer be edited" },
      { status: 400 },
    );
  }

  const match = await dbService.getMatch(params.id);
  if (!match) return json({ error: "Match not found" }, { status: 404 });
  if (match.status !== "in_progress") {
    return json(
      { error: "This match is finished — its turns can no longer be edited" },
      { status: 400 },
    );
  }

  // Only the latest turn of the leg may be edited: later turns chain their
  // remaining scores off this one, and there is nothing to re-chain.
  const legTurns = await dbService.getLegTurns(turn.legId);
  const latest = legTurns[legTurns.length - 1];
  if (!latest || latest.id !== turnId) {
    return json(
      { error: "Only the latest turn of a leg can be edited" },
      { status: 400 },
    );
  }

  const validation = validateEditedDarts(body?.darts, body?.dartsThrown);
  if (!validation.ok) return json({ error: validation.error }, { status: 400 });

  const prevRemaining =
    legTurns.length > 1
      ? legTurns[legTurns.length - 2].remainingScore
      : match.startingScore;
  const outcome = computeEditedTurnOutcome(prevRemaining, validation.darts);
  if (outcome.isCheckout) {
    return json(
      { error: "This edit would finish the leg — enter the checkout live instead" },
      { status: 400 },
    );
  }

  const slot = (i: number) => validation.darts[i] ?? { segment: 0, multiplier: 0, score: 0 };
  const [d1, d2, d3] = [slot(0), slot(1), slot(2)];
  const updated = await dbService.updateTurn(turnId, {
    dart1Score: d1.score,
    dart1Multiplier: d1.multiplier,
    dart1Segment: d1.segment,
    dart2Score: d2.score,
    dart2Multiplier: d2.multiplier,
    dart2Segment: d2.segment,
    dart3Score: d3.score,
    dart3Multiplier: d3.multiplier,
    dart3Segment: d3.segment,
    totalScore: outcome.totalScore,
    remainingScore: outcome.remainingScore,
    isBust: outcome.isBust,
    dartsThrown: validation.dartsThrown,
  });
  return json(updated);
};
