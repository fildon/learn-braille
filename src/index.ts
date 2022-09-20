// As noted in `jest.config.ts` this file is the 'imperative shell'
// As such it will not be checked. Therefore it should have
// only the bare minimum of code in it.

const check = document.querySelector("button#check");
const wrong = document.querySelector("button#wrong");
const right = document.querySelector("button#right");

if (!check) throw new Error("Could not find main element");
if (!wrong) throw new Error("Could not find wrong element");
if (!right) throw new Error("Could not find right element");

const currentCard = {
	front: "front",
	back: "back",
};
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
	// TODO mark card incorrect
	// Update the UI
	check.textContent = currentCard.front;
});
right.addEventListener("click", () => {
	showFront = true;
	// TODO mark card correct
	// Update the UI
	check.textContent = currentCard.front;
});
