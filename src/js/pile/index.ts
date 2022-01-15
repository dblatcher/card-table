import { Card, SerialisedCard } from "../card";

type SerialisedPile = { cards: SerialisedCard[], faceDown: boolean, spread: boolean };

class Pile {
    cards: Card[]
    faceDown: boolean
    spread: boolean

    constructor(cards: Card[], faceDown = false, spread = false) {
        this.cards = cards
        this.faceDown = faceDown
        this.spread = spread
    }

    static ofNewDeck(faceDown = false): Pile {
        const cards: Card[] = [];
        Card.suits.forEach(suit => {
            Card.cardValueList.filter(cardValue => !cardValue.noSuit).forEach(value => {
                cards.push(new Card(value, suit))
            })
        })

        return new Pile(cards, faceDown);
    }

    static ofNewDeckWithJokers(faceDown = false): Pile {
        const pile = Pile.ofNewDeck(faceDown)
        pile.cards.push(new Card(Card.value.JOKER))
        pile.cards.push(new Card(Card.value.JOKER))
        return pile
    }

    get descriptions() {
        return this.cards.map(card => card.description)
    }

    shuffle(): Pile {
        const tempPile = this.cards.splice(0, this.cards.length)
        while (tempPile.length > 0) {
            this.cards.push(
                ...tempPile.splice(Math.floor(Math.random() * tempPile.length), 1)
            )
        }
        return this
    }

    turnOver(): Pile {
        this.cards.reverse()
        this.faceDown = !this.faceDown
        return this
    }

    dealTo(destination: Pile): Pile {
        if (this.cards.length === 0) { return }
        destination.cards.unshift(this.cards.shift())
        return this
    }

    serialise(): SerialisedPile {
        return {
            cards: this.cards.map(card => card.serialise()),
            faceDown: this.faceDown,
            spread: this.spread,
        }
    }

    static deserialise(serialisedPile: SerialisedPile): Pile {
        const { cards, faceDown, spread } = serialisedPile;
        return new Pile(cards.map(serialisedCard => Card.deserialise(serialisedCard)), faceDown, spread)
    }
}

export { Pile, SerialisedPile }