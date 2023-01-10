let deck = [];

function createGame() {
    createDeck()
    shuffleDeck(deck)
    dealTheCards()
    debugger
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
                    name: undefined,
                    points: 0,
                    roundPoints: 0
                }
            };
        });
        tempDeck.push(tempCardsOfSameSuit);
    });
    deck = tempDeck.flatMap(flat => flat);
}

// 3, 2, 1, 12, 11, 10, 7, 6, 5, 4
function cardStrengthComparator(playerOneCard, playerTwoCard) {
    if (playerOneCard.number === 3 && playerTwoCard.number != 3) {
        playerOneCard.player.roundPoints++
    }
}

function dealTheCards() {
    deck.splice(0, 20);
    for (i = 0; i < 6; i++) {
        if ((deck.length - 1 - i) % 2 === 0) {
            deck[deck.length - 1 - i].player.name = "Player 1";
        } else {
            deck[deck.length - 1 - i].player.name = "Player 2";
        }
    }
}
