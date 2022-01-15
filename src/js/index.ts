
import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";

let tableElement: Element;

const elementToPileMap = new Map<Element, Pile>();
const elementToCardMap = new Map<Element, Card>();

interface CardDragData {
    pileIndex?: number
    cardIndex?: number
}

const piles = [
    new Pile([
        new Card(Card.value["QUEEN"], "clubs"),
        new Card(Card.value["QUEEN"], "hearts"),
        new Card(Card.value["QUEEN"], "diamonds"),
        new Card(Card.value[4], "diamonds"),
        new Card(Card.value[7], "diamonds"),
    ], false, true),
    new Pile([
        new Card(Card.value[2], "clubs"),
        new Card(Card.value[3], "hearts"),
        new Card(Card.value[10], "diamonds"),
        new Card(Card.value[9], "diamonds"),
        new Card(Card.value[2], "diamonds"),
    ], false, true),
    new Pile([
        // new Card(),
    ]),
    new Pile([
        // new Card(Card.value["JACK"], "diamonds"),
    ]),
    Pile.ofNewDeckWithJokers(),
]

function makePileElement(pile: Pile): HTMLElement {
    const pileElement = document.createElement('div');
    pileElement.classList.add('pile')
    if (pile.spread) { pileElement.classList.add('spread') }

    pileElement.addEventListener('dragover', event => { event.preventDefault() });
    pileElement.addEventListener('dragenter', event => { event.preventDefault() });
    pileElement.addEventListener('drop', dropHandler);
    pileElement.setAttribute('droptarget', "true")

    pileElement.addEventListener('click', () => {
        if (pile.spread) {
            pile.flipCards()
        } else {
            pile.turnOver()
        }
        render()
    })

    pileElement.addEventListener('contextmenu',event => {
        event.preventDefault();
        pile.spread = !pile.spread
        render()
    })

    elementToPileMap.set(pileElement, pile);
    return pileElement
}

function makeCardElement(card: Card, faceDown = false): HTMLElement {
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

    elementToCardMap.set(cardElement, card)
    return cardElement;
}

function renderPile(pile: Pile, pileElement: Element) {
    if (!pileElement) { return }

    if (pile.spread) {
        pileElement.classList.add('spread');
    } else {
        pileElement.classList.remove('spread');
    }

    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
    pile.cards.forEach(card => {
        pileElement.prepend(makeCardElement(card, pile.faceDown));
    })
}

function cardDragHandler(event: DragEvent) {
    event.dataTransfer.effectAllowed = "move";

    if (event.currentTarget instanceof HTMLElement) {
        const card = elementToCardMap.get(event.currentTarget)
        const pile = elementToPileMap.get(event.currentTarget.parentElement);

        if (!pile) { return }

        const data: CardDragData = {
            pileIndex: piles.indexOf(pile),
            cardIndex: pile.spread ? pile.cards.indexOf(card) : 0,
        }

        event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }
}

function parseCardDragData(event: DragEvent): CardDragData {
    let data: any = {}

    try {
        data = JSON.parse(event.dataTransfer.getData("text/plain"))
    } catch (error) {
        console.warn(error)
    }

    return data
}

function dropHandler(event: DragEvent) {
    let targetPile: Pile;

    const data = parseCardDragData(event)

    const sourcePile = piles[data.pileIndex];
    const sourceCard = sourcePile?.cards[data.cardIndex];

    if (event.target instanceof HTMLElement) {
        const targetPileElement = event.target.closest('[droptarget]')
        if (targetPileElement) {
            targetPile = elementToPileMap.get(targetPileElement)
        }
    }

    if (!targetPile || !sourcePile) { return }

    sourcePile.dealTo(targetPile, sourceCard)
    render()
}

function render() {
    const pileElements = [...tableElement.querySelectorAll('.pile')];
    elementToCardMap.clear();
    piles.forEach((pile, index) => { renderPile(pile, pileElements[index]) })

    const cardElements = [...document.querySelectorAll('.card')];
    cardElements.forEach(cardElement => {
        cardElement.addEventListener('dragstart', cardDragHandler)
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
