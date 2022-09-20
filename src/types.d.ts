/**
 * A card has two faces, each represented by a string
 */
type Card = [string, string];

/**
 * 7 sections of a Leitner box
 */
type Boxes = [
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>,
	Array<Card>
];

type LearningState = {
	/**
	 * Cards which haven't been added into the flow yet
	 */
	ready: Array<Card>;
	/**
	 * Active leitner boxes
	 */
	boxes: Boxes;
	/**
	 * Cards that have been completely learned
	 */
	retired: Array<Card>;
};
