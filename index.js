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

function createGame() {
    let mode = prompt("Qual será seu modo de jogo? 1v1 ou 2v2?")
    createPlayers(mode)
    createDeckAndShuffleAndDeal();
    game()
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
    let jokerIndex = lastCard - 1;
    let joker = deck[jokerIndex].number;

    if (joker === 7) {
        joker = 10;
    } else if (joker === 12) {
        joker = 1;
    } else {
        joker = joker + 1;
    }

    deck.filter(card => card.number === joker).map(card => card.isJoker = true)
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

async function round() {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");
    createCards(player1, player2);
    if (rounds.bo3.roundWinner === null) {
        if (rounds.amount % 2 === 0) {
            alert('Vez do jogador 1')
        } else {
            alert('Vez do jogador 1')
        }

        // const move = await player2Move(player2ChosenCard);
        debugger
        // console.log(move)
        // if (player1ChosenCard != null && player2ChosenCard != null) {
        // if (i > 2) {
        //     players.filter(el => el.name === rounds.bo3.firstRoundWinner).map(player => player.points++);
        //     rounds.bo3.roundWinner = rounds.bo3.firstRoundWinner;
        // } else {
        //     console.log(player1[player1ChosenCard]);
        //     debugger
        //     cardStrengthComparator(player1[player1ChosenCard], player2[player2ChosenCard])
        //     i++

        // }
        // }

        rounds.bo3.roundWinner = null;
        rounds.amount++
    }
}

async function player2Move(move) {
    if (move === null) {
        1
        console.log("Jogue")
        return;
    }

    return true;
}

function battle(card1, card2, cardDiv) {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");
    moveCard(player1[parseInt(card1)], cardDiv)
    if (card1 != null && card2 != null) {
        debugger
        cardStrengthComparator(player1[parseInt(card1)], player2[parseInt(card2)])
    }
}

function createCards(player1, player2) {
    for (let j = 0; j < 3; j++) {
        let player1Card = document.createElement('div');
        player1Card.setAttribute('class', `carta`);
        player1Card.setAttribute('id', `${j}`)
        player1Card.onclick = function (item) {
            player1ChosenCard = item.target.id;
            debugger
            battle(player1ChosenCard, player2ChosenCard, item.currentTarget);
        }

        let player2Card = document.createElement('div');
        player2Card.setAttribute('class', `carta`)
        player2Card.setAttribute('id', `${j}`)
        player2Card.onclick = function (item) {
            player2ChosenCard = item.target.id;
            battle(player1ChosenCard, player2ChosenCard);
        }

        setCardBackground(player1, j, player1Card);
        setCardBackground(player2, j, player2Card);

        document.getElementById(`player1`).appendChild(player1Card);
        document.getElementById(`player2`).appendChild(player2Card);
    }
}

function setCardBackground(player, index, playerCard) {
    let playerCardWithIndex = player.map(number => number)[0 + index];
    if (playerCardWithIndex.number === 1) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/1depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/1demolis.png)";
        }
    } else if (playerCardWithIndex.number === 2) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/2depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        }
    } else if (playerCardWithIndex.number === 3) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/3depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/3demolis.png')";
        }
    } else if (playerCardWithIndex.number === 4) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/4depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/4demolis.png')";
        }
    } else if (playerCardWithIndex.number === 5) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/5depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/5demolis.png')";
        }
    } else if (playerCardWithIndex.number === 6) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/6depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/6demolis.png')";
        }
    } else if (playerCardWithIndex.number === 7) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/7depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/7demolis.png')";
        }
    } else if (playerCardWithIndex.number === 10) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/10depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/10deespada.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/10demolis.png')";
        }
    } else if (playerCardWithIndex.number === 11) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/11depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/11demolis.png')";
        }
    } else if (playerCardWithIndex.number === 12) {
        if (playerCardWithIndex.suit === "Clubs") {
            playerCard.style.backgroundImage = "url('./assets/12depaus.png')";
        } else if (playerCardWithIndex.suit === "Hearts") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else if (playerCardWithIndex.suit === "Spades") {
            playerCard.style.backgroundImage = "url('./assets/verso.png')";
        } else {
            playerCard.style.backgroundImage = "url('./assets/12demolis.png')";
        }
    }
}

function game() {
    if (!players.map(el => el.points).some(el => el >= 12)) {
        round()
    } else {
        alert("O jogo acabou")
    }
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
            cardComparator(playerOneCard, playerTwoCard);
        } else {
            draw();
        }
    } else {
        if (playerOneCard.isJoker && !playerTwoCard.isJoker) {
            setRoundPoints(players[0], rounds)
        } else if (playerTwoCard.isJoker && !playerOneCard.isJoker) {
            setRoundPoints(players[1], rounds)
        } else if (playerOneCard.number != playerTwoCard.number) {
            cardComparator(playerOneCard, playerTwoCard);
        } else {
            suitComparator(playerOneCard, playerTwoCard);
        }
    }
    rounds.cardThrows++
    createDeckAndShuffleAndDeal();
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

function suitComparator(playerOneCard, playerTwoCard) {
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

function cardComparator(playerOneCard, playerTwoCard) {
    if (playerOneCard.number === 3) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 3) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 2) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 2) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 1) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 1) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 1) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 1) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 12) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 12) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 12) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 11) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 11) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 10) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 10) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 7) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 7) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 6) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 6) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 5) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 5) {
        setRoundPoints(players[0], rounds);
    } else if (playerTwoCard.number === 4) {
        setRoundPoints(players[1], rounds);
    } else if (playerOneCard.number === 4) {
        setRoundPoints(players[0], rounds);
    }
}


function sayTruco() {
    rounds.truco.isTrucado = true;
    rounds.truco.value = rounds.truco.value + 3;
}

function escape() {
    // impl
}

function moveCard(card, div) {
    if (card.player.name === "Player 1") {
        div.classList += " player1Move "
    } else { 
        div.classList += " player2Move "
    }
}