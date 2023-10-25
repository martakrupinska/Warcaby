let numberOfDiscs = 12;
let gamer;
function createDisc(classColor) {
	const disc = document.createElement('div');
	disc.classList.add('disc', 'disc--' + classColor);
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

const editBtns = document.querySelectorAll('.gamer__button--edit');

function saveGamerName(e) {
	const name = e.target.previousElementSibling.value;

	if (!name) {
		return;
	}
	const gamerNamePlace = gamer.parentElement.querySelector('.gamer__name');

	gamerNamePlace.textContent = name;

	const popup = e.target.parentElement;
	popup.style.opacity = 0;
}

function cancelPopup(e) {
	e.target.parentElement.style.opacity = 0;
}

function showPopUpWithUserName(e) {
	gamer = e.target.parentElement.previousElementSibling;
	const gamerName = gamer.textContent;

	if (!gamer) {
		return false;
	}

	const popup = document.querySelector('.popup');
	const gamerNumber = popup.querySelector('.popup__dscrpt');
	const gamerName1 = popup.querySelector('.popup__input');

	gamerName1.value = '';

	popup.style.opacity = 1;
	gamerNumber.textContent = gamerName;

	const saveBtn = popup.querySelector('.popup__button--accept');
	const cancelBtn = popup.querySelector('.popup__button--cancel');

	saveBtn.addEventListener('click', saveGamerName);
	cancelBtn.addEventListener('click', cancelPopup);
}

editBtns.forEach((btn) => {
	btn.addEventListener('click', showPopUpWithUserName);
});

export { createHint };
