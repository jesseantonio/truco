let deck = [];
let players = [];
let rounds = {
    amount: 0,
    isDraw: false,
    truco: {
        isTrucado: false,
        value: 0
    },
    cardThrows: 0,
    bo3: {
        firstRoundWinner: null,
        roundWinner: null
    },
};
let cardThrows = 0;
let player1ChosenCard = null;
let player2ChosenCard = null;
const playGameButtonElem = document.getElementById('playGame')

async function createGame() {
    let mode = prompt("Qual será seu modo de jogo? 1v1 ou 2v2?")
    toggleVisibility()
    createPlayers(mode)
    createDeckAndShuffleAndDeal();
    game()
}

function toggleVisibility() {
    var myDiv = document.getElementById('buttons');
    myDiv.classList.toggle('hidden');
}


function createDeckAndShuffleAndDeal() {
    createDeck()
    shuffleDeck(deck)
    dealTheCards()
}

function shuffleDeck(deck) {
    deck.sort(() => Math.random() - 0.5);
}

function createNumberCards() {
    let numberCards = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

    return numberCards;
}

/**
 * Suits 
 * 
 * Clubs -> ♣
 * Hearts -> ♥
 * Spades -> ♠
 * Diamonds -> ♦
 * 
 * @returns Cards suits
 */
function createCardSuits() {
    let cardsSuits = ["Clubs", "Hearts", "Spades", "Diamonds"];

    return cardsSuits;
}

function createDeck() {
    let cardNumbers = createNumberCards();
    let cardSuits = createCardSuits();
    for (i = 0; i < 4; i++) {
        cardNumbers.forEach(number => {
            let card = new Object();
            card.number = number;
            deck.push(card);
        });
    }
    let tempDeck = [];
    cardSuits.forEach(suit => {
        let tempCardsOfSameSuit = deck.splice(0, 10).map(card => {
            return {
                number: card.number,
                suit: suit,
                isJoker: false,
                player: {
                    name: undefined
                }
            };
        });
        tempDeck.push(tempCardsOfSameSuit);
    });
    deck = tempDeck.flatMap(flat => flat);
}

function dealTheCards() {
    deck.splice(0, 20);
    let last;
    for (i = 0; i < 6; i++) {
        if ((deck.length - 1 - i) % 2 === 0) {
            deck[deck.length - 1 - i].player.name = "Player 1";
        } else {
            deck[deck.length - 1 - i].player.name = "Player 2";
        }
        last = deck.length - 1 - i;
    }
    setJoker(last)
}

function setJoker(lastCard) {
    debugger
    const jokerIndex = lastCard - 1;
    let joker = deck[jokerIndex].number;
    createJokerCard(deck[jokerIndex]);

    if (joker === 7) {
        joker = 10;
    } else if (joker === 12) {
        joker = 1;
    } else {
        joker = joker + 1;
    }

    deck.filter(card => card.number === joker).map(card => card.isJoker = true)
}

function createJokerCard(joker) {
    let card = document.createElement('div');
    card.setAttribute('class', `other-cards back-card`);

    let jokerDivCard = document.createElement('div');
    jokerDivCard.setAttribute('class', `joker-card other-cards`);
    jokerDivCard.setAttribute('id', `joker`);

    document.getElementById(`joker-box`).appendChild(card);
    document.getElementById(`joker-box`).appendChild(jokerDivCard);

    const jokerCard = document.getElementById(`joker`);
    setCardBackground(joker, null, jokerCard, true);
}

function createPlayers(mode) {
    if (mode === "1v1") {
        for (let i = 0; i < 2; i++) {
            createOnePlayer(i);
        }
    } else if (mode === "2v2") {
        for (i = 0; i < 4; i++) {
            createOnePlayer(i);
        }
    } else {
        alert("Inválido")
    }
}

function createOnePlayer(index) {
    let player = new Object();
    player.points = 0,
        player.roundPoints = 0,
        player.name = `Player ${index + 1}`

    players.push(player)
}

function clearRoundPoints() {
    players.map(player => player.roundPoints = 0)
    rounds.cardThrows = 0;
    rounds.isDraw = false;
    rounds.bo3.firstRoundWinner = null;
    rounds.truco.isTrucado = false;
    rounds.truco.value = 0;

}

function setRoundPoints(player, rounds) {
    if (!rounds.isDraw && rounds.bo3.firstRoundWinner === null) {
        rounds.bo3.firstRoundWinner = player.name
    }
    if (rounds.isDraw) {
        player.points++
        rounds.bo3.roundWinner = player.name;
        clearRoundPoints()
    } else if (player.roundPoints + 1 === 2) {
        player.points++
        rounds.bo3.roundWinner = player.name;
        clearRoundPoints();
    } else {
        player.roundPoints++
    }
}

function waitPlayerAction(player) {
    return new Promise((resolve, reject) => {
        const playerCard = document.getElementById(`${player}`);
        let playerChosenCard = null;

        function onClickHandler(event) {
            playerChosenCard = event.target.id;
            playerCard.removeEventListener('click', onClickHandler);
            resolve(playerChosenCard);
        }

        playerCard.addEventListener('click', onClickHandler);
    });
}

