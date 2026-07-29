# 🎰 Marble Betting Game

A simple betting game where you draw marbles from a bag and win or lose gold based on their color. Built two ways in this repo:

- **`marble_betting_game.ipynb`** — a Python/Jupyter console version
- **`index.html` / `style.css` / `script.js`** — a browser version with a neon casino UI, animated log, confetti, and screen flashes

## How it works

You start with a pile of gold and choose how many draws to play. Before each draw you place a bet, then a marble is pulled at random from the bag and your bet is multiplied (or lost) based on its color:

| Marble | Odds (out of 9) | Outcome |
|--------|------------------|---------|
| 🟢 Green | 5/9 | Win 2x your bet |
| 🔴 Red | 3/9 | Lose your bet |
| ⚫ Black | 1/9 | Win 10x your bet |
| ⚪ White | 1/9 | Lose 5x your bet |

The game ends when you run out of draws, or when your gold drops to half (or less) of your starting amount.

## Play in the browser

Open `docs/index.html` in any browser — no build step or server required.

1. Enter your starting gold and number of draws
2. Click **Start Game**
3. Enter a bet amount and click **Place Bet** (or hit Enter) each round
4. Watch the log, screen flashes, and confetti as marbles are drawn
5. Click **Play Again** at the end to restart

## Play in Python / Jupyter

Open `marble_betting_game.ipynb` in Jupyter (or any notebook environment) and run the cells.

- You'll be prompted for a starting gold amount and number of draws
- Enter a bet each round, or type `exit` to quit early
- A summary is printed once the game ends

```bash
jupyter notebook marble_betting_game.ipynb
```

Requires Python 3 with the standard library only (uses `random`).

## Project structure

```
marbles_git/
├── marble_betting_game.ipynb   # Python console version
├── docs/
│   ├── index.html               # web game markup
│   ├── style.css                # neon/casino styling, animations
│   └── script.js                # web game logic
├── LICENSE.md
└── README.md
```

## License

See [LICENSE.md](LICENSE.md).
