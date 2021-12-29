import { CardValue, cardValues, cardValueList } from "./values"

type Suit = "clubs" | "hearts" | "diamonds" | "spades"
const suits: readonly Suit[] = Object.freeze(["clubs", "hearts", "diamonds", "spades"])


class Card {
    suit: Suit
    value: CardValue

    constructor(suit: Suit, value: CardValue) {
        this.suit = suit
        this.value = value
    }

    get description(): string {
        return `${this.value.name} of ${this.suit}`
    }

    toElement(faceDown = false) {
        const figure = document.createElement('figure');
        figure.classList.add('card');
        if (faceDown) {figure.classList.add('flip')}
        figure.setAttribute('suit', this.suit);
        const face = document.createElement('section');
        face.classList.add('face');
        face.innerHTML = `<span class="value">${this.value.symbol}</span>`
        figure.appendChild(face)
        const back = document.createElement('section');
        back.classList.add('back');
        figure.appendChild(back)
        return figure;
    }

    static suits = suits
    static cardValueList = cardValueList
}

export type { Suit }
export { Card, cardValues, CardValue }