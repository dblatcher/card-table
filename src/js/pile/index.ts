import { Card, SerialisedCard } from "../card";



interface PileConfig {
    faceDown?: boolean
    spread?: boolean
    x?: number
    y?: number
}

interface SerialisedPile extends Required<PileConfig> {
    cards: SerialisedCard[]
};

class Pile implements Required<PileConfig> {
    cards: Card[]
    faceDown: boolean
    spread: boolean
    x: number
    y: number

    constructor(cards: Card[] = [], config: PileConfig = {}) {

        const { faceDown = false, spread = false, x = 0, y = 0 } = config

        this.cards = cards
        this.faceDown = faceDown
        this.spread = spread
        this.x = x
        this.y = y
    }

    static ofNewDeck(config: PileConfig = {}): Pile {
        const cards: Card[] = [];
        Card.suits.forEach(suit => {
            Card.cardValueList.filter(cardValue => !cardValue.noSuit).forEach(value => {
                cards.push(new Card(value, suit))
            })
        })

        return new Pile(cards, config);
    }

    static ofNewDeckWithJokers(config: PileConfig = {}): Pile {
        const pile = Pile.ofNewDeck(config)
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

    flipCards(): Pile {
        this.faceDown = !this.faceDown
        return this
    }

    dealTo(destination: Pile, cardOrIndex?: Card | number): Pile {
        if (this.cards.length === 0) { return }

        let index = 0;

        if (typeof cardOrIndex === 'number') {
            if (cardOrIndex >= this.cards.length) { return }
            index = cardOrIndex
        } else if (cardOrIndex instanceof Card) {
            index = this.cards.indexOf(cardOrIndex)
            if (index === -1) { return }
        }

        destination.cards.unshift(this.cards.splice(index, 1)[0])
        return this
    }

    serialise(): SerialisedPile {
        return {
            cards: this.cards.map(card => card.serialise()),
            faceDown: this.faceDown,
            spread: this.spread,
            x: this.x,
            y: this.y
        }
    }

    static deserialise(serialisedPile: SerialisedPile): Pile {
        const { cards, faceDown, spread, x, y } = serialisedPile;
        return new Pile(cards.map(serialisedCard => Card.deserialise(serialisedCard)), { faceDown, spread, x, y })
    }
}

export { Pile, SerialisedPile }