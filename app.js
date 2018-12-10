/*jshint esversion: 6 */ 
/******************************************
Treehouse Techdegree:
FEWD project 6 - Game_Show_App
******************************************/
//Variables
const keyboard = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const startGame = document.querySelector('.btn__reset');
const  phrases = ['Hello World', 'Vanilla JS', 'do while', 'Syntax Error', 'Object Oriented',];
let missed = 0;

//func
const resetGame = () => {
	//display none overlay
	startGame.parentNode.style.display = 'none';
	//reset the display of chars if it's not empty
	if(phrase.firstElementChild.children.length > 0) {
		const charsDisplayed = phrase.firstElementChild.children;
		//loops over chars and remove
		for(let i = charsDisplayed.length - 1; i >= 0; --i) {
			charsDisplayed[i].parentNode.removeChild(charsDisplayed[i]);
		}
	}
	//Loop over tries and reset if needed
	const tries = document.querySelectorAll('.tries img');
	for(let i = 0; i < tries.length; i++){
		tries[i].src = 'images/liveHeart.png';

	}
	//reset selected buttons on keyboard
	const buttons = document.querySelectorAll('.keyrow button');
	for(let i = 0; i < buttons.length; i++){
		buttons[i].className = '';
		buttons[i].removeAttribute('disabled', 'true');
	}
	//remove any status-message if available
	if(document.querySelectorAll('.status-message').length > 0){
		const message = document.querySelectorAll('.status-message');
		for(let i = message.length - 1; i >= 0; --i){
			message[i].parentNode.removeChild(message[i]);
		}
	}
	//reset missed
	missed = 0;
};


//gets randomPhrase and split to give char array
const getRandomPhraseAsArray = (arr) => {
	const min = Math.ceil(0);
	const max = Math.floor(arr.length);
	 //min inclusive max exclusive to serve as Index of arr
	const randomIndex = Math.floor(Math.random() * (max - min )) + min;
	const randomPhrase = phrases[randomIndex];
	//split phrase to new array of characters
	const splittedPhrase = randomPhrase.split('');
	return splittedPhrase;
};



const addPhraseToDisplay = (arr) => {
	//loops over character array and put each char in li and append to display
	for(let i = 0; i < arr.length; i++){
		const li = document.createElement('li');
		li.innerHTML = arr[i];
		if(arr[i] !== ' '){
			li.className = 'letter';
		}
		phrase.firstElementChild.appendChild(li);
	}
};



//checks letter clicked and return letter if found or null if not found
const checkLetter = (button) => {
	//checks if button char === any char on display then display if not return null
	const buttonLetter = button.textContent;
	const charsDisplayed = document.querySelectorAll('.letter');
	let matched = null;
	for(let i = 0; i < charsDisplayed.length; i++){
		if(buttonLetter === charsDisplayed[i].textContent.toLowerCase()){
			charsDisplayed[i].classList.add('show');
			matched = buttonLetter;
		}
	}
	return matched;
};


//check win/lose and implement mechanism
const checkWin = (letterFound) => {
	//function to show overlay and appropraite message
	const showOverlay  = (status, message) => {
		const overlay = document.getElementById('overlay');
		overlay.style.display = 'flex';
		overlay.className = status;
		overlay.lastElementChild.innerHTML = 'Play Again';
		const p = document.createElement('p');
		p.innerHTML = message;
		p.style.fontSize = '1.5em';
		p.className = 'status-message';
		overlay.insertBefore(p, overlay.lastElementChild);
	};
	//check for win or lose when missed = 5 you lose when numOf .show = .letter you win
	if(letterFound === null){
		if(missed === 5){
			showOverlay('lose', 'Sorry! Try Again');
		}
	}
	else {
		const showClass = document.querySelectorAll('.show');
		const letterClass = document.querySelectorAll('.letter');
		if(showClass.length === letterClass.length){
			showOverlay('win', 'Great! Play Again?');
		}
	}
};


//resets overlay and game info
startGame.addEventListener('click', (event) => {
	resetGame();
	const randomPhraseCharArr = getRandomPhraseAsArray(phrases);
	addPhraseToDisplay(randomPhraseCharArr);
});


//event listener to handle each character button pressed on keyboard
keyboard.addEventListener('click', (event) => {
		const button = event.target;
		//set chosen class and disabled attr to the button
		if(button.tagName === 'BUTTON'){
			button.setAttribute('disabled','true');
			button.className = 'chosen';
			const letterFound = checkLetter(button);
			//check and remove/hide tries
			if(letterFound === null){
				const tries = document.querySelectorAll('.tries img');
				if(missed < tries.length){
					tries[missed].src = 'images/lostHeart.png';
				}
				missed += 1;
			}
			//check status of game
			checkWin(letterFound);
		}
	});