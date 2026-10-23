<script lang="ts">
    let { open, close }: { open: boolean; close: () => void } = $props();
</script>

<svelte:window onkeydown={(e) => { if (open && e.key === "Escape") close(); }} />

{#if open}
    <!-- backdrop -->
    <div class="fixed inset-0 z-50 bg-black/60" onclick={close} aria-hidden="true"></div>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Spelregels Risk 42"
    >
        <div class="pointer-events-auto w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/10 dark:ring-white/15 shadow-xl p-6 text-zinc-900 dark:text-zinc-100">
            <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p class="text-xs uppercase tracking-wider text-zinc-400 font-bold">Spelregels</p>
                    <h2 class="font-display text-xl font-bold">Risk 42</h2>
                </div>
                <button
                    onclick={close}
                    aria-label="Sluit spelregels"
                    class="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >Sluiten</button>
            </div>

            <div class="space-y-4 text-sm leading-relaxed">
                <section>
                    <h3 class="font-bold mb-1">🎯 Het doel</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Risk op het dartbord. <strong>Domination</strong>: bezet álle 40 terreinen en je wint meteen.
                        <strong>Clock</strong> (170/301/501 = 14/25/40 beurten per speler): als de hoorn klinkt telt de score —
                        terreinen + continentpunten. Gelijkstand → tiebreak.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🗺️ De verdeling</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Alle 40 terreinen worden eerlijk gedeeld: elk terrein start met 2 legers van zijn eigenaar.
                        Blijft er een terrein over, dan blijft het <strong>leeg</strong> (neutraal) — wie hem eerst raakt, claimt hem.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🎲 Je beurt</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        <strong>3 darts per beurt, +1 dart per 6 eigen terreinen</strong> (minimaal 3, ook in ballingschap).
                        Continenten geven geen bonusdarts. Je budget staat vóór elke beurt op het scherm. Te vroeg klaar? Met
                        <strong>End turn</strong> spaar je de resterende darts voor je volgende beurt — ze stapelen op.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🎯 Reikwijdte</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Je darts tellen alleen op <strong>eigen terrein</strong> of terrein dat <strong>daaraan grenst</strong>
                        (de groene rand op het bord). Treffers buiten je bereik zijn <strong>dode darts</strong> — je pijl is weg,
                        maar er gebeurt niets. Ballingen mogen overal gooien om terug te keren. Bull (25/50) telt altijd.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🏹 Werpen</h3>
                    <ul class="text-zinc-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
                        <li><strong>Single</strong> — +1 leger op het terrein waar je raakt (binnen- en buitenring zijn aparte terreinen)</li>
                        <li><strong>Treble</strong> — +2 legers op het <em>binnenste</em> terrein van de sector</li>
                        <li><strong>Double</strong> — +2 legers op het <em>buitenste</em> terrein van de sector</li>
                        <li><strong>Mis</strong> (zwarte rand) — je dart is weg</li>
                    </ul>
                </section>

                <section>
                    <h3 class="font-bold mb-1">⚔️ Vechten</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Raak een <strong>leeg terrein</strong> → direct van jou. <strong>Eigen terrein</strong> → legers erbij.
                        <strong>Vijandelijk terrein</strong> → legers eraf; op 0 legers is het <strong>veroverd</strong> (er blijft 1 leger van jou staan).
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🃏 Territoriumkaarten</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Elke verovering (leeg terrein claimen of vijandelijk terrein flippen) levert <strong>1 kaart</strong> op.
                        Hamsteren mag — zonder limiet. Lever op een willekeurig moment in je beurt <strong>3 kaarten</strong> in
                        voor extra darts, direct in je pool:
                    </p>
                    <ul class="text-zinc-600 dark:text-zinc-300 space-y-0.5 list-disc list-inside mt-1">
                        <li>3× 🪖 Infanterie = <strong>+3 darts</strong></li>
                        <li>3× 🐎 Cavalerie = <strong>+4 darts</strong></li>
                        <li>3× 💥 Artillerie = <strong>+5 darts</strong></li>
                        <li>1 van elk = <strong>+6 darts</strong></li>
                    </ul>
                    <p class="text-zinc-600 dark:text-zinc-300 mt-1">
                        ⭐ Jokers zijn wild en betalen altijd de beste combi. Elke set die je deze game al indeleverde maakt de
                        volgende <strong>+1 dart</strong> waard. Het deck (42 kaarten) is eindig — op = op, zoals in echt Risk.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">⚡ Het Arsenaal (bull)</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Bull (25) levert <strong>+2 extra darts</strong>, bullseye (50) <strong>+3</strong> — meteen beschikbaar in
                        deze beurt. Houd je aan het eind darts over, dan gaan die automatisch mee naar je volgende beurt.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🚫 Ballingschap</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Nul terreinen = verbannen. <strong>Verover één terrein</strong> (haal het op 0 legers) om terug te keren in het spel.
                    </p>
                </section>

                <section>
                    <h3 class="font-bold mb-1">🏁 Scoren bij Clock</h3>
                    <p class="text-zinc-600 dark:text-zinc-300">
                        Score = aantal terreinen + continentpunten: Noord-Amerika 2 · Zuid-Amerika 3 · Europa 3 · Afrika 3 · Azië 5 · Oceanië 3.
                    </p>
                </section>
            </div>
        </div>
    </div>
{/if}
