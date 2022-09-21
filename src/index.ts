import { initialState, stateToString, stringToState } from "./persistence";
import { markCardCorrect, markCardIncorrect } from "./stateMachine";

// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be checked. Therefore it should have
// only the bare minimum of code in it.

const check = document.querySelector("button#check");
const wrong = document.querySelector("button#wrong");
const right = document.querySelector("button#right");
if (!check) throw new Error("Could not find check element");
if (!wrong) throw new Error("Could not find wrong element");
if (!right) throw new Error("Could not find right element");

let state: GameState;
try {
	state = stringToState(window.localStorage.getItem("state") ?? "");
} catch (_) {
	state = initialState;
}

let showFront = true;
check.textContent = state.currentCard.front;

check.addEventListener("click", () => {
	// Flip which side we show
	showFront = !showFront;
	// Update the UI
	check.textContent = showFront
		? state.currentCard.front
		: state.currentCard.back;
});
wrong.addEventListener("click", () => {
	showFront = true;
	state = markCardIncorrect(state);

	// Persist updated state
	window.localStorage.setItem("state", stateToString(state));
	// Update the UI
	check.textContent = state.currentCard.front;
});
right.addEventListener("click", () => {
	showFront = true;
	state = markCardCorrect(state);

	// Persist updated state
	window.localStorage.setItem("state", stateToString(state));
	// Update the UI
	check.textContent = state.currentCard.front;
});
