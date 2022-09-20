import { buildStorage } from "./storage";

// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be tested. Therefore it should have
// only the bare minimum of code in it.

const test = document.querySelector("button#test");
const wrong = document.querySelector("button#wrong");
const right = document.querySelector("button#right");

if (!test) throw new Error("Could not find main element");
if (!wrong) throw new Error("Could not find wrong element");
if (!right) throw new Error("Could not find right element");

const storage = buildStorage({
	getItem: (key) => window.localStorage.getItem(key),
	setItem: (key, value) => window.localStorage.setItem(key, value),
});

const state = storage.getState();

test.textContent = state.boxes[0][0][0];
test.addEventListener("click", () => {
	// Flip the card
	state.boxes[0][0].reverse();
	// Update the UI
	test.textContent = state.boxes[0][0][0];
});
wrong.addEventListener("click", () => {
	// Rotate cards
	const [head, ...tail] = state.boxes[0];
	state.boxes[0] = [...tail, head];
	// Update the UI
	test.textContent = state.boxes[0][0][0];
});
right.addEventListener("click", () => {
	// Rotate cards
	const [head, ...tail] = state.boxes[0];
	state.boxes[0] = [...tail, head];
	// Update the UI
	test.textContent = state.boxes[0][0][0];
});
