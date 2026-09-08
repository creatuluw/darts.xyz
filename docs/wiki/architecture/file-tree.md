---
type: Artifact
title: File tree
description: Complete project file listing with per-file descriptions.
timestamp: "2026-09-07T19:11:02.020Z"
---

# File tree — generated 2026-09-07T19:11:02.042Z
# Respects .wiki_ignore exclusions.
# [description] — shorthand summary of each file's function

.
├── .codebase-graph/ — Output of the codebase-graph skill — a knowledge graph of this repo
│   ├── AGENTS.md.check — Integrity marker used by the codebase-graph skill to detect a valid graph build
│   ├── build.log — Log from the last codebase-graph build
│   ├── file-tree.md — Generated file-tree report from the codebase-graph build
│   ├── files.json — Inventory of indexed source files
│   ├── graph.json — Entities/relations knowledge graph of the codebase
│   ├── index.md — Human-readable index of the codebase graph (counts, entry points)
│   ├── summaries_cache.json — Cached per-file LLM summaries used to speed up rebuilds
├── .git/ — Git repository metadata
│   ├── hooks/ — Sample git hooks (inactive defaults from git init)
│   │   ├── applypatch-msg.sample — Inactive sample git hook shipped with git init
│   │   ├── commit-msg.sample — Inactive sample git hook shipped with git init
│   │   ├── fsmonitor-watchman.sample — Inactive sample git hook shipped with git init
│   │   ├── post-update.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-applypatch.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-commit.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-merge-commit.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-push.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-rebase.sample — Inactive sample git hook shipped with git init
│   │   ├── pre-receive.sample — Inactive sample git hook shipped with git init
│   │   ├── prepare-commit-msg.sample — Inactive sample git hook shipped with git init
│   │   ├── push-to-checkout.sample — Inactive sample git hook shipped with git init
│   │   ├── sendemail-validate.sample — Inactive sample git hook shipped with git init
│   │   ├── update.sample — Inactive sample git hook shipped with git init
│   ├── info/ — Git repo info
│   │   ├── exclude — Per-repo ignore patterns (like .gitignore)
│   │   ├── refs — Packed refs advertisement for dumb HTTP
│   ├── logs/ — Reflogs (ref update history)
│   │   ├── refs/ — Reflog directory (ref update logs)
│   │   │   ├── heads/ — Local branch reflogs
│   │   │   │   ├── master — Reflog of local master branch
│   │   │   ├── remotes/ — Remote-tracking reflogs
│   │   │       ├── origin/ — Reflogs for origin
│   │   │           ├── master — Reflog of remote-tracking origin/master
│   │   ├── HEAD — Reflog of HEAD movements
│   ├── objects/ — Git object database
│   │   ├── 01/ — Loose-object fan-out bucket
│   │   │   ├── 3c78c20d3a92d4d9f17a3ebe49fce4d35b374c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 03/ — Loose-object fan-out bucket
│   │   │   ├── 3265b184c4d51e09298e0ff56a0c32d87c304a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 04/ — Loose-object fan-out bucket
│   │   │   ├── 98fc406397de3dd5940e6e1d6eac1f7cdce45b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e5b09cbe57dfcc959fb80a4d5eecf94681b489 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 08/ — Loose-object fan-out bucket
│   │   │   ├── 1bbf3dd05d75911c1e8a487d836e40a846adec — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 90e647f6cd4e15097c7c63e450e4153f13e245 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e2a1f7cee4b1e70422e46d73abac91c3d0235b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 09/ — Loose-object fan-out bucket
│   │   │   ├── bc4381ae070d93c45be969d1dc1d2faf3bd1e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 0a/ — Loose-object fan-out bucket
│   │   │   ├── 0c4076905715045f1b20596881d766349bf9d8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8dced92226bb6e10ba9cf9af12fc8371d26522 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 0b/ — Loose-object fan-out bucket
│   │   │   ├── fe3fb6af9a74e7e336301631b0989fe148f8c6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 0c/ — Loose-object fan-out bucket
│   │   │   ├── ac37acc45498f177317bc98aa45f0c4b90d59d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 0e/ — Loose-object fan-out bucket
│   │   │   ├── 94b933510957eea6da5a42b46ded1703c4bb1c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 0f/ — Loose-object fan-out bucket
│   │   │   ├── b88173658c61c2eca2eb10f9073ebc0d55e3ee — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 15/ — Loose-object fan-out bucket
│   │   │   ├── 606fc143e53aa56236ed3af7b73f19a678fa0c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a9515ab5e4e6000857ad4b432f48df5a4e8202 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ad86ceede533b757770f1f6d185c19501d6ed4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 18/ — Loose-object fan-out bucket
│   │   │   ├── 016fe63b4247313e3588061a3db5b80e5734c0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── cce2a4065a7f5941ddfe6bb2eeea03b7aec850 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ed8c93a1dc6137ec43372ddf6d6d59237e3da3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 19/ — Loose-object fan-out bucket
│   │   │   ├── 0b2b70f041180c3d36990a7a5c5658d05999ac — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 1b/ — Loose-object fan-out bucket
│   │   │   ├── 997eb09769fa24b8e804e7daa017e0d85a14e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 1c/ — Loose-object fan-out bucket
│   │   │   ├── 2f5f6e227fd053dd0780d24b108f8333f145fb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 1d/ — Loose-object fan-out bucket
│   │   │   ├── cf5a20565c63f66ee4e67f0d7dd4aa513938b2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 1f/ — Loose-object fan-out bucket
│   │   │   ├── b12ab20f6303867268d57ddbfb522d83209fa4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 22/ — Loose-object fan-out bucket
│   │   │   ├── 1254e500729384296fde0b764638b80cfca636 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 2d6a5898da19f332419d4dd1c9cb8e9d441d0e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e5959464d2674eaa003b570b8b5d4f2693553c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 24/ — Loose-object fan-out bucket
│   │   │   ├── 01e71a8794517e4abcbd9ef4f096330729b6a8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 77dab9b7b57c39a77b79a6249b4508387b3fc0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 26/ — Loose-object fan-out bucket
│   │   │   ├── b70400e0a4319da1491b4861621db17265229f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d0e69442b2de1ec2bdb0563e9291de06f9274d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 28/ — Loose-object fan-out bucket
│   │   │   ├── 1cf8af1d336d431326a92f135506abbf446a05 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 526208e8a27e9c94c5b4d66d708fed69a42fb6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 29/ — Loose-object fan-out bucket
│   │   │   ├── 234f18eac88181488b9fd0fefebd4b1e88c59b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 470d5dfc64138a61154a0f4ae9096e12238a6b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 2a/ — Loose-object fan-out bucket
│   │   │   ├── f7b19c7293742fa545fca58772a5904d345531 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 2d/ — Loose-object fan-out bucket
│   │   │   ├── 0c639a2f7e514e176583670a8acd60a2c8d813 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 30/ — Loose-object fan-out bucket
│   │   │   ├── ad2c5258aca71aa3f02426264349f59cbae2e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 32/ — Loose-object fan-out bucket
│   │   │   ├── fde02787a8175ab1a83f03953ccbf2d823f6fb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 33/ — Loose-object fan-out bucket
│   │   │   ├── 0701f267d0c4207dabb1a847caf6a2a27774b1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 405ef9934634da67c77943ffe6737428f7c839 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── aa93080a7833ab1468cb1a3d22f10614e007d0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d792a0fa2ba0ce72b9d24be89b47d7acafe1c3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 34/ — Loose-object fan-out bucket
│   │   │   ├── f3650eec351cff58d4d3b111204c4bfcb14a3f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 38/ — Loose-object fan-out bucket
│   │   │   ├── 364edd6eaae59731b52ca134a8999b89745288 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 67b2a2aef824214987a47fa695d427a073c62a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 3b/ — Loose-object fan-out bucket
│   │   │   ├── 4374123c230b102402d9380264e221d2232b54 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 3f/ — Loose-object fan-out bucket
│   │   │   ├── 7d5e018dee0b31038ba727213a31d73e3ab545 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 40/ — Loose-object fan-out bucket
│   │   │   ├── 57ffaeabdf7da4f00f4f30cc965924d781d3e0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 43/ — Loose-object fan-out bucket
│   │   │   ├── 21d7c3e73ebd2550e80b00d855f736b266c668 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ecf1547c3489144383e356e62837408c248d5e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 44/ — Loose-object fan-out bucket
│   │   │   ├── 219d079f757581f59adfd0f5c1ae9051a825b2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 46/ — Loose-object fan-out bucket
│   │   │   ├── 908ca6b9b7a336bb376e8a2de05b94998855d5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 47/ — Loose-object fan-out bucket
│   │   │   ├── f2a8d86a06dfc9ea49db97e95050ac443cbfec — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 48/ — Loose-object fan-out bucket
│   │   │   ├── a0e75583f4ce7b96edab02fe4ad7ee12062c1b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 4a/ — Loose-object fan-out bucket
│   │   │   ├── 165fd52cd495d7f9ac40a14b360f136dca528b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 4d/ — Loose-object fan-out bucket
│   │   │   ├── e6d4d949f6f2994f00c26e74c032d59cbfac5e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 53/ — Loose-object fan-out bucket
│   │   │   ├── e5b7820fddec335c287c403504481eaac5e50a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 55/ — Loose-object fan-out bucket
│   │   │   ├── 5364057899982c8e12bc4e8033d77f24e07deb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── aa516e5338707e50955b3f5272e37e6c1ed385 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 57/ — Loose-object fan-out bucket
│   │   │   ├── 20cde86612576082cf706cfa933609c4ba3f30 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── da0bfaf674cca36f4345924348457d547ab375 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 58/ — Loose-object fan-out bucket
│   │   │   ├── 07ee07f9cd4bc8cc268d6c7b93d79501692a22 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 59/ — Loose-object fan-out bucket
│   │   │   ├── 2743f2e7fcb8eb62a1e4958e30de56a08f4750 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 5b/ — Loose-object fan-out bucket
│   │   │   ├── b0e5ae2cdc5819234a8eb94559009f230ae9d1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 5c/ — Loose-object fan-out bucket
│   │   │   ├── 3a7c64a314662137d690371a9f20c45ecb3a66 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 5d/ — Loose-object fan-out bucket
│   │   │   ├── b8e32df5bcb124a2af30001d53565dfd16eb81 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── bf6909648d8910633113088e1b557b816c5ce4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 5e/ — Loose-object fan-out bucket
│   │   │   ├── f5178a8c42e2c9b0fe195e467f3ba762f6d254 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 5f/ — Loose-object fan-out bucket
│   │   │   ├── 12529be4f1bd14f21d6e300e0f48cdf827d6b4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ad9881844fce02fb59307dc4f38e10bf29c46b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 61/ — Loose-object fan-out bucket
│   │   │   ├── dc4ecb647c6402401a000099c3cd6f22f8c99e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 62/ — Loose-object fan-out bucket
│   │   │   ├── b83f1e1875441d548de249f3ba016e3a7df2c3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 63/ — Loose-object fan-out bucket
│   │   │   ├── 3fe29383d673d72f5c7427f69c8977e99d70ec — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 61a7ab311ece5fdfbe4794754b95764d279fb4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 64/ — Loose-object fan-out bucket
│   │   │   ├── d8f2cc6f59380b3bb8456979ea272299372e8d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 65/ — Loose-object fan-out bucket
│   │   │   ├── 03fd2190059688c1439ee41fe11073b4d584ef — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b18dbdbdce7d2b923ac50784c9098a40596077 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 66/ — Loose-object fan-out bucket
│   │   │   ├── da448ceb82548d80eb6d1f4e14b419afe03e52 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 67/ — Loose-object fan-out bucket
│   │   │   ├── 076fa60348eff322212013e01eb7ab810da7ac — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 54a6e68e979fe9f6c8c76b8fdc83308039a8e4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 6a/ — Loose-object fan-out bucket
│   │   │   ├── 3767deffaf588c077836cd7b27fa1fba812591 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 6c/ — Loose-object fan-out bucket
│   │   │   ├── 74383af3c4f459c4a93fed661524f20493c47a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 6d/ — Loose-object fan-out bucket
│   │   │   ├── 40279ee1e9e352181dd2488cf2b48327a38439 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 70/ — Loose-object fan-out bucket
│   │   │   ├── 0611be71c6c24ee136765d523eb92fc5e3cfb0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── cccd502b378a8cf1ed2aca607836b6c41c0400 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 71/ — Loose-object fan-out bucket
│   │   │   ├── a42fecefd6f5b3f326bb98f098724ec6d9aa86 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 72/ — Loose-object fan-out bucket
│   │   │   ├── 06442dbe7e753383980b28f61bec83695b09fb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6352e7f5710d217d84799ed196f2e7c3d87326 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 74/ — Loose-object fan-out bucket
│   │   │   ├── 0e677eade2af8d88770f437ea396fd3ebfcdc7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 84673222ec801524820538143b5b29e0ab6614 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 75/ — Loose-object fan-out bucket
│   │   │   ├── 6c008b1a43ce352fbac88ea094a24b56f2459e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 78/ — Loose-object fan-out bucket
│   │   │   ├── 26a8c6a242c7f13668ddaae7b7d58cf4566312 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 7c/ — Loose-object fan-out bucket
│   │   │   ├── 0a2cf0148afd73817a91990bd1930a2037b975 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 7e/ — Loose-object fan-out bucket
│   │   │   ├── 1987cfc0da984be0204e81e3930d975e5ee9ad — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 82/ — Loose-object fan-out bucket
│   │   │   ├── 1ea75b64d53b6dadf4c2d90bde5744b5f689c5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a8cbafec62e830476b4ef090ad170ceb4bb457 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 83/ — Loose-object fan-out bucket
│   │   │   ├── 0da9a032666f9ac9be7f263f701fbd7fe33cba — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 88/ — Loose-object fan-out bucket
│   │   │   ├── 1a7623f894b37c3352428f3badfc30deb15287 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 26b2338b560d76d970f5e38a7f788ae8d9fba2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 833b01a66ed868cf93077324956a2a8dbf8371 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 97896d24c1fc795b3b705a1c6fb2b47dd5954d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 8b/ — Loose-object fan-out bucket
│   │   │   ├── 481f28c415b9680794dabb759e360551ed15ef — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 94628b85ac3d46255980f9a56ba735688f7701 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 8c/ — Loose-object fan-out bucket
│   │   │   ├── 84e708d373812c6132a5512b393126ce8b6470 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 8d/ — Loose-object fan-out bucket
│   │   │   ├── 36c5ed25a3e8527f39f9988e3f55db73c23e53 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5d4055446590faf3c3f8c12da950624c17e916 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c96e54f949d7f070456d7fb8d1dc8a2a1481ed — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 91/ — Loose-object fan-out bucket
│   │   │   ├── 61060a45129dbc2916e8287bdda92975b47ee8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── be703e89d6874e11697d457697177a9037403c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 93/ — Loose-object fan-out bucket
│   │   │   ├── 8126deb21ad2fb1ecdb89440ebc05be4e08456 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d1081098a319197c16e7a2beaf2e1bda66d03c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 94/ — Loose-object fan-out bucket
│   │   │   ├── 3104ce7bd8218f38dfc41346f94acfee64dec1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 9a/ — Loose-object fan-out bucket
│   │   │   ├── c7650e4f4ed583b4d2ba46de25f63c1f61fae1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 9b/ — Loose-object fan-out bucket
│   │   │   ├── 2afc79fc0f890c782d1068bace24f5bf219003 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 9c/ — Loose-object fan-out bucket
│   │   │   ├── 170f8d5547a23a17f0ca1d16e320ce28b0ee97 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 9d/ — Loose-object fan-out bucket
│   │   │   ├── b0c10ecb7f06c5c487454138f7075ba7045c93 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── 9e/ — Loose-object fan-out bucket
│   │   │   ├── 04291cb8e12985bb83b64ae5258e7a458821dc — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── a0/ — Loose-object fan-out bucket
│   │   │   ├── e112409fda52616ad3aa1db539904c70bb8b12 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f72184a62c3c1ca2b497361008e5582ba2b13d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── a3/ — Loose-object fan-out bucket
│   │   │   ├── 01aa03e4c5009d4764df56116011e62d668bcc — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── a5/ — Loose-object fan-out bucket
│   │   │   ├── 031531356ec2fe15c3fb64a54d60d697711f3c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── a6/ — Loose-object fan-out bucket
│   │   │   ├── 06a8a1dff83a2a6568dc3c55f3ae722e22e8e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ab/ — Loose-object fan-out bucket
│   │   │   ├── 7edc420959585ebb866c1793f8929139a69f3b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ac/ — Loose-object fan-out bucket
│   │   │   ├── 495decf0eee3dfe0359264331f96d51fa9ec11 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── af/ — Loose-object fan-out bucket
│   │   │   ├── 531ae826216185082cd4f8468583b6aba92bec — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b1/ — Loose-object fan-out bucket
│   │   │   ├── a0e12fdfd06bcbc3e50b4711c5825a0620b506 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b2/ — Loose-object fan-out bucket
│   │   │   ├── 10e1a1612abf2d671b7ed84920d29098c513f1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b4/ — Loose-object fan-out bucket
│   │   │   ├── 79860ad310fa1b3fddeed66d33caa78b5d80be — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b6/ — Loose-object fan-out bucket
│   │   │   ├── f305042828c3c5de5b68806ef7f0058a16d40a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b7/ — Loose-object fan-out bucket
│   │   │   ├── 092f84c0968dbc275f9a7bdddb55eeefaeb316 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── b8/ — Loose-object fan-out bucket
│   │   │   ├── 6ffc8c2e83bbbb16402e25a93844a917229770 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ba/ — Loose-object fan-out bucket
│   │   │   ├── 6ef498a0d7e48f62e492d69540e095ce10bfc6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── bb/ — Loose-object fan-out bucket
│   │   │   ├── a0d6cd11bdd5c628888a06595145d9167422bb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── bc/ — Loose-object fan-out bucket
│   │   │   ├── 875617e40e0ad7cdeeadcc5126e1bfa3fdff35 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── be/ — Loose-object fan-out bucket
│   │   │   ├── f07481b0b760e3be652c2ac3cfbf432a08e60a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── bf/ — Loose-object fan-out bucket
│   │   │   ├── e1bdaa8a4c4c7229a1730426e6fdd088373de5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── c2/ — Loose-object fan-out bucket
│   │   │   ├── 41cffe19ca060adf6604a9a7f156fd9ed914d4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f679f747e7b8dd1dafbdfeedda264eef8a83d7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── c3/ — Loose-object fan-out bucket
│   │   │   ├── d885407842b60db27de01074bb396649ed3bc9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── c5/ — Loose-object fan-out bucket
│   │   │   ├── 30e74f09a769e347372a90bea16bce1fd9c7f6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f7b3d7a25aa453167a84f85d98f1372b8d2d22 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── cd/ — Loose-object fan-out bucket
│   │   │   ├── 9785591c2364dc66e15d3e4051313dc855b08c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d0/ — Loose-object fan-out bucket
│   │   │   ├── 18bb80305a54fa50d3454973c24a4895c71ad2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 42292dffb49df60a7e0488a42b7554a217adbf — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d1/ — Loose-object fan-out bucket
│   │   │   ├── 7cbde899c9fb6a00e89f0a4a537976cf2bcc14 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d2/ — Loose-object fan-out bucket
│   │   │   ├── 36bacc3d6e5b9dd91f9d2cdb4d6c01ec530ee5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c239e24e783293c1a6ab1ed6fd459467c8e11e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── dfdf74a07adca810fe256217793b6050d09292 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d3/ — Loose-object fan-out bucket
│   │   │   ├── c34ba489ad8efaf6992bb9ceb3208a7e11ed41 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ca8cdbb0fff447cf8b2e40f145568900874267 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d4/ — Loose-object fan-out bucket
│   │   │   ├── 7c53c6ff3f2a4c865bef5ba5ae4c3c1ea5130a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d5/ — Loose-object fan-out bucket
│   │   │   ├── 53f1755c402491be164442a27d725cb9de07d9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ba9e183b1b3768de810844ba4307de19b9273c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── d7/ — Loose-object fan-out bucket
│   │   │   ├── e4dc66ef386bf1ee906f448ba10a6d76a88161 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── da/ — Loose-object fan-out bucket
│   │   │   ├── 6f83c9658f66dfc29f1aae3a8592675dc4ac24 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── dc/ — Loose-object fan-out bucket
│   │   │   ├── 1e080590ad4d9b634df08a76cd671850e0ed2c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── dd/ — Loose-object fan-out bucket
│   │   │   ├── 9c0a70eae43748a2a8a257ca416a38ac90795d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b6137f518b876e2929ad37555b3bd461cde2ef — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── df/ — Loose-object fan-out bucket
│   │   │   ├── 661d402ec304ee65f28e1747dace9c280a1376 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── eacd0ffad6776a544a921b58e8ea252bc49eb3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── e2/ — Loose-object fan-out bucket
│   │   │   ├── bba29adec1d26628f39b95763f4dc383e67902 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── e5/ — Loose-object fan-out bucket
│   │   │   ├── 0a2ba287042dcd97975d98d75ffbac30df3f8e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── e6/ — Loose-object fan-out bucket
│   │   │   ├── 1724b279c1f5dfc56870aaad8c8189039c78ea — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── e7/ — Loose-object fan-out bucket
│   │   │   ├── 6d10e7932bb40bddcc8973de75265448f42260 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── eb/ — Loose-object fan-out bucket
│   │   │   ├── b9d4cb73fdee84143a352ff06795276e50d977 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ed/ — Loose-object fan-out bucket
│   │   │   ├── 68e99b391232e58a21156aa3cb188eb66337f0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d6da834cabd5b034a774b0826f06382ed85eb6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ee/ — Loose-object fan-out bucket
│   │   │   ├── 24254cb34c9940d4d681d700f16a5ef631115d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── ef/ — Loose-object fan-out bucket
│   │   │   ├── 4d1691a4325848455521878753006aaec836a1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── f0/ — Loose-object fan-out bucket
│   │   │   ├── 7deb9f88d21fda9db1f8d847fecf5a13c7966d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── f1/ — Loose-object fan-out bucket
│   │   │   ├── ba437fee12ebc064d7f9ea1b94b95db8e0bf99 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── f3/ — Loose-object fan-out bucket
│   │   │   ├── 1ec61632b3001131d82c65e055223529f60445 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 904004556be5d1f9d0d2207c7f549a439dbb57 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── f6/ — Loose-object fan-out bucket
│   │   │   ├── 3eb3833a8aff09db296f9ce839bd8dec129133 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── f7/ — Loose-object fan-out bucket
│   │   │   ├── 6a318d125ac90f66fb5ccff7bce7055d5e4a63 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 7ba07d7e5c4eef5eea63e764de6b3f76d7ca02 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── fa/ — Loose-object fan-out bucket
│   │   │   ├── 1909c992e02012feb73d70f51a833eb7799725 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 9e69600c8587a33c4261a7f57d4683e76dffc1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ab80579c46dd27a80d197f68c722565e132c45 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   ├── info/ — Object-store metadata
│   │   │   ├── packs — List of available packfiles
│   │   ├── pack/ — Packed git objects
│   │       ├── multi-pack-index — Multi-pack index across all packfiles
│   │       ├── pack-8d56f852c5824a5ae6985d572e004539c6ecb74c.idx — Pack index — object offsets in the packfile
│   │       ├── pack-8d56f852c5824a5ae6985d572e004539c6ecb74c.pack — Packfile of zlib-compressed git objects
│   │       ├── pack-8d56f852c5824a5ae6985d572e004539c6ecb74c.rev — Reverse index (offset → object id)
│   │       ├── pack-bfb2146b50524cee5a6588113fff19e291846850.idx — Pack index — object offsets in the packfile
│   │       ├── pack-bfb2146b50524cee5a6588113fff19e291846850.mtimes — Cruft-pack object modification times
│   │       ├── pack-bfb2146b50524cee5a6588113fff19e291846850.pack — Packfile of zlib-compressed git objects
│   │       ├── pack-bfb2146b50524cee5a6588113fff19e291846850.rev — Reverse index (offset → object id)
│   ├── refs/ — Refs (branches, tags, remotes)
│   │   ├── heads/ — Local branch refs
│   │   │   ├── master — Local master branch tip
│   │   ├── remotes/ — Remote-tracking refs
│   │   │   ├── origin/ — Refs for the origin remote
│   │   │       ├── master — Remote-tracking ref origin/master
│   │   ├── tags/ — Tag refs (none present)
│   ├── COMMIT_EDITMSG — Text of the last commit message
│   ├── config — Repo-local git config (remote origin, branch settings)
│   ├── description — Default gitweb repo description
│   ├── FETCH_HEAD — Branch tips from the most recent fetch
│   ├── HEAD — Current branch pointer
│   ├── index — Binary staging-area index
│   ├── opencode — Marker written by the opencode agent tool
│   ├── ORIG_HEAD — Backup of pre-reset/pre-rebase HEAD
├── .llm-docs/ — LLM-optimized documentation exports (llm-docs skill output)
│   ├── codebase.md — Full-codebase dump and structured analysis report for LLM consumption
├── .opencode/ — opencode agent tooling home — config plus the skills library used to build this app
│   ├── node_modules/ — Installed opencode skill dependencies
│   ├── skills/ — Skill library (autoresearch, te9-spec, tdd-workflow, svelte5-best-practices, …) used during development
│   │   ├── .agents/ — Directory of the text-to-speech skill (TTS reference skill)
│   │   │   ├── skills/ — Directory of the text-to-speech skill (TTS reference skill)
│   │   │       ├── text-to-speech/ — Directory of the text-to-speech skill (TTS reference skill)
│   │   │           ├── references/ — Directory of the text-to-speech skill (TTS reference skill)
│   │   │           │   ├── installation.md — Reference doc for the text-to-speech skill
│   │   │           │   ├── streaming.md — Reference doc for the text-to-speech skill
│   │   │           │   ├── voice-settings.md — Reference doc for the text-to-speech skill
│   │   │           ├── SKILL.md — Instructions for the text-to-speech skill (TTS reference skill)
│   │   ├── .archive/ — Directory of the archived skill (opencode skill)
│   │   │   ├── codebase-context/ — Directory of the codebase-context skill (archived codebase-context skill)
│   │   │   │   ├── evals/ — Evals for the codebase-context skill
│   │   │   │   │   ├── evals.json — Eval cases for the codebase-context skill
│   │   │   │   ├── README.md — Readme for the codebase-context skill
│   │   │   │   ├── SKILL.md — Instructions for the codebase-context skill (archived codebase-context skill)
│   │   │   ├── codebase-documenter/ — Directory of the codebase-documenter skill (archived codebase documenter skill)
│   │   │   │   ├── assets/ — Directory of the codebase-documenter skill (archived codebase documenter skill)
│   │   │   │   │   ├── templates/ — Asset for the codebase-documenter skill
│   │   │   │   │       ├── API.template.md — Asset for the codebase-documenter skill
│   │   │   │   │       ├── ARCHITECTURE.template.md — Asset for the codebase-documenter skill
│   │   │   │   │       ├── CODE_COMMENTS.template.md — Asset for the codebase-documenter skill
│   │   │   │   │       ├── README.template.md — Asset for the codebase-documenter skill
│   │   │   │   ├── references/ — Directory of the codebase-documenter skill (archived codebase documenter skill)
│   │   │   │   │   ├── documentation_guidelines.md — Reference doc for the codebase-documenter skill
│   │   │   │   │   ├── visual_aids_guide.md — Reference doc for the codebase-documenter skill
│   │   │   │   ├── index.js — Directory of the codebase-documenter skill (archived codebase documenter skill)
│   │   │   │   ├── package.json — Directory of the codebase-documenter skill (archived codebase documenter skill)
│   │   │   │   ├── SKILL.md — Instructions for the codebase-documenter skill (archived codebase documenter skill)
│   │   │   ├── codebase-to-course/ — Directory of the codebase-to-course skill (archived codebase-to-course skill)
│   │   │   │   ├── references/ — Directory of the codebase-to-course skill (archived codebase-to-course skill)
│   │   │   │   │   ├── design-system.md — Reference doc for the codebase-to-course skill
│   │   │   │   │   ├── interactive-elements.md — Reference doc for the codebase-to-course skill
│   │   │   │   ├── README.md — Readme for the codebase-to-course skill
│   │   │   │   ├── SKILL.md — Instructions for the codebase-to-course skill (archived codebase-to-course skill)
│   │   │   ├── karpathy-examples.md — Documentation for the karpathy-examples.md skill
│   │   │   ├── karpathy-guidelines.md — Documentation for the karpathy-guidelines.md skill
│   │   │   ├── karpathy-readme.md — Documentation for the karpathy-readme.md skill
│   │   ├── agent-browser/ — Directory of the agent-browser skill (browser automation (snapshot, auth, recording))
│   │   │   ├── references/ — Directory of the agent-browser skill (browser automation (snapshot, auth, recording))
│   │   │   │   ├── authentication.md — Reference doc for the agent-browser skill
│   │   │   │   ├── commands.md — Reference doc for the agent-browser skill
│   │   │   │   ├── proxy-support.md — Reference doc for the agent-browser skill
│   │   │   │   ├── session-management.md — Reference doc for the agent-browser skill
│   │   │   │   ├── snapshot-refs.md — Reference doc for the agent-browser skill
│   │   │   │   ├── video-recording.md — Reference doc for the agent-browser skill
│   │   │   ├── templates/ — Directory of the agent-browser skill (browser automation (snapshot, auth, recording))
│   │   │   │   ├── authenticated-session.sh — Shell script template for the agent-browser skill
│   │   │   │   ├── capture-workflow.sh — Shell script template for the agent-browser skill
│   │   │   │   ├── form-automation.sh — Shell script template for the agent-browser skill
│   │   │   ├── SKILL.md — Instructions for the agent-browser skill (browser automation (snapshot, auth, recording))
│   │   ├── agent-skill-creator/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   ├── Dynamous/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   ├── Content-Ideation/ — Source material for the agent-skill-creator skill
│   │   │   │   │   ├── agent-skill-creator-full-brief.md — Source material for the agent-skill-creator skill
│   │   │   │   │   ├── vscode-copilot-simulation.txt — Source material for the agent-skill-creator skill
│   │   │   │   ├── Agent_Skill_Creator.pdf — Source material for the agent-skill-creator skill
│   │   │   │   ├── agentskillimage.png — Source material for the agent-skill-creator skill
│   │   │   ├── exports/ — Exported skill packages (agent-skill-creator)
│   │   │   ├── references/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   ├── examples/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   │   ├── stock-analyzer/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   │       ├── scripts/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   │       │   ├── main.py — Helper script for the agent-skill-creator skill
│   │   │   │   │       ├── README.md — Reference doc for the agent-skill-creator skill
│   │   │   │   │       ├── requirements.txt — Text file bundled with the skill
│   │   │   │   │       ├── SKILL.md — Instructions for the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   ├── templates/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   │   ├── README-activation-template.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── agentdb-integration.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── architecture-guide.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── cross-platform-guide.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── export-guide.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── interactive-mode.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── multi-agent-guide.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── phase1-discovery.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── phase2-design.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── phase3-architecture.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── phase4-detection.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── phase5-implementation.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── pipeline-phases.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── quality-standards.md — Reference doc for the agent-skill-creator skill
│   │   │   │   ├── templates-guide.md — Reference doc for the agent-skill-creator skill
│   │   │   ├── registry/ — Local skill registry for agent-skill-creator
│   │   │   │   ├── skills/ — Local skill registry for agent-skill-creator
│   │   │   │   ├── registry.json — Local skill registry for agent-skill-creator
│   │   │   ├── scripts/ — Directory of the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   │   │   ├── bootstrap.sh — Helper script for the agent-skill-creator skill
│   │   │   │   ├── export_utils.py — Helper script for the agent-skill-creator skill
│   │   │   │   ├── install-skill.sh — Helper script for the agent-skill-creator skill
│   │   │   │   ├── install-template.sh — Helper script for the agent-skill-creator skill
│   │   │   │   ├── security_scan.py — Helper script for the agent-skill-creator skill
│   │   │   │   ├── skill_registry.py — Helper script for the agent-skill-creator skill
│   │   │   │   ├── staleness_check.py — Helper script for the agent-skill-creator skill
│   │   │   │   ├── validate.py — Helper script for the agent-skill-creator skill
│   │   │   ├── install.sh — Shell helper for the agent-skill-creator skill
│   │   │   ├── README.md — Readme for the agent-skill-creator skill
│   │   │   ├── SKILL.md — Instructions for the agent-skill-creator skill (meta-skill for authoring new skills)
│   │   ├── autoresearch/ — Directory of the autoresearch skill (automated multi-source research workflow)
│   │   │   ├── SKILL.md — Instructions for the autoresearch skill (automated multi-source research workflow)
│   │   ├── codebase-graph/ — Directory of the codebase-graph skill (builds a codebase knowledge graph)
│   │   │   ├── references/ — Directory of the codebase-graph skill (builds a codebase knowledge graph)
│   │   │   │   ├── queries.md — Reference doc for the codebase-graph skill
│   │   │   │   ├── schema.yaml — Directory of the codebase-graph skill (builds a codebase knowledge graph)
│   │   │   │   ├── test_cases.md — Reference doc for the codebase-graph skill
│   │   │   ├── scripts/ — Directory of the codebase-graph skill (builds a codebase knowledge graph)
│   │   │   │   ├── codebase-graph.py — Helper script for the codebase-graph skill
│   │   │   │   ├── requirements.txt — Helper script for the codebase-graph skill
│   │   │   ├── README.md — Readme for the codebase-graph skill
│   │   │   ├── SKILL.md — Instructions for the codebase-graph skill (builds a codebase knowledge graph)
│   │   ├── commands/ — Directory of the autoresearch skill (automated multi-source research workflow)
│   │   │   ├── autoresearch.md — Documentation for the autoresearch skill
│   │   ├── course-creator/ — Directory of the course-creator skill (turns content into courses)
│   │   │   ├── SKILL.md — Instructions for the course-creator skill (turns content into courses)
│   │   ├── documentation-writing/ — Directory of the documentation-writing skill (documentation authoring guidance)
│   │   │   ├── SKILL.md — Instructions for the documentation-writing skill (documentation authoring guidance)
│   │   ├── endpoint-inspect/ — Directory of the endpoint-inspect skill (API endpoint inspection workflow)
│   │   │   ├── references/ — Directory of the endpoint-inspect skill (API endpoint inspection workflow)
│   │   │   │   ├── karpathy-examples.md — Reference doc for the endpoint-inspect skill
│   │   │   │   ├── karpathy-guidelines.md — Reference doc for the endpoint-inspect skill
│   │   │   │   ├── karpathy-readme.md — Reference doc for the endpoint-inspect skill
│   │   │   ├── SKILL.md — Instructions for the endpoint-inspect skill (API endpoint inspection workflow)
│   │   ├── formbricks-mgr/ — Directory of the formbricks-mgr skill (Formbricks survey management)
│   │   │   ├── SKILL.md — Instructions for the formbricks-mgr skill (Formbricks survey management)
│   │   ├── llm-docs/ — Directory of the llm-docs skill (generates LLM-optimized codebase docs)
│   │   │   ├── assets/ — Directory of the llm-docs skill (generates LLM-optimized codebase docs)
│   │   │   ├── references/ — Directory of the llm-docs skill (generates LLM-optimized codebase docs)
│   │   │   │   ├── analysis-patterns.md — Reference doc for the llm-docs skill
│   │   │   │   ├── endpoint-patterns.md — Reference doc for the llm-docs skill
│   │   │   ├── scripts/ — Directory of the llm-docs skill (generates LLM-optimized codebase docs)
│   │   │   ├── SKILL.md — Instructions for the llm-docs skill (generates LLM-optimized codebase docs)
│   │   ├── mastering-typescript/ — Directory of the mastering-typescript skill (advanced TypeScript guidance)
│   │   │   ├── assets/ — Directory of the mastering-typescript skill (advanced TypeScript guidance)
│   │   │   │   ├── eslint-template.js — Asset for the mastering-typescript skill
│   │   │   │   ├── tsconfig-template.json — Asset for the mastering-typescript skill
│   │   │   ├── references/ — Directory of the mastering-typescript skill (advanced TypeScript guidance)
│   │   │   │   ├── enterprise-patterns.md — Reference doc for the mastering-typescript skill
│   │   │   │   ├── generics.md — Reference doc for the mastering-typescript skill
│   │   │   │   ├── nestjs-integration.md — Reference doc for the mastering-typescript skill
│   │   │   │   ├── react-integration.md — Reference doc for the mastering-typescript skill
│   │   │   │   ├── toolchain.md — Reference doc for the mastering-typescript skill
│   │   │   │   ├── type-system.md — Reference doc for the mastering-typescript skill
│   │   │   ├── scripts/ — Directory of the mastering-typescript skill (advanced TypeScript guidance)
│   │   │   │   ├── validate-setup.sh — Helper script for the mastering-typescript skill
│   │   │   ├── SKILL.md — Instructions for the mastering-typescript skill (advanced TypeScript guidance)
│   │   ├── modern-frontend-design/ — Directory of the modern-frontend-design skill (frontend design guidance)
│   │   │   ├── evals/ — Evals for the modern-frontend-design skill
│   │   │   │   ├── evals.json — Eval cases for the modern-frontend-design skill
│   │   │   ├── references/ — Directory of the modern-frontend-design skill (frontend design guidance)
│   │   │   │   ├── design-systems.md — Reference doc for the modern-frontend-design skill
│   │   │   ├── SKILL.md — Instructions for the modern-frontend-design skill (frontend design guidance)
│   │   ├── ontology/ — Directory of the ontology skill (project ontology/knowledge modeling)
│   │   │   ├── references/ — Directory of the ontology skill (project ontology/knowledge modeling)
│   │   │   │   ├── queries.md — Reference doc for the ontology skill
│   │   │   │   ├── schema.md — Reference doc for the ontology skill
│   │   │   ├── scripts/ — Directory of the ontology skill (project ontology/knowledge modeling)
│   │   │   │   ├── ontology.py — Helper script for the ontology skill
│   │   │   ├── SKILL.md — Instructions for the ontology skill (project ontology/knowledge modeling)
│   │   ├── opencode-infinite-loop/ — Directory of the opencode-infinite-loop skill (spec-driven agent build loop)
│   │   │   ├── assets/ — Directory of the opencode-infinite-loop skill (spec-driven agent build loop)
│   │   │   ├── references/ — Directory of the opencode-infinite-loop skill (spec-driven agent build loop)
│   │   │   │   ├── agents-md-template.md — Reference doc for the opencode-infinite-loop skill
│   │   │   │   ├── opencode-config-template.json — Directory of the opencode-infinite-loop skill (spec-driven agent build loop)
│   │   │   │   ├── run-loop-template.sh — Shell helper for the opencode-infinite-loop skill
│   │   │   │   ├── spec-template.md — Reference doc for the opencode-infinite-loop skill
│   │   │   ├── SKILL.md — Instructions for the opencode-infinite-loop skill (spec-driven agent build loop)
│   │   ├── plugins/ — Directory of the plugins skill (opencode skill)
│   │   │   ├── autoresearch-context.ts — TypeScript source for the plugins skill
│   │   ├── pocketbase-best-practices/ — Directory of the pocketbase-best-practices skill (PocketBase patterns and rules)
│   │   │   ├── references/ — Directory of the pocketbase-best-practices skill (PocketBase patterns and rules)
│   │   │   │   ├── api-rules-security.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── authentication.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── collection-design.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── file-handling.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── production-deployment.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── query-performance.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── realtime.md — Reference doc for the pocketbase-best-practices skill
│   │   │   │   ├── sdk-usage.md — Reference doc for the pocketbase-best-practices skill
│   │   │   ├── rules/ — Rule fragments for the pocketbase-best-practices skill
│   │   │   │   ├── _sections.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── _template.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── auth-impersonation.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── auth-mfa.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── auth-oauth2.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── auth-password.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── auth-token-management.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-auth-vs-base.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-field-types.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-geopoint.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-indexes.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-relations.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── coll-view-collections.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── deploy-backup.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── deploy-configuration.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── deploy-rate-limiting.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── deploy-reverse-proxy.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── deploy-sqlite-considerations.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── file-serving.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── file-upload.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── file-validation.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-back-relations.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-batch-operations.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-expand.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-field-selection.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-first-item.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-n-plus-one.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── query-pagination.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── realtime-auth.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── realtime-events.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── realtime-reconnection.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── realtime-subscribe.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── rules-basics.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── rules-cross-collection.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── rules-filter-syntax.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── rules-locked-vs-open.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── rules-request-context.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-auth-store.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-auto-cancellation.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-error-handling.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-field-modifiers.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-filter-binding.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-initialization.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   │   ├── sdk-send-hooks.md — PocketBase rules-of-thumb fragment (used by pocketbase-best-practices)
│   │   │   ├── AGENTS.md — Documentation for the pocketbase-best-practices skill
│   │   │   ├── SKILL.md — Instructions for the pocketbase-best-practices skill (PocketBase patterns and rules)
│   │   ├── pocketbase-e2e/ — Directory of the pocketbase-e2e skill (PocketBase end-to-end testing)
│   │   │   ├── skill/ — Directory of the pocketbase-e2e skill (PocketBase end-to-end testing)
│   │   │   │   ├── references/ — Skill payload for pocketbase-e2e
│   │   │   │   │   ├── pocketbase-reference.md — Reference doc for the pocketbase-e2e skill
│   │   │   │   ├── SKILL.md — Instructions for the pocketbase-e2e skill (PocketBase end-to-end testing)
│   │   │   ├── QUICKSTART.md — Documentation for the pocketbase-e2e skill
│   │   │   ├── README.md — Readme for the pocketbase-e2e skill
│   │   │   ├── SCHEMA.md — Documentation for the pocketbase-e2e skill
│   │   ├── railway-docs/ — Directory of the railway-docs skill (Railway deployment documentation lookup)
│   │   │   ├── references/ — Directory of the railway-docs skill (Railway deployment documentation lookup)
│   │   │   │   ├── environment-config.md — Reference doc for the railway-docs skill
│   │   │   │   ├── monorepo.md — Reference doc for the railway-docs skill
│   │   │   │   ├── railpack.md — Reference doc for the railway-docs skill
│   │   │   │   ├── variables.md — Reference doc for the railway-docs skill
│   │   │   ├── SKILL.md — Instructions for the railway-docs skill (Railway deployment documentation lookup)
│   │   ├── skill-creator/ — Directory of the skill-creator skill (Anthropic skill creator toolchain)
│   │   │   ├── references/ — Directory of the skill-creator skill (Anthropic skill creator toolchain)
│   │   │   │   ├── output-patterns.md — Reference doc for the skill-creator skill
│   │   │   │   ├── scripts.md — Reference doc for the skill-creator skill
│   │   │   │   ├── workflows.md — Reference doc for the skill-creator skill
│   │   │   ├── scripts/ — Directory of the skill-creator skill (Anthropic skill creator toolchain)
│   │   │   │   ├── init_skill.py — Helper script for the skill-creator skill
│   │   │   │   ├── package_skill.py — Helper script for the skill-creator skill
│   │   │   │   ├── quick_validate.py — Helper script for the skill-creator skill
│   │   │   ├── .gitignore — License/ignore file bundled with the skill
│   │   │   ├── LICENSE — License/ignore file bundled with the skill
│   │   │   ├── README.md — Readme for the skill-creator skill
│   │   │   ├── SKILL.md — Instructions for the skill-creator skill (Anthropic skill creator toolchain)
│   │   ├── spec-writer/ — Directory of the spec-writer skill (spec writing workflow)
│   │   │   ├── assets/ — Directory of the spec-writer skill (spec writing workflow)
│   │   │   │   ├── spec.md — Asset for the spec-writer skill
│   │   │   ├── references/ — Directory of the spec-writer skill (spec writing workflow)
│   │   │   │   ├── spec-guide.md — Reference doc for the spec-writer skill
│   │   │   ├── SKILL.md — Instructions for the spec-writer skill (spec writing workflow)
│   │   ├── svelte5-best-practices/ — Directory of the svelte5-best-practices skill (Svelte 5 runes and SvelteKit patterns)
│   │   │   ├── references/ — Directory of the svelte5-best-practices skill (Svelte 5 runes and SvelteKit patterns)
│   │   │   │   ├── events.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── migration.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── performance.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── runes.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── snippets.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── sveltekit.md — Reference doc for the svelte5-best-practices skill
│   │   │   │   ├── typescript.md — Reference doc for the svelte5-best-practices skill
│   │   │   ├── SKILL.md — Instructions for the svelte5-best-practices skill (Svelte 5 runes and SvelteKit patterns)
│   │   ├── sveltekit-svelte5-tailwind-skill/ — Directory of the sveltekit-svelte5-tailwind-skill skill (SvelteKit + Svelte 5 + Tailwind docs bundle)
│   │   │   ├── docs/ — Directory of the sveltekit-svelte5-tailwind-skill skill (SvelteKit + Svelte 5 + Tailwind docs bundle)
│   │   │   │   ├── adapters-reference.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── advanced-routing.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── advanced-ssr.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── index.jsonl — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── index.meta.json — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── integration-patterns.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── sections.jsonl — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── svelte5-api-reference.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── sveltekit-configuration.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── tailwind-configuration.md — Bundled documentation for the sveltekit-svelte5-tailwind-skill skill
│   │   │   ├── references/ — Directory of the sveltekit-svelte5-tailwind-skill skill (SvelteKit + Svelte 5 + Tailwind docs bundle)
│   │   │   │   ├── best-practices.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── common-issues.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── data-loading.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── deployment-guide.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── documentation-search-system.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── forms-and-actions.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── getting-started.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── index.jsonl — Indexed doc data for the sveltekit docs bundle
│   │   │   │   ├── index.meta.json — Directory of the sveltekit-svelte5-tailwind-skill skill (SvelteKit + Svelte 5 + Tailwind docs bundle)
│   │   │   │   ├── migration-svelte4-to-5.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── performance-optimization.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── project-setup.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── routing-patterns.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── sections.jsonl — Indexed doc data for the sveltekit docs bundle
│   │   │   │   ├── server-rendering.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── styling-patterns.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── styling-with-tailwind.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── svelte5-runes.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── tailwind-v4-migration.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   │   ├── troubleshooting.md — Reference doc for the sveltekit-svelte5-tailwind-skill skill
│   │   │   ├── .gitignore — License/ignore file bundled with the skill
│   │   │   ├── provenance.jsonl — Indexed doc data for the sveltekit docs bundle
│   │   │   ├── README.md — Readme for the sveltekit-svelte5-tailwind-skill skill
│   │   │   ├── skill.manifest.json — Manifest for the sveltekit docs skill bundle
│   │   │   ├── SKILL.md — Instructions for the sveltekit-svelte5-tailwind-skill skill (SvelteKit + Svelte 5 + Tailwind docs bundle)
│   │   ├── taste-skills/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── design-taste-frontend/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── full-output-enforcement/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── high-end-visual-design/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── industrial-brutalist-ui/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── minimalist-ui/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── redesign-existing-projects/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   │   ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │   ├── stitch-design-taste/ — Directory of the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   │       ├── DESIGN.md — Documentation for the taste-skills skill
│   │   │       ├── SKILL.md — Instructions for the taste-skills skill (design-taste sub-skills (minimalist, brutalist, …))
│   │   ├── tdd-workflow/ — Directory of the tdd-workflow skill (red-green-refactor TDD workflow)
│   │   │   ├── SKILL.md — Instructions for the tdd-workflow skill (red-green-refactor TDD workflow)
│   │   ├── te9-spec/ — Directory of the te9-spec skill (6-step spec-driven development workflow)
│   │   │   ├── SKILL.md — Instructions for the te9-spec skill (6-step spec-driven development workflow)
│   │   ├── user-guide-writing/ — Directory of the user-guide-writing skill (user-facing guide writing)
│   │   │   ├── SKILL.md — Instructions for the user-guide-writing skill (user-facing guide writing)
│   │   │   ├── SKILL.toon — Directory of the user-guide-writing skill (user-facing guide writing)
│   │   ├── web-research/ — Directory of the web-research skill (web research and cited reports)
│   │   │   ├── SKILL.md — Instructions for the web-research skill (web research and cited reports)
│   │   ├── .architecture.md — Notes on how the skills library is organized
│   │   ├── autoresearch-dashboard.md — Autoresearch dashboard documentation
│   │   ├── autoresearch.md — Autoresearch command/skill documentation
│   │   ├── README.md — Index/readme of the skills library
│   │   ├── skills-lock.json — Pinned versions of installed skills
│   │   ├── tailwind-v4-integration.md — Notes on Tailwind v4 integration with SvelteKit
│   ├── .gitignore — Ignore rules for the opencode folder
│   ├── bun.lock — Bun lockfile for opencode packages
│   ├── package-lock.json — Lockfile for opencode skill packages
│   ├── package.json — Manifest for opencode skill packages
├── .pi/ — pi coding-agent session data for this project
│   ├── todos/ — pi agent todo store (task files for in-flight sessions)
├── .specs/ — Spec-driven development outputs (te9-spec workflow)
│   ├── darts-501-app/ — Spec + task breakdown for the darts-501 app feature set
│       ├── spec.md — Full application specification — tech stack, success criteria, data model, match/stat rules, API surface
│       ├── tasks.json — Machine-readable task list and progress from the spec workflow
│   ├── trebles-and-territories/ — Conquest mode (Trebles & Territories) implementation spec
│       ├── spec.html — Self-contained HTML spec — locked rules, preset ladder 51–1501, state-board visual language, LLM commentator + recap-video pipelines, milestones M1–M6
├── .svelte-kit/ — SvelteKit generated artifacts — dev code, build output, route types
│   ├── adapter-node/ — adapter-node scratch directory during build
│   ├── generated/ — SvelteKit-generated dev/build artifacts
│   │   ├── client/ — Generated dev-time client code
│   │   │   ├── nodes/ — Per-route client node chunks (dev)
│   │   │   │   ├── 0.js — Dev-time client bundle for a route node
│   │   │   │   ├── 1.js — Dev-time client bundle for a route node
│   │   │   │   ├── 10.js — Dev-time client bundle for a route node
│   │   │   │   ├── 2.js — Dev-time client bundle for a route node
│   │   │   │   ├── 3.js — Dev-time client bundle for a route node
│   │   │   │   ├── 4.js — Dev-time client bundle for a route node
│   │   │   │   ├── 5.js — Dev-time client bundle for a route node
│   │   │   │   ├── 6.js — Dev-time client bundle for a route node
│   │   │   │   ├── 7.js — Dev-time client bundle for a route node
│   │   │   │   ├── 8.js — Dev-time client bundle for a route node
│   │   │   │   ├── 9.js — Dev-time client bundle for a route node
│   │   │   ├── app.js — Generated client app bootstrap (dev)
│   │   │   ├── matchers.js — Generated route param matchers (dev)
│   │   ├── client-optimized/ — Build-optimized client manifests
│   │   │   ├── nodes/ — Optimized per-route client nodes
│   │   │   │   ├── 0.js — Optimized client bundle for a route node
│   │   │   │   ├── 1.js — Optimized client bundle for a route node
│   │   │   │   ├── 10.js — Optimized client bundle for a route node
│   │   │   │   ├── 2.js — Optimized client bundle for a route node
│   │   │   │   ├── 3.js — Optimized client bundle for a route node
│   │   │   │   ├── 4.js — Optimized client bundle for a route node
│   │   │   │   ├── 5.js — Optimized client bundle for a route node
│   │   │   │   ├── 6.js — Optimized client bundle for a route node
│   │   │   │   ├── 7.js — Optimized client bundle for a route node
│   │   │   │   ├── 8.js — Optimized client bundle for a route node
│   │   │   │   ├── 9.js — Optimized client bundle for a route node
│   │   │   ├── app.js — Optimized client app bootstrap
│   │   │   ├── matchers.js — Optimized route matchers
│   │   ├── server/ — Generated server-side runtime code
│   │   │   ├── internal.js — SvelteKit server runtime internals
│   │   ├── root.js — Generated server root module
│   │   ├── root.svelte — Generated root Svelte component
│   ├── output/ — Production build output before adapter packaging
│   │   ├── client/ — Built client assets
│   │   │   ├── _app/ — SvelteKit client build output
│   │   │   │   ├── immutable/ — Hashed (cache-forever) build assets
│   │   │   │   │   ├── assets/ — Hashed stylesheets and binaries
│   │   │   │   │   │   ├── 0.c-dZPB88.css — Hashed build stylesheet
│   │   │   │   │   │   ├── loading.B1wEwenN.css — Hashed build stylesheet
│   │   │   │   │   │   ├── ort-wasm-simd-threaded.jsep.B0T3yYHD.wasm — onnxruntime WASM binary bundled for kokoro-js in-browser TTS
│   │   │   │   │   ├── chunks/ — Hashed shared JS chunks
│   │   │   │   │   │   ├── 5hNENXus.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── B0e0CHJU.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── Bk84T0jC.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── BpAUpWCQ.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── CDaU1PbN.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── CG2OZ9zf.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── CKMIm72z.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── CMV2jJ5w.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── DkMlwcDI.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── DmXAgxnj.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── DshIPtwZ.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── DxdL7MUY.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── HjMtZPdE.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── PPVm8Dsz.js — Hashed shared JS chunk
│   │   │   │   │   │   ├── wYxFpm2k.js — Hashed shared JS chunk
│   │   │   │   │   ├── entry/ — Client entry chunks
│   │   │   │   │   │   ├── app.CcuxAeJs.js — Client entry chunk (app/start)
│   │   │   │   │   │   ├── start.Jn6kl7eR.js — Client entry chunk (app/start)
│   │   │   │   │   ├── nodes/ — Hashed per-route JS
│   │   │   │   │       ├── 0.CaGiQ0Vj.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 1.CKotg3a3.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 10.DgJp_iqY.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 2.BtmUcHS6.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 3.Br--_X4b.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 4.BZnzg7Wu.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 5.BYYoli23.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 6.CMAF3v-s.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 7.PZAqSzxo.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 8.D4apKXAX.js — Hashed per-route JS chunk
│   │   │   │   │       ├── 9.DfMHmRlc.js — Hashed per-route JS chunk
│   │   │   │   ├── version.json — Build version stamp for cache busting
│   │   │   ├── .vite/ — Vite build metadata
│   │   │   │   ├── manifest.json — Vite client build manifest
│   │   │   ├── audio/ — static/audio copied into the client build
│   │   │   │   ├── .archive/ — Experimental 180-call takes kept for reference
│   │   │   │   │   ├── 180-test-dramatic.1.mp3 — Experimental one-off 180 call take
│   │   │   │   │   ├── 180-test-scottish.mp3 — Experimental one-off 180 call take
│   │   │   │   │   ├── 180-test-scream.1.mp3 — Experimental one-off 180 call take
│   │   │   │   │   ├── 180-test-slow.1.mp3 — Experimental one-off 180 call take
│   │   │   │   │   ├── 180-test.1.mp3 — Experimental one-off 180 call take
│   │   │   │   ├── bust.mp3 — Caller clip for the "bust" event
│   │   │   │   ├── century.mp3 — Caller clip for the "century" event
│   │   │   │   ├── change-of-throw.mp3 — Caller clip for the "change of throw" event
│   │   │   │   ├── checkout.mp3 — Caller clip for the "checkout" event
│   │   │   │   ├── first-throw.mp3 — Caller clip for the "first throw" event
│   │   │   │   ├── game-on.mp3 — Caller clip for the "game on" event
│   │   │   │   ├── high-ton.mp3 — Caller clip for the "high ton" event
│   │   │   │   ├── leg-winner.mp3 — Caller clip for the "leg winner" event
│   │   │   │   ├── match-winner.mp3 — Caller clip for the "match winner" event
│   │   │   │   ├── next-leg.mp3 — Caller clip for the "next leg" event
│   │   │   │   ├── next-set.mp3 — Caller clip for the "next set" event
│   │   │   │   ├── player1-starting.mp3 — Caller clip for the "player1 starting" event
│   │   │   │   ├── player2-starting.mp3 — Caller clip for the "player2 starting" event
│   │   │   │   ├── score-0.mp3 — Caller clip announcing score 0 (default voice)
│   │   │   │   ├── score-1.mp3 — Caller clip announcing score 1 (default voice)
│   │   │   │   ├── score-10.mp3 — Caller clip announcing score 10 (default voice)
│   │   │   │   ├── score-100.mp3 — Caller clip announcing score 100 (default voice)
│   │   │   │   ├── score-101.mp3 — Caller clip announcing score 101 (default voice)
│   │   │   │   ├── score-102.mp3 — Caller clip announcing score 102 (default voice)
│   │   │   │   ├── score-103.mp3 — Caller clip announcing score 103 (default voice)
│   │   │   │   ├── score-104.mp3 — Caller clip announcing score 104 (default voice)
│   │   │   │   ├── score-105.mp3 — Caller clip announcing score 105 (default voice)
│   │   │   │   ├── score-106.mp3 — Caller clip announcing score 106 (default voice)
│   │   │   │   ├── score-107.mp3 — Caller clip announcing score 107 (default voice)
│   │   │   │   ├── score-108.mp3 — Caller clip announcing score 108 (default voice)
│   │   │   │   ├── score-109.mp3 — Caller clip announcing score 109 (default voice)
│   │   │   │   ├── score-11.mp3 — Caller clip announcing score 11 (default voice)
│   │   │   │   ├── score-110.mp3 — Caller clip announcing score 110 (default voice)
│   │   │   │   ├── score-111.mp3 — Caller clip announcing score 111 (default voice)
│   │   │   │   ├── score-112.mp3 — Caller clip announcing score 112 (default voice)
│   │   │   │   ├── score-113.mp3 — Caller clip announcing score 113 (default voice)
│   │   │   │   ├── score-114.mp3 — Caller clip announcing score 114 (default voice)
│   │   │   │   ├── score-115.mp3 — Caller clip announcing score 115 (default voice)
│   │   │   │   ├── score-116.mp3 — Caller clip announcing score 116 (default voice)
│   │   │   │   ├── score-117.mp3 — Caller clip announcing score 117 (default voice)
│   │   │   │   ├── score-118.mp3 — Caller clip announcing score 118 (default voice)
│   │   │   │   ├── score-119.mp3 — Caller clip announcing score 119 (default voice)
│   │   │   │   ├── score-12.mp3 — Caller clip announcing score 12 (default voice)
│   │   │   │   ├── score-120.mp3 — Caller clip announcing score 120 (default voice)
│   │   │   │   ├── score-121.mp3 — Caller clip announcing score 121 (default voice)
│   │   │   │   ├── score-122.mp3 — Caller clip announcing score 122 (default voice)
│   │   │   │   ├── score-123.mp3 — Caller clip announcing score 123 (default voice)
│   │   │   │   ├── score-124.mp3 — Caller clip announcing score 124 (default voice)
│   │   │   │   ├── score-125.mp3 — Caller clip announcing score 125 (default voice)
│   │   │   │   ├── score-126.mp3 — Caller clip announcing score 126 (default voice)
│   │   │   │   ├── score-127.mp3 — Caller clip announcing score 127 (default voice)
│   │   │   │   ├── score-128.mp3 — Caller clip announcing score 128 (default voice)
│   │   │   │   ├── score-129.mp3 — Caller clip announcing score 129 (default voice)
│   │   │   │   ├── score-13.mp3 — Caller clip announcing score 13 (default voice)
│   │   │   │   ├── score-130.mp3 — Caller clip announcing score 130 (default voice)
│   │   │   │   ├── score-131.mp3 — Caller clip announcing score 131 (default voice)
│   │   │   │   ├── score-132.mp3 — Caller clip announcing score 132 (default voice)
│   │   │   │   ├── score-133.mp3 — Caller clip announcing score 133 (default voice)
│   │   │   │   ├── score-134.mp3 — Caller clip announcing score 134 (default voice)
│   │   │   │   ├── score-135.mp3 — Caller clip announcing score 135 (default voice)
│   │   │   │   ├── score-136.mp3 — Caller clip announcing score 136 (default voice)
│   │   │   │   ├── score-137.mp3 — Caller clip announcing score 137 (default voice)
│   │   │   │   ├── score-138.mp3 — Caller clip announcing score 138 (default voice)
│   │   │   │   ├── score-139.mp3 — Caller clip announcing score 139 (default voice)
│   │   │   │   ├── score-14.mp3 — Caller clip announcing score 14 (default voice)
│   │   │   │   ├── score-140.mp3 — Caller clip announcing score 140 (default voice)
│   │   │   │   ├── score-141.mp3 — Caller clip announcing score 141 (default voice)
│   │   │   │   ├── score-142.mp3 — Caller clip announcing score 142 (default voice)
│   │   │   │   ├── score-143.mp3 — Caller clip announcing score 143 (default voice)
│   │   │   │   ├── score-144.mp3 — Caller clip announcing score 144 (default voice)
│   │   │   │   ├── score-145.mp3 — Caller clip announcing score 145 (default voice)
│   │   │   │   ├── score-146.mp3 — Caller clip announcing score 146 (default voice)
│   │   │   │   ├── score-147.mp3 — Caller clip announcing score 147 (default voice)
│   │   │   │   ├── score-148.mp3 — Caller clip announcing score 148 (default voice)
│   │   │   │   ├── score-149.mp3 — Caller clip announcing score 149 (default voice)
│   │   │   │   ├── score-15.mp3 — Caller clip announcing score 15 (default voice)
│   │   │   │   ├── score-150.mp3 — Caller clip announcing score 150 (default voice)
│   │   │   │   ├── score-151.mp3 — Caller clip announcing score 151 (default voice)
│   │   │   │   ├── score-152.mp3 — Caller clip announcing score 152 (default voice)
│   │   │   │   ├── score-153.mp3 — Caller clip announcing score 153 (default voice)
│   │   │   │   ├── score-154.mp3 — Caller clip announcing score 154 (default voice)
│   │   │   │   ├── score-155.mp3 — Caller clip announcing score 155 (default voice)
│   │   │   │   ├── score-156.mp3 — Caller clip announcing score 156 (default voice)
│   │   │   │   ├── score-157.mp3 — Caller clip announcing score 157 (default voice)
│   │   │   │   ├── score-158.mp3 — Caller clip announcing score 158 (default voice)
│   │   │   │   ├── score-159.mp3 — Caller clip announcing score 159 (default voice)
│   │   │   │   ├── score-16.mp3 — Caller clip announcing score 16 (default voice)
│   │   │   │   ├── score-160.mp3 — Caller clip announcing score 160 (default voice)
│   │   │   │   ├── score-161.mp3 — Caller clip announcing score 161 (default voice)
│   │   │   │   ├── score-162.mp3 — Caller clip announcing score 162 (default voice)
│   │   │   │   ├── score-163.mp3 — Caller clip announcing score 163 (default voice)
│   │   │   │   ├── score-164.mp3 — Caller clip announcing score 164 (default voice)
│   │   │   │   ├── score-165.mp3 — Caller clip announcing score 165 (default voice)
│   │   │   │   ├── score-166.mp3 — Caller clip announcing score 166 (default voice)
│   │   │   │   ├── score-167.mp3 — Caller clip announcing score 167 (default voice)
│   │   │   │   ├── score-168.mp3 — Caller clip announcing score 168 (default voice)
│   │   │   │   ├── score-169.mp3 — Caller clip announcing score 169 (default voice)
│   │   │   │   ├── score-17.mp3 — Caller clip announcing score 17 (default voice)
│   │   │   │   ├── score-170.mp3 — Caller clip announcing score 170 (default voice)
│   │   │   │   ├── score-171.mp3 — Caller clip announcing score 171 (default voice)
│   │   │   │   ├── score-172.mp3 — Caller clip announcing score 172 (default voice)
│   │   │   │   ├── score-173.mp3 — Caller clip announcing score 173 (default voice)
│   │   │   │   ├── score-174.mp3 — Caller clip announcing score 174 (default voice)
│   │   │   │   ├── score-175.mp3 — Caller clip announcing score 175 (default voice)
│   │   │   │   ├── score-176.mp3 — Caller clip announcing score 176 (default voice)
│   │   │   │   ├── score-177.mp3 — Caller clip announcing score 177 (default voice)
│   │   │   │   ├── score-178.mp3 — Caller clip announcing score 178 (default voice)
│   │   │   │   ├── score-179.mp3 — Caller clip announcing score 179 (default voice)
│   │   │   │   ├── score-18.mp3 — Caller clip announcing score 18 (default voice)
│   │   │   │   ├── score-180.mp3 — Caller clip announcing score 180 (default voice)
│   │   │   │   ├── score-19.mp3 — Caller clip announcing score 19 (default voice)
│   │   │   │   ├── score-2.mp3 — Caller clip announcing score 2 (default voice)
│   │   │   │   ├── score-20.mp3 — Caller clip announcing score 20 (default voice)
│   │   │   │   ├── score-21.mp3 — Caller clip announcing score 21 (default voice)
│   │   │   │   ├── score-22.mp3 — Caller clip announcing score 22 (default voice)
│   │   │   │   ├── score-23.mp3 — Caller clip announcing score 23 (default voice)
│   │   │   │   ├── score-24.mp3 — Caller clip announcing score 24 (default voice)
│   │   │   │   ├── score-25.mp3 — Caller clip announcing score 25 (default voice)
│   │   │   │   ├── score-26.mp3 — Caller clip announcing score 26 (default voice)
│   │   │   │   ├── score-27.mp3 — Caller clip announcing score 27 (default voice)
│   │   │   │   ├── score-28.mp3 — Caller clip announcing score 28 (default voice)
│   │   │   │   ├── score-29.mp3 — Caller clip announcing score 29 (default voice)
│   │   │   │   ├── score-3.mp3 — Caller clip announcing score 3 (default voice)
│   │   │   │   ├── score-30.mp3 — Caller clip announcing score 30 (default voice)
│   │   │   │   ├── score-31.mp3 — Caller clip announcing score 31 (default voice)
│   │   │   │   ├── score-32.mp3 — Caller clip announcing score 32 (default voice)
│   │   │   │   ├── score-33.mp3 — Caller clip announcing score 33 (default voice)
│   │   │   │   ├── score-34.mp3 — Caller clip announcing score 34 (default voice)
│   │   │   │   ├── score-35.mp3 — Caller clip announcing score 35 (default voice)
│   │   │   │   ├── score-36.mp3 — Caller clip announcing score 36 (default voice)
│   │   │   │   ├── score-37.mp3 — Caller clip announcing score 37 (default voice)
│   │   │   │   ├── score-38.mp3 — Caller clip announcing score 38 (default voice)
│   │   │   │   ├── score-39.mp3 — Caller clip announcing score 39 (default voice)
│   │   │   │   ├── score-4.mp3 — Caller clip announcing score 4 (default voice)
│   │   │   │   ├── score-40.mp3 — Caller clip announcing score 40 (default voice)
│   │   │   │   ├── score-41.mp3 — Caller clip announcing score 41 (default voice)
│   │   │   │   ├── score-42.mp3 — Caller clip announcing score 42 (default voice)
│   │   │   │   ├── score-43.mp3 — Caller clip announcing score 43 (default voice)
│   │   │   │   ├── score-44.mp3 — Caller clip announcing score 44 (default voice)
│   │   │   │   ├── score-45.mp3 — Caller clip announcing score 45 (default voice)
│   │   │   │   ├── score-46.mp3 — Caller clip announcing score 46 (default voice)
│   │   │   │   ├── score-47.mp3 — Caller clip announcing score 47 (default voice)
│   │   │   │   ├── score-48.mp3 — Caller clip announcing score 48 (default voice)
│   │   │   │   ├── score-49.mp3 — Caller clip announcing score 49 (default voice)
│   │   │   │   ├── score-5.mp3 — Caller clip announcing score 5 (default voice)
│   │   │   │   ├── score-50.mp3 — Caller clip announcing score 50 (default voice)
│   │   │   │   ├── score-51.mp3 — Caller clip announcing score 51 (default voice)
│   │   │   │   ├── score-52.mp3 — Caller clip announcing score 52 (default voice)
│   │   │   │   ├── score-53.mp3 — Caller clip announcing score 53 (default voice)
│   │   │   │   ├── score-54.mp3 — Caller clip announcing score 54 (default voice)
│   │   │   │   ├── score-55.mp3 — Caller clip announcing score 55 (default voice)
│   │   │   │   ├── score-56.mp3 — Caller clip announcing score 56 (default voice)
│   │   │   │   ├── score-57.mp3 — Caller clip announcing score 57 (default voice)
│   │   │   │   ├── score-58.mp3 — Caller clip announcing score 58 (default voice)
│   │   │   │   ├── score-59.mp3 — Caller clip announcing score 59 (default voice)
│   │   │   │   ├── score-6.mp3 — Caller clip announcing score 6 (default voice)
│   │   │   │   ├── score-60.mp3 — Caller clip announcing score 60 (default voice)
│   │   │   │   ├── score-61.mp3 — Caller clip announcing score 61 (default voice)
│   │   │   │   ├── score-62.mp3 — Caller clip announcing score 62 (default voice)
│   │   │   │   ├── score-63.mp3 — Caller clip announcing score 63 (default voice)
│   │   │   │   ├── score-64.mp3 — Caller clip announcing score 64 (default voice)
│   │   │   │   ├── score-65.mp3 — Caller clip announcing score 65 (default voice)
│   │   │   │   ├── score-66.mp3 — Caller clip announcing score 66 (default voice)
│   │   │   │   ├── score-67.mp3 — Caller clip announcing score 67 (default voice)
│   │   │   │   ├── score-68.mp3 — Caller clip announcing score 68 (default voice)
│   │   │   │   ├── score-69.mp3 — Caller clip announcing score 69 (default voice)
│   │   │   │   ├── score-7.mp3 — Caller clip announcing score 7 (default voice)
│   │   │   │   ├── score-70.mp3 — Caller clip announcing score 70 (default voice)
│   │   │   │   ├── score-71.mp3 — Caller clip announcing score 71 (default voice)
│   │   │   │   ├── score-72.mp3 — Caller clip announcing score 72 (default voice)
│   │   │   │   ├── score-73.mp3 — Caller clip announcing score 73 (default voice)
│   │   │   │   ├── score-74.mp3 — Caller clip announcing score 74 (default voice)
│   │   │   │   ├── score-75.mp3 — Caller clip announcing score 75 (default voice)
│   │   │   │   ├── score-76.mp3 — Caller clip announcing score 76 (default voice)
│   │   │   │   ├── score-77.mp3 — Caller clip announcing score 77 (default voice)
│   │   │   │   ├── score-78.mp3 — Caller clip announcing score 78 (default voice)
│   │   │   │   ├── score-79.mp3 — Caller clip announcing score 79 (default voice)
│   │   │   │   ├── score-8.mp3 — Caller clip announcing score 8 (default voice)
│   │   │   │   ├── score-80.mp3 — Caller clip announcing score 80 (default voice)
│   │   │   │   ├── score-81.mp3 — Caller clip announcing score 81 (default voice)
│   │   │   │   ├── score-82.mp3 — Caller clip announcing score 82 (default voice)
│   │   │   │   ├── score-83.mp3 — Caller clip announcing score 83 (default voice)
│   │   │   │   ├── score-84.mp3 — Caller clip announcing score 84 (default voice)
│   │   │   │   ├── score-85.mp3 — Caller clip announcing score 85 (default voice)
│   │   │   │   ├── score-86.mp3 — Caller clip announcing score 86 (default voice)
│   │   │   │   ├── score-87.mp3 — Caller clip announcing score 87 (default voice)
│   │   │   │   ├── score-88.mp3 — Caller clip announcing score 88 (default voice)
│   │   │   │   ├── score-89.mp3 — Caller clip announcing score 89 (default voice)
│   │   │   │   ├── score-9.mp3 — Caller clip announcing score 9 (default voice)
│   │   │   │   ├── score-90.mp3 — Caller clip announcing score 90 (default voice)
│   │   │   │   ├── score-91.mp3 — Caller clip announcing score 91 (default voice)
│   │   │   │   ├── score-92.mp3 — Caller clip announcing score 92 (default voice)
│   │   │   │   ├── score-93.mp3 — Caller clip announcing score 93 (default voice)
│   │   │   │   ├── score-94.mp3 — Caller clip announcing score 94 (default voice)
│   │   │   │   ├── score-95.mp3 — Caller clip announcing score 95 (default voice)
│   │   │   │   ├── score-96.mp3 — Caller clip announcing score 96 (default voice)
│   │   │   │   ├── score-97.mp3 — Caller clip announcing score 97 (default voice)
│   │   │   │   ├── score-98.mp3 — Caller clip announcing score 98 (default voice)
│   │   │   │   ├── score-99.mp3 — Caller clip announcing score 99 (default voice)
│   │   │   │   ├── scotty-bust.mp3 — Caller clip for the "bust" event (Scotty voice)
│   │   │   │   ├── scotty-century.mp3 — Caller clip for the "century" event (Scotty voice)
│   │   │   │   ├── scotty-change-of-throw.mp3 — Caller clip for the "change of throw" event (Scotty voice)
│   │   │   │   ├── scotty-checkout.mp3 — Caller clip for the "checkout" event (Scotty voice)
│   │   │   │   ├── scotty-first-throw.mp3 — Caller clip for the "first throw" event (Scotty voice)
│   │   │   │   ├── scotty-game-on.mp3 — Caller clip for the "game on" event (Scotty voice)
│   │   │   │   ├── scotty-high-ton.mp3 — Caller clip for the "high ton" event (Scotty voice)
│   │   │   │   ├── scotty-leg-winner.mp3 — Caller clip for the "leg winner" event (Scotty voice)
│   │   │   │   ├── scotty-match-winner.mp3 — Caller clip for the "match winner" event (Scotty voice)
│   │   │   │   ├── scotty-next-leg.mp3 — Caller clip for the "next leg" event (Scotty voice)
│   │   │   │   ├── scotty-next-set.mp3 — Caller clip for the "next set" event (Scotty voice)
│   │   │   │   ├── scotty-player1-starting.mp3 — Caller clip for the "player1 starting" event (Scotty voice)
│   │   │   │   ├── scotty-player2-starting.mp3 — Caller clip for the "player2 starting" event (Scotty voice)
│   │   │   │   ├── scotty-score-0.mp3 — Caller clip announcing score 0 (Scotty voice)
│   │   │   │   ├── scotty-score-1.mp3 — Caller clip announcing score 1 (Scotty voice)
│   │   │   │   ├── scotty-score-10.mp3 — Caller clip announcing score 10 (Scotty voice)
│   │   │   │   ├── scotty-score-100.mp3 — Caller clip announcing score 100 (Scotty voice)
│   │   │   │   ├── scotty-score-101.mp3 — Caller clip announcing score 101 (Scotty voice)
│   │   │   │   ├── scotty-score-102.mp3 — Caller clip announcing score 102 (Scotty voice)
│   │   │   │   ├── scotty-score-103.mp3 — Caller clip announcing score 103 (Scotty voice)
│   │   │   │   ├── scotty-score-104.mp3 — Caller clip announcing score 104 (Scotty voice)
│   │   │   │   ├── scotty-score-105.mp3 — Caller clip announcing score 105 (Scotty voice)
│   │   │   │   ├── scotty-score-106.mp3 — Caller clip announcing score 106 (Scotty voice)
│   │   │   │   ├── scotty-score-107.mp3 — Caller clip announcing score 107 (Scotty voice)
│   │   │   │   ├── scotty-score-108.mp3 — Caller clip announcing score 108 (Scotty voice)
│   │   │   │   ├── scotty-score-109.mp3 — Caller clip announcing score 109 (Scotty voice)
│   │   │   │   ├── scotty-score-11.mp3 — Caller clip announcing score 11 (Scotty voice)
│   │   │   │   ├── scotty-score-110.mp3 — Caller clip announcing score 110 (Scotty voice)
│   │   │   │   ├── scotty-score-111.mp3 — Caller clip announcing score 111 (Scotty voice)
│   │   │   │   ├── scotty-score-112.mp3 — Caller clip announcing score 112 (Scotty voice)
│   │   │   │   ├── scotty-score-113.mp3 — Caller clip announcing score 113 (Scotty voice)
│   │   │   │   ├── scotty-score-114.mp3 — Caller clip announcing score 114 (Scotty voice)
│   │   │   │   ├── scotty-score-115.mp3 — Caller clip announcing score 115 (Scotty voice)
│   │   │   │   ├── scotty-score-116.mp3 — Caller clip announcing score 116 (Scotty voice)
│   │   │   │   ├── scotty-score-117.mp3 — Caller clip announcing score 117 (Scotty voice)
│   │   │   │   ├── scotty-score-118.mp3 — Caller clip announcing score 118 (Scotty voice)
│   │   │   │   ├── scotty-score-119.mp3 — Caller clip announcing score 119 (Scotty voice)
│   │   │   │   ├── scotty-score-12.mp3 — Caller clip announcing score 12 (Scotty voice)
│   │   │   │   ├── scotty-score-120.mp3 — Caller clip announcing score 120 (Scotty voice)
│   │   │   │   ├── scotty-score-121.mp3 — Caller clip announcing score 121 (Scotty voice)
│   │   │   │   ├── scotty-score-122.mp3 — Caller clip announcing score 122 (Scotty voice)
│   │   │   │   ├── scotty-score-123.mp3 — Caller clip announcing score 123 (Scotty voice)
│   │   │   │   ├── scotty-score-124.mp3 — Caller clip announcing score 124 (Scotty voice)
│   │   │   │   ├── scotty-score-125.mp3 — Caller clip announcing score 125 (Scotty voice)
│   │   │   │   ├── scotty-score-126.mp3 — Caller clip announcing score 126 (Scotty voice)
│   │   │   │   ├── scotty-score-127.mp3 — Caller clip announcing score 127 (Scotty voice)
│   │   │   │   ├── scotty-score-128.mp3 — Caller clip announcing score 128 (Scotty voice)
│   │   │   │   ├── scotty-score-129.mp3 — Caller clip announcing score 129 (Scotty voice)
│   │   │   │   ├── scotty-score-13.mp3 — Caller clip announcing score 13 (Scotty voice)
│   │   │   │   ├── scotty-score-130.mp3 — Caller clip announcing score 130 (Scotty voice)
│   │   │   │   ├── scotty-score-131.mp3 — Caller clip announcing score 131 (Scotty voice)
│   │   │   │   ├── scotty-score-132.mp3 — Caller clip announcing score 132 (Scotty voice)
│   │   │   │   ├── scotty-score-133.mp3 — Caller clip announcing score 133 (Scotty voice)
│   │   │   │   ├── scotty-score-134.mp3 — Caller clip announcing score 134 (Scotty voice)
│   │   │   │   ├── scotty-score-135.mp3 — Caller clip announcing score 135 (Scotty voice)
│   │   │   │   ├── scotty-score-136.mp3 — Caller clip announcing score 136 (Scotty voice)
│   │   │   │   ├── scotty-score-137.mp3 — Caller clip announcing score 137 (Scotty voice)
│   │   │   │   ├── scotty-score-138.mp3 — Caller clip announcing score 138 (Scotty voice)
│   │   │   │   ├── scotty-score-139.mp3 — Caller clip announcing score 139 (Scotty voice)
│   │   │   │   ├── scotty-score-14.mp3 — Caller clip announcing score 14 (Scotty voice)
│   │   │   │   ├── scotty-score-140.mp3 — Caller clip announcing score 140 (Scotty voice)
│   │   │   │   ├── scotty-score-141.mp3 — Caller clip announcing score 141 (Scotty voice)
│   │   │   │   ├── scotty-score-142.mp3 — Caller clip announcing score 142 (Scotty voice)
│   │   │   │   ├── scotty-score-143.mp3 — Caller clip announcing score 143 (Scotty voice)
│   │   │   │   ├── scotty-score-144.mp3 — Caller clip announcing score 144 (Scotty voice)
│   │   │   │   ├── scotty-score-145.mp3 — Caller clip announcing score 145 (Scotty voice)
│   │   │   │   ├── scotty-score-146.mp3 — Caller clip announcing score 146 (Scotty voice)
│   │   │   │   ├── scotty-score-147.mp3 — Caller clip announcing score 147 (Scotty voice)
│   │   │   │   ├── scotty-score-148.mp3 — Caller clip announcing score 148 (Scotty voice)
│   │   │   │   ├── scotty-score-149.mp3 — Caller clip announcing score 149 (Scotty voice)
│   │   │   │   ├── scotty-score-15.mp3 — Caller clip announcing score 15 (Scotty voice)
│   │   │   │   ├── scotty-score-150.mp3 — Caller clip announcing score 150 (Scotty voice)
│   │   │   │   ├── scotty-score-151.mp3 — Caller clip announcing score 151 (Scotty voice)
│   │   │   │   ├── scotty-score-152.mp3 — Caller clip announcing score 152 (Scotty voice)
│   │   │   │   ├── scotty-score-153.mp3 — Caller clip announcing score 153 (Scotty voice)
│   │   │   │   ├── scotty-score-154.mp3 — Caller clip announcing score 154 (Scotty voice)
│   │   │   │   ├── scotty-score-155.mp3 — Caller clip announcing score 155 (Scotty voice)
│   │   │   │   ├── scotty-score-156.mp3 — Caller clip announcing score 156 (Scotty voice)
│   │   │   │   ├── scotty-score-157.mp3 — Caller clip announcing score 157 (Scotty voice)
│   │   │   │   ├── scotty-score-158.mp3 — Caller clip announcing score 158 (Scotty voice)
│   │   │   │   ├── scotty-score-159.mp3 — Caller clip announcing score 159 (Scotty voice)
│   │   │   │   ├── scotty-score-16.mp3 — Caller clip announcing score 16 (Scotty voice)
│   │   │   │   ├── scotty-score-160.mp3 — Caller clip announcing score 160 (Scotty voice)
│   │   │   │   ├── scotty-score-161.mp3 — Caller clip announcing score 161 (Scotty voice)
│   │   │   │   ├── scotty-score-162.mp3 — Caller clip announcing score 162 (Scotty voice)
│   │   │   │   ├── scotty-score-163.mp3 — Caller clip announcing score 163 (Scotty voice)
│   │   │   │   ├── scotty-score-164.mp3 — Caller clip announcing score 164 (Scotty voice)
│   │   │   │   ├── scotty-score-165.mp3 — Caller clip announcing score 165 (Scotty voice)
│   │   │   │   ├── scotty-score-166.mp3 — Caller clip announcing score 166 (Scotty voice)
│   │   │   │   ├── scotty-score-167.mp3 — Caller clip announcing score 167 (Scotty voice)
│   │   │   │   ├── scotty-score-168.mp3 — Caller clip announcing score 168 (Scotty voice)
│   │   │   │   ├── scotty-score-169.mp3 — Caller clip announcing score 169 (Scotty voice)
│   │   │   │   ├── scotty-score-17.mp3 — Caller clip announcing score 17 (Scotty voice)
│   │   │   │   ├── scotty-score-170.mp3 — Caller clip announcing score 170 (Scotty voice)
│   │   │   │   ├── scotty-score-171.mp3 — Caller clip announcing score 171 (Scotty voice)
│   │   │   │   ├── scotty-score-172.mp3 — Caller clip announcing score 172 (Scotty voice)
│   │   │   │   ├── scotty-score-173.mp3 — Caller clip announcing score 173 (Scotty voice)
│   │   │   │   ├── scotty-score-174.mp3 — Caller clip announcing score 174 (Scotty voice)
│   │   │   │   ├── scotty-score-175.mp3 — Caller clip announcing score 175 (Scotty voice)
│   │   │   │   ├── scotty-score-176.mp3 — Caller clip announcing score 176 (Scotty voice)
│   │   │   │   ├── scotty-score-177.mp3 — Caller clip announcing score 177 (Scotty voice)
│   │   │   │   ├── scotty-score-178.mp3 — Caller clip announcing score 178 (Scotty voice)
│   │   │   │   ├── scotty-score-179.mp3 — Caller clip announcing score 179 (Scotty voice)
│   │   │   │   ├── scotty-score-18.mp3 — Caller clip announcing score 18 (Scotty voice)
│   │   │   │   ├── scotty-score-180.mp3 — Caller clip announcing score 180 (Scotty voice)
│   │   │   │   ├── scotty-score-19.mp3 — Caller clip announcing score 19 (Scotty voice)
│   │   │   │   ├── scotty-score-2.mp3 — Caller clip announcing score 2 (Scotty voice)
│   │   │   │   ├── scotty-score-20.mp3 — Caller clip announcing score 20 (Scotty voice)
│   │   │   │   ├── scotty-score-21.mp3 — Caller clip announcing score 21 (Scotty voice)
│   │   │   │   ├── scotty-score-22.mp3 — Caller clip announcing score 22 (Scotty voice)
│   │   │   │   ├── scotty-score-23.mp3 — Caller clip announcing score 23 (Scotty voice)
│   │   │   │   ├── scotty-score-24.mp3 — Caller clip announcing score 24 (Scotty voice)
│   │   │   │   ├── scotty-score-25.mp3 — Caller clip announcing score 25 (Scotty voice)
│   │   │   │   ├── scotty-score-26.mp3 — Caller clip announcing score 26 (Scotty voice)
│   │   │   │   ├── scotty-score-27.mp3 — Caller clip announcing score 27 (Scotty voice)
│   │   │   │   ├── scotty-score-28.mp3 — Caller clip announcing score 28 (Scotty voice)
│   │   │   │   ├── scotty-score-29.mp3 — Caller clip announcing score 29 (Scotty voice)
│   │   │   │   ├── scotty-score-3.mp3 — Caller clip announcing score 3 (Scotty voice)
│   │   │   │   ├── scotty-score-30.mp3 — Caller clip announcing score 30 (Scotty voice)
│   │   │   │   ├── scotty-score-31.mp3 — Caller clip announcing score 31 (Scotty voice)
│   │   │   │   ├── scotty-score-32.mp3 — Caller clip announcing score 32 (Scotty voice)
│   │   │   │   ├── scotty-score-33.mp3 — Caller clip announcing score 33 (Scotty voice)
│   │   │   │   ├── scotty-score-34.mp3 — Caller clip announcing score 34 (Scotty voice)
│   │   │   │   ├── scotty-score-35.mp3 — Caller clip announcing score 35 (Scotty voice)
│   │   │   │   ├── scotty-score-36.mp3 — Caller clip announcing score 36 (Scotty voice)
│   │   │   │   ├── scotty-score-37.mp3 — Caller clip announcing score 37 (Scotty voice)
│   │   │   │   ├── scotty-score-38.mp3 — Caller clip announcing score 38 (Scotty voice)
│   │   │   │   ├── scotty-score-39.mp3 — Caller clip announcing score 39 (Scotty voice)
│   │   │   │   ├── scotty-score-4.mp3 — Caller clip announcing score 4 (Scotty voice)
│   │   │   │   ├── scotty-score-40.mp3 — Caller clip announcing score 40 (Scotty voice)
│   │   │   │   ├── scotty-score-41.mp3 — Caller clip announcing score 41 (Scotty voice)
│   │   │   │   ├── scotty-score-42.mp3 — Caller clip announcing score 42 (Scotty voice)
│   │   │   │   ├── scotty-score-43.mp3 — Caller clip announcing score 43 (Scotty voice)
│   │   │   │   ├── scotty-score-44.mp3 — Caller clip announcing score 44 (Scotty voice)
│   │   │   │   ├── scotty-score-45.mp3 — Caller clip announcing score 45 (Scotty voice)
│   │   │   │   ├── scotty-score-46.mp3 — Caller clip announcing score 46 (Scotty voice)
│   │   │   │   ├── scotty-score-47.mp3 — Caller clip announcing score 47 (Scotty voice)
│   │   │   │   ├── scotty-score-48.mp3 — Caller clip announcing score 48 (Scotty voice)
│   │   │   │   ├── scotty-score-49.mp3 — Caller clip announcing score 49 (Scotty voice)
│   │   │   │   ├── scotty-score-5.mp3 — Caller clip announcing score 5 (Scotty voice)
│   │   │   │   ├── scotty-score-50.mp3 — Caller clip announcing score 50 (Scotty voice)
│   │   │   │   ├── scotty-score-51.mp3 — Caller clip announcing score 51 (Scotty voice)
│   │   │   │   ├── scotty-score-52.mp3 — Caller clip announcing score 52 (Scotty voice)
│   │   │   │   ├── scotty-score-53.mp3 — Caller clip announcing score 53 (Scotty voice)
│   │   │   │   ├── scotty-score-54.mp3 — Caller clip announcing score 54 (Scotty voice)
│   │   │   │   ├── scotty-score-55.mp3 — Caller clip announcing score 55 (Scotty voice)
│   │   │   │   ├── scotty-score-56.mp3 — Caller clip announcing score 56 (Scotty voice)
│   │   │   │   ├── scotty-score-57.mp3 — Caller clip announcing score 57 (Scotty voice)
│   │   │   │   ├── scotty-score-58.mp3 — Caller clip announcing score 58 (Scotty voice)
│   │   │   │   ├── scotty-score-59.mp3 — Caller clip announcing score 59 (Scotty voice)
│   │   │   │   ├── scotty-score-6.mp3 — Caller clip announcing score 6 (Scotty voice)
│   │   │   │   ├── scotty-score-60.mp3 — Caller clip announcing score 60 (Scotty voice)
│   │   │   │   ├── scotty-score-61.mp3 — Caller clip announcing score 61 (Scotty voice)
│   │   │   │   ├── scotty-score-62.mp3 — Caller clip announcing score 62 (Scotty voice)
│   │   │   │   ├── scotty-score-63.mp3 — Caller clip announcing score 63 (Scotty voice)
│   │   │   │   ├── scotty-score-64.mp3 — Caller clip announcing score 64 (Scotty voice)
│   │   │   │   ├── scotty-score-65.mp3 — Caller clip announcing score 65 (Scotty voice)
│   │   │   │   ├── scotty-score-66.mp3 — Caller clip announcing score 66 (Scotty voice)
│   │   │   │   ├── scotty-score-67.mp3 — Caller clip announcing score 67 (Scotty voice)
│   │   │   │   ├── scotty-score-68.mp3 — Caller clip announcing score 68 (Scotty voice)
│   │   │   │   ├── scotty-score-69.mp3 — Caller clip announcing score 69 (Scotty voice)
│   │   │   │   ├── scotty-score-7.mp3 — Caller clip announcing score 7 (Scotty voice)
│   │   │   │   ├── scotty-score-70.mp3 — Caller clip announcing score 70 (Scotty voice)
│   │   │   │   ├── scotty-score-71.mp3 — Caller clip announcing score 71 (Scotty voice)
│   │   │   │   ├── scotty-score-72.mp3 — Caller clip announcing score 72 (Scotty voice)
│   │   │   │   ├── scotty-score-73.mp3 — Caller clip announcing score 73 (Scotty voice)
│   │   │   │   ├── scotty-score-74.mp3 — Caller clip announcing score 74 (Scotty voice)
│   │   │   │   ├── scotty-score-75.mp3 — Caller clip announcing score 75 (Scotty voice)
│   │   │   │   ├── scotty-score-76.mp3 — Caller clip announcing score 76 (Scotty voice)
│   │   │   │   ├── scotty-score-77.mp3 — Caller clip announcing score 77 (Scotty voice)
│   │   │   │   ├── scotty-score-78.mp3 — Caller clip announcing score 78 (Scotty voice)
│   │   │   │   ├── scotty-score-79.mp3 — Caller clip announcing score 79 (Scotty voice)
│   │   │   │   ├── scotty-score-8.mp3 — Caller clip announcing score 8 (Scotty voice)
│   │   │   │   ├── scotty-score-80.mp3 — Caller clip announcing score 80 (Scotty voice)
│   │   │   │   ├── scotty-score-81.mp3 — Caller clip announcing score 81 (Scotty voice)
│   │   │   │   ├── scotty-score-82.mp3 — Caller clip announcing score 82 (Scotty voice)
│   │   │   │   ├── scotty-score-83.mp3 — Caller clip announcing score 83 (Scotty voice)
│   │   │   │   ├── scotty-score-84.mp3 — Caller clip announcing score 84 (Scotty voice)
│   │   │   │   ├── scotty-score-85.mp3 — Caller clip announcing score 85 (Scotty voice)
│   │   │   │   ├── scotty-score-86.mp3 — Caller clip announcing score 86 (Scotty voice)
│   │   │   │   ├── scotty-score-87.mp3 — Caller clip announcing score 87 (Scotty voice)
│   │   │   │   ├── scotty-score-88.mp3 — Caller clip announcing score 88 (Scotty voice)
│   │   │   │   ├── scotty-score-89.mp3 — Caller clip announcing score 89 (Scotty voice)
│   │   │   │   ├── scotty-score-9.mp3 — Caller clip announcing score 9 (Scotty voice)
│   │   │   │   ├── scotty-score-90.mp3 — Caller clip announcing score 90 (Scotty voice)
│   │   │   │   ├── scotty-score-91.mp3 — Caller clip announcing score 91 (Scotty voice)
│   │   │   │   ├── scotty-score-92.mp3 — Caller clip announcing score 92 (Scotty voice)
│   │   │   │   ├── scotty-score-93.mp3 — Caller clip announcing score 93 (Scotty voice)
│   │   │   │   ├── scotty-score-94.mp3 — Caller clip announcing score 94 (Scotty voice)
│   │   │   │   ├── scotty-score-95.mp3 — Caller clip announcing score 95 (Scotty voice)
│   │   │   │   ├── scotty-score-96.mp3 — Caller clip announcing score 96 (Scotty voice)
│   │   │   │   ├── scotty-score-97.mp3 — Caller clip announcing score 97 (Scotty voice)
│   │   │   │   ├── scotty-score-98.mp3 — Caller clip announcing score 98 (Scotty voice)
│   │   │   │   ├── scotty-score-99.mp3 — Caller clip announcing score 99 (Scotty voice)
│   │   │   │   ├── scotty-set-winner.mp3 — Caller clip for the "set winner" event (Scotty voice)
│   │   │   │   ├── scotty-ton-80.mp3 — Caller clip for the "ton 80" event (Scotty voice)
│   │   │   │   ├── set-winner.mp3 — Caller clip for the "set winner" event
│   │   │   │   ├── ton-80.mp3 — Caller clip for the "ton 80" event
│   │   │   │   ├── voice3-score-0.mp3 — Caller clip announcing score 0 (voice 3)
│   │   │   │   ├── voice3-score-1.mp3 — Caller clip announcing score 1 (voice 3)
│   │   │   │   ├── voice3-score-10.mp3 — Caller clip announcing score 10 (voice 3)
│   │   │   │   ├── voice3-score-100.mp3 — Caller clip announcing score 100 (voice 3)
│   │   │   │   ├── voice3-score-101.mp3 — Caller clip announcing score 101 (voice 3)
│   │   │   │   ├── voice3-score-102.mp3 — Caller clip announcing score 102 (voice 3)
│   │   │   │   ├── voice3-score-103.mp3 — Caller clip announcing score 103 (voice 3)
│   │   │   │   ├── voice3-score-104.mp3 — Caller clip announcing score 104 (voice 3)
│   │   │   │   ├── voice3-score-105.mp3 — Caller clip announcing score 105 (voice 3)
│   │   │   │   ├── voice3-score-106.mp3 — Caller clip announcing score 106 (voice 3)
│   │   │   │   ├── voice3-score-107.mp3 — Caller clip announcing score 107 (voice 3)
│   │   │   │   ├── voice3-score-108.mp3 — Caller clip announcing score 108 (voice 3)
│   │   │   │   ├── voice3-score-109.mp3 — Caller clip announcing score 109 (voice 3)
│   │   │   │   ├── voice3-score-11.mp3 — Caller clip announcing score 11 (voice 3)
│   │   │   │   ├── voice3-score-110.mp3 — Caller clip announcing score 110 (voice 3)
│   │   │   │   ├── voice3-score-111.mp3 — Caller clip announcing score 111 (voice 3)
│   │   │   │   ├── voice3-score-112.mp3 — Caller clip announcing score 112 (voice 3)
│   │   │   │   ├── voice3-score-113.mp3 — Caller clip announcing score 113 (voice 3)
│   │   │   │   ├── voice3-score-114.mp3 — Caller clip announcing score 114 (voice 3)
│   │   │   │   ├── voice3-score-115.mp3 — Caller clip announcing score 115 (voice 3)
│   │   │   │   ├── voice3-score-116.mp3 — Caller clip announcing score 116 (voice 3)
│   │   │   │   ├── voice3-score-117.mp3 — Caller clip announcing score 117 (voice 3)
│   │   │   │   ├── voice3-score-118.mp3 — Caller clip announcing score 118 (voice 3)
│   │   │   │   ├── voice3-score-119.mp3 — Caller clip announcing score 119 (voice 3)
│   │   │   │   ├── voice3-score-12.mp3 — Caller clip announcing score 12 (voice 3)
│   │   │   │   ├── voice3-score-120.mp3 — Caller clip announcing score 120 (voice 3)
│   │   │   │   ├── voice3-score-121.mp3 — Caller clip announcing score 121 (voice 3)
│   │   │   │   ├── voice3-score-122.mp3 — Caller clip announcing score 122 (voice 3)
│   │   │   │   ├── voice3-score-123.mp3 — Caller clip announcing score 123 (voice 3)
│   │   │   │   ├── voice3-score-124.mp3 — Caller clip announcing score 124 (voice 3)
│   │   │   │   ├── voice3-score-125.mp3 — Caller clip announcing score 125 (voice 3)
│   │   │   │   ├── voice3-score-126.mp3 — Caller clip announcing score 126 (voice 3)
│   │   │   │   ├── voice3-score-127.mp3 — Caller clip announcing score 127 (voice 3)
│   │   │   │   ├── voice3-score-128.mp3 — Caller clip announcing score 128 (voice 3)
│   │   │   │   ├── voice3-score-129.mp3 — Caller clip announcing score 129 (voice 3)
│   │   │   │   ├── voice3-score-13.mp3 — Caller clip announcing score 13 (voice 3)
│   │   │   │   ├── voice3-score-130.mp3 — Caller clip announcing score 130 (voice 3)
│   │   │   │   ├── voice3-score-131.mp3 — Caller clip announcing score 131 (voice 3)
│   │   │   │   ├── voice3-score-132.mp3 — Caller clip announcing score 132 (voice 3)
│   │   │   │   ├── voice3-score-133.mp3 — Caller clip announcing score 133 (voice 3)
│   │   │   │   ├── voice3-score-134.mp3 — Caller clip announcing score 134 (voice 3)
│   │   │   │   ├── voice3-score-135.mp3 — Caller clip announcing score 135 (voice 3)
│   │   │   │   ├── voice3-score-136.mp3 — Caller clip announcing score 136 (voice 3)
│   │   │   │   ├── voice3-score-137.mp3 — Caller clip announcing score 137 (voice 3)
│   │   │   │   ├── voice3-score-138.mp3 — Caller clip announcing score 138 (voice 3)
│   │   │   │   ├── voice3-score-139.mp3 — Caller clip announcing score 139 (voice 3)
│   │   │   │   ├── voice3-score-14.mp3 — Caller clip announcing score 14 (voice 3)
│   │   │   │   ├── voice3-score-140.mp3 — Caller clip announcing score 140 (voice 3)
│   │   │   │   ├── voice3-score-141.mp3 — Caller clip announcing score 141 (voice 3)
│   │   │   │   ├── voice3-score-142.mp3 — Caller clip announcing score 142 (voice 3)
│   │   │   │   ├── voice3-score-143.mp3 — Caller clip announcing score 143 (voice 3)
│   │   │   │   ├── voice3-score-144.mp3 — Caller clip announcing score 144 (voice 3)
│   │   │   │   ├── voice3-score-145.mp3 — Caller clip announcing score 145 (voice 3)
│   │   │   │   ├── voice3-score-15.mp3 — Caller clip announcing score 15 (voice 3)
│   │   │   │   ├── voice3-score-150.mp3 — Caller clip announcing score 150 (voice 3)
│   │   │   │   ├── voice3-score-16.mp3 — Caller clip announcing score 16 (voice 3)
│   │   │   │   ├── voice3-score-17.mp3 — Caller clip announcing score 17 (voice 3)
│   │   │   │   ├── voice3-score-18.mp3 — Caller clip announcing score 18 (voice 3)
│   │   │   │   ├── voice3-score-19.mp3 — Caller clip announcing score 19 (voice 3)
│   │   │   │   ├── voice3-score-2.mp3 — Caller clip announcing score 2 (voice 3)
│   │   │   │   ├── voice3-score-20.mp3 — Caller clip announcing score 20 (voice 3)
│   │   │   │   ├── voice3-score-21.mp3 — Caller clip announcing score 21 (voice 3)
│   │   │   │   ├── voice3-score-22.mp3 — Caller clip announcing score 22 (voice 3)
│   │   │   │   ├── voice3-score-23.mp3 — Caller clip announcing score 23 (voice 3)
│   │   │   │   ├── voice3-score-24.mp3 — Caller clip announcing score 24 (voice 3)
│   │   │   │   ├── voice3-score-25.mp3 — Caller clip announcing score 25 (voice 3)
│   │   │   │   ├── voice3-score-26.mp3 — Caller clip announcing score 26 (voice 3)
│   │   │   │   ├── voice3-score-27.mp3 — Caller clip announcing score 27 (voice 3)
│   │   │   │   ├── voice3-score-28.mp3 — Caller clip announcing score 28 (voice 3)
│   │   │   │   ├── voice3-score-29.mp3 — Caller clip announcing score 29 (voice 3)
│   │   │   │   ├── voice3-score-3.mp3 — Caller clip announcing score 3 (voice 3)
│   │   │   │   ├── voice3-score-30.mp3 — Caller clip announcing score 30 (voice 3)
│   │   │   │   ├── voice3-score-31.mp3 — Caller clip announcing score 31 (voice 3)
│   │   │   │   ├── voice3-score-32.mp3 — Caller clip announcing score 32 (voice 3)
│   │   │   │   ├── voice3-score-33.mp3 — Caller clip announcing score 33 (voice 3)
│   │   │   │   ├── voice3-score-34.mp3 — Caller clip announcing score 34 (voice 3)
│   │   │   │   ├── voice3-score-35.mp3 — Caller clip announcing score 35 (voice 3)
│   │   │   │   ├── voice3-score-36.mp3 — Caller clip announcing score 36 (voice 3)
│   │   │   │   ├── voice3-score-37.mp3 — Caller clip announcing score 37 (voice 3)
│   │   │   │   ├── voice3-score-38.mp3 — Caller clip announcing score 38 (voice 3)
│   │   │   │   ├── voice3-score-39.mp3 — Caller clip announcing score 39 (voice 3)
│   │   │   │   ├── voice3-score-4.mp3 — Caller clip announcing score 4 (voice 3)
│   │   │   │   ├── voice3-score-40.mp3 — Caller clip announcing score 40 (voice 3)
│   │   │   │   ├── voice3-score-41.mp3 — Caller clip announcing score 41 (voice 3)
│   │   │   │   ├── voice3-score-42.mp3 — Caller clip announcing score 42 (voice 3)
│   │   │   │   ├── voice3-score-43.mp3 — Caller clip announcing score 43 (voice 3)
│   │   │   │   ├── voice3-score-44.mp3 — Caller clip announcing score 44 (voice 3)
│   │   │   │   ├── voice3-score-45.mp3 — Caller clip announcing score 45 (voice 3)
│   │   │   │   ├── voice3-score-46.mp3 — Caller clip announcing score 46 (voice 3)
│   │   │   │   ├── voice3-score-47.mp3 — Caller clip announcing score 47 (voice 3)
│   │   │   │   ├── voice3-score-48.mp3 — Caller clip announcing score 48 (voice 3)
│   │   │   │   ├── voice3-score-49.mp3 — Caller clip announcing score 49 (voice 3)
│   │   │   │   ├── voice3-score-5.mp3 — Caller clip announcing score 5 (voice 3)
│   │   │   │   ├── voice3-score-50.mp3 — Caller clip announcing score 50 (voice 3)
│   │   │   │   ├── voice3-score-51.mp3 — Caller clip announcing score 51 (voice 3)
│   │   │   │   ├── voice3-score-52.mp3 — Caller clip announcing score 52 (voice 3)
│   │   │   │   ├── voice3-score-53.mp3 — Caller clip announcing score 53 (voice 3)
│   │   │   │   ├── voice3-score-54.mp3 — Caller clip announcing score 54 (voice 3)
│   │   │   │   ├── voice3-score-55.mp3 — Caller clip announcing score 55 (voice 3)
│   │   │   │   ├── voice3-score-56.mp3 — Caller clip announcing score 56 (voice 3)
│   │   │   │   ├── voice3-score-57.mp3 — Caller clip announcing score 57 (voice 3)
│   │   │   │   ├── voice3-score-58.mp3 — Caller clip announcing score 58 (voice 3)
│   │   │   │   ├── voice3-score-59.mp3 — Caller clip announcing score 59 (voice 3)
│   │   │   │   ├── voice3-score-6.mp3 — Caller clip announcing score 6 (voice 3)
│   │   │   │   ├── voice3-score-60.mp3 — Caller clip announcing score 60 (voice 3)
│   │   │   │   ├── voice3-score-61.mp3 — Caller clip announcing score 61 (voice 3)
│   │   │   │   ├── voice3-score-62.mp3 — Caller clip announcing score 62 (voice 3)
│   │   │   │   ├── voice3-score-63.mp3 — Caller clip announcing score 63 (voice 3)
│   │   │   │   ├── voice3-score-64.mp3 — Caller clip announcing score 64 (voice 3)
│   │   │   │   ├── voice3-score-65.mp3 — Caller clip announcing score 65 (voice 3)
│   │   │   │   ├── voice3-score-66.mp3 — Caller clip announcing score 66 (voice 3)
│   │   │   │   ├── voice3-score-67.mp3 — Caller clip announcing score 67 (voice 3)
│   │   │   │   ├── voice3-score-68.mp3 — Caller clip announcing score 68 (voice 3)
│   │   │   │   ├── voice3-score-69.mp3 — Caller clip announcing score 69 (voice 3)
│   │   │   │   ├── voice3-score-7.mp3 — Caller clip announcing score 7 (voice 3)
│   │   │   │   ├── voice3-score-70.mp3 — Caller clip announcing score 70 (voice 3)
│   │   │   │   ├── voice3-score-71.mp3 — Caller clip announcing score 71 (voice 3)
│   │   │   │   ├── voice3-score-72.mp3 — Caller clip announcing score 72 (voice 3)
│   │   │   │   ├── voice3-score-73.mp3 — Caller clip announcing score 73 (voice 3)
│   │   │   │   ├── voice3-score-74.mp3 — Caller clip announcing score 74 (voice 3)
│   │   │   │   ├── voice3-score-75.mp3 — Caller clip announcing score 75 (voice 3)
│   │   │   │   ├── voice3-score-76.mp3 — Caller clip announcing score 76 (voice 3)
│   │   │   │   ├── voice3-score-77.mp3 — Caller clip announcing score 77 (voice 3)
│   │   │   │   ├── voice3-score-78.mp3 — Caller clip announcing score 78 (voice 3)
│   │   │   │   ├── voice3-score-79.mp3 — Caller clip announcing score 79 (voice 3)
│   │   │   │   ├── voice3-score-8.mp3 — Caller clip announcing score 8 (voice 3)
│   │   │   │   ├── voice3-score-80.mp3 — Caller clip announcing score 80 (voice 3)
│   │   │   │   ├── voice3-score-81.mp3 — Caller clip announcing score 81 (voice 3)
│   │   │   │   ├── voice3-score-82.mp3 — Caller clip announcing score 82 (voice 3)
│   │   │   │   ├── voice3-score-83.mp3 — Caller clip announcing score 83 (voice 3)
│   │   │   │   ├── voice3-score-84.mp3 — Caller clip announcing score 84 (voice 3)
│   │   │   │   ├── voice3-score-85.mp3 — Caller clip announcing score 85 (voice 3)
│   │   │   │   ├── voice3-score-86.mp3 — Caller clip announcing score 86 (voice 3)
│   │   │   │   ├── voice3-score-87.mp3 — Caller clip announcing score 87 (voice 3)
│   │   │   │   ├── voice3-score-88.mp3 — Caller clip announcing score 88 (voice 3)
│   │   │   │   ├── voice3-score-89.mp3 — Caller clip announcing score 89 (voice 3)
│   │   │   │   ├── voice3-score-9.mp3 — Caller clip announcing score 9 (voice 3)
│   │   │   │   ├── voice3-score-90.mp3 — Caller clip announcing score 90 (voice 3)
│   │   │   │   ├── voice3-score-91.mp3 — Caller clip announcing score 91 (voice 3)
│   │   │   │   ├── voice3-score-92.mp3 — Caller clip announcing score 92 (voice 3)
│   │   │   │   ├── voice3-score-93.mp3 — Caller clip announcing score 93 (voice 3)
│   │   │   │   ├── voice3-score-94.mp3 — Caller clip announcing score 94 (voice 3)
│   │   │   │   ├── voice3-score-95.mp3 — Caller clip announcing score 95 (voice 3)
│   │   │   │   ├── voice3-score-96.mp3 — Caller clip announcing score 96 (voice 3)
│   │   │   │   ├── voice3-score-97.mp3 — Caller clip announcing score 97 (voice 3)
│   │   │   │   ├── voice3-score-98.mp3 — Caller clip announcing score 98 (voice 3)
│   │   │   │   ├── voice3-score-99.mp3 — Caller clip announcing score 99 (voice 3)
│   │   │   ├── favicon.svg — Favicon copied into the build
│   │   │   ├── robots.txt — robots.txt copied into the build
│   │   ├── server/ — Built server bundle (compiled by esbuild)
│   │       ├── _app/ — Server-referenced build assets
│   │       │   ├── immutable/ — Hashed immutable server assets
│   │       │       ├── assets/ — Server-side hashed assets
│   │       │           ├── _layout.BlhjZR09.css — Hashed server-referenced stylesheet
│   │       ├── .vite/ — Vite build metadata
│   │       │   ├── manifest.json — Vite server build manifest
│   │       ├── chunks/ — Compiled shared server chunks
│   │       │   ├── database-service.js — Compiled server chunk — DB service layer
│   │       │   ├── DoubleBezel.js — Compiled server chunk — DoubleBezel component
│   │       │   ├── environment.js — Compiled server chunk — environment helpers
│   │       │   ├── exports.js — Compiled server chunk — shared exports
│   │       │   ├── false.js — Compiled server chunk (conditional import stub)
│   │       │   ├── Icon.js — Compiled server chunk — Tabler icon component
│   │       │   ├── index.js — Compiled server chunk — barrel/index
│   │       │   ├── internal.js — Compiled server chunk — SvelteKit internals
│   │       │   ├── loading.js — Compiled server chunk — loading overlay
│   │       │   ├── root.js — Compiled server chunk — root component
│   │       │   ├── search.js — Compiled server chunk — search select
│   │       │   ├── shared.js — Compiled server chunk — shared runtime
│   │       │   ├── state.svelte.js — Compiled server chunk — Svelte 5 state (runes)
│   │       │   ├── utils.js — Compiled server chunk — utils
│   │       │   ├── voice-settings.js — Compiled server chunk — voice settings store
│   │       ├── entries/ — Compiled route entries (endpoints, pages)
│   │       │   ├── endpoints/ — Compiled endpoint handlers
│   │       │   │   ├── api/ — Compiled /api endpoint handlers
│   │       │   │       ├── insights/ — Compiled /api/insights endpoint handler dir
│   │       │   │       │   ├── _playerId_/ — Compiled /api/insights/:playerId endpoint handler dir
│   │       │   │       │       ├── _server.ts.js — Compiled API handler for /api/insights/:playerId
│   │       │   │       ├── matches/ — Compiled /api/matches endpoint handler dir
│   │       │   │       │   ├── _id_/ — Compiled /api/matches/:id endpoint handler dir
│   │       │   │       │   │   ├── legs/ — Compiled /api/matches/:id/legs endpoint handler dir
│   │       │   │       │   │   │   ├── _server.ts.js — Compiled API handler for /api/matches/:id/legs
│   │       │   │       │   │   ├── players/ — Compiled /api/matches/:id/players endpoint handler dir
│   │       │   │       │   │   │   ├── _playerId_/ — Compiled /api/matches/:id/players/:playerId endpoint handler dir
│   │       │   │       │   │   │       ├── _server.ts.js — Compiled API handler for /api/matches/:id/players/:playerId
│   │       │   │       │   │   ├── turns/ — Compiled /api/matches/:id/turns endpoint handler dir
│   │       │   │       │   │   │   ├── _server.ts.js — Compiled API handler for /api/matches/:id/turns
│   │       │   │       │   │   ├── _server.ts.js — Compiled API handler for /api/matches/:id
│   │       │   │       │   ├── with-players/ — Compiled /api/matches/with-players endpoint handler dir
│   │       │   │       │   │   ├── _server.ts.js — Compiled API handler for /api/matches/with-players
│   │       │   │       │   ├── _server.ts.js — Compiled API handler for /api/matches
│   │       │   │       ├── players/ — Compiled /api/players endpoint handler dir
│   │       │   │       │   ├── _id_/ — Compiled /api/players/:id endpoint handler dir
│   │       │   │       │   │   ├── matches/ — Compiled /api/players/:id/matches endpoint handler dir
│   │       │   │       │   │   │   ├── _server.ts.js — Compiled API handler for /api/players/:id/matches
│   │       │   │       │   │   ├── _server.ts.js — Compiled API handler for /api/players/:id
│   │       │   │       │   ├── archived/ — Compiled /api/players/archived endpoint handler dir
│   │       │   │       │   │   ├── _id_/ — Compiled /api/players/archived/:id endpoint handler dir
│   │       │   │       │   │   │   ├── restore/ — Compiled /api/players/archived/:id/restore endpoint handler dir
│   │       │   │       │   │   │       ├── _server.ts.js — Compiled API handler for /api/players/archived/:id/restore
│   │       │   │       │   │   ├── _server.ts.js — Compiled API handler for /api/players/archived
│   │       │   │       │   ├── _server.ts.js — Compiled API handler for /api/players
│   │       │   │       ├── settings/ — Compiled /api/settings endpoint handler dir
│   │       │   │       │   ├── _server.ts.js — Compiled API handler for /api/settings
│   │       │   │       ├── stats/ — Compiled /api/stats endpoint handler dir
│   │       │   │           ├── _playerId_/ — Compiled /api/stats/:playerId endpoint handler dir
│   │       │   │               ├── checkout/ — Compiled /api/stats/:playerId/checkout endpoint handler dir
│   │       │   │               │   ├── _server.ts.js — Compiled API handler for /api/stats/:playerId/checkout
│   │       │   │               ├── _server.ts.js — Compiled API handler for /api/stats/:playerId
│   │       │   ├── fallbacks/ — Compiled fallback components
│   │       │   │   ├── error.svelte.js — Compiled error fallback page
│   │       │   ├── pages/ — Compiled page components
│   │       │       ├── archive/ — Compiled /archive page component dir
│   │       │       │   ├── _page.svelte.js — Compiled page component for /archive
│   │       │       ├── history/ — Compiled /history page component dir
│   │       │       │   ├── _id_/ — Compiled /history/:id page component dir
│   │       │       │   │   ├── _page.svelte.js — Compiled page component for /history/_id_
│   │       │       │   ├── _page.svelte.js — Compiled page component for /history
│   │       │       ├── match/ — Compiled /match page component dir
│   │       │       │   ├── _id_/ — Compiled /match/:id page component dir
│   │       │       │   │   ├── _page.svelte.js — Compiled page component for /match/_id_
│   │       │       │   ├── setup/ — Compiled /match/setup page component dir
│   │       │       │       ├── _page.svelte.js — Compiled page component for /match/setup
│   │       │       ├── players/ — Compiled /players page component dir
│   │       │       │   ├── _id_/ — Compiled /players/:id page component dir
│   │       │       │   │   ├── checkout/ — Compiled /players/:id/checkout page component dir
│   │       │       │   │   │   ├── _page.svelte.js — Compiled page component for /players/_id_/checkout
│   │       │       │   │   ├── _page.svelte.js — Compiled page component for /players/_id_
│   │       │       │   ├── _page.svelte.js — Compiled page component for /players
│   │       │       ├── _layout.svelte.js — Compiled root layout component
│   │       │       ├── _page.svelte.js — Compiled home page component
│   │       ├── nodes/ — Compiled server route nodes
│   │       │   ├── 0.js — Compiled server route node chunk
│   │       │   ├── 1.js — Compiled server route node chunk
│   │       │   ├── 10.js — Compiled server route node chunk
│   │       │   ├── 2.js — Compiled server route node chunk
│   │       │   ├── 3.js — Compiled server route node chunk
│   │       │   ├── 4.js — Compiled server route node chunk
│   │       │   ├── 5.js — Compiled server route node chunk
│   │       │   ├── 6.js — Compiled server route node chunk
│   │       │   ├── 7.js — Compiled server route node chunk
│   │       │   ├── 8.js — Compiled server route node chunk
│   │       │   ├── 9.js — Compiled server route node chunk
│   │       ├── stylesheets/ — Server stylesheet output dir (empty)
│   │       ├── index.js — Server entry point consumed by adapter-node
│   │       ├── internal.js — SvelteKit server runtime internals (build)
│   │       ├── manifest-full.js — Full route manifest (with methods) for the server
│   │       ├── manifest.js — Route manifest for the server
│   │       ├── remote-entry.js — Remote entry hook for the server build
│   ├── types/ — Generated route type declarations
│   │   ├── src/ — Generated types for src
│   │   │   ├── routes/ — Generated types mirroring the routes tree
│   │   │       ├── api/ — Generated types for the /api route
│   │   │       │   ├── insights/ — Generated types for the /api/insights route
│   │   │       │   │   ├── [playerId]/ — Generated types for the /api/insights/:playerId route
│   │   │       │   │       ├── $types.d.ts — Generated SvelteKit types for the /api/insights/:playerId route
│   │   │       │   ├── matches/ — Generated types for the /api/matches route
│   │   │       │   │   ├── [id]/ — Generated types for the /api/matches/:id route
│   │   │       │   │   │   ├── legs/ — Generated types for the /api/matches/:id/legs route
│   │   │       │   │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/matches/:id/legs route
│   │   │       │   │   │   ├── players/ — Generated types for the /api/matches/:id/players route
│   │   │       │   │   │   │   ├── [playerId]/ — Generated types for the /api/matches/:id/players/:playerId route
│   │   │       │   │   │   │       ├── $types.d.ts — Generated SvelteKit types for the /api/matches/:id/players/:playerId route
│   │   │       │   │   │   ├── turns/ — Generated types for the /api/matches/:id/turns route
│   │   │       │   │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/matches/:id/turns route
│   │   │       │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/matches/:id route
│   │   │       │   │   ├── with-players/ — Generated types for the /api/matches/with-players route
│   │   │       │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/matches/with-players route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/matches route
│   │   │       │   ├── players/ — Generated types for the /api/players route
│   │   │       │   │   ├── [id]/ — Generated types for the /api/players/:id route
│   │   │       │   │   │   ├── matches/ — Generated types for the /api/players/:id/matches route
│   │   │       │   │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/players/:id/matches route
│   │   │       │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/players/:id route
│   │   │       │   │   ├── archived/ — Generated types for the /api/players/archived route
│   │   │       │   │   │   ├── [id]/ — Generated types for the /api/players/archived/:id route
│   │   │       │   │   │   │   ├── restore/ — Generated types for the /api/players/archived/:id/restore route
│   │   │       │   │   │   │       ├── $types.d.ts — Generated SvelteKit types for the /api/players/archived/:id/restore route
│   │   │       │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/players/archived route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/players route
│   │   │       │   ├── settings/ — Generated types for the /api/settings route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /api/settings route
│   │   │       │   ├── stats/ — Generated types for the /api/stats route
│   │   │       │       ├── [playerId]/ — Generated types for the /api/stats/:playerId route
│   │   │       │           ├── checkout/ — Generated types for the /api/stats/:playerId/checkout route
│   │   │       │           │   ├── $types.d.ts — Generated SvelteKit types for the /api/stats/:playerId/checkout route
│   │   │       │           ├── $types.d.ts — Generated SvelteKit types for the /api/stats/:playerId route
│   │   │       ├── archive/ — Generated types for the /archive route
│   │   │       │   ├── $types.d.ts — Generated SvelteKit types for the /archive route
│   │   │       ├── history/ — Generated types for the /history route
│   │   │       │   ├── [id]/ — Generated types for the /history/:id route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /history/:id route
│   │   │       │   ├── $types.d.ts — Generated SvelteKit types for the /history route
│   │   │       ├── match/ — Generated types for the /match route
│   │   │       │   ├── [id]/ — Generated types for the /match/:id route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /match/:id route
│   │   │       │   ├── setup/ — Generated types for the /match/setup route
│   │   │       │       ├── $types.d.ts — Generated SvelteKit types for the /match/setup route
│   │   │       ├── players/ — Generated types for the /players route
│   │   │       │   ├── [id]/ — Generated types for the /players/:id route
│   │   │       │   │   ├── checkout/ — Generated types for the /players/:id/checkout route
│   │   │       │   │   │   ├── $types.d.ts — Generated SvelteKit types for the /players/:id/checkout route
│   │   │       │   │   ├── $types.d.ts — Generated SvelteKit types for the /players/:id route
│   │   │       │   ├── $types.d.ts — Generated SvelteKit types for the /players route
│   │   │       ├── $types.d.ts — Generated SvelteKit types for the / route
│   │   ├── route_meta_data.json — Route metadata used for type generation
│   ├── ambient.d.ts — Generated ambient type declarations
│   ├── non-ambient.d.ts — Generated non-ambient type declarations
│   ├── tsconfig.json — Generated tsconfig the root config extends
├── .vscode/ — VS Code workspace settings
│   ├── extensions.json — Recommended extensions (svelte.svelte-vscode)
├── build/ — adapter-node production build output (compiled server bundle) — not committed
├── docs/ — Research, testing and reference documentation (plus this wiki)
│   ├── players/ — Docs about the player-facing metrics
│   │   ├── metrics-tree.md — Catalog of every metric shown on the player detail page, with tab/section codes
│   ├── wiki/ — This OKF knowledge wiki (overview, glossary, file tree, pages)
│   ├── dartbord.html — Standalone HTML prototype/reference of the dartboard UI
│   ├── darts-rules-research.md — Research notes on official PDC/WDF leg/set turn-taking rules vs the app implementation
│   ├── gameplay-e2e.md — End-to-end gameplay simulation doc — player perspective, match/turn-level logic walkthrough
│   ├── gameplay-test-results.md — Recorded results of gameplay test runs
│   ├── img-uJOuvY-Q-zoom.png — Screenshot referenced by the docs (zoomed dartboard)
├── drizzle/ — Drizzle Kit SQL migrations for the `darts` PostgreSQL schema
│   ├── meta/ — Drizzle Kit migration metadata
│   │   ├── _journal.json — Migration journal — which migrations have been applied
│   │   ├── 0000_snapshot.json — Schema snapshot after migration 0000
│   │   ├── 0001_snapshot.json — Schema snapshot after migration 0001
│   ├── 0000_great_callisto.sql — Initial migration — players, matches, legs, turns, throws tables
│   ├── 0001_add_email.sql — Hand-written migration adding player email columns
│   ├── 0001_needy_lester.sql — Drizzle-generated migration (email/account groundwork)
│   ├── 0002_add_account_id.sql — Migration adding an account_id concept
│   ├── 0003_players_account_id.sql — Migration adding players.account_id column + index
│   ├── 0004_account_settings.sql — Migration creating account_settings table
│   ├── 0005_verification_tokens.sql — Migration creating verification_tokens table (email verification)
├── godaddy-cli/ — Vendored third-party Go CLI (github.com/Cabemo/godaddy-cli) used to manage GoDaddy domains/DNS from the terminal
│   ├── .git/ — Git repository metadata
│   │   ├── hooks/ — Sample git hooks (inactive defaults from git init)
│   │   │   ├── applypatch-msg.sample — Inactive sample git hook shipped with git init
│   │   │   ├── commit-msg.sample — Inactive sample git hook shipped with git init
│   │   │   ├── fsmonitor-watchman.sample — Inactive sample git hook shipped with git init
│   │   │   ├── post-update.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-applypatch.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-commit.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-merge-commit.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-push.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-rebase.sample — Inactive sample git hook shipped with git init
│   │   │   ├── pre-receive.sample — Inactive sample git hook shipped with git init
│   │   │   ├── prepare-commit-msg.sample — Inactive sample git hook shipped with git init
│   │   │   ├── push-to-checkout.sample — Inactive sample git hook shipped with git init
│   │   │   ├── sendemail-validate.sample — Inactive sample git hook shipped with git init
│   │   │   ├── update.sample — Inactive sample git hook shipped with git init
│   │   ├── info/ — Git repo info
│   │   │   ├── exclude — Per-repo ignore patterns (like .gitignore)
│   │   ├── logs/ — Reflogs (ref update history)
│   │   │   ├── refs/ — Reflog directory (ref update logs)
│   │   │   │   ├── heads/ — Local branch reflogs
│   │   │   │   │   ├── main — Reflog of local main branch
│   │   │   │   ├── remotes/ — Remote-tracking reflogs
│   │   │   │       ├── origin/ — Reflogs for origin
│   │   │   │           ├── HEAD — Reflog of origin's default branch
│   │   │   ├── HEAD — Reflog of HEAD movements
│   │   ├── objects/ — Git object database
│   │   │   ├── 00/ — Loose-object fan-out bucket
│   │   │   │   ├── 8977ffc83416cd70cb51a711cdbdbf48329950 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d422993f9d43109cf6cd3895ed0492bd6a1bf0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 01/ — Loose-object fan-out bucket
│   │   │   │   ├── 431b8b9d1da7179c0f5f040d45a1f8aa832f9d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── a6ff07bc28a0b33c2bb21001e4afb24c05d9e8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 04/ — Loose-object fan-out bucket
│   │   │   │   ├── 1d551550630c1ae3814a2ab97647e46883c3b1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 06/ — Loose-object fan-out bucket
│   │   │   │   ├── 55c8ce067dfbd08e638a4e23070579c9a5f438 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 72ac80390fd43dbc8944187c1e853c454b9a4c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 76e63919f7dda8a48cf55b4adf6f4d897e0b63 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 09/ — Loose-object fan-out bucket
│   │   │   │   ├── 745793c13d917341ea332da43171d5a6d02123 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── a7a2803895bc507032a49b764ef73f59c5a6a1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 0c/ — Loose-object fan-out bucket
│   │   │   │   ├── 7f8138b32ef17872dffcf595885dcbaa5fd8a6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 0d/ — Loose-object fan-out bucket
│   │   │   │   ├── 3b61926ed3982d1daa01b7f05c9950d568f216 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d7a52de0a7455bec9f7c0c219a72da176a10ba — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 0e/ — Loose-object fan-out bucket
│   │   │   │   ├── 8531779e66c4213273d8ad7f228d448351075e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 10/ — Loose-object fan-out bucket
│   │   │   │   ├── 685352767f0fe544ac4e0adc3c874dfd2ed428 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 12/ — Loose-object fan-out bucket
│   │   │   │   ├── 2acedb1cb1af9cfc079e73610de1bfc3c70d8f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e3968d432bc68f05f2b4d2f213097c3a058fab — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 13/ — Loose-object fan-out bucket
│   │   │   │   ├── 139a5b960f0aa81755839eea01d54d880145b3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d20aed2d7c650fa47f14cf2353f11d56f233d1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 15/ — Loose-object fan-out bucket
│   │   │   │   ├── 472c814164490b69b018187dffe7eefeb30c39 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8f54b25037f25a78b3f1218e7cdd6f9c70dc17 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 17/ — Loose-object fan-out bucket
│   │   │   │   ├── d84cdbcf1b8deab978bcdb743dabc88117c6f7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 18/ — Loose-object fan-out bucket
│   │   │   │   ├── c4416385603e9c04b8c9293c209cbff51b1bb8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 19/ — Loose-object fan-out bucket
│   │   │   │   ├── cdefc8fbd43b4eefd14786f4ee713ccd135895 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1a/ — Loose-object fan-out bucket
│   │   │   │   ├── e1cd67bb22dbbd4edc4dbb4f3bff8fecaf6146 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1b/ — Loose-object fan-out bucket
│   │   │   │   ├── e7e83f24ab560c41d75ff5d29e8c5dad453375 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1c/ — Loose-object fan-out bucket
│   │   │   │   ├── 94fe482e43f848ca068112eb821bfd1e8d345d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1d/ — Loose-object fan-out bucket
│   │   │   │   ├── 2586f0513b292e4d1718ac98a2e8fda53f5b3d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1e/ — Loose-object fan-out bucket
│   │   │   │   ├── 142ee99e28cbf22fa0d40787facd6442a8aeb8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 1f/ — Loose-object fan-out bucket
│   │   │   │   ├── 427eb6fcfe01ff7613435604a5cacdb6f07160 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── df60cdc7b8ccdf6c0eb2931c7bb08411379a03 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 22/ — Loose-object fan-out bucket
│   │   │   │   ├── 3f5a0892ef8501845a071d96ea7af70ff66731 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f7e34747e51f34c7d7ed765b12f699cba1ed4e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 23/ — Loose-object fan-out bucket
│   │   │   │   ├── 35a839bd77ece4c5afdc8d1ce7982d02096f69 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 7f9bfeed71a73ff7162c7f65a346fa34259044 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 84e1a3fe979471dbab805b124dbf4299a42768 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8c57636f5153a5eb0d3b786a050adca135c5c2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 24/ — Loose-object fan-out bucket
│   │   │   │   ├── 881f83a2a8a587a78d95573957acebc9579e7c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 25/ — Loose-object fan-out bucket
│   │   │   │   ├── afbf763adf48c97512d8d35f830c80a57590b5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 28/ — Loose-object fan-out bucket
│   │   │   │   ├── 40a6692046ba910bbc449d04632107b828033d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 29/ — Loose-object fan-out bucket
│   │   │   │   ├── 88b80abffa8727fda95d9c95827f3eca411722 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 2c/ — Loose-object fan-out bucket
│   │   │   │   ├── 489bb389910143b11483d0d7c9aed9b7dc6322 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── fb79539980ece427392341fb74e40bab8600e1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 2d/ — Loose-object fan-out bucket
│   │   │   │   ├── 5faf2f256f598cdfbe1ec224d360706292dbb1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 30/ — Loose-object fan-out bucket
│   │   │   │   ├── af1daef1c40a2ef02bf8f5e21f7f688ceb07f3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── da026ba20f664c6c30772eb0281f10e4a32aa3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 31/ — Loose-object fan-out bucket
│   │   │   │   ├── ff2c215f2da96fc62d18f8e5b52a48e2ca0cf9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 32/ — Loose-object fan-out bucket
│   │   │   │   ├── 8a1a408532b14d362cb58972ef5322bbf6a9db — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 34/ — Loose-object fan-out bucket
│   │   │   │   ├── 708ce241f18d9b9983ffe0bfcd26b867d11f63 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f3deeebe78405cc725f040b59325fd11cfff5a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 35/ — Loose-object fan-out bucket
│   │   │   │   ├── d7ddf61f12802e019e85e4ae6a256f2432c173 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 37/ — Loose-object fan-out bucket
│   │   │   │   ├── fb2d9e3b5326f117e453c093c35a5f39d8fde3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 3b/ — Loose-object fan-out bucket
│   │   │   │   ├── 4050e8af731190eb72f2bac52237810073cbd0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 3e/ — Loose-object fan-out bucket
│   │   │   │   ├── 7f3884f9cb621c0e4d9bea1f57d1662fb20fb2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 9dd5ac2bee7425d1688f943332dff4b1df61f8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 3f/ — Loose-object fan-out bucket
│   │   │   │   ├── af18d9ade880509b16e49417fece9290a652b3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── dd87e74770c969a645e9e86a49db01f8cab8b5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 40/ — Loose-object fan-out bucket
│   │   │   │   ├── a1c6b18c9a91b55e20ab26390b070d41683263 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 41/ — Loose-object fan-out bucket
│   │   │   │   ├── 51dc607ac40ca6f3d32a4e7938848c4140ffa1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f0c53279e1c572a4efdc4b69e5a312800a8eac — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 44/ — Loose-object fan-out bucket
│   │   │   │   ├── bbfe8267ec9b5ed677ccc0852f74b2dfdcf05c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 47/ — Loose-object fan-out bucket
│   │   │   │   ├── d0d0a8b307480ae5da153aa26632f5b55189d9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 48/ — Loose-object fan-out bucket
│   │   │   │   ├── 2fd9fa233ca00ab5caf3808c2995cc7a9e810a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 4a/ — Loose-object fan-out bucket
│   │   │   │   ├── 56cdc4ca5dc11002a39ffd21fc756b87426205 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 4b/ — Loose-object fan-out bucket
│   │   │   │   ├── c9c2542132da3b8a6cb38bb0b479ed8350d5d8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 50/ — Loose-object fan-out bucket
│   │   │   │   ├── 19968fa0c00578e2925f64df1ddccb9c8f001e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 95129bbbf199dda935a4213e554629b408a7d3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c2b7f8b07f4ade5fce40b5ca7bf74dc05916ed — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 51/ — Loose-object fan-out bucket
│   │   │   │   ├── dbaba6eae535713a5ea79ebdf733fc60dd5f50 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 52/ — Loose-object fan-out bucket
│   │   │   │   ├── 3ceb04bf63df127e86217f4ca81b4ec9d33072 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 53/ — Loose-object fan-out bucket
│   │   │   │   ├── 4343e3e08a96f4d8c89bc5fcb36ee41056c817 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 74f5e69ec8e80cd69231f257d0c4ba0b6354a4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8bcb5513d89abbe30864cf4eb8ed66cc7fc32d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 90fe5746d8b4134bdb7daffaa23ea39eb9acf4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 54/ — Loose-object fan-out bucket
│   │   │   │   ├── 3065a0dec4a0243c7f300a05cb711d98ddbe50 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── eebcbd369782cb9730a717f68af74cab8ed880 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 55/ — Loose-object fan-out bucket
│   │   │   │   ├── 050f4a910241a14a834f9636448f1ed2c92a16 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 58/ — Loose-object fan-out bucket
│   │   │   │   ├── a58eb7e0b53a34cb9a488056a3d9ed0e638163 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── ddd26a6cf1399ecde13af0ad25568940523426 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 59/ — Loose-object fan-out bucket
│   │   │   │   ├── 6929e22a468471c6d2cb870e2820fd2909bae7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── de3fbd9ead8a05b50cd4d0cfbe6659cd2005ef — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5a/ — Loose-object fan-out bucket
│   │   │   │   ├── 57140ec7a8812897c9a2bc42ccce3636355689 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── cff706134fff8a49211edc23683db6fce769fa — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5b/ — Loose-object fan-out bucket
│   │   │   │   ├── 52f5ef8fa6d91678921c3bc4252702a1572b80 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5c/ — Loose-object fan-out bucket
│   │   │   │   ├── 2f094a97c2ce73faef6e2b1095b956140bbd65 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 7a406d36cfbb93e5bdc9202cf8e740e47eab71 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 887022294e1936a24903fb06ee117daa2673eb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5d/ — Loose-object fan-out bucket
│   │   │   │   ├── 2dc0b9034c62d5a0c4243b615d9a91b2cfd277 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5e/ — Loose-object fan-out bucket
│   │   │   │   ├── ad8e66c5d79522f90e5883b7b8603f07c3d8f9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 5f/ — Loose-object fan-out bucket
│   │   │   │   ├── 1448ee0b385c2efac7b80c8f19138095f1388c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 5db15166fda75b8de25f5b661837402514f8f9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 60/ — Loose-object fan-out bucket
│   │   │   │   ├── 3b3288810c8ee5b7f357cff156ad60200938c9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── df3f0e73a55e9d763471df1eb183a4fee49209 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 63/ — Loose-object fan-out bucket
│   │   │   │   ├── 61d99d460b171ff4225220ee4e919024f4911e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 65/ — Loose-object fan-out bucket
│   │   │   │   ├── 7b4196513d683ad866d1c08097b8fd4e58970b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 66/ — Loose-object fan-out bucket
│   │   │   │   ├── 4d7059ccdc0abb3e9e9c6577e123fee44a187e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 82a9a406af26d3d835aedaace7187e3ca80b96 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 67/ — Loose-object fan-out bucket
│   │   │   │   ├── 2a578282155cd9e0ca0c7ade52ec5cb29c6a2c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f8743663041160577e0220d9dffe9010e478a3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 68/ — Loose-object fan-out bucket
│   │   │   │   ├── 7b0e18230aa2ccadd44d28054f28f068d1b3eb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6a/ — Loose-object fan-out bucket
│   │   │   │   ├── 5bcce636fd71c72d913a58d5a940d0a071cb0c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8aadefdcd3b2d05981e842562744b7685ba5e9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d7afa0503b3a5446a4b0b9ba22ac4b28ecc9f1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d85211b541c7e317d3c79a178301422e0ee983 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f0fb7cd8e3e5b843ced78976e7bec6d2d6dc2b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6b/ — Loose-object fan-out bucket
│   │   │   │   ├── ae6edd81037df7d37ae98fe857a40d8543f891 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── afe5c7fd9c4d2b62fc4beeb4c87092fc8c8599 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6c/ — Loose-object fan-out bucket
│   │   │   │   ├── d0e61380de0515b7328eba8e614dbfdfb75b68 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6d/ — Loose-object fan-out bucket
│   │   │   │   ├── 6b609e6131cb5ccdd78e98ed64f37ba27b5eea — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 76409a4ad47c59ac5bd70546c0a9d23d2988c4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6e/ — Loose-object fan-out bucket
│   │   │   │   ├── 101e80fc96ccf0c3c527504e3321e540794cff — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 2c069119696f6e9d240ab5b7795718cbf16804 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 6f/ — Loose-object fan-out bucket
│   │   │   │   ├── 1eb8b040aca00f2fd99293602661e747bc38d1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c75f594fafc4d344712466afe032a4c57ead74 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 71/ — Loose-object fan-out bucket
│   │   │   │   ├── 752f600770382353e5b39939da19ef60a95a6a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e2d6fc97f452c60945458e03f96cf995fe02e2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 72/ — Loose-object fan-out bucket
│   │   │   │   ├── 9ff322b6994cb2e43a2e104ff77e03c9ceff8c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 73/ — Loose-object fan-out bucket
│   │   │   │   ├── 64c115892350060579dab31f72e7e414bfb27e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 75/ — Loose-object fan-out bucket
│   │   │   │   ├── 2e6870edfc6210b0baddd22d71e3b89ca535cb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── bcec0abe3c2f9013f4cdd26892b6ca26cb10c7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 76/ — Loose-object fan-out bucket
│   │   │   │   ├── 78c44dd5d17d75e0ffd2574b7300532c04f4d7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c631666a310a2cae6c3eda27e01631d7d7a2ea — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 78/ — Loose-object fan-out bucket
│   │   │   │   ├── 397f729619411e758740b4e6000400be771d2e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 7a/ — Loose-object fan-out bucket
│   │   │   │   ├── 965af5020469f5fdb62ad6b220d7800b08d34c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 7c/ — Loose-object fan-out bucket
│   │   │   │   ├── de850f758c4d38b3ff1cbebe5934a38a6dba3b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e9279c4f594a79b14f3da5e742593104a1e09d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 7d/ — Loose-object fan-out bucket
│   │   │   │   ├── 2cff5fcde0c8a2f79380a5acca5aa3d30000c0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 7f/ — Loose-object fan-out bucket
│   │   │   │   ├── 361a698a60bb2865c7256cd40bc330ced6f000 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e6b8b128842cd2b1b47a12a3beb4842b76bdf7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 83/ — Loose-object fan-out bucket
│   │   │   │   ├── 138069f86d768622b92c5e9b11774535963e69 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 231d8d626669a4f341c4645688ad11c9a6f2ce — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 80f4ac9fa7353806c553b87fb6aed4bf86dcd0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 85/ — Loose-object fan-out bucket
│   │   │   │   ├── e77155c81d62da64874c8a58e30edced5fa5ad — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── f83a58196583b5b44ff6f983ea84a533e322e1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 87/ — Loose-object fan-out bucket
│   │   │   │   ├── ff0975e6729e8d9270039461ab0ba6d5ecc31b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 89/ — Loose-object fan-out bucket
│   │   │   │   ├── 85781a1b7af31e6c15ecedf077cece5a150d19 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8a/ — Loose-object fan-out bucket
│   │   │   │   ├── 0f4f98b47d6ec59f899204405c740667ef7ead — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e7d6cb4a6b5a4b0c3f5be7d52f7bddb7be562b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8c/ — Loose-object fan-out bucket
│   │   │   │   ├── 25a034370a706ba92c33361da0201c99370b73 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── b58f2605ab86f6cab52434f0a7fc2f49e02050 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8d/ — Loose-object fan-out bucket
│   │   │   │   ├── 370f5cc11d7046807ddd7daec4bbd756347a01 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 5cb8d088cdc4d0e1d32be6edfe87f83a8f26b2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 815ade22fffdcbb364f30f0ade00275d1ca421 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── cf5aa4c0e68090b0f000d2150e09c927cedbf3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8e/ — Loose-object fan-out bucket
│   │   │   │   ├── a5e6aacddc7621320777ffd0b746b43561e39b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 8f/ — Loose-object fan-out bucket
│   │   │   │   ├── aa499fed241c25fc693622c98ba946630b3403 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 92/ — Loose-object fan-out bucket
│   │   │   │   ├── 1e9390a34d82a3956bb9fd78a85b1624cdb179 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 93/ — Loose-object fan-out bucket
│   │   │   │   ├── 6ecbdabcc9cfcbfdafcd4b0eec8b2f40b96311 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 94/ — Loose-object fan-out bucket
│   │   │   │   ├── 9eb157ccff200a7cb5325e84952cc613f321f0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 95/ — Loose-object fan-out bucket
│   │   │   │   ├── 6fc0ba3fb3b4d1bbfa0700b1d7454a06c3dab0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 7cfe1385058efb1fb86d7c559fa77831eda663 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── b7befb7ebf2e5190cf10dc801d059501c986b8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 96/ — Loose-object fan-out bucket
│   │   │   │   ├── 29e47fc517bd54b004cb64160fea5b19a6b259 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 3fe76db338f456e3df9ce7ffee35f80e342f5f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 97/ — Loose-object fan-out bucket
│   │   │   │   ├── 4307b7e100ab1553ceb2c0b93c66c8bc9651df — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 9b/ — Loose-object fan-out bucket
│   │   │   │   ├── 5d730ed901d0c508ead8c1104cef647467bc5f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── 9e/ — Loose-object fan-out bucket
│   │   │   │   ├── 293d23fc701f1ca92ae3c50bcdc993fe10f83e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a1/ — Loose-object fan-out bucket
│   │   │   │   ├── 4f97778cf2b80fb8ad71341b5bb29f83a82091 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── ca596624b685731e5a5bb7c3454d3893598e6a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a2/ — Loose-object fan-out bucket
│   │   │   │   ├── de658591925043cebee3c25c98545d9892d1cf — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a3/ — Loose-object fan-out bucket
│   │   │   │   ├── e8172a13049a31dc1b942643d218af593fdec1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a4/ — Loose-object fan-out bucket
│   │   │   │   ├── 6d1d3f36eceb3109ebd0dbae4e891e43c83722 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a5/ — Loose-object fan-out bucket
│   │   │   │   ├── ce176cb3f6399fb3292594a0d74f7a4aa8c9e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a6/ — Loose-object fan-out bucket
│   │   │   │   ├── 187c31153890a9ab1f92238eccedd223205b55 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 3cca62799fbec43e2a3fe236fc03fee0c0dbf5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a8/ — Loose-object fan-out bucket
│   │   │   │   ├── 028adf8393356f91913752919c234cc4fb4fc7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8dc9530fe1866d642949846e11d753b20a8993 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── a9/ — Loose-object fan-out bucket
│   │   │   │   ├── 3be9e00405697626efd308a672c445eb281db3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ab/ — Loose-object fan-out bucket
│   │   │   │   ├── f2f4f9a4429c9d1113f0dc351a94b36d095e10 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ac/ — Loose-object fan-out bucket
│   │   │   │   ├── 1fd812d0b24f75e7c9d8ee8d1db87f81a4a8f3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ae/ — Loose-object fan-out bucket
│   │   │   │   ├── 702afbcad6ba4812603faca68fee1eff9f3c85 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 7c52fed4244cdfff572a08843175dd1360734e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d26f280178d1e51fff157cb6500a27710702de — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b0/ — Loose-object fan-out bucket
│   │   │   │   ├── 06b5408d6b1d55270a3e1b5c1ba259d4081e40 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b1/ — Loose-object fan-out bucket
│   │   │   │   ├── ef9c3b43122207c6714fb384e007c8fc24db24 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b2/ — Loose-object fan-out bucket
│   │   │   │   ├── 384c52f8bd39893007564ab7cbb1947992c144 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b6/ — Loose-object fan-out bucket
│   │   │   │   ├── 3720e16bc308693fdc83e9d91a32f426529733 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── ba8e456fb9990a5dfb56a34ef949dd4e8bcf75 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── b8/ — Loose-object fan-out bucket
│   │   │   │   ├── 1ce7065308e11c355ccd8eb21716c58254e8b9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ba/ — Loose-object fan-out bucket
│   │   │   │   ├── 235495fcdeccb9315a527f8ecb27a512f27937 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 2aaf92b09c4372df83073adf5af065643d693e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 354d6ae5fd7559530b0b28e3fb0ac9781caf94 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── bb/ — Loose-object fan-out bucket
│   │   │   │   ├── 72a4288daf8aa52b71622a70d0e76effb02cd4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── be/ — Loose-object fan-out bucket
│   │   │   │   ├── 08ba8ddf0329e97a57f41554cf40c9d867f3f8 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 13d5fe188194b347068b0942f81b2a5277f73b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 36b709a8d1eecfb738e7e7e23319fb51a80ec3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── bf/ — Loose-object fan-out bucket
│   │   │   │   ├── 5c38a0fdc696365265ec0c592d75f9bce4ce21 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 714c75552c8b280d1306f5050a342cd25439b5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c0/ — Loose-object fan-out bucket
│   │   │   │   ├── 626d136fcfbf3c4fd85b310ab89c86d126692d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c1/ — Loose-object fan-out bucket
│   │   │   │   ├── 2d6c1a18ecdbf0440236486c5238011c2c25c3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── dffa76be1f035381ff618b46041de133bf386e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c4/ — Loose-object fan-out bucket
│   │   │   │   ├── 60dc15ac5f66558ce11269ef4c594ddd66992f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 72a594d650887808a0ce2b7b73480e63dc42a9 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c5/ — Loose-object fan-out bucket
│   │   │   │   ├── 98886e148d3ce869ad6505a789df28761a3008 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c9081c3db88000f7d9b09112234210d231673a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c6/ — Loose-object fan-out bucket
│   │   │   │   ├── 9c09ca2c12f6d01f43962054b66e3d428ebae7 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── fb34dcaaef29dc00396678f3daee02a39e582a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c7/ — Loose-object fan-out bucket
│   │   │   │   ├── 714a8c09f31038e7197dec2a442c147577c3fb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c8/ — Loose-object fan-out bucket
│   │   │   │   ├── 10d2f30ec31769964c013d6695b311504a4069 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── c9/ — Loose-object fan-out bucket
│   │   │   │   ├── 3fb0d0cf70b1e91fc5a2d758569e7548965024 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ca/ — Loose-object fan-out bucket
│   │   │   │   ├── c8ca44fdfed510e1560f103a79de4d410e1dbf — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── cb/ — Loose-object fan-out bucket
│   │   │   │   ├── a3c31c650181de987a3ba18513005ca34090e1 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── cc/ — Loose-object fan-out bucket
│   │   │   │   ├── 2ad6b8571eead9ea4238d3cc0abdcef25b0a00 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── edafa741799f4dfc968e5dc0cc1d633e4c89ac — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── cd/ — Loose-object fan-out bucket
│   │   │   │   ├── 607b762712faf8cd50d87e896bd713d37d6d60 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d0/ — Loose-object fan-out bucket
│   │   │   │   ├── 0091acad27c527e3b9a0fa9c772b947b3f7642 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 8a9f0ee8cb77010506042f14fc5f66ee5527af — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d2/ — Loose-object fan-out bucket
│   │   │   │   ├── e896f373e11a0ebe3d4fad9204243283f7cd54 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d3/ — Loose-object fan-out bucket
│   │   │   │   ├── ab71ede7dd47c1702bd1efbba117fe35ed1f0d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d4/ — Loose-object fan-out bucket
│   │   │   │   ├── 55314e6f8b9cd0ac6c47244d32e9025bd686f5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── bf528e34c61f285c5c2c434abcccadf422fa95 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── d9/ — Loose-object fan-out bucket
│   │   │   │   ├── f8d7fb15c4be28c3bd526842323cafbe2df8eb — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── de/ — Loose-object fan-out bucket
│   │   │   │   ├── 0db8641f6d56cf6e8021f291cd52cbf938e1c5 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d84d19c5103db2679bb688092ed45d9158c334 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── df/ — Loose-object fan-out bucket
│   │   │   │   ├── dadf91c87c8b5488c65456ffb34621c5c388e4 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e89362aa393fc033738d37db8bce4ee734196b — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e0/ — Loose-object fan-out bucket
│   │   │   │   ├── 6bd3919d45cfdd9ea4d74c1dd2b98fb0a7b16c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e2/ — Loose-object fan-out bucket
│   │   │   │   ├── d6fcae6d29367ee0cc31fa883b1546857daacf — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e5/ — Loose-object fan-out bucket
│   │   │   │   ├── 1b158c1cdf6f05b4c638a7dd91b08246f0f93c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e6/ — Loose-object fan-out bucket
│   │   │   │   ├── 0918b23929022b9541bf5f2b93bfb876422734 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── e7/ — Loose-object fan-out bucket
│   │   │   │   ├── c527d459aa5563a7af2dd2c6342e248c0e30e6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e014f1bb1c6eb535631fbee720f87989dc5ef0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ea/ — Loose-object fan-out bucket
│   │   │   │   ├── b69c846b5808f36ebf96cdd0d7cf069c37f62d — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ed/ — Loose-object fan-out bucket
│   │   │   │   ├── 18ccca1636be1f165c2df8e34659e1e069a245 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 290dbbf2c266f3920a5bc69894041c19d4ca6e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── b8dd9cac162179ca805531f005aa8086d6538f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c255e454d966db4a8b807227c6d5798a1220ac — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── d229452d31093e80fc7e51b2696a78e3df8bb0 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ee/ — Loose-object fan-out bucket
│   │   │   │   ├── c7465454146453b21ca2c3d3adb938ce95b1b6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── ef/ — Loose-object fan-out bucket
│   │   │   │   ├── 02491debfc4b9a1f7247401b14fc6fd5b8b088 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 88127fe33e2905f19bdda92549ae7a1c8be391 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── dc6681540a827b6caee35f257b0593591b6a1c — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f0/ — Loose-object fan-out bucket
│   │   │   │   ├── aa7727d1e5ebc987677525b85370ce9c322538 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f1/ — Loose-object fan-out bucket
│   │   │   │   ├── 6be6c38b89edd58c7dc62f5ad0bec75124f638 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 6d329dadaec53f6b16dad9544263d3d7b16800 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f2/ — Loose-object fan-out bucket
│   │   │   │   ├── 0fe553639cfa033dab9ffba04d7163626d8d2a — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f4/ — Loose-object fan-out bucket
│   │   │   │   ├── 508663207a96d2897166926e154e0bbafb0b7f — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── b1c8064e2fe772f4db373adf355aa1f00235ae — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── c99f54524a61c1160ebe4bba5371e4c66f1fb6 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f5/ — Loose-object fan-out bucket
│   │   │   │   ├── 0665cf0b81f7335e3c073e54782897c22a3d65 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e116adc7bf2ab93713ec55e8b0e47ad49f0770 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f6/ — Loose-object fan-out bucket
│   │   │   │   ├── c002e15776fce863f1fd93605c6b44ce08ebd3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── e6ce5787b3984d915fa30c05f06db54b6a3e87 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── f7/ — Loose-object fan-out bucket
│   │   │   │   ├── 388c615fdd95aba5174f6f728cdcd3939e4c89 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── fa/ — Loose-object fan-out bucket
│   │   │   │   ├── 34c530850a3d76f5442d2060fb46bfbcc58cdf — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── 5eef2f3937eb415318ba675204981951927ad3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── fc/ — Loose-object fan-out bucket
│   │   │   │   ├── c4c7cd3d8e91fd4c420c8455650c6fd5aa3dec — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── fd/ — Loose-object fan-out bucket
│   │   │   │   ├── bcfadf184f48dfd1dac4b9f5768d6b0be74c8e — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── fe/ — Loose-object fan-out bucket
│   │   │   │   ├── 065e04183c76fe3358a52bcbf3b1ea86cc59e3 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   │   ├── b241a15648973945416f6060ad18f94aacdcb2 — Loose git object (blob/tree/commit), content-addressed by SHA
│   │   │   ├── info/ — Object-store metadata
│   │   │   ├── pack/ — Packed git objects
│   │   │       ├── pack-9f439ef4d97fd4abe8714f79558701eaf4630cd7.idx — Pack index — object offsets in the packfile
│   │   │       ├── pack-9f439ef4d97fd4abe8714f79558701eaf4630cd7.pack — Packfile of zlib-compressed git objects
│   │   │       ├── pack-9f439ef4d97fd4abe8714f79558701eaf4630cd7.rev — Reverse index (offset → object id)
│   │   ├── refs/ — Refs (branches, tags, remotes)
│   │   │   ├── heads/ — Local branch refs
│   │   │   │   ├── main — Local main branch tip
│   │   │   ├── remotes/ — Remote-tracking refs
│   │   │   │   ├── origin/ — Refs for the origin remote
│   │   │   │       ├── HEAD — Default branch of origin
│   │   │   ├── tags/ — Tag refs (none present)
│   │   ├── config — Repo-local git config (remote origin, branch settings)
│   │   ├── description — Default gitweb repo description
│   │   ├── FETCH_HEAD — Branch tips from the most recent fetch
│   │   ├── HEAD — Current branch pointer
│   │   ├── index — Binary staging-area index
│   │   ├── index-5d096554-8a83-46e2-bc50-64556dcf303c.tmp — Temp file from an interrupted git index write
│   │   ├── packed-refs — Packed refs list
│   ├── internal/ — Go source packages (config, domains, records, util)
│   │   ├── config/ — Go package — GoDaddy API credentials/config loading
│   │   │   ├── config.go — GoDaddy API credentials/config loading
│   │   ├── domains/ — Go package — domain list/search commands
│   │   │   ├── domains.go — Domain commands — list, search availability
│   │   ├── records/ — Go package — DNS record management
│   │   │   ├── records.go — DNS record management commands
│   │   ├── util/ — Go package — shared CLI helpers
│   │       ├── flags.go — Shared CLI flag helpers
│   │       ├── util.go — Shared CLI utilities
│   ├── .gitignore — godaddy-cli's own ignore rules
│   ├── go.mod — Go module definition and dependency list
│   ├── go.sum — Go dependency checksums
│   ├── godaddy.exe — Pre-built Windows binary of the CLI
│   ├── godaddy.go — CLI entrypoint — command wiring and root cobra command
│   ├── LICENSE — License for the vendored godaddy-cli project
│   ├── Makefile — Build/install targets for the Go CLI
│   ├── README.md — godaddy-cli usage docs (setup, examples)
├── node_modules/ — Installed npm dependencies
├── scripts/ — One-off developer tooling scripts
│   ├── elevenlabs-test.ts — Scratch script exercising the ElevenLabs TTS API
│   ├── generate-soundboard.ts — Generates the caller soundboard MP3s via ElevenLabs (score-0..180, bust, ton-80, …) with configurable voice + prefix
├── src/ — Application source (SvelteKit)
│   ├── lib/ — Shared library code
│   │   ├── assets/ — Library assets
│   │   │   ├── favicon.svg — Favicon source asset
│   │   ├── components/ — Shared Svelte components
│   │   │   ├── ui/ — Reusable UI components
│   │   │   │   ├── Dartboard/ — Reserved folder for dartboard subcomponents (currently empty)
│   │   │   │   ├── AnimatedNumber.svelte — Number display that animates (counts) between values
│   │   │   │   ├── Dartboard.svelte — Interactive SVG dartboard — tap segments (single/double/treble/bull) to enter darts
│   │   │   │   ├── DoubleBezel.svelte — Bezel overlay highlighting double-in/double-out targets
│   │   │   │   ├── EmailGate.svelte — Email capture/verification gate dialog
│   │   │   │   ├── EyebrowTag.svelte — Small uppercase label/tag
│   │   │   │   ├── FloatingNav.svelte — Floating bottom navigation bar
│   │   │   │   ├── FullscreenButton.svelte — Toggle fullscreen mode
│   │   │   │   ├── index.ts — UI component barrel exports
│   │   │   │   ├── LoadingOverlay.svelte — Full-screen loading overlay
│   │   │   │   ├── PillButton.svelte — Pill-shaped CTA button
│   │   │   │   ├── SearchSelect.svelte — Searchable select (player picker)
│   │   │   │   ├── StatBadge.svelte — Compact stat display badge
│   │   │   │   ├── StyledSelect.svelte — Styled native select
│   │   │   │   ├── ThemeSwitcher.svelte — Light/dark theme toggle
│   │   │   │   ├── Toast.svelte — Toast notification UI
│   │   │   │   ├── Tooltip.svelte — Hover tooltip — fixed-position bubble measured via getBoundingClientRect so it never clips in overflow containers
│   │   │   ├── conquest/ — Trebles & Territories (Conquest) game components
│   │   │   │   ├── ConquestBoard.svelte — SVG conquest board — clickable territories, pick-candidate highlighting, duel overlay, current-visit dart markers
│   │   │   │   ├── ConquestScoreboard.svelte — Per-player conquest cards — territories/continents held, score, darts remaining, dead/active states
│   │   │   ├── .gitkeep — Directory placeholder
│   │   ├── db/ — Database layer (Drizzle ORM + PostgreSQL)
│   │   │   ├── database-service.ts — Service layer over the schema — CRUD for players, matches, legs, turns and stats queries
│   │   │   ├── index.ts — Lazy Drizzle client — postgres() connection from DATABASE_URL at runtime
│   │   │   ├── init.ts — DB bootstrap script (npm run db:init) — creates schema/tables if missing
│   │   │   ├── schema.ts — Drizzle schema — `darts` PG schema: players, matches, legs, turns, throws, account_settings, verification_tokens
│   │   │   ├── verify.ts — DB connection verification script (npm run db:verify)
│   │   ├── email/ — Email sending
│   │   │   ├── email.service.ts — Sends email via Emailit SMTP using emailjs (verification links)
│   │   ├── game/ — Pure game logic (no UI, no DB)
│   │   │   ├── .gitkeep — Directory placeholder
│   │   │   ├── checkout-suggestions.ts — Optimal checkout combination engine (≤170 finishes)
│   │   │   ├── conquest-engine.ts — Pure Trebles & Territories engine — claim/siege/resurrect/duel state machine, standings (see conquest-engine-and-live-game)
│   │   │   ├── conquest-setup.ts — Conquest setup — 51–1501 preset ladder, duration estimate, validation
│   │   │   ├── index.ts — Game module barrel export
│   │   │   ├── match-engine.ts — Match state machine — legs/sets progression, thrower rotation, win/bust transitions, match completion
│   │   │   ├── scoring.ts — Scoring math — per-dart points (singles/doubles/trebles/bull), turn totals, bust + checkout detection
│   │   │   ├── stats-engine.ts — Statistics engine — averages, checkout %, 180s, highest finish, last-20-legs window
│   │   │   ├── types.ts — Game types — MatchConfig, MatchState, LegState, TurnRecord, DartData
│   │   ├── stores/ — Svelte 5 rune stores (shared client state)
│   │   │   ├── .gitkeep — Directory placeholder
│   │   │   ├── email.ts — Email gate / verification state
│   │   │   ├── fullscreen.ts — Fullscreen state
│   │   │   ├── loading.ts — Global loading state
│   │   │   ├── theme.ts — Theme (light/dark) state + persistence
│   │   │   ├── toast.ts — Toast notification state
│   │   │   ├── voice-settings.ts — Voice caller settings (enabled, chosen voice)
│   │   ├── types/ — Shared type definitions (placeholder dir)
│   │   │   ├── .gitkeep — Directory placeholder
│   │   ├── utils/ — Utility helpers
│   │   │   ├── .gitkeep — Directory placeholder
│   │   │   ├── audio-effects.ts — Audio playback + dramatic voice effect profiles for the soundboard
│   │   │   ├── darts-caller.ts — Voice caller — plays ElevenLabs soundboard clips for scores/events, Kokoro TTS for dynamic player names (in-browser)
│   │   ├── index.ts — Library barrel export
│   ├── routes/ — SvelteKit routes (pages + API endpoints), filesystem routing
│   │   ├── api/ — REST API endpoints (SvelteKit +server.ts)
│   │   │   ├── insights/ — API route group — player insights
│   │   │   │   ├── [playerId]/ — [playerId] directory
│   │   │   │       ├── +server.ts — GET player insights (derived analytics)
│   │   │   ├── matches/ — API route group — match CRUD, legs, turns
│   │   │   │   ├── [id]/ — Match-detail API route group (GET/PUT, legs, turns, players)
│   │   │   │   │   ├── legs/ — API route — GET legs of a match
│   │   │   │   │   │   ├── +server.ts — GET legs of a match
│   │   │   │   │   ├── players/ — API route group — per-player match stats
│   │   │   │   │   │   ├── [playerId]/ — API route — GET per-player stats within a match
│   │   │   │   │   │       ├── +server.ts — GET per-player stats within a match
│   │   │   │   │   ├── turns/ — API route — POST record a turn (3 darts)
│   │   │   │   │   │   ├── +server.ts — POST record a turn (3 darts) during play
│   │   │   │   │   ├── +server.ts — GET match detail / PUT update match status
│   │   │   │   ├── with-players/ — API route — GET matches joined with player info
│   │   │   │   │   ├── +server.ts — GET matches joined with player info
│   │   │   │   ├── +server.ts — GET list matches / POST create match
│   │   │   ├── players/ — API route group — player management
│   │   │   │   ├── [id]/ — Player-detail API route group (GET/PUT, soft delete, history)
│   │   │   │   │   ├── matches/ — API route — GET match history for a player
│   │   │   │   │   │   ├── +server.ts — GET match history for a player
│   │   │   │   │   ├── +server.ts — GET/PUT player, DELETE soft-delete (archive)
│   │   │   │   ├── archived/ — API route group — archived players
│   │   │   │   │   ├── [id]/ — Archived-player API route group
│   │   │   │   │   │   ├── restore/ — API route — POST restore archived player
│   │   │   │   │   │       ├── +server.ts — POST restore an archived player
│   │   │   │   │   ├── +server.ts — GET archived players
│   │   │   │   ├── +server.ts — GET active players / POST create player
│   │   │   ├── settings/ — API route — GET/PUT account settings
│   │   │   │   ├── +server.ts — GET/PUT account settings
│   │   │   ├── stats/ — API route group — player statistics
│   │   │       ├── [playerId]/ — API route — GET aggregate player stats
│   │   │           ├── checkout/ — API route — GET player checkout stats
│   │   │           │   ├── +server.ts — GET player checkout statistics
│   │   │           ├── +server.ts — GET aggregate player statistics
│   │   ├── archive/ — Route — archived players page
│   │   │   ├── +page.svelte — Archived (soft-deleted) players view with restore
│   │   ├── history/ — Match history pages
│   │   │   ├── [id]/ — Route — past-match detail
│   │   │   │   ├── +page.svelte — Match detail — leg/turn breakdown of a past match
│   │   │   ├── +page.svelte — Match history list
│   │   ├── match/ — Live match pages
│   │   │   ├── [id]/ — Route — live match scorer
│   │   │   │   ├── +page.svelte — Live match scorer — dartboard, scores, checkout hints, live stats
│   │   │   ├── conquest/ — Route — live Trebles & Territories (Conquest) game
│   │   │   │   ├── +page.svelte — Live conquest game — board, scoreboard, war-log, altar resurrection, duels, podium
│   │   │   ├── setup/ — Route — match configuration
│   │   │       ├── +page.svelte — Match setup — pick players, format (301/501/701/1001, legs, sets, double-in/out)
│   │   ├── players/ — Player pages
│   │   │   ├── [id]/ — Route — player profile/stats
│   │   │   │   ├── checkout/ — Route — player checkout stats
│   │   │   │   │   ├── +page.svelte — Player checkout stats page (finishes by range)
│   │   │   │   ├── +page.svelte — Player profile — career stats and insights
│   │   │   ├── +page.svelte — Player management (create/select players, archive)
│   │   ├── +layout.svelte — Root layout — theme, floating nav, toasts, global styling
│   │   ├── +page.svelte — Home page / dashboard
│   ├── app.css — Global styles — Tailwind CSS v4 import, theme tokens, fonts (Geist Sans / Clash Display)
│   ├── app.d.ts — Ambient app types (App.Error, Locals)
│   ├── app.html — HTML shell for every page
├── static/ — Static assets served as-is by SvelteKit
│   ├── audio/ — Caller soundboard — pre-generated voice clips for scores and match events
│   │   ├── .archive/ — Experimental 180-call takes kept for reference
│   │   │   ├── 180-test-dramatic.1.mp3 — Experimental one-off 180-call take kept for reference
│   │   │   ├── 180-test-scottish.mp3 — Experimental one-off 180-call take kept for reference
│   │   │   ├── 180-test-scream.1.mp3 — Experimental one-off 180-call take kept for reference
│   │   │   ├── 180-test-slow.1.mp3 — Experimental one-off 180-call take kept for reference
│   │   │   ├── 180-test.1.mp3 — Experimental one-off 180-call take kept for reference
│   │   ├── bust.mp3 — Caller clip for the "bust" event (default voice)
│   │   ├── century.mp3 — Caller clip for the "century" event (default voice)
│   │   ├── change-of-throw.mp3 — Caller clip for the "change of throw" event (default voice)
│   │   ├── checkout.mp3 — Caller clip for the "checkout" event (default voice)
│   │   ├── first-throw.mp3 — Caller clip for the "first throw" event (default voice)
│   │   ├── game-on.mp3 — Caller clip for the "game on" event (default voice)
│   │   ├── high-ton.mp3 — Caller clip for the "high ton" event (default voice)
│   │   ├── leg-winner.mp3 — Caller clip for the "leg winner" event (default voice)
│   │   ├── match-winner.mp3 — Caller clip for the "match winner" event (default voice)
│   │   ├── next-leg.mp3 — Caller clip for the "next leg" event (default voice)
│   │   ├── next-set.mp3 — Caller clip for the "next set" event (default voice)
│   │   ├── player1-starting.mp3 — Caller clip for the "player1 starting" event (default voice)
│   │   ├── player2-starting.mp3 — Caller clip for the "player2 starting" event (default voice)
│   │   ├── score-0.mp3 — Caller clip announcing score 0 (default voice)
│   │   ├── score-1.mp3 — Caller clip announcing score 1 (default voice)
│   │   ├── score-10.mp3 — Caller clip announcing score 10 (default voice)
│   │   ├── score-100.mp3 — Caller clip announcing score 100 (default voice)
│   │   ├── score-101.mp3 — Caller clip announcing score 101 (default voice)
│   │   ├── score-102.mp3 — Caller clip announcing score 102 (default voice)
│   │   ├── score-103.mp3 — Caller clip announcing score 103 (default voice)
│   │   ├── score-104.mp3 — Caller clip announcing score 104 (default voice)
│   │   ├── score-105.mp3 — Caller clip announcing score 105 (default voice)
│   │   ├── score-106.mp3 — Caller clip announcing score 106 (default voice)
│   │   ├── score-107.mp3 — Caller clip announcing score 107 (default voice)
│   │   ├── score-108.mp3 — Caller clip announcing score 108 (default voice)
│   │   ├── score-109.mp3 — Caller clip announcing score 109 (default voice)
│   │   ├── score-11.mp3 — Caller clip announcing score 11 (default voice)
│   │   ├── score-110.mp3 — Caller clip announcing score 110 (default voice)
│   │   ├── score-111.mp3 — Caller clip announcing score 111 (default voice)
│   │   ├── score-112.mp3 — Caller clip announcing score 112 (default voice)
│   │   ├── score-113.mp3 — Caller clip announcing score 113 (default voice)
│   │   ├── score-114.mp3 — Caller clip announcing score 114 (default voice)
│   │   ├── score-115.mp3 — Caller clip announcing score 115 (default voice)
│   │   ├── score-116.mp3 — Caller clip announcing score 116 (default voice)
│   │   ├── score-117.mp3 — Caller clip announcing score 117 (default voice)
│   │   ├── score-118.mp3 — Caller clip announcing score 118 (default voice)
│   │   ├── score-119.mp3 — Caller clip announcing score 119 (default voice)
│   │   ├── score-12.mp3 — Caller clip announcing score 12 (default voice)
│   │   ├── score-120.mp3 — Caller clip announcing score 120 (default voice)
│   │   ├── score-121.mp3 — Caller clip announcing score 121 (default voice)
│   │   ├── score-122.mp3 — Caller clip announcing score 122 (default voice)
│   │   ├── score-123.mp3 — Caller clip announcing score 123 (default voice)
│   │   ├── score-124.mp3 — Caller clip announcing score 124 (default voice)
│   │   ├── score-125.mp3 — Caller clip announcing score 125 (default voice)
│   │   ├── score-126.mp3 — Caller clip announcing score 126 (default voice)
│   │   ├── score-127.mp3 — Caller clip announcing score 127 (default voice)
│   │   ├── score-128.mp3 — Caller clip announcing score 128 (default voice)
│   │   ├── score-129.mp3 — Caller clip announcing score 129 (default voice)
│   │   ├── score-13.mp3 — Caller clip announcing score 13 (default voice)
│   │   ├── score-130.mp3 — Caller clip announcing score 130 (default voice)
│   │   ├── score-131.mp3 — Caller clip announcing score 131 (default voice)
│   │   ├── score-132.mp3 — Caller clip announcing score 132 (default voice)
│   │   ├── score-133.mp3 — Caller clip announcing score 133 (default voice)
│   │   ├── score-134.mp3 — Caller clip announcing score 134 (default voice)
│   │   ├── score-135.mp3 — Caller clip announcing score 135 (default voice)
│   │   ├── score-136.mp3 — Caller clip announcing score 136 (default voice)
│   │   ├── score-137.mp3 — Caller clip announcing score 137 (default voice)
│   │   ├── score-138.mp3 — Caller clip announcing score 138 (default voice)
│   │   ├── score-139.mp3 — Caller clip announcing score 139 (default voice)
│   │   ├── score-14.mp3 — Caller clip announcing score 14 (default voice)
│   │   ├── score-140.mp3 — Caller clip announcing score 140 (default voice)
│   │   ├── score-141.mp3 — Caller clip announcing score 141 (default voice)
│   │   ├── score-142.mp3 — Caller clip announcing score 142 (default voice)
│   │   ├── score-143.mp3 — Caller clip announcing score 143 (default voice)
│   │   ├── score-144.mp3 — Caller clip announcing score 144 (default voice)
│   │   ├── score-145.mp3 — Caller clip announcing score 145 (default voice)
│   │   ├── score-146.mp3 — Caller clip announcing score 146 (default voice)
│   │   ├── score-147.mp3 — Caller clip announcing score 147 (default voice)
│   │   ├── score-148.mp3 — Caller clip announcing score 148 (default voice)
│   │   ├── score-149.mp3 — Caller clip announcing score 149 (default voice)
│   │   ├── score-15.mp3 — Caller clip announcing score 15 (default voice)
│   │   ├── score-150.mp3 — Caller clip announcing score 150 (default voice)
│   │   ├── score-151.mp3 — Caller clip announcing score 151 (default voice)
│   │   ├── score-152.mp3 — Caller clip announcing score 152 (default voice)
│   │   ├── score-153.mp3 — Caller clip announcing score 153 (default voice)
│   │   ├── score-154.mp3 — Caller clip announcing score 154 (default voice)
│   │   ├── score-155.mp3 — Caller clip announcing score 155 (default voice)
│   │   ├── score-156.mp3 — Caller clip announcing score 156 (default voice)
│   │   ├── score-157.mp3 — Caller clip announcing score 157 (default voice)
│   │   ├── score-158.mp3 — Caller clip announcing score 158 (default voice)
│   │   ├── score-159.mp3 — Caller clip announcing score 159 (default voice)
│   │   ├── score-16.mp3 — Caller clip announcing score 16 (default voice)
│   │   ├── score-160.mp3 — Caller clip announcing score 160 (default voice)
│   │   ├── score-161.mp3 — Caller clip announcing score 161 (default voice)
│   │   ├── score-162.mp3 — Caller clip announcing score 162 (default voice)
│   │   ├── score-163.mp3 — Caller clip announcing score 163 (default voice)
│   │   ├── score-164.mp3 — Caller clip announcing score 164 (default voice)
│   │   ├── score-165.mp3 — Caller clip announcing score 165 (default voice)
│   │   ├── score-166.mp3 — Caller clip announcing score 166 (default voice)
│   │   ├── score-167.mp3 — Caller clip announcing score 167 (default voice)
│   │   ├── score-168.mp3 — Caller clip announcing score 168 (default voice)
│   │   ├── score-169.mp3 — Caller clip announcing score 169 (default voice)
│   │   ├── score-17.mp3 — Caller clip announcing score 17 (default voice)
│   │   ├── score-170.mp3 — Caller clip announcing score 170 (default voice)
│   │   ├── score-171.mp3 — Caller clip announcing score 171 (default voice)
│   │   ├── score-172.mp3 — Caller clip announcing score 172 (default voice)
│   │   ├── score-173.mp3 — Caller clip announcing score 173 (default voice)
│   │   ├── score-174.mp3 — Caller clip announcing score 174 (default voice)
│   │   ├── score-175.mp3 — Caller clip announcing score 175 (default voice)
│   │   ├── score-176.mp3 — Caller clip announcing score 176 (default voice)
│   │   ├── score-177.mp3 — Caller clip announcing score 177 (default voice)
│   │   ├── score-178.mp3 — Caller clip announcing score 178 (default voice)
│   │   ├── score-179.mp3 — Caller clip announcing score 179 (default voice)
│   │   ├── score-18.mp3 — Caller clip announcing score 18 (default voice)
│   │   ├── score-180.mp3 — Caller clip announcing score 180 (default voice)
│   │   ├── score-19.mp3 — Caller clip announcing score 19 (default voice)
│   │   ├── score-2.mp3 — Caller clip announcing score 2 (default voice)
│   │   ├── score-20.mp3 — Caller clip announcing score 20 (default voice)
│   │   ├── score-21.mp3 — Caller clip announcing score 21 (default voice)
│   │   ├── score-22.mp3 — Caller clip announcing score 22 (default voice)
│   │   ├── score-23.mp3 — Caller clip announcing score 23 (default voice)
│   │   ├── score-24.mp3 — Caller clip announcing score 24 (default voice)
│   │   ├── score-25.mp3 — Caller clip announcing score 25 (default voice)
│   │   ├── score-26.mp3 — Caller clip announcing score 26 (default voice)
│   │   ├── score-27.mp3 — Caller clip announcing score 27 (default voice)
│   │   ├── score-28.mp3 — Caller clip announcing score 28 (default voice)
│   │   ├── score-29.mp3 — Caller clip announcing score 29 (default voice)
│   │   ├── score-3.mp3 — Caller clip announcing score 3 (default voice)
│   │   ├── score-30.mp3 — Caller clip announcing score 30 (default voice)
│   │   ├── score-31.mp3 — Caller clip announcing score 31 (default voice)
│   │   ├── score-32.mp3 — Caller clip announcing score 32 (default voice)
│   │   ├── score-33.mp3 — Caller clip announcing score 33 (default voice)
│   │   ├── score-34.mp3 — Caller clip announcing score 34 (default voice)
│   │   ├── score-35.mp3 — Caller clip announcing score 35 (default voice)
│   │   ├── score-36.mp3 — Caller clip announcing score 36 (default voice)
│   │   ├── score-37.mp3 — Caller clip announcing score 37 (default voice)
│   │   ├── score-38.mp3 — Caller clip announcing score 38 (default voice)
│   │   ├── score-39.mp3 — Caller clip announcing score 39 (default voice)
│   │   ├── score-4.mp3 — Caller clip announcing score 4 (default voice)
│   │   ├── score-40.mp3 — Caller clip announcing score 40 (default voice)
│   │   ├── score-41.mp3 — Caller clip announcing score 41 (default voice)
│   │   ├── score-42.mp3 — Caller clip announcing score 42 (default voice)
│   │   ├── score-43.mp3 — Caller clip announcing score 43 (default voice)
│   │   ├── score-44.mp3 — Caller clip announcing score 44 (default voice)
│   │   ├── score-45.mp3 — Caller clip announcing score 45 (default voice)
│   │   ├── score-46.mp3 — Caller clip announcing score 46 (default voice)
│   │   ├── score-47.mp3 — Caller clip announcing score 47 (default voice)
│   │   ├── score-48.mp3 — Caller clip announcing score 48 (default voice)
│   │   ├── score-49.mp3 — Caller clip announcing score 49 (default voice)
│   │   ├── score-5.mp3 — Caller clip announcing score 5 (default voice)
│   │   ├── score-50.mp3 — Caller clip announcing score 50 (default voice)
│   │   ├── score-51.mp3 — Caller clip announcing score 51 (default voice)
│   │   ├── score-52.mp3 — Caller clip announcing score 52 (default voice)
│   │   ├── score-53.mp3 — Caller clip announcing score 53 (default voice)
│   │   ├── score-54.mp3 — Caller clip announcing score 54 (default voice)
│   │   ├── score-55.mp3 — Caller clip announcing score 55 (default voice)
│   │   ├── score-56.mp3 — Caller clip announcing score 56 (default voice)
│   │   ├── score-57.mp3 — Caller clip announcing score 57 (default voice)
│   │   ├── score-58.mp3 — Caller clip announcing score 58 (default voice)
│   │   ├── score-59.mp3 — Caller clip announcing score 59 (default voice)
│   │   ├── score-6.mp3 — Caller clip announcing score 6 (default voice)
│   │   ├── score-60.mp3 — Caller clip announcing score 60 (default voice)
│   │   ├── score-61.mp3 — Caller clip announcing score 61 (default voice)
│   │   ├── score-62.mp3 — Caller clip announcing score 62 (default voice)
│   │   ├── score-63.mp3 — Caller clip announcing score 63 (default voice)
│   │   ├── score-64.mp3 — Caller clip announcing score 64 (default voice)
│   │   ├── score-65.mp3 — Caller clip announcing score 65 (default voice)
│   │   ├── score-66.mp3 — Caller clip announcing score 66 (default voice)
│   │   ├── score-67.mp3 — Caller clip announcing score 67 (default voice)
│   │   ├── score-68.mp3 — Caller clip announcing score 68 (default voice)
│   │   ├── score-69.mp3 — Caller clip announcing score 69 (default voice)
│   │   ├── score-7.mp3 — Caller clip announcing score 7 (default voice)
│   │   ├── score-70.mp3 — Caller clip announcing score 70 (default voice)
│   │   ├── score-71.mp3 — Caller clip announcing score 71 (default voice)
│   │   ├── score-72.mp3 — Caller clip announcing score 72 (default voice)
│   │   ├── score-73.mp3 — Caller clip announcing score 73 (default voice)
│   │   ├── score-74.mp3 — Caller clip announcing score 74 (default voice)
│   │   ├── score-75.mp3 — Caller clip announcing score 75 (default voice)
│   │   ├── score-76.mp3 — Caller clip announcing score 76 (default voice)
│   │   ├── score-77.mp3 — Caller clip announcing score 77 (default voice)
│   │   ├── score-78.mp3 — Caller clip announcing score 78 (default voice)
│   │   ├── score-79.mp3 — Caller clip announcing score 79 (default voice)
│   │   ├── score-8.mp3 — Caller clip announcing score 8 (default voice)
│   │   ├── score-80.mp3 — Caller clip announcing score 80 (default voice)
│   │   ├── score-81.mp3 — Caller clip announcing score 81 (default voice)
│   │   ├── score-82.mp3 — Caller clip announcing score 82 (default voice)
│   │   ├── score-83.mp3 — Caller clip announcing score 83 (default voice)
│   │   ├── score-84.mp3 — Caller clip announcing score 84 (default voice)
│   │   ├── score-85.mp3 — Caller clip announcing score 85 (default voice)
│   │   ├── score-86.mp3 — Caller clip announcing score 86 (default voice)
│   │   ├── score-87.mp3 — Caller clip announcing score 87 (default voice)
│   │   ├── score-88.mp3 — Caller clip announcing score 88 (default voice)
│   │   ├── score-89.mp3 — Caller clip announcing score 89 (default voice)
│   │   ├── score-9.mp3 — Caller clip announcing score 9 (default voice)
│   │   ├── score-90.mp3 — Caller clip announcing score 90 (default voice)
│   │   ├── score-91.mp3 — Caller clip announcing score 91 (default voice)
│   │   ├── score-92.mp3 — Caller clip announcing score 92 (default voice)
│   │   ├── score-93.mp3 — Caller clip announcing score 93 (default voice)
│   │   ├── score-94.mp3 — Caller clip announcing score 94 (default voice)
│   │   ├── score-95.mp3 — Caller clip announcing score 95 (default voice)
│   │   ├── score-96.mp3 — Caller clip announcing score 96 (default voice)
│   │   ├── score-97.mp3 — Caller clip announcing score 97 (default voice)
│   │   ├── score-98.mp3 — Caller clip announcing score 98 (default voice)
│   │   ├── score-99.mp3 — Caller clip announcing score 99 (default voice)
│   │   ├── scotty-bust.mp3 — Caller clip for the "bust" event (Scotty voice)
│   │   ├── scotty-century.mp3 — Caller clip for the "century" event (Scotty voice)
│   │   ├── scotty-change-of-throw.mp3 — Caller clip for the "change of throw" event (Scotty voice)
│   │   ├── scotty-checkout.mp3 — Caller clip for the "checkout" event (Scotty voice)
│   │   ├── scotty-first-throw.mp3 — Caller clip for the "first throw" event (Scotty voice)
│   │   ├── scotty-game-on.mp3 — Caller clip for the "game on" event (Scotty voice)
│   │   ├── scotty-high-ton.mp3 — Caller clip for the "high ton" event (Scotty voice)
│   │   ├── scotty-leg-winner.mp3 — Caller clip for the "leg winner" event (Scotty voice)
│   │   ├── scotty-match-winner.mp3 — Caller clip for the "match winner" event (Scotty voice)
│   │   ├── scotty-next-leg.mp3 — Caller clip for the "next leg" event (Scotty voice)
│   │   ├── scotty-next-set.mp3 — Caller clip for the "next set" event (Scotty voice)
│   │   ├── scotty-player1-starting.mp3 — Caller clip for the "player1 starting" event (Scotty voice)
│   │   ├── scotty-player2-starting.mp3 — Caller clip for the "player2 starting" event (Scotty voice)
│   │   ├── scotty-score-0.mp3 — Caller clip announcing score 0 (Scotty voice)
│   │   ├── scotty-score-1.mp3 — Caller clip announcing score 1 (Scotty voice)
│   │   ├── scotty-score-10.mp3 — Caller clip announcing score 10 (Scotty voice)
│   │   ├── scotty-score-100.mp3 — Caller clip announcing score 100 (Scotty voice)
│   │   ├── scotty-score-101.mp3 — Caller clip announcing score 101 (Scotty voice)
│   │   ├── scotty-score-102.mp3 — Caller clip announcing score 102 (Scotty voice)
│   │   ├── scotty-score-103.mp3 — Caller clip announcing score 103 (Scotty voice)
│   │   ├── scotty-score-104.mp3 — Caller clip announcing score 104 (Scotty voice)
│   │   ├── scotty-score-105.mp3 — Caller clip announcing score 105 (Scotty voice)
│   │   ├── scotty-score-106.mp3 — Caller clip announcing score 106 (Scotty voice)
│   │   ├── scotty-score-107.mp3 — Caller clip announcing score 107 (Scotty voice)
│   │   ├── scotty-score-108.mp3 — Caller clip announcing score 108 (Scotty voice)
│   │   ├── scotty-score-109.mp3 — Caller clip announcing score 109 (Scotty voice)
│   │   ├── scotty-score-11.mp3 — Caller clip announcing score 11 (Scotty voice)
│   │   ├── scotty-score-110.mp3 — Caller clip announcing score 110 (Scotty voice)
│   │   ├── scotty-score-111.mp3 — Caller clip announcing score 111 (Scotty voice)
│   │   ├── scotty-score-112.mp3 — Caller clip announcing score 112 (Scotty voice)
│   │   ├── scotty-score-113.mp3 — Caller clip announcing score 113 (Scotty voice)
│   │   ├── scotty-score-114.mp3 — Caller clip announcing score 114 (Scotty voice)
│   │   ├── scotty-score-115.mp3 — Caller clip announcing score 115 (Scotty voice)
│   │   ├── scotty-score-116.mp3 — Caller clip announcing score 116 (Scotty voice)
│   │   ├── scotty-score-117.mp3 — Caller clip announcing score 117 (Scotty voice)
│   │   ├── scotty-score-118.mp3 — Caller clip announcing score 118 (Scotty voice)
│   │   ├── scotty-score-119.mp3 — Caller clip announcing score 119 (Scotty voice)
│   │   ├── scotty-score-12.mp3 — Caller clip announcing score 12 (Scotty voice)
│   │   ├── scotty-score-120.mp3 — Caller clip announcing score 120 (Scotty voice)
│   │   ├── scotty-score-121.mp3 — Caller clip announcing score 121 (Scotty voice)
│   │   ├── scotty-score-122.mp3 — Caller clip announcing score 122 (Scotty voice)
│   │   ├── scotty-score-123.mp3 — Caller clip announcing score 123 (Scotty voice)
│   │   ├── scotty-score-124.mp3 — Caller clip announcing score 124 (Scotty voice)
│   │   ├── scotty-score-125.mp3 — Caller clip announcing score 125 (Scotty voice)
│   │   ├── scotty-score-126.mp3 — Caller clip announcing score 126 (Scotty voice)
│   │   ├── scotty-score-127.mp3 — Caller clip announcing score 127 (Scotty voice)
│   │   ├── scotty-score-128.mp3 — Caller clip announcing score 128 (Scotty voice)
│   │   ├── scotty-score-129.mp3 — Caller clip announcing score 129 (Scotty voice)
│   │   ├── scotty-score-13.mp3 — Caller clip announcing score 13 (Scotty voice)
│   │   ├── scotty-score-130.mp3 — Caller clip announcing score 130 (Scotty voice)
│   │   ├── scotty-score-131.mp3 — Caller clip announcing score 131 (Scotty voice)
│   │   ├── scotty-score-132.mp3 — Caller clip announcing score 132 (Scotty voice)
│   │   ├── scotty-score-133.mp3 — Caller clip announcing score 133 (Scotty voice)
│   │   ├── scotty-score-134.mp3 — Caller clip announcing score 134 (Scotty voice)
│   │   ├── scotty-score-135.mp3 — Caller clip announcing score 135 (Scotty voice)
│   │   ├── scotty-score-136.mp3 — Caller clip announcing score 136 (Scotty voice)
│   │   ├── scotty-score-137.mp3 — Caller clip announcing score 137 (Scotty voice)
│   │   ├── scotty-score-138.mp3 — Caller clip announcing score 138 (Scotty voice)
│   │   ├── scotty-score-139.mp3 — Caller clip announcing score 139 (Scotty voice)
│   │   ├── scotty-score-14.mp3 — Caller clip announcing score 14 (Scotty voice)
│   │   ├── scotty-score-140.mp3 — Caller clip announcing score 140 (Scotty voice)
│   │   ├── scotty-score-141.mp3 — Caller clip announcing score 141 (Scotty voice)
│   │   ├── scotty-score-142.mp3 — Caller clip announcing score 142 (Scotty voice)
│   │   ├── scotty-score-143.mp3 — Caller clip announcing score 143 (Scotty voice)
│   │   ├── scotty-score-144.mp3 — Caller clip announcing score 144 (Scotty voice)
│   │   ├── scotty-score-145.mp3 — Caller clip announcing score 145 (Scotty voice)
│   │   ├── scotty-score-146.mp3 — Caller clip announcing score 146 (Scotty voice)
│   │   ├── scotty-score-147.mp3 — Caller clip announcing score 147 (Scotty voice)
│   │   ├── scotty-score-148.mp3 — Caller clip announcing score 148 (Scotty voice)
│   │   ├── scotty-score-149.mp3 — Caller clip announcing score 149 (Scotty voice)
│   │   ├── scotty-score-15.mp3 — Caller clip announcing score 15 (Scotty voice)
│   │   ├── scotty-score-150.mp3 — Caller clip announcing score 150 (Scotty voice)
│   │   ├── scotty-score-151.mp3 — Caller clip announcing score 151 (Scotty voice)
│   │   ├── scotty-score-152.mp3 — Caller clip announcing score 152 (Scotty voice)
│   │   ├── scotty-score-153.mp3 — Caller clip announcing score 153 (Scotty voice)
│   │   ├── scotty-score-154.mp3 — Caller clip announcing score 154 (Scotty voice)
│   │   ├── scotty-score-155.mp3 — Caller clip announcing score 155 (Scotty voice)
│   │   ├── scotty-score-156.mp3 — Caller clip announcing score 156 (Scotty voice)
│   │   ├── scotty-score-157.mp3 — Caller clip announcing score 157 (Scotty voice)
│   │   ├── scotty-score-158.mp3 — Caller clip announcing score 158 (Scotty voice)
│   │   ├── scotty-score-159.mp3 — Caller clip announcing score 159 (Scotty voice)
│   │   ├── scotty-score-16.mp3 — Caller clip announcing score 16 (Scotty voice)
│   │   ├── scotty-score-160.mp3 — Caller clip announcing score 160 (Scotty voice)
│   │   ├── scotty-score-161.mp3 — Caller clip announcing score 161 (Scotty voice)
│   │   ├── scotty-score-162.mp3 — Caller clip announcing score 162 (Scotty voice)
│   │   ├── scotty-score-163.mp3 — Caller clip announcing score 163 (Scotty voice)
│   │   ├── scotty-score-164.mp3 — Caller clip announcing score 164 (Scotty voice)
│   │   ├── scotty-score-165.mp3 — Caller clip announcing score 165 (Scotty voice)
│   │   ├── scotty-score-166.mp3 — Caller clip announcing score 166 (Scotty voice)
│   │   ├── scotty-score-167.mp3 — Caller clip announcing score 167 (Scotty voice)
│   │   ├── scotty-score-168.mp3 — Caller clip announcing score 168 (Scotty voice)
│   │   ├── scotty-score-169.mp3 — Caller clip announcing score 169 (Scotty voice)
│   │   ├── scotty-score-17.mp3 — Caller clip announcing score 17 (Scotty voice)
│   │   ├── scotty-score-170.mp3 — Caller clip announcing score 170 (Scotty voice)
│   │   ├── scotty-score-171.mp3 — Caller clip announcing score 171 (Scotty voice)
│   │   ├── scotty-score-172.mp3 — Caller clip announcing score 172 (Scotty voice)
│   │   ├── scotty-score-173.mp3 — Caller clip announcing score 173 (Scotty voice)
│   │   ├── scotty-score-174.mp3 — Caller clip announcing score 174 (Scotty voice)
│   │   ├── scotty-score-175.mp3 — Caller clip announcing score 175 (Scotty voice)
│   │   ├── scotty-score-176.mp3 — Caller clip announcing score 176 (Scotty voice)
│   │   ├── scotty-score-177.mp3 — Caller clip announcing score 177 (Scotty voice)
│   │   ├── scotty-score-178.mp3 — Caller clip announcing score 178 (Scotty voice)
│   │   ├── scotty-score-179.mp3 — Caller clip announcing score 179 (Scotty voice)
│   │   ├── scotty-score-18.mp3 — Caller clip announcing score 18 (Scotty voice)
│   │   ├── scotty-score-180.mp3 — Caller clip announcing score 180 (Scotty voice)
│   │   ├── scotty-score-19.mp3 — Caller clip announcing score 19 (Scotty voice)
│   │   ├── scotty-score-2.mp3 — Caller clip announcing score 2 (Scotty voice)
│   │   ├── scotty-score-20.mp3 — Caller clip announcing score 20 (Scotty voice)
│   │   ├── scotty-score-21.mp3 — Caller clip announcing score 21 (Scotty voice)
│   │   ├── scotty-score-22.mp3 — Caller clip announcing score 22 (Scotty voice)
│   │   ├── scotty-score-23.mp3 — Caller clip announcing score 23 (Scotty voice)
│   │   ├── scotty-score-24.mp3 — Caller clip announcing score 24 (Scotty voice)
│   │   ├── scotty-score-25.mp3 — Caller clip announcing score 25 (Scotty voice)
│   │   ├── scotty-score-26.mp3 — Caller clip announcing score 26 (Scotty voice)
│   │   ├── scotty-score-27.mp3 — Caller clip announcing score 27 (Scotty voice)
│   │   ├── scotty-score-28.mp3 — Caller clip announcing score 28 (Scotty voice)
│   │   ├── scotty-score-29.mp3 — Caller clip announcing score 29 (Scotty voice)
│   │   ├── scotty-score-3.mp3 — Caller clip announcing score 3 (Scotty voice)
│   │   ├── scotty-score-30.mp3 — Caller clip announcing score 30 (Scotty voice)
│   │   ├── scotty-score-31.mp3 — Caller clip announcing score 31 (Scotty voice)
│   │   ├── scotty-score-32.mp3 — Caller clip announcing score 32 (Scotty voice)
│   │   ├── scotty-score-33.mp3 — Caller clip announcing score 33 (Scotty voice)
│   │   ├── scotty-score-34.mp3 — Caller clip announcing score 34 (Scotty voice)
│   │   ├── scotty-score-35.mp3 — Caller clip announcing score 35 (Scotty voice)
│   │   ├── scotty-score-36.mp3 — Caller clip announcing score 36 (Scotty voice)
│   │   ├── scotty-score-37.mp3 — Caller clip announcing score 37 (Scotty voice)
│   │   ├── scotty-score-38.mp3 — Caller clip announcing score 38 (Scotty voice)
│   │   ├── scotty-score-39.mp3 — Caller clip announcing score 39 (Scotty voice)
│   │   ├── scotty-score-4.mp3 — Caller clip announcing score 4 (Scotty voice)
│   │   ├── scotty-score-40.mp3 — Caller clip announcing score 40 (Scotty voice)
│   │   ├── scotty-score-41.mp3 — Caller clip announcing score 41 (Scotty voice)
│   │   ├── scotty-score-42.mp3 — Caller clip announcing score 42 (Scotty voice)
│   │   ├── scotty-score-43.mp3 — Caller clip announcing score 43 (Scotty voice)
│   │   ├── scotty-score-44.mp3 — Caller clip announcing score 44 (Scotty voice)
│   │   ├── scotty-score-45.mp3 — Caller clip announcing score 45 (Scotty voice)
│   │   ├── scotty-score-46.mp3 — Caller clip announcing score 46 (Scotty voice)
│   │   ├── scotty-score-47.mp3 — Caller clip announcing score 47 (Scotty voice)
│   │   ├── scotty-score-48.mp3 — Caller clip announcing score 48 (Scotty voice)
│   │   ├── scotty-score-49.mp3 — Caller clip announcing score 49 (Scotty voice)
│   │   ├── scotty-score-5.mp3 — Caller clip announcing score 5 (Scotty voice)
│   │   ├── scotty-score-50.mp3 — Caller clip announcing score 50 (Scotty voice)
│   │   ├── scotty-score-51.mp3 — Caller clip announcing score 51 (Scotty voice)
│   │   ├── scotty-score-52.mp3 — Caller clip announcing score 52 (Scotty voice)
│   │   ├── scotty-score-53.mp3 — Caller clip announcing score 53 (Scotty voice)
│   │   ├── scotty-score-54.mp3 — Caller clip announcing score 54 (Scotty voice)
│   │   ├── scotty-score-55.mp3 — Caller clip announcing score 55 (Scotty voice)
│   │   ├── scotty-score-56.mp3 — Caller clip announcing score 56 (Scotty voice)
│   │   ├── scotty-score-57.mp3 — Caller clip announcing score 57 (Scotty voice)
│   │   ├── scotty-score-58.mp3 — Caller clip announcing score 58 (Scotty voice)
│   │   ├── scotty-score-59.mp3 — Caller clip announcing score 59 (Scotty voice)
│   │   ├── scotty-score-6.mp3 — Caller clip announcing score 6 (Scotty voice)
│   │   ├── scotty-score-60.mp3 — Caller clip announcing score 60 (Scotty voice)
│   │   ├── scotty-score-61.mp3 — Caller clip announcing score 61 (Scotty voice)
│   │   ├── scotty-score-62.mp3 — Caller clip announcing score 62 (Scotty voice)
│   │   ├── scotty-score-63.mp3 — Caller clip announcing score 63 (Scotty voice)
│   │   ├── scotty-score-64.mp3 — Caller clip announcing score 64 (Scotty voice)
│   │   ├── scotty-score-65.mp3 — Caller clip announcing score 65 (Scotty voice)
│   │   ├── scotty-score-66.mp3 — Caller clip announcing score 66 (Scotty voice)
│   │   ├── scotty-score-67.mp3 — Caller clip announcing score 67 (Scotty voice)
│   │   ├── scotty-score-68.mp3 — Caller clip announcing score 68 (Scotty voice)
│   │   ├── scotty-score-69.mp3 — Caller clip announcing score 69 (Scotty voice)
│   │   ├── scotty-score-7.mp3 — Caller clip announcing score 7 (Scotty voice)
│   │   ├── scotty-score-70.mp3 — Caller clip announcing score 70 (Scotty voice)
│   │   ├── scotty-score-71.mp3 — Caller clip announcing score 71 (Scotty voice)
│   │   ├── scotty-score-72.mp3 — Caller clip announcing score 72 (Scotty voice)
│   │   ├── scotty-score-73.mp3 — Caller clip announcing score 73 (Scotty voice)
│   │   ├── scotty-score-74.mp3 — Caller clip announcing score 74 (Scotty voice)
│   │   ├── scotty-score-75.mp3 — Caller clip announcing score 75 (Scotty voice)
│   │   ├── scotty-score-76.mp3 — Caller clip announcing score 76 (Scotty voice)
│   │   ├── scotty-score-77.mp3 — Caller clip announcing score 77 (Scotty voice)
│   │   ├── scotty-score-78.mp3 — Caller clip announcing score 78 (Scotty voice)
│   │   ├── scotty-score-79.mp3 — Caller clip announcing score 79 (Scotty voice)
│   │   ├── scotty-score-8.mp3 — Caller clip announcing score 8 (Scotty voice)
│   │   ├── scotty-score-80.mp3 — Caller clip announcing score 80 (Scotty voice)
│   │   ├── scotty-score-81.mp3 — Caller clip announcing score 81 (Scotty voice)
│   │   ├── scotty-score-82.mp3 — Caller clip announcing score 82 (Scotty voice)
│   │   ├── scotty-score-83.mp3 — Caller clip announcing score 83 (Scotty voice)
│   │   ├── scotty-score-84.mp3 — Caller clip announcing score 84 (Scotty voice)
│   │   ├── scotty-score-85.mp3 — Caller clip announcing score 85 (Scotty voice)
│   │   ├── scotty-score-86.mp3 — Caller clip announcing score 86 (Scotty voice)
│   │   ├── scotty-score-87.mp3 — Caller clip announcing score 87 (Scotty voice)
│   │   ├── scotty-score-88.mp3 — Caller clip announcing score 88 (Scotty voice)
│   │   ├── scotty-score-89.mp3 — Caller clip announcing score 89 (Scotty voice)
│   │   ├── scotty-score-9.mp3 — Caller clip announcing score 9 (Scotty voice)
│   │   ├── scotty-score-90.mp3 — Caller clip announcing score 90 (Scotty voice)
│   │   ├── scotty-score-91.mp3 — Caller clip announcing score 91 (Scotty voice)
│   │   ├── scotty-score-92.mp3 — Caller clip announcing score 92 (Scotty voice)
│   │   ├── scotty-score-93.mp3 — Caller clip announcing score 93 (Scotty voice)
│   │   ├── scotty-score-94.mp3 — Caller clip announcing score 94 (Scotty voice)
│   │   ├── scotty-score-95.mp3 — Caller clip announcing score 95 (Scotty voice)
│   │   ├── scotty-score-96.mp3 — Caller clip announcing score 96 (Scotty voice)
│   │   ├── scotty-score-97.mp3 — Caller clip announcing score 97 (Scotty voice)
│   │   ├── scotty-score-98.mp3 — Caller clip announcing score 98 (Scotty voice)
│   │   ├── scotty-score-99.mp3 — Caller clip announcing score 99 (Scotty voice)
│   │   ├── scotty-set-winner.mp3 — Caller clip for the "set winner" event (Scotty voice)
│   │   ├── scotty-ton-80.mp3 — Caller clip for the "ton 80" event (Scotty voice)
│   │   ├── set-winner.mp3 — Caller clip for the "set winner" event (default voice)
│   │   ├── ton-80.mp3 — Caller clip for the "ton 80" event (default voice)
│   │   ├── voice3-score-0.mp3 — Caller clip announcing score 0 (voice 3)
│   │   ├── voice3-score-1.mp3 — Caller clip announcing score 1 (voice 3)
│   │   ├── voice3-score-10.mp3 — Caller clip announcing score 10 (voice 3)
│   │   ├── voice3-score-100.mp3 — Caller clip announcing score 100 (voice 3)
│   │   ├── voice3-score-101.mp3 — Caller clip announcing score 101 (voice 3)
│   │   ├── voice3-score-102.mp3 — Caller clip announcing score 102 (voice 3)
│   │   ├── voice3-score-103.mp3 — Caller clip announcing score 103 (voice 3)
│   │   ├── voice3-score-104.mp3 — Caller clip announcing score 104 (voice 3)
│   │   ├── voice3-score-105.mp3 — Caller clip announcing score 105 (voice 3)
│   │   ├── voice3-score-106.mp3 — Caller clip announcing score 106 (voice 3)
│   │   ├── voice3-score-107.mp3 — Caller clip announcing score 107 (voice 3)
│   │   ├── voice3-score-108.mp3 — Caller clip announcing score 108 (voice 3)
│   │   ├── voice3-score-109.mp3 — Caller clip announcing score 109 (voice 3)
│   │   ├── voice3-score-11.mp3 — Caller clip announcing score 11 (voice 3)
│   │   ├── voice3-score-110.mp3 — Caller clip announcing score 110 (voice 3)
│   │   ├── voice3-score-111.mp3 — Caller clip announcing score 111 (voice 3)
│   │   ├── voice3-score-112.mp3 — Caller clip announcing score 112 (voice 3)
│   │   ├── voice3-score-113.mp3 — Caller clip announcing score 113 (voice 3)
│   │   ├── voice3-score-114.mp3 — Caller clip announcing score 114 (voice 3)
│   │   ├── voice3-score-115.mp3 — Caller clip announcing score 115 (voice 3)
│   │   ├── voice3-score-116.mp3 — Caller clip announcing score 116 (voice 3)
│   │   ├── voice3-score-117.mp3 — Caller clip announcing score 117 (voice 3)
│   │   ├── voice3-score-118.mp3 — Caller clip announcing score 118 (voice 3)
│   │   ├── voice3-score-119.mp3 — Caller clip announcing score 119 (voice 3)
│   │   ├── voice3-score-12.mp3 — Caller clip announcing score 12 (voice 3)
│   │   ├── voice3-score-120.mp3 — Caller clip announcing score 120 (voice 3)
│   │   ├── voice3-score-121.mp3 — Caller clip announcing score 121 (voice 3)
│   │   ├── voice3-score-122.mp3 — Caller clip announcing score 122 (voice 3)
│   │   ├── voice3-score-123.mp3 — Caller clip announcing score 123 (voice 3)
│   │   ├── voice3-score-124.mp3 — Caller clip announcing score 124 (voice 3)
│   │   ├── voice3-score-125.mp3 — Caller clip announcing score 125 (voice 3)
│   │   ├── voice3-score-126.mp3 — Caller clip announcing score 126 (voice 3)
│   │   ├── voice3-score-127.mp3 — Caller clip announcing score 127 (voice 3)
│   │   ├── voice3-score-128.mp3 — Caller clip announcing score 128 (voice 3)
│   │   ├── voice3-score-129.mp3 — Caller clip announcing score 129 (voice 3)
│   │   ├── voice3-score-13.mp3 — Caller clip announcing score 13 (voice 3)
│   │   ├── voice3-score-130.mp3 — Caller clip announcing score 130 (voice 3)
│   │   ├── voice3-score-131.mp3 — Caller clip announcing score 131 (voice 3)
│   │   ├── voice3-score-132.mp3 — Caller clip announcing score 132 (voice 3)
│   │   ├── voice3-score-133.mp3 — Caller clip announcing score 133 (voice 3)
│   │   ├── voice3-score-134.mp3 — Caller clip announcing score 134 (voice 3)
│   │   ├── voice3-score-135.mp3 — Caller clip announcing score 135 (voice 3)
│   │   ├── voice3-score-136.mp3 — Caller clip announcing score 136 (voice 3)
│   │   ├── voice3-score-137.mp3 — Caller clip announcing score 137 (voice 3)
│   │   ├── voice3-score-138.mp3 — Caller clip announcing score 138 (voice 3)
│   │   ├── voice3-score-139.mp3 — Caller clip announcing score 139 (voice 3)
│   │   ├── voice3-score-14.mp3 — Caller clip announcing score 14 (voice 3)
│   │   ├── voice3-score-140.mp3 — Caller clip announcing score 140 (voice 3)
│   │   ├── voice3-score-141.mp3 — Caller clip announcing score 141 (voice 3)
│   │   ├── voice3-score-142.mp3 — Caller clip announcing score 142 (voice 3)
│   │   ├── voice3-score-143.mp3 — Caller clip announcing score 143 (voice 3)
│   │   ├── voice3-score-144.mp3 — Caller clip announcing score 144 (voice 3)
│   │   ├── voice3-score-145.mp3 — Caller clip announcing score 145 (voice 3)
│   │   ├── voice3-score-15.mp3 — Caller clip announcing score 15 (voice 3)
│   │   ├── voice3-score-150.mp3 — Caller clip announcing score 150 (voice 3)
│   │   ├── voice3-score-16.mp3 — Caller clip announcing score 16 (voice 3)
│   │   ├── voice3-score-17.mp3 — Caller clip announcing score 17 (voice 3)
│   │   ├── voice3-score-18.mp3 — Caller clip announcing score 18 (voice 3)
│   │   ├── voice3-score-19.mp3 — Caller clip announcing score 19 (voice 3)
│   │   ├── voice3-score-2.mp3 — Caller clip announcing score 2 (voice 3)
│   │   ├── voice3-score-20.mp3 — Caller clip announcing score 20 (voice 3)
│   │   ├── voice3-score-21.mp3 — Caller clip announcing score 21 (voice 3)
│   │   ├── voice3-score-22.mp3 — Caller clip announcing score 22 (voice 3)
│   │   ├── voice3-score-23.mp3 — Caller clip announcing score 23 (voice 3)
│   │   ├── voice3-score-24.mp3 — Caller clip announcing score 24 (voice 3)
│   │   ├── voice3-score-25.mp3 — Caller clip announcing score 25 (voice 3)
│   │   ├── voice3-score-26.mp3 — Caller clip announcing score 26 (voice 3)
│   │   ├── voice3-score-27.mp3 — Caller clip announcing score 27 (voice 3)
│   │   ├── voice3-score-28.mp3 — Caller clip announcing score 28 (voice 3)
│   │   ├── voice3-score-29.mp3 — Caller clip announcing score 29 (voice 3)
│   │   ├── voice3-score-3.mp3 — Caller clip announcing score 3 (voice 3)
│   │   ├── voice3-score-30.mp3 — Caller clip announcing score 30 (voice 3)
│   │   ├── voice3-score-31.mp3 — Caller clip announcing score 31 (voice 3)
│   │   ├── voice3-score-32.mp3 — Caller clip announcing score 32 (voice 3)
│   │   ├── voice3-score-33.mp3 — Caller clip announcing score 33 (voice 3)
│   │   ├── voice3-score-34.mp3 — Caller clip announcing score 34 (voice 3)
│   │   ├── voice3-score-35.mp3 — Caller clip announcing score 35 (voice 3)
│   │   ├── voice3-score-36.mp3 — Caller clip announcing score 36 (voice 3)
│   │   ├── voice3-score-37.mp3 — Caller clip announcing score 37 (voice 3)
│   │   ├── voice3-score-38.mp3 — Caller clip announcing score 38 (voice 3)
│   │   ├── voice3-score-39.mp3 — Caller clip announcing score 39 (voice 3)
│   │   ├── voice3-score-4.mp3 — Caller clip announcing score 4 (voice 3)
│   │   ├── voice3-score-40.mp3 — Caller clip announcing score 40 (voice 3)
│   │   ├── voice3-score-41.mp3 — Caller clip announcing score 41 (voice 3)
│   │   ├── voice3-score-42.mp3 — Caller clip announcing score 42 (voice 3)
│   │   ├── voice3-score-43.mp3 — Caller clip announcing score 43 (voice 3)
│   │   ├── voice3-score-44.mp3 — Caller clip announcing score 44 (voice 3)
│   │   ├── voice3-score-45.mp3 — Caller clip announcing score 45 (voice 3)
│   │   ├── voice3-score-46.mp3 — Caller clip announcing score 46 (voice 3)
│   │   ├── voice3-score-47.mp3 — Caller clip announcing score 47 (voice 3)
│   │   ├── voice3-score-48.mp3 — Caller clip announcing score 48 (voice 3)
│   │   ├── voice3-score-49.mp3 — Caller clip announcing score 49 (voice 3)
│   │   ├── voice3-score-5.mp3 — Caller clip announcing score 5 (voice 3)
│   │   ├── voice3-score-50.mp3 — Caller clip announcing score 50 (voice 3)
│   │   ├── voice3-score-51.mp3 — Caller clip announcing score 51 (voice 3)
│   │   ├── voice3-score-52.mp3 — Caller clip announcing score 52 (voice 3)
│   │   ├── voice3-score-53.mp3 — Caller clip announcing score 53 (voice 3)
│   │   ├── voice3-score-54.mp3 — Caller clip announcing score 54 (voice 3)
│   │   ├── voice3-score-55.mp3 — Caller clip announcing score 55 (voice 3)
│   │   ├── voice3-score-56.mp3 — Caller clip announcing score 56 (voice 3)
│   │   ├── voice3-score-57.mp3 — Caller clip announcing score 57 (voice 3)
│   │   ├── voice3-score-58.mp3 — Caller clip announcing score 58 (voice 3)
│   │   ├── voice3-score-59.mp3 — Caller clip announcing score 59 (voice 3)
│   │   ├── voice3-score-6.mp3 — Caller clip announcing score 6 (voice 3)
│   │   ├── voice3-score-60.mp3 — Caller clip announcing score 60 (voice 3)
│   │   ├── voice3-score-61.mp3 — Caller clip announcing score 61 (voice 3)
│   │   ├── voice3-score-62.mp3 — Caller clip announcing score 62 (voice 3)
│   │   ├── voice3-score-63.mp3 — Caller clip announcing score 63 (voice 3)
│   │   ├── voice3-score-64.mp3 — Caller clip announcing score 64 (voice 3)
│   │   ├── voice3-score-65.mp3 — Caller clip announcing score 65 (voice 3)
│   │   ├── voice3-score-66.mp3 — Caller clip announcing score 66 (voice 3)
│   │   ├── voice3-score-67.mp3 — Caller clip announcing score 67 (voice 3)
│   │   ├── voice3-score-68.mp3 — Caller clip announcing score 68 (voice 3)
│   │   ├── voice3-score-69.mp3 — Caller clip announcing score 69 (voice 3)
│   │   ├── voice3-score-7.mp3 — Caller clip announcing score 7 (voice 3)
│   │   ├── voice3-score-70.mp3 — Caller clip announcing score 70 (voice 3)
│   │   ├── voice3-score-71.mp3 — Caller clip announcing score 71 (voice 3)
│   │   ├── voice3-score-72.mp3 — Caller clip announcing score 72 (voice 3)
│   │   ├── voice3-score-73.mp3 — Caller clip announcing score 73 (voice 3)
│   │   ├── voice3-score-74.mp3 — Caller clip announcing score 74 (voice 3)
│   │   ├── voice3-score-75.mp3 — Caller clip announcing score 75 (voice 3)
│   │   ├── voice3-score-76.mp3 — Caller clip announcing score 76 (voice 3)
│   │   ├── voice3-score-77.mp3 — Caller clip announcing score 77 (voice 3)
│   │   ├── voice3-score-78.mp3 — Caller clip announcing score 78 (voice 3)
│   │   ├── voice3-score-79.mp3 — Caller clip announcing score 79 (voice 3)
│   │   ├── voice3-score-8.mp3 — Caller clip announcing score 8 (voice 3)
│   │   ├── voice3-score-80.mp3 — Caller clip announcing score 80 (voice 3)
│   │   ├── voice3-score-81.mp3 — Caller clip announcing score 81 (voice 3)
│   │   ├── voice3-score-82.mp3 — Caller clip announcing score 82 (voice 3)
│   │   ├── voice3-score-83.mp3 — Caller clip announcing score 83 (voice 3)
│   │   ├── voice3-score-84.mp3 — Caller clip announcing score 84 (voice 3)
│   │   ├── voice3-score-85.mp3 — Caller clip announcing score 85 (voice 3)
│   │   ├── voice3-score-86.mp3 — Caller clip announcing score 86 (voice 3)
│   │   ├── voice3-score-87.mp3 — Caller clip announcing score 87 (voice 3)
│   │   ├── voice3-score-88.mp3 — Caller clip announcing score 88 (voice 3)
│   │   ├── voice3-score-89.mp3 — Caller clip announcing score 89 (voice 3)
│   │   ├── voice3-score-9.mp3 — Caller clip announcing score 9 (voice 3)
│   │   ├── voice3-score-90.mp3 — Caller clip announcing score 90 (voice 3)
│   │   ├── voice3-score-91.mp3 — Caller clip announcing score 91 (voice 3)
│   │   ├── voice3-score-92.mp3 — Caller clip announcing score 92 (voice 3)
│   │   ├── voice3-score-93.mp3 — Caller clip announcing score 93 (voice 3)
│   │   ├── voice3-score-94.mp3 — Caller clip announcing score 94 (voice 3)
│   │   ├── voice3-score-95.mp3 — Caller clip announcing score 95 (voice 3)
│   │   ├── voice3-score-96.mp3 — Caller clip announcing score 96 (voice 3)
│   │   ├── voice3-score-97.mp3 — Caller clip announcing score 97 (voice 3)
│   │   ├── voice3-score-98.mp3 — Caller clip announcing score 98 (voice 3)
│   │   ├── voice3-score-99.mp3 — Caller clip announcing score 99 (voice 3)
│   ├── favicon.svg — App favicon (dartboard mark)
│   ├── robots.txt — Crawler rules
├── .env — Environment variables (DATABASE_URL, SMTP/email keys, TTS API keys) — gitignored, loaded by vite and the db:* scripts
├── .gitignore — Git ignore rules (node_modules, .env, build output, .svelte-kit)
├── .npmrc — npm config — enables engine-strict version checking
├── .wiki_ignore — Paths excluded from wiki staleness detection (node_modules, build, docs/wiki itself)
├── app-idea.md — Original product brief: multi-player 501 darts over legs/sets with persisted player stats
├── drizzle.config.ts — Drizzle Kit config — postgresql dialect, schema at src/lib/db/schema.ts, migrations into drizzle/, targets the `darts` schema
├── nul — Stray Windows artifact (accidental `> NUL` redirect) — safe to delete
├── package-lock.json — npm lockfile pinning the dependency tree
├── package.json — npm manifest — scripts (dev/build/check, db:init/push/studio/verify), deps: SvelteKit 2, Svelte 5, Tailwind v4, Drizzle ORM, kokoro-js, emailjs, postgres
├── prompts.md — Developer prompt log — feature requests and rule decisions applied during development (turn alternation, UI tweaks)
├── README.md — Project readme — features, install, project structure, API reference, game rules, data models
├── svelte.config.js — SvelteKit config — adapter-node output, Svelte 5 runes mode forced outside node_modules
├── tsconfig.json — TypeScript config extending the generated .svelte-kit/tsconfig.json
└── vite.config.ts — Vite config — sveltekit() + tailwindcss() plugins, dotenv preload of .env
