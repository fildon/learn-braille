import { buildStorage } from "./storage";
import { markCardCorrect, markCardIncorrect } from "./cardActions";

// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be checked. Therefore it should have
// only the bare minimum of code in it.

const check = document.querySelector("button#check");
const wrong = document.querySelector("button#wrong");
const right = document.querySelector("button#right");

if (!check) throw new Error("Could not find main element");
if (!wrong) throw new Error("Could not find wrong element");
if (!right) throw new Error("Could not find right element");

const storage = buildStorage({
	getItem: (key) => window.localStorage.getItem(key),
	setItem: (key, value) => window.localStorage.setItem(key, value),
});

let currentCard = storage.getCurrentCard();
let showFront = true;
check.textContent = currentCard.front;
check.addEventListener("click", () => {
	// Flip which side we show
	showFront = !showFront;
	// Update the UI
	check.textContent = showFront ? currentCard.front : currentCard.back;
});
wrong.addEventListener("click", () => {
	showFront = true;
	const nextCard = markCardIncorrect(
		currentCard,
		(card, target) => storage.setCardTo(card, target),
		() => storage.getCurrentCard()
	);
	currentCard = nextCard;
	// Update the UI
	check.textContent = currentCard.front;
});
right.addEventListener("click", () => {
	showFront = true;
	const nextCard = markCardCorrect(
		currentCard,
		(card, target) => storage.setCardTo(card, target),
		() => storage.getCurrentCard()
	);
	currentCard = nextCard;
	// Update the UI
	check.textContent = currentCard.front;
});
