# Agent Instructions

## Project Type

- Static site only
- GitHub Pages serves `docs/`
- No backend, database, or build step

## Canonical Context

- Treat this file as the default project snapshot for future sessions
- Do not re-scan basic site structure unless the user says it changed
- New game ideas should be appended in `## Idea Inbox`

## Key Paths

- `docs/index.html`: game hub
- `docs/script.js`: game card data
- `docs/styles.css`: shared styles
- `docs/games/`: one page per game
- `docs/assets/images/`: game card art
- `tests/memory-game.test.js`: memory-game logic checks
- `tests/fruit-pairs.test.js`: fruit matching difficulty and deck checks
- `tests/teddy-game.test.js`: teddy box shuffle level and guess checks
- `README.md`: local run and GitHub Pages notes

## Package Manager

- None configured
- Use direct browser/static commands only

## File-Scoped Commands

| Task              | Command                          |
| ----------------- | -------------------------------- |
| Serve locally     | `python3 -m http.server 8000`    |
| Open site         | `http://localhost:8000/docs/`    |
| Test memory logic | `node tests/memory-game.test.js` |
| Test fruit pairs  | `node tests/fruit-pairs.test.js` |
| Test find teddy   | `node tests/teddy-game.test.js`  |

## Current Game

- `docs/games/memory.html`: 3x3 memory game
- Flow: enter seconds -> start -> show shuffled `1-9` -> hide -> click tiles to reveal -> restart
- `docs/games/fruit-pairs.html`: image matching game using `docs/assets/images/fruit-collection.png`
- Flow: choose `easy`/`medium`/`hard` -> start -> flip fruit cards -> match all pairs to win
- `docs/games/teddy.html`: find-the-teddy shell game in a pink toy room
- Flow: choose `easy`/`medium`/`hard` -> preview teddy in one box -> shuffle -> click the correct box

## Add A New Game

- Add page: `docs/games/<slug>.html`
- Add optional logic: `docs/games/<slug>.js`
- Add optional image: `docs/assets/images/<slug>.svg`
- Add card entry in `docs/script.js`
- Include back link to `../index.html`
- Reuse `../styles.css`

## Idea Inbox

```md
- [ ] Game title
  - Goal:
  - Core loop:
  - Controls:
  - Visual notes:
  - Extra rules:
```
