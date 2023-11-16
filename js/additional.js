import { createObjectDisc, findNextStep } from './actions.js';

import { createHint } from './script.js';

const isSquareEmpty = (square) => {
	if (!square) {
		return false;
	}
	return !square.children.length;
};

const squareIsOccupiedByEnemy = (square, enemyColor) => {
	if (!square.children.item(0)) {
		return false;
	}
	return square.children.item(0).classList.contains('disc--' + enemyColor);
};

function isEnemy(enemyElement, movedDisc) {
	if (!enemyElement) {
		return false;
	}
	return enemyElement.firstElementChild.classList.contains(
		'disc--' + movedDisc.enemyColor
	);
}

function isTwoRowDifference(startRow, stopRow) {
	if (!startRow) {
		return false;
	}

	const rowDifference = 2;

	return (
		startRow === stopRow + rowDifference || startRow === stopRow - rowDifference
	);
}

const isEnemyInTopOrBottomDirection = (enemy, startRow) => {
	if (!enemy || !startRow) {
		return false;
	}
	const direction = 1;

	return enemy === startRow + direction || enemy === startRow - direction;
};

const isEnemyInLeftDirection = (enemy, stopColumn) => {
	if (!enemy || !stopColumn) {
		return false;
	}
	const leftDirection = 1;
	return enemy === stopColumn - leftDirection;
};

const isEnemyInRightDirection = (enemy, stopColumn) => {
	if (!enemy || !stopColumn) {
		return false;
	}
	const rightDirection = 1;
	return enemy === stopColumn + rightDirection;
};

const findDiscWhichMoveIsPossible = (gamer) => {
	const gamerDiscs = document.querySelectorAll('.disc--' + gamer);

	if (!gamerDiscs.length) {
		return false;
	}

	let moves = false;
	let enemies = [];

	gamerDiscs.forEach((disc) => {
		const possibleMoves = findPossibleMovesToShowIt(disc);
		//console.log(possibleMoves);
		if (possibleMoves) {
			if (possibleMoves.placesToMove.length > 0) {
				moves = true;

				if (possibleMoves.placesWithEnemy.length > 0) {
					enemies.push(possibleMoves.placesWithEnemy);
				}
			}
		}
	});

	/* for (let i = 0; i <= gamerDiscs.length; i++) {
		const possibleMoves = findPossibleMovesToShowIt(gamerDiscs[i]);
		if (possibleMoves.placesToMove && possibleMoves.placesToMove.length > 0) {
			moves = true;
			if (possibleMoves.enemyDisc) {
				console.log(possibleMoves.enemyDisc);
				enemies.push(possibleMoves.enemyDisc);
			}
			//return true;
		}
	} */
	return { moves: moves, enemies: enemies };
};

const findPossibleMovesToShowIt = (element) => {
	const disc = createObjectDisc(element);

	if (!disc) {
		return [];
	}

	return findNextStep(disc);
};

function showPossibleMoves(element, isEnemyToCapture) {
	const steps = findPossibleMovesToShowIt(element);

	if (!steps) {
		return false;
	}

	steps.placesToMove.forEach((step) => {
		if (isEnemyToCapture) {
			for (let i = 0; i < isEnemyToCapture.length; i++) {
				if (isEnemyToCapture[i][0] == step) {
					createHint(step);
				}
			}
		} else {
			createHint(step);
		}
	});

	return steps.placesToMove;
}

function removePossibleMoves() {
	const hints = document.querySelectorAll('.hint');

	if (!hints) {
		return false;
	}

	hints.forEach((hint) => {
		hint.parentNode.removeChild(hint);
	});
}

const getTableWithoudUndefindElement = (table) => {
	if (!table) {
		return false;
	}
	const elements = table.filter((element) => {
		if (element !== 'undefined' || element !== '') {
			return element;
		}
	});
	return elements;
};

function getIndexes(index, rowNumber, colId) {
	if (!index || !rowNumber || !colId) {
		return [];
	}

	if (!index[rowNumber]) {
		return [];
	}

	return [index[rowNumber][0], index[rowNumber][colId]];
}

const getIndexesOfFirstStep = (disc, square) => {
	const steps = disc.getFirstSteps();

	const indexes = steps[0].indexOf(square);
	const rowNumber = steps[1][indexes][0];
	const colNumber = disc.getColId(rowNumber, steps[1][indexes][1]);
	return { row: rowNumber, columnId: colNumber };
};

export {
	isSquareEmpty,
	squareIsOccupiedByEnemy,
	isEnemy,
	isTwoRowDifference,
	isEnemyInTopOrBottomDirection,
	isEnemyInLeftDirection,
	isEnemyInRightDirection,
	findDiscWhichMoveIsPossible,
	showPossibleMoves,
	removePossibleMoves,
	getTableWithoudUndefindElement,
	getIndexes,
	getIndexesOfFirstStep,
};
