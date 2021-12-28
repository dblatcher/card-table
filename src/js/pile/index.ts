import { Card } from "../card";


class Pile {
    cards: Card[]
    faceDown: boolean

    constructor(cards: Card[], faceDown = true) {
        this.cards = cards
        this.faceDown = faceDown
    }

    static ofNewDeck(faceDown = true) {
        const cards: Card[] = [];
        Card.suits.forEach(suit => {
            Card.cardValueList.forEach(value => {
                cards.push(new Card(suit, value))
            })
        })

        return new Pile(cards,faceDown);
    }

}

export { Pile }