class CardValue {
    readonly name: string
    readonly score: number
    readonly isFace: boolean

    constructor(input: string | number) {
        this.name = input.toString()

        if (typeof input === 'string') {
            this.score = 10
            this.isFace = true
        } else {
            this.score = input
            this.isFace = false
        }
    }

    get symbol() {
        return this.isFace ? this.name[0] : this.name
    }
}

const cardValues:{[index:string|number] : CardValue} = {
    2: new CardValue(2),
    3: new CardValue(3),
    4: new CardValue(4),
    5: new CardValue(5),
    6: new CardValue(6),
    7: new CardValue(7),
    8: new CardValue(8),
    9: new CardValue(9),
    10: new CardValue(10),
    JACK: new CardValue("Jack"),
    QUEEN: new CardValue("Queen"),
    KING: new CardValue("King"),
    ACE: new CardValue("Ace"),
}

const cardValueList: CardValue[] = []
for (const key in cardValues) {
    cardValueList.push(cardValues[key])
}

export { cardValues,cardValueList, CardValue }