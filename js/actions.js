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
	const steps = disc.findNextStep();

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
		console.log(enemyElement);
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
	const indexes = dragged.findNextStep();

	if (!indexes.placesToMove) {
		return false;
	}

	if (indexes.placesToMove.includes(target)) {
		dragged.HTMLelement.parentNode.removeChild(dragged.HTMLelement);
		target.appendChild(dragged.HTMLelement);
		captureEnemyDisc(start, indexes.enemyDisc);
	}
}

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
