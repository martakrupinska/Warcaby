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

	getSteps() {
		const col_min = [];
		const col_max = [];
		const maxColNumber = this.findMaxColumnNumber();
		const colNumber = this.getColNumber();
		const rowNumber = this.getRowNumber();

		let j = 1;
		while (j < maxColNumber) {
			if (j < colNumber) {
				col_min.push(colNumber - j);
			} else if (j > colNumber) {
				col_max.push(colNumber + (j - colNumber));
			}

			j++;
		}

		col_min.unshift(undefined);
		col_max.unshift(undefined);

		for (let f = 0; f <= rowRow.length; f++) {
			if (rowRow[f] < rowNumber) {
				col_min.unshift(colNumber - rowRow[f]);
				col_max.unshift(colNumber + rowRow[f]);
			}
		}
		return [col_min, col_max];
	}

	findMaxColumnNumber() {
		return boardPieces + 1;
	}
	findColumnIndexes() {
		const col_min = [];
		const col_max = [];
		const maxColNumber = this.findMaxColumnNumber();
		const colNumber = this.getColNumber();
		const rowNumber = this.getRowNumber();

		let j = 1;
		while (j < maxColNumber) {
			if (j < colNumber) {
				col_min.push(colNumber - j);
			} else if (j > colNumber) {
				col_max.push(colNumber + (j - colNumber));
			}

			j++;
		}

		return [col_min, col_max];
	}

	findIndexesOfStep() {
		let indexes = [];
		const row = [1, 2, 3, 4, 5, 6, 7, 8]; //this.findRowIndexes();
		const col_min = this.getSteps()[0];
		const col_max = this.getSteps()[1];

		console.log(col_min);
		for (let g = 1; g <= boardPieces; g++) {
			indexes[g] = [row[g - 1], col_min[g - 1], col_max[g - 1]];
		}
		//indexes.splice(this.getRowNumber() - 1, 1);
		return indexes;
	}
	/* getIndexNumberOfROw(row) {
		const indexes = this.findIndexesOfStep();

		console.log(indexes);
	}
 */
	findNextStep() {
		const index = this.findIndexesOfStep();
		let placesToMove = [];
		let enemyDisc = [];
		let indexOfEnemy = [];
		const row = this.getRowNumber();
		let firstStep = [];

		for (let j = 1; j <= 2; j++) {
			/* 	if (index[row][j] === undefined) {
					continue;
				} */

			if (row > 1 && index[row - 1][0] && index[row - 1][j]) {
				firstStep.push(getBoardElement(index[row - 1][0], index[row - 1][j]));
			}
			if (row < 8 && index[row + 1][0] && index[row + 1][j]) {
				firstStep.push(getBoardElement(index[row + 1][0], index[row + 1][j]));
			}
		}
		console.log(firstStep);

		const newStepMap = firstStep.map((square) => {
			if (squareIsOccupiedByEnemy(square, this.enemyColor)) {
				const indexOfFirstStep = firstStep.indexOf(square);

				let rowFirstOfStep;
				if (indexOfFirstStep === 1 || indexOfFirstStep === 3) {
					rowFirstOfStep = row + 1;
				} else {
					rowFirstOfStep = row - 1;
				}
				let colFirstOfStep;
				if (indexOfFirstStep === 0 || indexOfFirstStep === 1) {
					colFirstOfStep = 1;
				} else {
					colFirstOfStep = 2;
				}
				console.log(rowFirstOfStep);
				//	for (let i = rowFirstOfStep; i < index.length; i++) {
				/* 	if (index[i][colFirstOfStep] === undefined) {
					//	break;
					} */

				let steps = getBoardElement(
					index[rowFirstOfStep + 1][0],
					index[rowFirstOfStep + 1][colFirstOfStep]
				);

				if (isSquareEmpty(steps)) {
					placesToMove.push(steps);
					enemyDisc.push(
						square,
						index[rowFirstOfStep][0],
						index[rowFirstOfStep][colFirstOfStep]
					);

					return steps;
				}
				//	}
			}
		});
		let newSteps;
		const newNew = newStepMap.filter((step) => {
			if (step !== 'undefined' || step !== '') {
				return step;
			}
		});

		/* tylko dla białych! ;/ */
		let forwardStep = [firstStep[1], firstStep[3]];
		console.log(newNew);

		if (!newNew.length) {
			forwardStep.forEach((step) => {
				if (isSquareEmpty(step)) {
					console.log(step);
					placesToMove.push(step);
				}
			});
		}

		return { placesToMove: placesToMove, enemyDisc: enemyDisc };
	}
	createNextStep() {
		const steps = this.findNextStep();

		steps.placesToMove.forEach((step) => {
			createHint(step);
		});
	}
}

class White extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'white');
		this.enemyColor = 'black';
	}

	findMaxRowNumber() {
		return boardPieces - this.getRowNumber();
	}
	findRowIndexes() {
		let i = 1;
		const row = [];

		while (i <= this.findMaxRowNumber()) {
			row.push(this.getRowNumber() + i);
			i++;
		}
		return row;
	}
}
class Black extends Discs {
	constructor(HTMLelement) {
		super(HTMLelement), (this.color = 'black');
		this.enemyColor = 'white';
	}
	findMaxRowNumber() {
		return boardPieces - (boardPieces - this.getRowNumber() + 1);
	}
	findRowIndexes() {
		let i = 1;
		const row = [];

		while (i <= this.findMaxRowNumber()) {
			row.push(this.getRowNumber() - i);
			i++;
		}
		return row;
	}
}
