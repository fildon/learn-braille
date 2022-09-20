const boxKeyUpwardsMap: Record<BoxKey, BoxKey> = {
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

export const markCardCorrect = (
	card: Card,
	setCardTo: (card: Card, target: Card["learningState"]) => void,
	getCurrentCard: () => Card
) => {
	setCardTo(card, boxKeyUpwardsMap[card.learningState]);
	return getCurrentCard();
};

export const markCardIncorrect = (
	card: Card,
	setCardTo: (card: Card, target: Card["learningState"]) => void,
	getCurrentCard: () => Card
) => {
	setCardTo(card, "box1");
	return getCurrentCard();
};
