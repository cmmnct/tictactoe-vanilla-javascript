export default class GameController extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
             <style>
                @keyframes example {0% {background-color: aliceblue;}20% {background-color: green;}40% {background-color: aliceblue;}60% {background-color: green;}80% {background-color: aliceblue;}100% { background-color: green;}}
                body {margin: 1vw;}
                #game-container {max-width: 992px;min-width: 300px;margin: auto;}
                #field {display: flex;flex-wrap: wrap;}
                #score {display: flex;}
                #field.playerO {cursor: url("data:image/svg+xml,%3Csvg version='1.1' id='Laag_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 500 500' style='enable-background:new 0 0 500 500%3B' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M500 250c0 138.07-111.93 250-250 250S0 388.07 0 250S111.93 0 250 0S500 111.93 500 250z M425 250c0-96.65-78.35-175-175-175S75 153.35 75 250s78.35 175 175 175S425 346.65 425 250z'/%3E%3C/g%3E%3C/svg%3E"), pointer;}
                #field.playerX {cursor: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 500 500' style='enable-background:new 0 0 500 500%3B' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Crect x='212.93' y='-66.15' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -103.421 250.2478)' width='74.88' height='632.23'/%3E%3C/g%3E%3Cg%3E%3Crect x='-65.75' y='212.52' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -103.421 250.2478)' width='632.23' height='74.88'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), pointer;}
                #field > div {box-sizing: border-box;flex: 30%;margin: 5px;aspect-ratio: 1 / 1;border: 1px solid grey;padding: 15px;background-size: 90%;background-position: center;background-repeat: no-repeat;background-color: aliceblue;}
                #score > div {box-sizing: border-box;flex: 50%;margin: 5px;border: 1px solid grey;background-color: aquamarine;border-radius: 10px;}
                #score div div {float: left;margin-top: 6px;padding: 15px;}
                #score div input {box-sizing: border-box;padding: 15px;width: 50%;margin: 0;background-color: transparent;border: none;font-size: 32px;}
                #field > div[data-player="playerO"] {background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Laag_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 500 500' style='enable-background:new 0 0 500 500%3B' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M500 250c0 138.07-111.93 250-250 250S0 388.07 0 250S111.93 0 250 0S500 111.93 500 250z M425 250c0-96.65-78.35-175-175-175S75 153.35 75 250s78.35 175 175 175S425 346.65 425 250z'/%3E%3C/g%3E%3C/svg%3E");}
                #field > div[data-player="playerX"] {background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 500 500' style='enable-background:new 0 0 500 500%3B' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Crect x='212.93' y='-66.15' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -103.421 250.2478)' width='74.88' height='632.23'/%3E%3C/g%3E%3Cg%3E%3Crect x='-65.75' y='212.52' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -103.421 250.2478)' width='632.23' height='74.88'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
                #field .win {background-color: green;animation-name: example;animation-duration: 2s;}
                #btn_start { visibility: hidden;display: block;width: 80%;background-color: chocolate;margin: 20px auto;padding: 15px;box-sizing: border-box;font-size: 5vw;border: 1px solid grey;border-radius: 10px;}
            </style>
                <div id="game-container">
                    <div id="field"></div>
                    <div id="score">
                        <div>
                            <div><img src="/images/playerX.svg" style="width: 24px"></div>
                            <input type="text" disabled id="score_kruisje">
                        </div>
                        <div>
                            <div><img src="/images/playerO.svg" style="width: 24px"></div>
                            <input type="text" disabled id="score_rondje">
                        </div>
                    </div>
                    <button id="btn_start">Play again</button>
                </div>
    `;
        this.field = this.shadowRoot.getElementById('field');
        this.score = this.shadowRoot.getElementById('score');
        this.btnStart = this.shadowRoot.getElementById('btn_start');
        this.scoreKruisje = this.shadowRoot.getElementById('score_kruisje');
        this.scoreRondje = this.shadowRoot.getElementById('score_rondje');
        this.init();
    }
    gameData = {
        winningCombinations: [
            [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 5, 9], [3, 5, 7], [1, 4, 7], [2, 5, 8], [3, 6, 9]
        ],
        numberOfFields: 9,
        step: 0,
        playerX: new Player('playerX', [], 0),
        playerO: new Player('playerO', [], 0),
        currentPlayer: ''
    };
    readyForInit = false;
    init() { // 1. het instellen van de init condities
        if (this.gameData.currentPlayer) { // als het spel al gespeeld is...
            this.togglePlayer(); // switch de player
        } else { // of...
            this.setCurrentPlayer(Math.random() > 0.5 ? this.gameData.playerX : this.gameData.playerO); // kies random een speler
            this.field.addEventListener('click', this.onPlacement.bind(this)); // met een event listener zorgen we er voor dat de speler kan gaan spelen
            this.btnStart.addEventListener('click', this.init.bind(this));
        }
        this.btnStart.style.visibility = 'hidden'; // verberg de reset knop
        this.gameData.playerX.clickedPositions = []; // zet de aangeklikte posities op nul
        this.gameData.playerO.clickedPositions = []; // zet de aangeklikte posities op nul
        this.gameData.step = 0;
        this.field.innerHTML = ''; // maak het veld leeg
        for (let index = 0; index < this.gameData.numberOfFields; index++) { // vul het veld met negen lege vakjes
            this.field.innerHTML += `<div data-index="${index + 1}"></div>`;
        }
        this.readyForInit = false;
    }
    onPlacement(event) { // 2. het starten van het spel
        if (event.target.className === '' && !this.readyForInit) { // check if field is empty by the classname
            this.gameData.step++; // verhoog de stap in het spel
            event.target.dataset.player = this.gameData.currentPlayer.name; // place symbol as backgroundImage by a CSS class
            this.gameData.currentPlayer.clickedPositions.push(parseInt(event.target.dataset.index)); // add position to currentPlayer clickedPositions
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
        switch (this.gameData.currentPlayer) {
        case this.gameData.playerX:
            this.setCurrentPlayer(this.gameData.playerO);
            break;
        case this.gameData.playerO:
            this.setCurrentPlayer(this.gameData.playerX);
            break;
        }
    }
    setCurrentPlayer(player) {
        this.field.className = player.name;
        this.gameData.currentPlayer = player;
    }
    checkWinningCombination() {
        let win = false;
        this.gameData.winningCombinations.forEach(
            (combination) => {
                let toCheck = true;
                combination.forEach(pos => {
                    if (this.gameData.currentPlayer.clickedPositions.indexOf(pos) === -1) {
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
        this.gameData.currentPlayer.score++;
        this.scoreKruisje.value = this.gameData.playerX.score;
        this.scoreRondje.value = this.gameData.playerO.score;
        console.log(this.field);
        this.btnStart.style.visibility = 'visible';
    }
    highlightWinningRow(combination) {
        const nodes = Array.prototype.slice.call(this.field.children); // goed Googlen!!!
        combination.forEach(pos => nodes[pos - 1].classList.add('win')); // maak de winnende combinatie groen
    }

}
export class Player {
    constructor(name, clickedPositions, score) {
        this.name = name;
        this.clickedPositions = clickedPositions;
        this.score = score;
    }
}
customElements.define('tic-tac-toe', GameController);