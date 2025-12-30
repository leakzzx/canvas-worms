# Copilot Instructions for Worm Game Project

## Project Overview

This is a simple browser-based worm (snake) game implemented in HTML, CSS, and JavaScript. The game logic, rendering, and user input handling are all managed on the client side. There are no external dependencies or build steps.

## File Structure

- `worm-game.html`: Main HTML file. Loads the canvas, links to CSS and JS.
- `worm-game.js`: Contains all game logic, rendering, and input handling.
- `worm-game.css`: Styles for centering the canvas and setting the background.

## Key Patterns and Conventions

- All JavaScript is in a single file (`worm-game.js`) and runs in the browser. No modules or frameworks are used.
- The game loop is managed with `setInterval(gameLoop, 100)`.
- The worm, food, and score are drawn directly to the canvas using 2D context methods.
- Keyboard input is handled with a single `keydown` event listener. Arrow key scrolling is prevented.
- Game state (worm, food, score, direction, gameOver) is managed with top-level variables.
- There is no persistent state or server communication.

## Developer Workflows

- No build or test commands are required; simply open `worm-game.html` in a browser to play and develop.
- To refactor or extend the game, edit `worm-game.js` and refresh the browser.
- For styling changes, edit `worm-game.css`.
- All changes can be tracked with git. Typical workflow: edit files, `git add .`, `git commit -m "message"`.

## Example: Adding a Feature

To add a new feature (e.g., restart button):

- Add the button to `worm-game.html`.
- Add event handling and logic in `worm-game.js`.
- Update styles in `worm-game.css` if needed.

## Notable Practices

- The code is heavily commented for clarity.
- No external libraries or frameworks are used.
- The project is intentionally minimal for easy onboarding and experimentation.

## References

- See `worm-game.js` for all gameplay logic and patterns.
- See `worm-game.html` for structure and resource linking.
- See `worm-game.css` for layout and appearance.

---

If you add new features or refactor, update this file to document new patterns or workflows.
