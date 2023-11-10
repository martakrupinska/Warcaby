const numberOfDiscs = 12;
const boardPieces = 8;
let editBtnGamerElement;
let popup;

function createDisc(classColor) {
	const disc = document.createElement('div');
	disc.classList.add('disc', 'disc--' + classColor);
	disc.setAttribute('draggable', 'true');
	return disc;
}

const setPiecesOnBoard = () => {
	const boardPlaces = document.querySelectorAll('.board__square--dark');
	const places = Array.prototype.slice.call(boardPlaces);

	for (let i = 0; i <= places.length - 1; i++) {
		if (i < numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('white'));
		} else if (i >= places.length - numberOfDiscs) {
			boardPlaces[i].appendChild(createDisc('black'));
		}
	}
};

function createHint(parent) {
	const hint = document.createElement('div');
	hint.classList.add('hint');
	parent.appendChild(hint);
}

setPiecesOnBoard();

function getBoardElement(row, col) {
	const allColumn = document.querySelectorAll('tr .board__square');
	const index = (row - 1) * boardPieces + (col - 1);

	if (allColumn[index].classList.contains('board__square--dark')) {
		return allColumn[index];
	}
	return allColumn[index];
}

function pushRowAndColToFirstStep(rowNumber, colNumber) {
	let step;
	let index;
	if (rowNumber && colNumber) {
		step = getBoardElement(rowNumber, colNumber);
		index = [rowNumber, colNumber];
	}
	return { firstStep: step, indexOfFirsSteps: index };
}

const editBtns = document.querySelectorAll('.gamer__button--edit');

function saveGamerName(e) {
	const name = e.target.previousElementSibling.value;

	if (!name) {
		return;
	}
	const gamerNamePlace =
		editBtnGamerElement.parentElement.querySelector('.gamer__name');

	gamerNamePlace.textContent = name;
	//const popup = e.target.parentElement;
	popup.style.opacity = 0;
}

function cancelPopup(e) {
	//e.target.parentElement.style.opacity = 0;
	popup.style.opacity = 0;
}

function showPopUpWithUserName(e) {
	editBtnGamerElement = e.target.parentElement.previousElementSibling;
	const editBtnGamerNumber = editBtnGamerElement.textContent;
	const editBtnGamerName = e.target.nextElementSibling.textContent;

	if (!editBtnGamerElement) {
		return false;
	}

	popup = document.querySelector('.popup');
	const gamerNumber = popup.querySelector('.popup__dscrpt');
	const gamerName = popup.querySelector('.popup__input');

	if (editBtnGamerName) {
		gamerName.value = editBtnGamerName;
	} else {
		gamerName.value = '';
	}

	popup.style.opacity = 1;
	gamerNumber.textContent = editBtnGamerNumber;

	const saveBtn = popup.querySelector('.popup__button--accept');
	const cancelBtn = popup.querySelector('.popup__button--cancel');

	saveBtn.addEventListener('click', saveGamerName);
	cancelBtn.addEventListener('click', cancelPopup);
}

function showPlayer(player) {
	const white = document.querySelector('.gamer__icon--forward');
	const black = document.querySelector('.gamer__icon--back');

	white.style.opacity = 0;
	black.style.opacity = 0;

	if (player === 'white') {
		white.style.opacity = 1;
	} else if (player === 'black') {
		black.style.opacity = 1;
	}
}

function setGameOverInformation(player) {
	const colorOfGamer = document.querySelector('.disc__gamer--' + player);

	const gamerClass = colorOfGamer.closest('.gamer');
	const gamerNames = gamerClass.querySelector('.gamer__name');
	const gamerNumbers = gamerClass.querySelector('.gamer__header');

	const winInformation = document.querySelector('.win-game__gamer');
	const winGame = document.querySelector('.win-game');

	if (player) {
		winGame.style.opacity = 1;
		winInformation.textContent =
			winInformation.textContent +
			' ' +
			(gamerNames.textContent
				? gamerNames.textContent
				: gamerNumbers.textContent);
	}
}

editBtns.forEach((btn) => {
	btn.addEventListener('click', showPopUpWithUserName);
});

export {
	createHint,
	getBoardElement,
	pushRowAndColToFirstStep,
	showPlayer,
	setGameOverInformation,
};
