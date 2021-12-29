
import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";

let pileElements: Element[];

const piles = [
    new Pile([
        new Card("diamonds", Card.value[2]),
        new Card("diamonds", Card.value[3]),
        new Card("diamonds", Card.value[7]),
        new Card("diamonds", Card.value["JACK"]),
    ], true).shuffle(),
    new Pile([
        new Card("clubs", Card.value["JACK"]),
    ])
]


function turnOver(card: Element) {
    card.classList.toggle('flip')
}


function renderPile(pile: Pile, pileElement: Element) {
    if (!pileElement) { return }
    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
    pile.cards.forEach(card => {
        pileElement.prepend(card.toElement(pile.faceDown));
    })
}

function render() {
    renderPile(piles[0], pileElements[0]);
    renderPile(piles[1], pileElements[1]);
}

function init() {
    pileElements = [...document.querySelectorAll('.pile')];

    render();
    console.log('pile[0]', piles[0].descriptions)
    console.log(piles[1].descriptions)

    pileElements[0].addEventListener('click', () => {
        piles[0].dealTo(piles[1])
        console.log('pile1', piles[0].descriptions)
        console.log(piles[1].descriptions)
        render()
    })

    pileElements[1].addEventListener('click', () => {
        piles[1].turnOver()
        render()
    })

}

window.addEventListener('load', init, { once: false });
