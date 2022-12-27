import { getBoxKey } from "./boxSequencer";
import { pickRandomFrom, shuffle } from "./utils";

const moveCard = (
	state: GameState,
	card: Card,
	target: LearningState
): GameState => {
	// No-op case
	if (card.learningState === target) return state;
	return {
		...state,
		// Remove the card from it's current box
		[card.learningState]: state[card.learningState].filter(
			({ id }) => id !== card.id
		),
		// Add it to target, and update its learningState
		[target]: [...state[target], { ...card, learningState: target }],
	};
};

const pullInReadyCardsIfNeeded = (state: GameState): GameState => {
	if (state.box1.length > 0) return state;
	if (state.box2.length > 0) return state;
	if (state.ready.length === 0) return state;

	// Shuffle the ready cards, and take up to 5
	const cardsToAdd = shuffle(state.ready).slice(0, 5);

	const newState = cardsToAdd.reduce(
		(acc, curr) => moveCard(acc, curr, "box1"),
		state
	);

	return newState;
};

const onlyRetiredHasCards = (state: GameState): boolean =>
	state.box1.length === 0 &&
	state.box2.length === 0 &&
	state.box3.length === 0 &&
	state.box4.length === 0 &&
	state.box5.length === 0 &&
	state.box6.length === 0 &&
	state.box7.length === 0;

const advanceStepToNonEmptyBox = (state: GameState): GameState => {
	let workingStep = state.step;

	let box = state[getBoxKey(workingStep)];

	while (box.length === 0) {
		workingStep++;
		box = state[getBoxKey(workingStep)];
	}

	// This keeps the step counter sensibly rotating, rather than growing
	// The -1/+1 is to keep it running from 1-64 (rather than 0-63)
	workingStep = ((workingStep - 1) % 64) + 1;

	return { ...state, step: workingStep };
};

const getFalseGuesses = (
	state: GameState,
	correctCard: Card
): [Card, Card, Card] => {
	const correctBox = state[getBoxKey(state.step)];
	// If there are enough cards in the correct box, then we take them all from there.
	if (correctBox.length >= 4) {
		return shuffle(
			correctBox.filter((card) => card.id !== correctCard.id)
		).slice(0, 3) as [Card, Card, Card];
	}

	// Else we need to look in other boxes
	return shuffle(
		[
			...state.ready,
			...state.box1,
			...state.box2,
			...state.box3,
			...state.box4,
			...state.box5,
			...state.box6,
			...state.box7,
			...state.retired,
		].filter((card) => card.id !== correctCard.id)
	).slice(0, 3) as [Card, Card, Card];
};

const advanceState = (state: GameState): GameState => {
	// Special case, if every card is in 'retired'
	// Then we just have to return a random other retired card
	if (onlyRetiredHasCards(state)) {
		const randomRetired = shuffle(
			state.retired.filter(({ id }) => id !== state.currentCard.id)
		)[0];
		return { ...state, currentCard: randomRetired };
	}

	const advancedState = advanceStepToNonEmptyBox(
		pullInReadyCardsIfNeeded(state)
	);

	const box = advancedState[getBoxKey(advancedState.step)];

	const cardToTest = pickRandomFrom(box);

	return {
		...advancedState,
		guesses: getFalseGuesses(advancedState, cardToTest),
		currentCard: cardToTest,
	};
};

const boxKeyUpwardsMap: Record<LearningState, LearningState> = {
	ready: "box1",
	box1: "box2",
	box2: "box3",
	box3: "box4",
	box4: "box5",
	box5: "box6",
	box6: "box7",
	box7: "retired",
	retired: "retired",
};

export const markCardCorrect = (state: GameState): GameState => {
	const movedCard = moveCard(
		state,
		state.currentCard,
		boxKeyUpwardsMap[state.currentCard.learningState]
	);

	return advanceState(movedCard);
};

export const markCardIncorrect = (state: GameState): GameState => {
	const movedCard = moveCard(state, state.currentCard, "box1");

	return advanceState(movedCard);
};
