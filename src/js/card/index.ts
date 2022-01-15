import { CardValue, cardValues, cardValueList } from "./values"

type Suit = "clubs" | "hearts" | "diamonds" | "spades"
const suits: readonly Suit[] = Object.freeze(["clubs", "hearts", "diamonds", "spades"])


class Card {
    suit?: Suit
    value?: CardValue

    constructor(value?: CardValue, suit?: Suit) {
        this.suit = this.value?.noSuit ? undefined : suit
        this.value = value
    }

    get description(): string {
        if (!this.value) { return `unknown card` }
        if (this.value.noSuit) { return this.value.name }
        return `${this.value.name} of ${this.suit}`
    }

    get symbol(): string {
        if (this.value) { return this.value.symbol }
        return "_";
    }

    static suits = suits
    static cardValueList = cardValueList
    static value = cardValues
}

export type { Suit }
export { Card, cardValues, CardValue }