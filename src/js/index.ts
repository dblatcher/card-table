import "../scss/base.scss";
import { Card } from "./card";
import { Pile } from "./pile";
import { makeCardElement, makePileElement, setPileElementAttributes } from "./elements";
import { animatedElementMove } from "./animation";
import { TableModel } from "./TableModel";
import { initialPiles } from "./setUp";


interface CardDragData {
    pileIndex?: number
    cardIndex?: number
}

let tableModel: TableModel;



function spreadOrCollectPile(pile: Pile): void {
    pile.spread = !pile.spread
    if (pile.cards.length === 0) { pile.spread = false }
    setPileElementAttributes(pile, tableModel.findElementForPile(pile))
}

function turnOverPile(pile: Pile): void {
    if (pile.spread) {
        pile.flipCards()
    } else {
        pile.turnOver()
    }

    renderPile(pile, tableModel.findElementForPile(pile))
}

function renderPile(pile: Pile, pileElement: Element) {

    setPileElementAttributes(pile, pileElement)

    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
    pile.cards.forEach(card => {
        const cardElement = makeCardElement(card, pile.faceDown, cardDragHandler)
        pileElement.prepend(cardElement);
        tableModel.elementToCardMap.set(cardElement, card)
    })
}

function cardDragHandler(event: DragEvent) {
    event.dataTransfer.effectAllowed = "move";

    if (event.currentTarget instanceof HTMLElement) {
        const card = tableModel.elementToCardMap.get(event.currentTarget)
        const pile = tableModel.elementToPileMap.get(event.currentTarget.parentElement);

        if (!pile) { return }

        const data: CardDragData = {
            pileIndex: tableModel.piles.indexOf(pile),
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

    const sourcePile = tableModel.piles[data.pileIndex];
    const sourceCard = sourcePile?.cards[data.cardIndex];

    if (event.target instanceof HTMLElement) {
        targetPileElement = event.target.closest('[droptarget]');
        if (targetPileElement) {
            targetPile = tableModel.elementToPileMap.get(targetPileElement)
        }
    }

    if (!targetPile || !sourcePile) { return }

    sourceCardElement = tableModel.findElementForCard(sourceCard) as HTMLElement
    sourcePileElement = tableModel.findElementForPile(sourcePile) as HTMLElement

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
    tableModel.piles.push(pile)

    const pileElement = makePileElement(pile, dropOnPileHandler, spreadOrCollectPile, turnOverPile);
    tableModel.elementToPileMap.set(pileElement, pile);
    renderPile(pile, pileElement)
    tableModel.tableElement.appendChild(pileElement);
}

function init() {
    tableModel = new TableModel(initialPiles, document.querySelector(".table"));

    tableModel.piles.forEach(pile => {
        const pileElement = makePileElement(pile, dropOnPileHandler, spreadOrCollectPile, turnOverPile);
        tableModel.elementToPileMap.set(pileElement, pile);
        renderPile(pile, pileElement)
        tableModel.tableElement.appendChild(pileElement);
    });


    const myWindow = window as any;

    myWindow.addPile = addPile;
    myWindow.tableModel = tableModel;
    myWindow.Card = Card;
    myWindow.Pile = Pile;
}

window.addEventListener('load', init, { once: true });
