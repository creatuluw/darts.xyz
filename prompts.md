when in http://localhost:5173/match/setup i want the start match button with info text to be in the top-right of the Match Format panel

###################################################################

also the rules for taking turns are:

- every leg the player who did not start the previous leg will start
- when a new set starts the player who did not start the previous set starts the new set

Analyze if we have implemented this logic like this

###################################################################

i want you to simulate the following flow of playing a game:

- choose 501 with 3 legs per set and play 3 sets with two players
- simulate the turns using all turn-leg-set-match logic
- check on every turn, leg, set and match if the data at these checkpoints is valid, accurate and complete and if it aligns with the gameplay and rules for the darts match of choice
- document all logic from the gameplay and simulation step by step to reference in the future
- store the document in docs\gameplay-e2e.md
- in the doc start with the high level explanation of how the logic works from a players perspective and then explain all code logic step by step on every step along the way

###################################################################

Change the name of the button with: "Submit Turn" into: Sla op
