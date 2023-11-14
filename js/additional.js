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

	for (let i = 0; i <= gamerDiscs.length; i++) {
		if (findPossibleMovesToShowIt(gamerDiscs[i]).placesToMove.length > 0) {
			return true;
		}
	}
};

const findPossibleMovesToShowIt = (element) => {
	const disc = createObjectDisc(element);
	console.log(disc);

	if (!disc) {
		return false;
	}

	return findNextStep(disc);
};

function showPossibleMoves(element) {
	const steps = findPossibleMovesToShowIt(element);

	if (!steps) {
		return false;
	}

	steps.placesToMove.forEach((step) => {
		createHint(step);
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
