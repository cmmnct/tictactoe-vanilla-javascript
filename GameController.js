export default class GameController {
    constructor(gameContainer, btnStart, scoreRondje, scoreKruisje) {
        this.gameContainer = gameContainer;
        this.btnStart = btnStart;
        this.scoreRondje = scoreRondje;
        this.scoreKruisje = scoreKruisje;
        this.field = document.createElement('div');
        this.field.id = 'field';
        this.score = document.createElement('div');
        this.score.id = 'score';
        let div1 = document.createElement('div');
        this.score.appendChild(div1);
        let div2 = document.createElement('div');
        this.score.appendChild(div2);
        let labelKruisje = document.createElement('div');
        labelKruisje.innerHTML = '<img src="/images/playerX.svg" style="width: 24px"> ';
        let labelRondje = document.createElement('div');
        labelRondje.innerHTML = '<img src="/images/playerO.svg" style="width: 24px"> ';
        div1.appendChild(labelKruisje);
        div2.appendChild(labelRondje);
        this.scoreRondje = document.createElement('input');
        this.scoreRondje.disabled = true;
        this.scoreKruisje = document.createElement('input');
        this.scoreKruisje.disabled = true;
        div1.appendChild(this.scoreKruisje);
        div2.appendChild(this.scoreRondje);
        this.gameContainer.appendChild(this.field);
        this.gameContainer.appendChild(this.score);
        this.btnStart = document.createElement('button');
        this.btnStart.id = 'btn_start';
        this.btnStart.innerHTML = 'Play again';
        this.gameContainer.appendChild(this.btnStart);
    }
    winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 5, 9], [3, 5, 7], [1, 4, 7], [2, 5, 8], [3, 6, 9]
    ];
    readyForInit = false;
    numberOfFields = 9;
    step = 0;
    playerX = {
        name: 'playerX',
        clickedPositions: [],
        score: 0
    };
    playerO = {
        name: 'playerO',
        clickedPositions: [],
        score: 0
    };
    currentPlayer;
    init() { // 1. het instellen van de init condities
        if (this.currentPlayer) { // als het spel al gespeeld is...
            this.togglePlayer(); // switch de player
        } else { // of...
            this.setCurrentPlayer(Math.random() > 0.5 ? this.playerX : this.playerO); // kies random een speler
            this.field.addEventListener('click', this.onPlacement.bind(this)); // met een event listener zorgen we er voor dat de speler kan gaan spelen
            this.btnStart.addEventListener('click', this.init.bind(this));
        }
        this.btnStart.style.visibility = 'hidden'; // verberg de reset knop
        this.playerX.clickedPositions = []; // zet de aangeklikte posities op nul
        this.playerO.clickedPositions = []; // zet de aangeklikte posities op nul
        this.step = 0;
        this.field.innerHTML = ''; // maak het veld leeg
        for (let index = 0; index < this.numberOfFields; index++) { // vul het veld met negen lege vakjes
            this.field.innerHTML += `<div data-index="${index + 1}"></div>`;
        }
        this.readyForInit = false;
    }

    onPlacement(event) { // 2. het starten van het spel
        if (event.target.className === '' && !this.readyForInit) { // check if field is empty by the classname
            this.step++; // verhoog de stap in het spel
            console.log(this.numberOfFields);
            event.target.dataset.player = this.currentPlayer.name; // place symbol as backgroundImage by a CSS class
            this.currentPlayer.clickedPositions.push(parseInt(event.target.dataset.index)); // add position to currentPlayer clickedPositions
            if (this.checkWinningCombination()) { // check for winning combination and...
                this.endAndReset(); // reset game or...
            } else if (this.step === 9) {
                this.btnStart.style.visibility = 'visible';
            } else {
                this.togglePlayer(); // continue....
            }
        }
    }
    togglePlayer() {
        switch (this.currentPlayer) {
        case this.playerX:
            this.setCurrentPlayer(this.playerO);
            break;
        case this.playerO:
            this.setCurrentPlayer(this.playerX);
            break;
        }
    }
    setCurrentPlayer(player) {
        this.field.className = player.name;
        this.currentPlayer = player;
    }
    checkWinningCombination() {
        let win = false;
        this.winningCombinations.forEach(
            (combination) => {
                let toCheck = true;
                combination.forEach(pos => {
                    if (this.currentPlayer.clickedPositions.indexOf(pos) === -1) {
                        toCheck = false;
                    }
                });
                if (toCheck) {
                    win = true;
                    this.highlightWinningRow(combination);
                }
            }
        );
        return win;
    }
    endAndReset() {
        this.readyForInit = true;
        this.currentPlayer.score++;
        this.scoreKruisje.value = this.playerX.score;
        this.scoreRondje.value = this.playerO.score;
        console.log(this.field);
        this.btnStart.style.visibility = 'visible';
    }
    highlightWinningRow(combination) {
        const nodes = Array.prototype.slice.call(document.getElementById('field').children); // goed Googlen!!!
        combination.forEach(pos => nodes[pos - 1].classList.add('win')) ; // maak de winnende combinatie groen
    }
}