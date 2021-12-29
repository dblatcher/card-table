import { Card } from "../card";



class Pile {
    cards: Card[]
    faceDown: boolean

    constructor(cards: Card[], faceDown = false) {
        this.cards = cards
        this.faceDown = faceDown
    }

    static ofNewDeck(faceDown = false):Pile {
        const cards: Card[] = [];
        Card.suits.forEach(suit => {
            Card.cardValueList.forEach(value => {
                cards.push(new Card(suit, value))
            })
        })

        return new Pile(cards, faceDown);
    }

    shuffle():Pile {
        const tempPile = this.cards.splice(0, this.cards.length)
        while (tempPile.length > 0) {
            this.cards.push(
                ...tempPile.splice(Math.floor(Math.random() * tempPile.length), 1)
            )
        }
        return this
    }

    turnOver():Pile {
        this.cards.reverse()
        this.faceDown = !this.faceDown
        return this
    }

    dealTo(destination:Pile) {
        destination.cards.unshift(this.cards.shift())
    }
}

export { Pile }