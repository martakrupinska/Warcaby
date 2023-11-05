import { createHint, getBoardElement } from './script.js';
import { White, Black } from './object.js';

let movedDisc;
let startSquare;

const discs = document.querySelectorAll('.disc');
const darkSquares = document.querySelectorAll('.board__square--dark');

const isSquareEmpty = (square) => {
	if (!square) {
		return false;
	}
	return !square.children.length;
};

const squareIsOccupiedByEnemy = (square, enemyColor) => {
	if (!square.children.item(0)) {
		//console.error('Brakuje pola, na które pionek mógłby iść!');
		return false;
	}
	return square.children.item(0).classList.contains('disc--' + enemyColor);
};

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

function showPossibleMoves(e) {
	const disc = createObjectDisc(e);

	if (disc) {
		const steps = findNextStep(disc);

		steps.placesToMove.forEach((step) => {
			createHint(step);
		});
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
	movedDisc = createObjectDisc(e);
	startSquare = e.target;
	showPossibleMoves(e);
}

function isEnemy(enemyElement) {
	if (!enemyElement) {
		return false;
	}
	return enemyElement.firstElementChild.classList.contains(
		'disc--' + movedDisc.enemyColor
	);
}

function isTwoRowDifference(startRow) {
	const stopRow = movedDisc.getRowNumber();

	return (
		parseInt(startRow) === parseInt(stopRow) + 2 ||
		parseInt(startRow) === parseInt(stopRow) - 2
	);
}

function captureEnemyDisc(start, enemyDisc) {
	const startRow = start.parentElement.firstElementChild.textContent;
	const stopColumn = movedDisc.getColNumber();

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
	const indexes = findNextStep(movedDisc);

	if (!indexes.placesToMove) {
		return false;
	}

	if (indexes.placesToMove.includes(target)) {
		movedDisc.HTMLelement.parentNode.removeChild(movedDisc.HTMLelement);
		target.appendChild(movedDisc.HTMLelement);
		captureEnemyDisc(start, indexes.enemyDisc);
	}
}

/* */
const getIndexes = (index, rowNumber, colId) => {
	if (!index || !rowNumber || !colId) {
		return false;
	}

	return [index[rowNumber][0], index[rowNumber][colId]];
};

const getIndexesOfFirstStep = (disc, square) => {
	const steps = disc.getFirstSteps();

	const indexes = steps[0].indexOf(square);
	const rowNumber = steps[1][indexes][0];
	const colNumber = disc.getColId(rowNumber, steps[1][indexes][1]);
	return { row: rowNumber, columnId: colNumber };
};

function findStepsToCaptureEnemyDisc(square, disc) {
	let enemyDisc = [];
	const indexes = getIndexesOfFirstStep(disc, square);
	const indexOfPossibleSteps = disc.getIndexesOfPossibleSteps();

	const rowAndColNumberAdd = getIndexes(
		indexOfPossibleSteps,
		indexes.row + 1,
		indexes.columnId
	);
	const rowAndColNumberSub = getIndexes(
		indexOfPossibleSteps,
		indexes.row - 1,
		indexes.columnId
	);

	let element;

	if (!rowAndColNumberAdd.includes(undefined)) {
		element = getBoardElement(...rowAndColNumberAdd);
	} else {
		element = getBoardElement(...rowAndColNumberSub);
	}

	if (isSquareEmpty(element)) {
		enemyDisc.push(square, [
			...getIndexes(indexOfPossibleSteps, indexes.row, indexes.columnId),
		]);
		return { element: element, enemyDisc: enemyDisc };
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

	const firstSteps = disc.getFirstSteps();
	console.log(firstSteps);

	const stepsElements = getTableWithoudUndefindElement(firstSteps[0]);

	const nextStepToCaptureDiscs = stepsElements.map((square) => {
		if (squareIsOccupiedByEnemy(square, disc.enemyColor)) {
			const steps = findStepsToCaptureEnemyDisc(square, disc);
			console.log(steps);
			if (steps) {
				placesToMove.push(steps.element);
				enemyDisc.push(steps.enemyDisc);
				return steps.element;
			}
		}
	});

	let forwardStep = getTableWithoudUndefindElement(
		movedDisc.getForwardSteps(stepsElements)
	);

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
	if (enemyDisc.length > 0) {
		enemyDisc = [enemyDisc[0][0], ...enemyDisc[0][1]];
	}

	return { placesToMove: placesToMove, enemyDisc: enemyDisc };
}

/* */
discs.forEach((disc) => {
	disc.addEventListener('click', chooseDiscToMove);
});

darkSquares.forEach((square) => {
	square.addEventListener('click', moveDisc);
});
