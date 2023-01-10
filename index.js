let deck = [];
let players = [];

function createGame() {
    let mode = prompt("Qual será seu modo de jogo? 1v1 ou 2v2?")
    createPlayers(mode)
    debugger
    createDeck()
    shuffleDeck(deck)
    dealTheCards()
    game()
}

function shuffleDeck(deck) {
    deck.sort(() => Math.random() - 0.5);
}

function createNumberCards() {
    let numberCards = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

    return numberCards;
}

function createCardSuits() {
    let cardsSuits = ["♣", "♥", "♠", "♦"];

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
        let player = new Object();
        player.name = undefined,
            player.points = undefined,
            player.roundPoints = undefined
        for (let i = 0; i < 2; i++) {
            debugger
            player.name = `Player ${i + 1}`
            players.push(player)
        }
    } else {
        for (i = 0; i < 2; i++) {
            players.push(player)
        }
    }
}

function setRoundPoints(roundPoints) {
    if (roundPoints + 1 === 2) {
        deck.filter(el => el.player.name === card.player.name).map(cardEl => cardEl.player.points++);
    } else {
        deck.filter(el => el.player.name === card.player.name).map(cardEl => cardEl.player.roundPoints++);
    }
}

function round() {
    let player1 = deck.filter(el => el.player.name === "Player 1");
    let player2 = deck.filter(el => el.player.name === "Player 2");

    cardStrengthComparator(player1[0], player2[2])
    debugger
}

function game() {
    while (deck.filter(el => el.player.points <= 12).length >= 1) {
        round()
    }
}

// 3, 2, 1, 12, 11, 10, 7, 6, 5, 4
function cardStrengthComparator(playerOneCard, playerTwoCard) {
    debugger
    if (playerOneCard.number === playerTwoCard.number) {
        console.log("empachou")
    } else if (playerOneCard.number === 3 && playerTwoCard.number != 3) {
        setRoundPoints(playerOneRoundPoints)
    } else if (playerTwoCard.number === 3 && playerOneCard.number != 3) {
        setRoundPoints(playerTwoRoundPoints)
    } else if (playerOneCard.number === 2 && playerTwoCard.number != 2) {
        setRoundPoints(playerOneRoundPoints)
    } else if (playerTwoCard.number === 2 && playerOneCard.number != 2) {
        setRoundPoints(playerTwoRoundPoints)
    }
}