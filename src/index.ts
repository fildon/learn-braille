/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	createInitialState,
	stateToString,
	stringToState,
} from "./persistence";
import { markCardCorrect, markCardIncorrect } from "./stateMachine";
import { pickRandom, shuffle } from "./utils";

// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be checked. Therefore it should have
// only the bare minimum of code in it.

const test = document.querySelector("#test")!;
const answerA = document.querySelector("#A")!;
const answerB = document.querySelector("#B")!;
const answerC = document.querySelector("#C")!;
const answerD = document.querySelector("#D")!;
const previousResult = document.querySelector("#previousResult")!;
const ready = document.querySelector("#ready")!;
const box1 = document.querySelector("#box1")!;
const box2 = document.querySelector("#box2")!;
const box3 = document.querySelector("#box3")!;
const box4 = document.querySelector("#box4")!;
const box5 = document.querySelector("#box5")!;
const box6 = document.querySelector("#box6")!;
const box7 = document.querySelector("#box7")!;
const retired = document.querySelector("#retired")!;

let state: GameState;
try {
	state = stringToState(window.localStorage.getItem("state") ?? "");
} catch (_) {
	state = createInitialState();
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
	ready.textContent = state.ready.length.toString();
	box1.textContent = state.box1.length.toString();
	box2.textContent = state.box2.length.toString();
	box3.textContent = state.box3.length.toString();
	box4.textContent = state.box4.length.toString();
	box5.textContent = state.box5.length.toString();
	box6.textContent = state.box6.length.toString();
	box7.textContent = state.box7.length.toString();
	retired.textContent = state.retired.length.toString();
};

updateUI();

const positiveFeedback = [
	"Nice!",
	"Good job!",
	"You're the best!",
	"Keep it up!",
	"You're practically Dr. Braille at this point!",
	"Amazing!",
	"Bravo!",
	"YESSSS",
	"Well done!",
	"Got it right!",
	"Brailliant!",
];

[answerA, answerB, answerC, answerD].forEach((answer, i) =>
	answer.addEventListener("click", () => {
		// If this was correct?
		if (answers[i].isCorrect) {
			previousResult.textContent = pickRandom(positiveFeedback);
			state = markCardCorrect(state);
		} else {
			previousResult.textContent = `Naw. ${state.currentCard.front} is actually ${state.currentCard.back}`;
			state = markCardIncorrect(state);
		}
		// Persist
		window.localStorage.setItem("state", stateToString(state));
		// Update UI
		updateUI();
	})
);
