
import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";

let tableElement: Element;

const piles = [
    new Pile([
        new Card(Card.value["QUEEN"], "clubs"),
        new Card(Card.value["QUEEN"], "hearts"),
        new Card(Card.value["QUEEN"], "diamonds"),
        new Card(Card.value[4], "diamonds"),
        new Card(Card.value[7], "diamonds"),
    ], false, true),
    new Pile([
        // new Card(),
    ]),
    new Pile([
        // new Card(Card.value["JACK"], "diamonds"),
    ]),
    Pile.ofNewDeckWithJokers(),
]

function makePileElement(pile: Pile) {

    const index = piles.indexOf(pile)
    const pileElement = document.createElement('div');
    pileElement.classList.add('pile')
    if (pile.spread) { pileElement.classList.add('spread') }

    pileElement.addEventListener('dragover', event => { event.preventDefault() });
    pileElement.addEventListener('dragenter', event => { event.preventDefault() });
    pileElement.addEventListener('drop', dropHandler);
    pileElement.setAttribute('droptarget', "true")
    pileElement.setAttribute('pileindex', index.toString()) // to do - create a map of piles to elements instead of using this attribute

    pileElement.addEventListener('click', () => {
        pile.turnOver()
        render()
    })

    return pileElement
}

function makeCardElement(card: Card, faceDown = false) {
    const cardElement = document.createElement('figure');
    cardElement.classList.add('card');
    if (faceDown) { cardElement.classList.add('flip') }
    cardElement.setAttribute('suit', card.suit);
    cardElement.setAttribute('draggable', "true");

    const face = document.createElement('section');
    face.classList.add('face');
    face.innerHTML = `<span class="value">${card.symbol}</span>`
    cardElement.appendChild(face)

    const back = document.createElement('section');
    back.classList.add('back');
    cardElement.appendChild(back)

    return cardElement;
}

function renderPile(pile: Pile, pileElement: Element) {
    if (!pileElement) { return }
    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
    pile.cards.forEach(card => {
        pileElement.prepend(makeCardElement(card, pile.faceDown));
    })
}

function dragHandler(event: DragEvent) {
    event.dataTransfer.effectAllowed = "move";
    if (event.target instanceof HTMLElement) {
        // to do - if the pile is spread, need to move the card selected, not always card[0]
        event.dataTransfer.setData("text/plain", event.target.parentElement.getAttribute('pileindex'));
    }

}

function getAssociatedPile(pileElement: Element): Pile | undefined {
    const index = pileElement.getAttribute('pileindex');
    if (!index || isNaN(Number(index))) { return undefined }
    return piles[Number(index)]
}

function dropHandler(event: DragEvent) {
    let targetPile: Pile, sourcePile: Pile;
    const sourceIndex = event.dataTransfer.getData("text/plain")
    sourcePile = piles[Number(sourceIndex)];

    if (event.target instanceof HTMLElement) {
        const targetPileElement = event.target.closest('[droptarget]')
        if (targetPileElement) {
            targetPile = getAssociatedPile(targetPileElement)
        }
    }

    if (!targetPile || !sourcePile) { return }

    sourcePile.dealTo(targetPile)
    render()
}

function render() {
    const pileElements = [...tableElement.querySelectorAll('.pile')];
    piles.forEach((pile, index) => { renderPile(pile, pileElements[index]) })

    const cardElements = [...document.querySelectorAll('.card')];
    cardElements.forEach(cardElement => {
        cardElement.addEventListener('dragstart', dragHandler)
    })
}

function addPile() {
    const newPile = new Pile([])
    piles.push(newPile)
    tableElement.appendChild(makePileElement(newPile))
    render()
}

function init() {
    tableElement = document.querySelector(".table");

    piles.forEach(pile => {
        tableElement.appendChild(makePileElement(pile))
    })

    render();
    (window as any).addPile = addPile;
    (window as any).piles = piles;
    (window as any).Card = Card;
    (window as any).Pile = Pile;
}

window.addEventListener('load', init, { once: true });
