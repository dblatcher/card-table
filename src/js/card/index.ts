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

    static suits = suits
    static cardValueList = cardValueList
    static value = cardValues
}

export type { Suit }
export { Card, cardValues, CardValue }