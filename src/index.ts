/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	initialState,
	stateToString,
	stringToState,
} from "./persistence";
import {
	markCardCorrect,
	markCardIncorrect,
	shuffle,
} from "./stateMachine";

// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be checked. Therefore it should have
// only the bare minimum of code in it.

const test = document.querySelector("#test")!;
const answerA = document.querySelector("#A")!;
const answerB = document.querySelector("#B")!;
const answerC = document.querySelector("#C")!;
const answerD = document.querySelector("#D")!;

let state: GameState;
try {
	state = stringToState(window.localStorage.getItem("state") ?? "");
} catch (_) {
	state = initialState;
}
let answers: { text: string; isCorrect: boolean }[] = [];

const updateUI = () => {
	answers = shuffle([
		{ text: state.currentCard.back, isCorrect: true },
		...state.guesses.map((g) => ({
			text: g.back,
			isCorrect: false,
		})),
	]);
	test.textContent = state.currentCard.front;
	answerA.textContent = answers[0].text;
	answerB.textContent = answers[1].text;
	answerC.textContent = answers[2].text;
	answerD.textContent = answers[3].text;
};

updateUI();

[answerA, answerB, answerC, answerD].forEach((answer, i) =>
	answer.addEventListener("click", () => {
		// If this was correct?
		state = answers[i].isCorrect
			? markCardCorrect(state)
			: markCardIncorrect(state);
		// Persist
		window.localStorage.setItem("state", stateToString(state));
		// Update UI
		updateUI();
	})
);