function removeCards() {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");
    while (player1.firstChild) {
        player1.removeChild(player1.lastChild);
    }
    while (player2.firstChild) {
        player2.removeChild(player2.lastChild);
    }
}

async function round() {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");
    let i = 0;


    createCards(player1, player2);
    createCardAnimation();
    rounds.bo3.roundWinner = null;
    while (rounds.bo3.roundWinner === null) {
        if (i > 2) {
            players.filter(el => el.name === rounds.bo3.firstRoundWinner).map(player => player.points++);
            rounds.bo3.roundWinner = rounds.bo3.firstRoundWinner;
        } else {
            if (rounds.bo3.firstRoundWinner === null) {
                if (rounds.amount % 2 === 0) {
                    alert('Vez do jogador 1')
                    while (player1ChosenCard == undefined) {
                        await play(player1ChosenCard, "player1");
                    }
                    alert('Vez do jogador 2')
                    while (player2ChosenCard == undefined) {
                        await play(player2ChosenCard, "player2");
                    }
                } else {
                    alert('Vez do jogador 2')
                    while (player2ChosenCard == undefined) {
                        await play(player2ChosenCard, "player2");
                    }
                    alert('Vez do jogador 1')
                    while (player1ChosenCard == undefined) {
                        await play(player1ChosenCard, "player1");
                    }
                }
            } else {
                let lastWinner = rounds.bo3.firstRoundWinner;
                if (lastWinner == "Player 1") {
                    alert('Vez do jogador 1')
                    while (player1ChosenCard == undefined) {
                        await play(player1ChosenCard, "player1");
                    }
                    alert('Vez do jogador 2')
                    while (player2ChosenCard == undefined) {
                        await play(player2ChosenCard, "player2");
                    }
                } else {
                    alert('Vez do jogador 2')
                    while (player2ChosenCard == undefined) {
                        await play(player2ChosenCard, "player2");
                    }
                    alert('Vez do jogador 1')
                    while (player1ChosenCard == undefined) {
                        await play(player1ChosenCard, "player1");
                    }
                }
            }

            cardStrengthComparator(player1[player1ChosenCard.id], player2[player2ChosenCard.id])
            player1ChosenCard = undefined;
            player2ChosenCard = undefined;
            i++
            rounds.amount++
        }
    }
}



async function play(player, name) {
    try {
        await waitPlayerAction(`${name}`);
    } catch (error) {
        console.log("error");
    }
}

function battle(card1, card2, cardDiv) {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");
    if (card1 != null && card2 != null) {
        cardStrengthComparator(player1[parseInt(card1.id)], player2[parseInt(card2.id)])
        player1ChosenCard.item.remove();
        player2ChosenCard.item.remove();
        card1 = null;
        card2 = null;
    }
}

function createCards(player1, player2) {
    removeCards();
    for (let j = 0; j < 3; j++) {
        let player1Card = document.createElement('div');
        player1Card.setAttribute('class', `card bottom`);
        player1Card.setAttribute('id', `${j}`)
        player1Card.onclick = function (item) {
            player1ChosenCard = {
                id: item.target.id,
                item: item.target
            }
        }

        let player2Card = document.createElement('div');
        player2Card.setAttribute('class', `other-cards top back-card player2`)
        player2Card.setAttribute('id', `${j}`)
        player2Card.onclick = function (item) {
            player2ChosenCard = {
                id: item.target.id,
                item: item.target
            }
        }

        setCardBackground(player1, j, player1Card, false);
        setCardBackground(player2, j, player2Card, false);

        document.getElementById(`player1`).appendChild(player1Card);
        document.getElementById(`player2`).appendChild(player2Card);
    }
}

function setCardBackground(cards, index, playerCardDiv, isJoker) {
    let playerCardWithIndex;
    if (!isJoker) {
        playerCardWithIndex = cards.map(number => number)[0 + index];
    } else {
        playerCardWithIndex = cards;
    }
    if (playerCardWithIndex.number === 1) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/1depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/1decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/1demolis.png)";
        }
    } else if (playerCardWithIndex.number === 2) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/2depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/2decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        }
    } else if (playerCardWithIndex.number === 3) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/3depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/3decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/3demolis.png')";
        }
    } else if (playerCardWithIndex.number === 4) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/4depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/4decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/4demolis.png')";
        }
    } else if (playerCardWithIndex.number === 5) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/5depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/5decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/5demolis.png')";
        }
    } else if (playerCardWithIndex.number === 6) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/6depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/6decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/6demolis.png')";
        }
    } else if (playerCardWithIndex.number === 7) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/7depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/7decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/7demolis.png')";
        }
    } else if (playerCardWithIndex.number === 10) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/10depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/10decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/10deespada.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/10demolis.png')";
        }
    } else if (playerCardWithIndex.number === 11) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/11depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/11decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/11demolis.png')";
        }
    } else if (playerCardWithIndex.number === 12) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCardDiv.style.backgroundImage = "url('./assets/12depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCardDiv.style.backgroundImage = "url('./assets/12decopas.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCardDiv.style.backgroundImage = "url('./assets/verso3.png')";
        } else {
            playerCardDiv.style.backgroundImage = "url('./assets/12demolis.png')";
        }
    }
}

