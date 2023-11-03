import { createHint, getBoardElement } from './script.js';
import { Discs, White, Black } from './object.js';
const boardPieces = 8;
const rowRow = [1, 2, 3, 4, 5, 6, 7, 8];
const colCol = [1, 2, 3, 4, 5, 6, 7, 8];
let dragged;
let startSquare;

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

const discs = document.querySelectorAll('.disc');
const darkSquares = document.querySelectorAll('.board__square--dark');

function createObjectDisc(e) {
	let disc;
	const activeDisc = e.target;

	if (!activeDisc) {
		return false;
	}

	if (activeDisc.classList.contains('disc--white')) {
		disc = new White(activeDisc);
	} else if (activeDisc.classList.contains('disc--black')) {
		disc = new Black(activeDisc);
	}

	return disc;
}

function createNextStep(disc) {
	const steps = findNextStep(disc);

	steps.placesToMove.forEach((step) => {
		createHint(step);
	});
}

function showPossibleMoves(e) {
	const disc = createObjectDisc(e);
	if (disc) {
		createNextStep(disc);
	}
}

function removePossibleMoves() {
	const hints = document.querySelectorAll('.hint');
	hints.forEach((hint) => {
		hint.parentNode.removeChild(hint);
	});
}

function chooseDiscToMove(e) {
	removePossibleMoves();
	dragged = createObjectDisc(e);
	startSquare = e.target;
	showPossibleMoves(e);
}

function isEnemy(enemyElement) {
	if (!enemyElement) {
		return false;
	}

	return enemyElement.firstElementChild.classList.contains(
		'disc--' + dragged.enemyColor
	);
}

function isTwoRowDifference(startRow) {
	const stopRow = dragged.getRowNumber();

	return (
		parseInt(startRow) === parseInt(stopRow) + 2 ||
		parseInt(startRow) === parseInt(stopRow) - 2
	);
}

function captureEnemyDisc(start, enemyDisc) {
	const startRow = start.parentElement.firstElementChild.textContent;
	const stopColumn = dragged.getColNumber();

	if (isTwoRowDifference(startRow)) {
		let enemyElement = null;
		let i = 0;

		while (i < enemyDisc.length) {
			if (
				enemyDisc[i + 1] === parseInt(startRow) + 1 ||
				enemyDisc[i + 1] === parseInt(startRow) - 1
			) {
				if (enemyDisc[i + 2] === parseInt(stopColumn) - 1) {
					enemyElement = enemyDisc[i];
				} else if (enemyDisc[i + 2] === parseInt(stopColumn) + 1) {
					enemyElement = enemyDisc[i];
				}
			}
			i = i + 3;
		}
		if (isEnemy(enemyElement)) {
			enemyElement.removeChild(enemyElement.firstElementChild);
		}
	}
}

function moveDisc(e) {
	if (e.target.classList.contains('disc')) {
		return false;
	}
	const target = e.target.closest('.board__square--dark');
	if (!target.children.length) {
		return false;
	}
	removePossibleMoves();

	const start = startSquare.parentElement;
	const indexes = findNextStep(dragged);

	if (!indexes.placesToMove) {
		return false;
	}

	if (indexes.placesToMove.includes(target)) {
		dragged.HTMLelement.parentNode.removeChild(dragged.HTMLelement);
		target.appendChild(dragged.HTMLelement);
		captureEnemyDisc(start, indexes.enemyDisc);
	}
}

/* */
const getIndexes = (disc, rowNumber, colId) => {
	const index = disc.getIndexesOfStep();
	return [index[rowNumber][0], index[rowNumber][colId]];
};

const getIndexesOfFirstStep = (disc, square) => {
	const steps = disc.getFirstStep();

	const indexes = steps[0].indexOf(square);
	const rowNumber = steps[1][indexes][0];
	const colNumber = disc.getColId(rowNumber, steps[1][indexes][1]);
	return { row: rowNumber, columnId: colNumber };
};

function findStepsToCaptureEnemyDisc(square, disc) {
	let enemyDisc = [];

	const firstStepsIndexes = getIndexesOfFirstStep(disc, square);

	const steps = getBoardElement(
		...getIndexes(disc, firstStepsIndexes.row + 1, firstStepsIndexes.columnId)
	);

	if (isSquareEmpty(steps)) {
		enemyDisc.push(square, [
			...getIndexes(disc, firstStepsIndexes.row, firstStepsIndexes.columnId),
		]);

		return { steps: steps, enemyDisc: enemyDisc };
	}
}

const getTableWithoudUndefindElement = (table) => {
	const elements = table.filter((element) => {
		if (element !== 'undefined' || element !== '') {
			return element;
		}
	});
	return elements;
};

function findNextStep(disc) {
	let placesToMove = [];
	let enemyDisc = [];

	const firstSteps = disc.getFirstStep();
	console.log(firstSteps);

	const nextStepToCaptureDiscs = firstSteps[0].map((square) => {
		if (squareIsOccupiedByEnemy(square, disc.enemyColor)) {
			const steps = findStepsToCaptureEnemyDisc(square, disc);
			placesToMove.push(steps.steps);
			enemyDisc.push(steps.enemyDisc);
			return steps.steps;
		}
	});

	let forwardStep = dragged.getForwardSteps(firstSteps[0]);

	const stepsWithoutCaptureDisc = getTableWithoudUndefindElement(
		nextStepToCaptureDiscs
	);

	if (!stepsWithoutCaptureDisc.length) {
		forwardStep.forEach((step) => {
			if (isSquareEmpty(step)) {
				placesToMove.push(step);
			}
		});
	}
	/* do poprawy w innym miejscu..*/
	enemyDisc = [enemyDisc[0][0], ...enemyDisc[0][1]];

	return { placesToMove: placesToMove, enemyDisc: enemyDisc };
}

/* */
discs.forEach((disc) => {
	//disc.addEventListener('dragstart', chooseDiscToMove);
	disc.addEventListener('click', chooseDiscToMove);
});

darkSquares.forEach((square) => {
	square.addEventListener('click', moveDisc);
	//	square.addEventListener('dragover', changeStateOfDisc);
	//square.addEventListener('drop', moveDisc);
});

export { isSquareEmpty, squareIsOccupiedByEnemy };
