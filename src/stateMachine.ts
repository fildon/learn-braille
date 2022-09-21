import { getBoxKey } from "./boxSequencer";

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
	const shuffledCardsInRead = state.ready
		.map((card) => ({ card, rank: Math.random() }))
		.sort((a, b) => a.rank - b.rank)
		.map(({ card }) => card);
	const cardsToAdd = shuffledCardsInRead.slice(0, 5);

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

const advanceState = (state: GameState): GameState => {
	// Special case, if every card is in 'retired'
	// Then we just have to return a random other retired card
	if (onlyRetiredHasCards(state)) {
		const randomRetired = state.retired
			.filter(({ id }) => id !== state.currentCard.id)
			.map((card) => ({ card, rank: Math.random() }))
			.sort((a, b) => a.rank - b.rank)
			.map(({ card }) => card)[0];
		return { ...state, currentCard: randomRetired };
	}

	const advancedState = advanceStepToNonEmptyBox(
		pullInReadyCardsIfNeeded(state)
	);

	const box = advancedState[getBoxKey(advancedState.step)];

	const randomIndex = Math.floor(box.length * Math.random());
	const randomCard = box[randomIndex];

	return {
		...advancedState,
		currentCard: randomCard,
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
