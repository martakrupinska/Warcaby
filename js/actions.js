import {
	getBoardElement,
	showPlayer,
	setGameOverInformation,
} from './script.js';

import { White, Black } from './discs.js';

import {
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
} from './additional.js';

let movedDisc;
let startSquare;
let capturedEnemyDisc;
let isDiscMoved;
let foundEnemyToCapture;

const discs = document.querySelectorAll('.disc');
const darkSquares = document.querySelectorAll('.board__square--dark');

function createObjectDisc(activeDisc) {
	if (!activeDisc) {
		return false;
	}

	if (activeDisc.classList.contains('disc--white')) {
		return new White(activeDisc);
	} else if (activeDisc.classList.contains('disc--black')) {
		return new Black(activeDisc);
	}
}

function chooseDiscToMove(e) {
	removePossibleMoves();

	if (!checkIfMoveIsPossible(e)) {
		return false;
	}

	movedDisc = createObjectDisc(e.target);
	startSquare = e.target;
	showPossibleMoves(e.target, foundEnemyToCapture);

	capturedEnemyDisc = null;
	isDiscMoved = null;
}

function captureEnemyDisc(start, enemy) {
	if (!start) {
		return false;
	}

	const startRow = start.parentElement.firstElementChild.textContent;
	const stopRow = movedDisc.getRowNumber();
	const stopColumn = movedDisc.getColNumber();

	if (!isTwoRowDifference(parseInt(startRow), parseInt(stopRow))) {
		return false;
	}

	let enemyElement = null;
	enemyElement = findEnemyElement(
		parseInt(startRow),
		parseInt(stopColumn),
		enemy
	);

	if (isEnemy(enemyElement, movedDisc)) {
		enemyElement.removeChild(enemyElement.firstElementChild);
		return true;
	}

	return false;
}

const findEnemyElement = (startRow, stopColumn, enemyArray) => {
	let i = 0;

	while (i < enemyArray.length) {
		let row = enemyArray[i + 1];
		let column = enemyArray[i + 2];
		let element = enemyArray[i];

		if (!isEnemyInTopOrBottomDirection(row, startRow)) {
			return;
		}

		if (isEnemyInLeftDirection(column, stopColumn)) {
			return element;
		} else if (isEnemyInRightDirection(column, stopColumn)) {
			return element;
		}

		i = i + 3;
	}
};

function moveDisc(e) {
	if (e.target.classList.contains('disc')) {
		return false;
	}
	const target = e.target.closest('.board__square--dark');
	if (!target.children.length) {
		return false;
	}
	removePossibleMoves();

	const indexes = findNextStep(movedDisc);
	const start = startSquare.parentElement;

	if (!indexes.placesToMove) {
		return false;
	}

	if (indexes.placesToMove.includes(target)) {
		movedDisc.HTMLelement.parentNode.removeChild(movedDisc.HTMLelement);
		target.appendChild(movedDisc.HTMLelement);

		isDiscMoved = true;
		additionalActionAfterCapturedEnemyDisc(start, indexes.enemyDisc);
	}
}
const additionalActionAfterCapturedEnemyDisc = (start, enemyDisc) => {
	capturedEnemyDisc = captureEnemyDisc(start, enemyDisc);
	const color = capturedEnemyDisc ? movedDisc.color : movedDisc.enemyColor;

	showPlayer(color);
	const movedIsPossible = findDiscWhichMoveIsPossible(color);

	foundEnemyToCapture =
		movedIsPossible.enemies.length > 0 ? movedIsPossible.enemies : false;

	if (!movedIsPossible.moves) {
		setGameOverInformation(movedDisc.color);
	}
};

/* */
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

	if (isDiscMoved && capturedEnemyDisc) {
		if (colorCurrent !== colorPrevious) {
			console.error('ruch przeciwnika po zbiciu');
			return false;
		}
	}

	if (isDiscMoved && !capturedEnemyDisc) {
		if (colorCurrent === colorPrevious) {
			console.error('dwa ruchy jednego koloru!');
			return false;
		}
	}

	return true;
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

	if (
		rowAndColNumberAdd.length > 0 &&
		!rowAndColNumberAdd.includes(undefined)
	) {
		element = getBoardElement(...rowAndColNumberAdd);
	} else if (
		rowAndColNumberSub.length > 0 &&
		!rowAndColNumberSub.includes(undefined)
	) {
		element = getBoardElement(...rowAndColNumberSub);
	}

	if (isSquareEmpty(element)) {
		enemyDisc.push(square, [
			...getIndexes(indexOfPossibleSteps, indexes.row, indexes.columnId),
		]);
		return { element: element, enemyDisc: enemyDisc };
	}
}

function findNextStep(disc) {
	let placesToMove = [];
	let placesWithEnemy = [];
	let enemyDisc = [];

	const stepsElements = getTableWithoudUndefindElement(disc.getFirstSteps()[0]);

	const nextStepToCaptureDiscs = stepsElements.map((square) => {
		if (squareIsOccupiedByEnemy(square, disc.enemyColor)) {
			const steps = findStepsToCaptureEnemyDisc(square, disc);
			if (steps) {
				placesToMove.push(steps.element);
				placesWithEnemy.push(steps.element);
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
	/* do poprawy w innym miejscu..*/
	if (enemyDisc.length > 0) {
		enemyDisc = [enemyDisc[0][0], ...enemyDisc[0][1]];
	}

	if (stepsWithoutCaptureDisc.length > 0) {
		return {
			placesToMove: placesToMove,
			enemyDisc: enemyDisc,
			placesWithEnemy: placesWithEnemy,
		};
	}

	forwardStep.forEach((step) => {
		if (isSquareEmpty(step)) {
			placesToMove.push(step);
		}
	});

	return {
		placesToMove: placesToMove,
		enemyDisc: [],
		placesWithEnemy: [],
	};
}

/* */
discs.forEach((disc) => {
	disc.addEventListener('click', chooseDiscToMove);
});

darkSquares.forEach((square) => {
	square.addEventListener('click', moveDisc);
});

export { createObjectDisc, findNextStep };
