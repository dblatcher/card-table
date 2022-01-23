import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";
import { makeCardElement, makePileElement, setPileElementAttributes } from "./elements";
import { animatedElementMove } from "./animation";


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

function findElementForPile(sourcePile: Pile): Element {
    let sourcePileElement
    elementToPileMap.forEach((pile, pileElement) => {
        if (pile === sourcePile) {
            sourcePileElement = pileElement
        }
    })
    return sourcePileElement
}

function findElementForCard(sourceCard: Card): Element {
    let sourcePileElement
    elementToCardMap.forEach((card, cardElement) => {
        if (card === sourceCard) {
            sourcePileElement = cardElement
        }
    })
    return sourcePileElement
}

function spreadOrCollectPile(pile: Pile): void {
    pile.spread = !pile.spread
    if (pile.cards.length === 0) { pile.spread = false }
    setPileElementAttributes(pile, findElementForPile(pile))
}

function turnOverPile(pile: Pile): void {
    if (pile.spread) {
        pile.flipCards()
    } else {
        pile.turnOver()
    }

    renderPile(pile, findElementForPile(pile))
}

function renderPile(pile: Pile, pileElement: Element) {

    setPileElementAttributes(pile, pileElement)

    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
    pile.cards.forEach(card => {
        const cardElement = makeCardElement(card, pile.faceDown, cardDragHandler)
        pileElement.prepend(cardElement);
        elementToCardMap.set(cardElement, card)
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

function dropOnPileHandler(event: DragEvent) {
    let targetPile: Pile, targetPileElement: HTMLElement, sourceCardElement: HTMLElement, sourcePileElement: HTMLElement;

    const data = parseCardDragData(event)

    const sourcePile = piles[data.pileIndex];
    const sourceCard = sourcePile?.cards[data.cardIndex];

    if (event.target instanceof HTMLElement) {
        targetPileElement = event.target.closest('[droptarget]');
        if (targetPileElement) {
            targetPile = elementToPileMap.get(targetPileElement)
        }
    }

    if (!targetPile || !sourcePile) { return }

    sourceCardElement = findElementForCard(sourceCard) as HTMLElement
    sourcePileElement = findElementForPile(sourcePile) as HTMLElement

    sourcePile.dealTo(targetPile, sourceCard)

    animatedElementMove(
        sourceCardElement as HTMLElement,
        () => {
            targetPileElement.appendChild(sourceCardElement)
        },
        {
            speed: 100,
            startingTransforms: {
                "rotateY": sourceCardElement.classList.contains('flip') ? '180deg' : '0deg',
                "rotateZ": '10deg'
            },
            endingClasses: { "flip": targetPile.faceDown }
        }
    )

    if (sourcePile.cards.length === 0) { sourcePile.spread = false }
    setPileElementAttributes(targetPile, targetPileElement);
    setPileElementAttributes(sourcePile, sourcePileElement)
}


function addPile() {
    const pile = new Pile([])
    piles.push(pile)
    const pileElement = makePileElement(pile, dropOnPileHandler, spreadOrCollectPile, turnOverPile);
    elementToPileMap.set(pileElement, pile);
    setPileElementAttributes(pile, pileElement);
    tableElement.appendChild(pileElement);
}

function init() {
    tableElement = document.querySelector(".table");

    piles.forEach(pile => {
        const pileElement = makePileElement(pile, dropOnPileHandler, spreadOrCollectPile, turnOverPile);
        elementToPileMap.set(pileElement, pile);
        tableElement.appendChild(pileElement);
    });

    elementToPileMap.forEach((pile, pileElement) => { renderPile(pile, pileElement) });

    const myWindow = window as any;

    myWindow.addPile = addPile;
    myWindow.piles = piles;
    myWindow.Card = Card;
    myWindow.Pile = Pile;
}

window.addEventListener('load', init, { once: true });
