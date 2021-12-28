
import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";


function turnOver(card: Element) {
    card.classList.toggle('flip')
}

function init() {

    const pile = Pile.ofNewDeck();
    console.log(pile)

    pile.cards.forEach(card => {
        document.body.appendChild(card.toElement());
    })

    const cards = [...document.querySelectorAll('.card')];
    console.log(cards)

    cards.forEach(card => {
        card.addEventListener('click', () => {
            turnOver(card)
        })
    })

}

window.addEventListener('load', init, { once: false });
