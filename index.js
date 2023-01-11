let deck = [];
let players = [];
//let round = 0;

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
                isManilha: false,
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
    setManilha(last)
}

function setManilha(lastCard) {
    let manilhaIndex = lastCard - 1;
    let manilha = deck[manilhaIndex].number;

    if (manilha === 7) {
        manilha = 10;
    } else if (manilha === 12) {
        manilha = 1;
    } else {
        manilha = manilha + 1;
    }

    deck.filter(card => card.number === manilha).map(card => card.isManilha = true)
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
}

function setRoundPoints(player) {
    if (player.roundPoints + 1 === 2) {
        player.points++

        clearRoundPoints();
    } else {
        player.roundPoints++
    }
}

function round() {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");
    cardStrengthComparator(player1[0], player2[0])
    cardStrengthComparator(player1[1], player2[1])
    cardStrengthComparator(player1[2], player2[2])
}

function game() {
    while (!players.map(el => el.points).some(el => el >= 12)) {
        round()
    }
}

// 3, 2, 1, 12, 11, 10, 7, 6, 5, 4
function cardStrengthComparator(playerOneCard, playerTwoCard) {
    if (!playerOneCard.isManilha && !playerTwoCard.isManilha) {
        if (playerOneCard.number != playerTwoCard.number) {
            cardComparator(playerOneCard, playerTwoCard);
        } else {
           // console.log("Empachou")
        }
    } else {
        if (playerOneCard.isManilha && !playerTwoCard.isManilha) {
            setRoundPoints(players[0])
        } else if (playerTwoCard.isManilha && !playerOneCard.isManilha) {
            setRoundPoints(players[1])
        } else if (playerOneCard.number != playerTwoCard.number) {
            cardComparator(playerOneCard, playerTwoCard);
        } else {
            suitComparator(playerOneCard, playerTwoCard);
        }
    }

    createDeckAndShuffleAndDeal();
}


function suitComparator(playerOneCard, playerTwoCard) {
    if (playerOneCard.suit === "Clubs") {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.suit === "Clubs") {
        setRoundPoints(players[1]);
    } else if (playerOneCard.suit === "Hearts") {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.suit === "Hearts") {
        setRoundPoints(players[1]);
    } else if (playerOneCard.suit === "Spades") {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.suit === "Spades") {
        setRoundPoints(players[1]);
    } else if (playerOneCard.suit === "Diamonds") {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.suit === "Diamonds") {
        setRoundPoints(players[1]);
    }
}

function cardComparator(playerOneCard, playerTwoCard) {
    if (playerOneCard.number === 3) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 3) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 2) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 2) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 1) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 1) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 1) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 1) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 12) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 12) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 12) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 11) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 11) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 10) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 10) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 7) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 7) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 6) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 6) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 5) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 5) {
        setRoundPoints(players[0]);
    } else if (playerTwoCard.number === 4) {
        setRoundPoints(players[1]);
    } else if (playerOneCard.number === 4) {
        setRoundPoints(players[0]);
    }
}

// alert(`Jogador 1, as suas cartas são 
//     \n ${player1.map(el => el.number)} 
//     \n ${player1.map(el => el.suit)}
//     \n ${player1.map(el => el.isManilha)}`)

//     alert(`Jogador 2, as suas cartas são 
//     \n ${player2.map(el => el.number)} 
//     \n ${player2.map(el => el.suit)}
//     \n ${player2.map(el => el.isManilha)}`)

//     alert("O jogador 1 começa")
//     let firstCard = +prompt(`Jogador 1, as suas cartas são 
//     \n ${player1.map(el => el.number)} 
//     \n ${player1.map(el => el.suit)}
//     \n ${player1.map(el => el.isManilha)}`)

//     let firstCardPlayer2 = +prompt(`O Jogador 1 jogou ${player1[firstCard].number}, as suas cartas são 
//     \n ${player2.map(el => el.number)} 
//     \n ${player2.map(el => el.suit)}
//     \n ${player2.map(el => el.isManilha)}`)

//     cardStrengthComparator(player1[firstCard], player2[firstCardPlayer2])
//     delete player1[firstCard]
//     delete player2[firstCardPlayer2]

//     debugger
//     if (players.filter(el => el.roundPoints > 0 && el.name === 'Player 1').length >= 1) {
//         alert("O jogador 1 levou e é o próximo a jogar")
//         let secondCard = +prompt(`Jogador 1, as suas cartas são 
//         \n ${player1.map(el => el.number)} 
//         \n ${player1.map(el => el.suit)}
//         \n ${player1.map(el => el.isManilha)}`)

//         let secondCardPlayer2 = +prompt(`O Jogador 1 jogou ${player1[secondCard].number}, as suas cartas são 
//         \n ${player2.map(el => el.number)} 
//         \n ${player2.map(el => el.suit)}
//         \n ${player2.map(el => el.isManilha)}`)

//         cardStrengthComparator(player1[secondCard], player2[secondCardPlayer2])
//         delete player1[secondCard]
//         delete player2[secondCardPlayer2]

//     } else {
//         alert("O jogador 2 levou e é o próximo a jogar")
//         let secondCardPlayer2 = +prompt(`Jogador 2, as suas cartas são 
//         \n ${player2.map(el => el.number)} 
//         \n ${player2.map(el => el.suit)}
//         \n ${player2.map(el => el.isManilha)}`)

//         let secondCard = +prompt(`O Jogador 1 jogou ${player2[secondCardPlayer2].number}, as suas cartas são 
//         \n ${player1.map(el => el.number)} 
//         \n ${player1.map(el => el.suit)}
//         \n ${player1.map(el => el.isManilha)}`)

//         cardStrengthComparator(player1[secondCard], player2[secondCardPlayer2])
//         delete player1[secondCard]
//         delete player2[secondCardPlayer2]
//     }