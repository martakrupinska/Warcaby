import {
	createHint,
	getBoardElement,
	showPlayer,
	setGameOverInformation,
} from './script.js';
import { White, Black } from './object.js';

let movedDisc;
let startSquare;
let isCapturedEnemy;
let isDiscMoved;

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
		return false;
	}
	return square.children.item(0).classList.contains('disc--' + enemyColor);
};

function createObjectDisc(activeDisc) {
	let disc;

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

const findPossibleMovesToShowIt = (element) => {
	const disc = createObjectDisc(element);

	if (!disc) {
		return false;
	}

	return findNextStep(disc);
};

function showPossibleMoves(element) {
	const steps = findPossibleMovesToShowIt(element);

	steps.placesToMove.forEach((step) => {
		createHint(step);
	});
	return steps.placesToMove;
}

function removePossibleMoves() {
	const hints = document.querySelectorAll('.hint');
	hints.forEach((hint) => {
		hint.parentNode.removeChild(hint);
	});
}

const checkIfMoveIsPossible = (e) => {
	if (!movedDisc) {
		return true;
	}

	const colorPrevious = e.target.classList.value.split('--')[1];
	const colorCurrent = movedDisc.color;

	if (isDiscMoved === null) {
		if (colorCurrent !== colorPrevious) {
			console.error('dwa ruchy jednego koloru po kliknięciu na przeciwny');
			return false;
		}
	}

	if (isDiscMoved && isCapturedEnemy) {
		if (colorCurrent !== colorPrevious) {
			console.error('ruch przeciwnika po zbiciu');
			return false;
		}
	}

	if (isDiscMoved && !isCapturedEnemy) {
		if (colorCurrent === colorPrevious) {
			console.error('dwa ruchy jednego koloru!');
			return false;
		}
	}
	return true;
};

function chooseDiscToMove(e) {
	removePossibleMoves();

	if (!checkIfMoveIsPossible(e)) {
		return false;
	}

	movedDisc = createObjectDisc(e.target);
	startSquare = e.target;
	showPossibleMoves(e.target);
	isCapturedEnemy = null;
	isDiscMoved = null;
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
			return true;
		}
	}
	return false;
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

		isDiscMoved = true;
		isCapturedEnemy = captureEnemyDisc(start, indexes.enemyDisc);

		isCapturedEnemy
			? showPlayer(movedDisc.color)
			: showPlayer(movedDisc.enemyColor);

		if (!findDiscWhichMoveIsPossible(movedDisc.enemyColor)) {
			setGameOverInformation(movedDisc.color);
		}
	}
}

const findDiscWhichMoveIsPossible = (gamer) => {
	const gamerDiscs = document.querySelectorAll('.disc--' + gamer);

	if (!gamerDiscs.length) {
		return false;
	}

	let possibleMoves = [];
	let amountOfMoves = [];

	gamerDiscs.forEach((gamerDisc) => {
		possibleMoves = findPossibleMovesToShowIt(gamerDisc).placesToMove.length;

		if (possibleMoves > 0) {
			amountOfMoves.push(possibleMoves);
		}
	});

	if (!amountOfMoves.length) {
		return false;
	}
	return true;
};

/* */
function getIndexes(index, rowNumber, colId) {
	if (!index || !rowNumber || !colId) {
		return false;
	}
	/* return chyba nie powinien być false tylko []*/

	return [index[rowNumber][0], index[rowNumber][colId]];
}

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

	if (rowAndColNumberAdd && !rowAndColNumberAdd.includes(undefined)) {
		element = getBoardElement(...rowAndColNumberAdd);
	} else if (rowAndColNumberSub && !rowAndColNumberSub.includes(undefined)) {
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

function findNextStep(disc) {
	let placesToMove = [];
	let enemyDisc = [];

	const stepsElements = getTableWithoudUndefindElement(disc.getFirstSteps()[0]);

	const nextStepToCaptureDiscs = stepsElements.map((square) => {
		if (squareIsOccupiedByEnemy(square, disc.enemyColor)) {
			const steps = findStepsToCaptureEnemyDisc(square, disc);
			if (steps) {
				placesToMove.push(steps.element);
				enemyDisc.push(steps.enemyDisc);

				return steps.element;
			}
		}
	});

	let forwardStep = getTableWithoudUndefindElement(
		disc.getForwardSteps(stepsElements)
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
	//console.log(enemyDisc);
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
