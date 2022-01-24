import { Card } from "./card"
import { Pile } from "./pile"

const initialPiles: Pile[] = [
    Pile.ofNewDeckWithJokers(),
    new Pile(),
    new Pile(),
    new Pile(),
    new Pile(),
    new Pile(),
]

const initialPiles2 = [
    new Pile([
        new Card(Card.value["QUEEN"], "clubs"),
        new Card(Card.value["QUEEN"], "hearts"),
        new Card(Card.value["QUEEN"], "diamonds"),
        new Card(Card.value[4], "diamonds"),
        new Card(Card.value[7], "diamonds"),
    ], { spread: true }),
    new Pile([
        new Card(Card.value[2], "clubs"),
        new Card(Card.value[3], "hearts"),
        new Card(Card.value[10], "diamonds"),
        new Card(Card.value[9], "diamonds"),
        new Card(Card.value[2], "diamonds"),
    ], { faceDown: true }),
    new Pile([
        // new Card(),
    ]),
    new Pile([
        // new Card(Card.value["JACK"], "diamonds"),
    ]),
    Pile.ofNewDeckWithJokers(),
]

export { initialPiles, initialPiles2 }