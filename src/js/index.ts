
import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";


function turnOver(card: Element) {
    card.classList.toggle('flip')
}

function init() {

    const pile1 = Pile.ofNewDeck()
    // .shuffle();

    const pile2 = new Pile([])

    pile1.dealTo(pile2)
    pile1.dealTo(pile2)
    pile1.dealTo(pile2)

    const frame = document.getElementById("frame")

    pile2.turnOver().cards.forEach(card => {
        console.log(card.description)
        frame.appendChild(card.toElement(pile2.faceDown));
    })

    const cards = [...document.querySelectorAll('.card')];

    cards.forEach(card => {
        card.addEventListener('click', () => {
            turnOver(card)
        })
    })

}

window.addEventListener('load', init, { once: false });