function createCardAnimation() {
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            card.classList.toggle('animateCard');
        });
    });
}

async function game() {
    const checkWinCondition = () => players.map(el => el.points).some(el => el >= 12);

    async function playTurn() {
        if (!checkWinCondition()) {
            createDeckAndShuffleAndDeal();
            await round();
            await playTurn();
        }
    }

    await playTurn();
}

/**
 * Ordem de força das cartas:
 *  
 * 3, 2, 1, 12, 11, 10, 7, 6, 5, 4
 * @param {*} playerOneCard - Carta do jogador 1
 * @param {*} playerTwoCard - Carta do jogador 2
 */
function cardStrengthComparator(playerOneCard, playerTwoCard) {
    if (!playerOneCard.isJoker && !playerTwoCard.isJoker) {
        if (playerOneCard.number != playerTwoCard.number) {
            cardComparator(playerOneCard, playerTwoCard, false);
        } else {
            draw();
        }
    } else {
        if (playerOneCard.isJoker && !playerTwoCard.isJoker) {
            setRoundPoints(players[0], rounds)
        } else if (playerTwoCard.isJoker && !playerOneCard.isJoker) {
            setRoundPoints(players[1], rounds)
        } else if (playerOneCard.number != playerTwoCard.number) {
            cardComparator(playerOneCard, playerTwoCard, false);
        } else {
            suitComparator(playerOneCard, playerTwoCard);
        }
    }
    rounds.cardThrows++
}


function draw() {
    if (rounds.isDraw) {
        let playerWinner = players.filter(player => player.name === rounds.bo3.firstRoundWinner);
        playerWinner.map(points => points++);
        rounds.bo3.firstRoundWinner = playerWinner.map(name => name);
    } else {
        rounds.isDraw = true;
    }
}

function suitComparator(playerOneCard, playerTwoCard, isInformational) {
    if (playerOneCard.suit === "Clubs") {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.suit === "Clubs") {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.suit === "Hearts") {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.suit === "Hearts") {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.suit === "Spades") {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.suit === "Spades") {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.suit === "Diamonds") {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.suit === "Diamonds") {
        setRoundPoints(players[1], rounds);
    }
}



function cardComparator(playerOneCard, playerTwoCard, isInformational) {
    function getCard(isInformational, player) {
        if (isInformational) {
            return player;
        }
    }
    if (playerOneCard.number === 3) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 3) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 2) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 2) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 1) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 1) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 1) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 1) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 12) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 12) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 12) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 11) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 11) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 10) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 10) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 7) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 7) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 6) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 6) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 5) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 5) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 4) {
        getCard(isInformational, "Player 2")
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 4) {
        getCard(isInformational, "Player 1")
        setRoundPoints(players[0], rounds);
    }
}


function sayTruco() {
    //rounds.truco.isTrucado = true;
    //rounds.truco.value = rounds.truco.value + 3;
}

function escape() {
    // impl
}

function botHelper(cards) {
    const { cardClassification, cardClassificationCounter } = setCardClassification(cards);
    const cardHandClassification = setCardHandClassification(cardClassificationCounter);
    return cardHandClassification;
}

function setCardHandClassification(cardClassification) {
    const BEST = "BEST";
    const AVERAGE = "AVERAGE";
    const BAD = "BAD";
    if (cardClassification.best >= 2) {
        return BEST;
    } else if (cardClassification.best == 1 && cardClassification.average == 2) {
        return BEST;
    } else if (cardClassification.average >= 2) {
        return AVERAGE;
    } else if (cardClassification.best == 1 && cardClassification.average == 1 && cardClassification.bad == 1) {
        return AVERAGE;
    } else if (cardClassification.bad >= 2) {
        return BAD;
    }
}

function setCardClassification(cards) {
    const bestCards = [3, 2, 1];
    const averageCards = [12, 11, 10];
    const BEST = "BEST";
    const AVERAGE = "AVERAGE";
    const BAD = "BAD";
    let cardClassificationMap = new Map;
    let cardClassificationCounter = new Object;
    cardClassificationCounter.best = 0;
    cardClassificationCounter.average = 0;
    cardClassificationCounter.bad = 0;
    cards.forEach(card => {
        if (card.isJoker) {
            cardClassificationMap.set(card, BEST);
            debugger
            cardClassificationCounter.best++;
        } else if (bestCards.includes(card.number)) {
            cardClassificationMap.set(card, BEST);
            cardClassificationCounter.best++;
        } else if (averageCards.includes(card.number)) {
            cardClassificationMap.set(card, AVERAGE);
            cardClassificationCounter.average++;
        } else {
            cardClassificationMap.set(card, BAD);
            cardClassificationMap.bad++;
        }
    });

    return { cardClassificationMap, cardClassificationCounter };
}

function botIntelligence(cards) {
    if (rounds.bo3.firstRoundWinner == null) {
        if (player1ChosenCard == null) {

        } else {

        }
    }
}