import { pushRowAndColToFirstStep } from './script.js';

const boardPieces = 8;
const row = [1, 2, 3, 4, 5, 6, 7, 8];

class Discs {
	constructor(HTMLelement) {
		this.HTMLelement = HTMLelement;
	}

	getRowNumber() {
		const row = this.HTMLelement.closest('tr');
		const rowNumber = row.childNodes[1].textContent;

		return parseInt(rowNumber);
	}

	getColNumber() {
		const row = this.HTMLelement.closest('tr');
		const col = Array.prototype.slice.call(row.querySelectorAll('td'));

		return parseInt(col.indexOf(this.HTMLelement.parentElement));
	}

	getColumnToMoveIsPossible() {
				const col_left = [];
		const col_right = [];
		const colNumber = this.getColNumber();
		
		let j = 1;
		while (j <= boardPieces) {
			if (j < colNumber) {
				col_left.push(colNumber - j);
			} else if (j > colNumber) {
				col_right.push(colNumber + (j - colNumber));
			}

			j++;
		}

		col_left.unshift(undefined);
		col_right.unshift(undefined);

		for (let f = 0; f <= row.length; f++) {
			if (row[f] < this.getRowNumber()) {
				if (colNumber - row[f] > 0) {
					col_left.unshift(colNumber - row[f]);
				} else {
					col_left.unshift(undefined);
									}

				if (colNumber + row[f] <= 8) {
					col_right.unshift(colNumber + row[f]);
				} else {
					col_right.unshift(undefined);
				}
			}
		}
		return [col_left, col_right];
	}

	getIndexesOfPossibleSteps(column) {
		if (!column) {
			column = this.getColumnToMoveIsPossible();
		}

		let indexes = [];

		const col_left = column[0];
		const col_right = column[1];

		for (let g = 1; g <= boardPieces; g++) {
			indexes[g] = [row[g - 1], col_left[g - 1], col_right[g - 1]];
		}

		return indexes;
	}

	getQuantityOfColumnFromIndexesTable(column) {
		if (column.length) {
			return parseInt(column.length);
		}
	}

	getColId(row, col) {
		if (!row || !col) {
			return false;
		}

		const indexes = this.getIndexesOfPossibleSteps();
		let columnId;

		indexes.forEach((x) => {
			if (x[0] === row) {
				columnId = x.indexOf(col);
			}
		});
		return columnId;
	}

	getFirstSteps() {
		const column = this.getColumnToMoveIsPossible();
		const index = this.getIndexesOfPossibleSteps(column);
		const columnNumber = this.getQuantityOfColumnFromIndexesTable(column);
		const rowNumber = this.getForwardAndStepBackRowNumberToStep();
		let firstStep = [];
		let indexOfFirsSteps = [];

		for (let j = 1; j <= columnNumber; j++) {
			let back;
			let forward;
			if (rowNumber.stepBack) {
				back = pushRowAndColToFirstStep(
					index[rowNumber.stepBack][0],
					index[rowNumber.stepBack][j]
				);
				firstStep.push(back.firstStep);
				indexOfFirsSteps.push(back.indexOfFirsSteps);
			}

			if (rowNumber.forward) {
				forward = pushRowAndColToFirstStep(
					index[rowNumber.forward][0],
					index[rowNumber.forward][j]
				);
				firstStep.push(forward.firstStep);
				indexOfFirsSteps.push(forward.indexOfFirsSteps);
			}
		}
		return [firstStep, indexOfFirsSteps];
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'white');
		this.enemyColor = 'black';
	}

	getForwardSteps() {
		const steps = this.getFirstSteps();
		const rowNumber = this.getRowNumber();

		const forward = steps[1].map((row) => {
			if (row !== undefined) {
				if (rowNumber + 1 === row[0]) {
					const index = steps[1].indexOf(row);
					return steps[0][index];
				}
			}
		});
		return forward;
	}

	getForwardAndStepBackRowNumberToStep() {
		const rowNumber = this.getRowNumber();

		let forward = rowNumber + 1;
		let back = rowNumber - 1;

		if (rowNumber === row[0]) {
			back = null;
		} else if (rowNumber === row[row.length - 1]) {
			forward = null;
		}
		return { forward: forward, stepBack: back };
	}
}

class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'black');
		this.enemyColor = 'white';
	}

	getForwardSteps() {
		const steps = this.getFirstSteps();
		const rowNumber = this.getRowNumber();

		const forward = steps[1].map((row) => {
			if (row !== undefined) {
				if (rowNumber - 1 === row[0]) {
					const index = steps[1].indexOf(row);
					return steps[0][index];
				}
			}
		});
		return forward;
	}

	getForwardAndStepBackRowNumberToStep() {
		const rowNumber = this.getRowNumber();

		let forward = rowNumber - 1;
		let back = rowNumber + 1;

		if (rowNumber === row[0]) {
			forward = null;
		} else if (rowNumber === row[row.length - 1]) {
			back = null;
		}
		return { forward: forward, stepBack: back };
	}
}

export { Discs, White, Black };
