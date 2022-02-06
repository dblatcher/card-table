import { Card } from "../card";
import { Pile } from "../pile";

import htm from 'htm';

function h(type: string, props: { [index: string]: string | number | undefined }, ...children: any[]): HTMLElement {
    const element = document.createElement(type);

    for (let key in props) {
        const value = props[key] ? props[key].toString() : '';
        element.setAttribute(key, value)
    }

    children.forEach(child => {
        if (child instanceof Node) {
            element.appendChild(child)
        } else if (typeof child == 'string') {
            element.appendChild(document.createTextNode(child))
        }
    })
    return element
}

const html = htm.bind(h);


function makeCardElement(
    card: Card,
    faceDown = false,
    cardDragHandler?: EventListener
): HTMLElement {


    const cardElement = html`
    <figure class="card${faceDown ? ' flip' : ''}" suit="${card.suit}" draggable="true">
        <section class="face">
            <span class="top-value">
                <span>${card.suitSymbol}</span>
                <span>${card.symbol}</span>
            </span>
            <span class="middle">${card.symbol}</span>
            <span class="bottom-value">
                <span>${card.suitSymbol}</span>
                <span>${card.symbol}</span>
            </span>
        </section>
        <section class="back">
        </section>
    </figure>
    ` as HTMLElement

    cardElement.addEventListener('dragstart', cardDragHandler);
    return cardElement;
}


function makeControlElement(
    pile: Pile,
    pileDragHandler?: EventListener,
    leftClickAction?: { (pile: Pile): void },
    rightClickAction?: { (pile: Pile): void }
): HTMLElement {

    const controlElement = document.createElement('figure');
    controlElement.classList.add('pile-control');
    controlElement.setAttribute('draggable', "true");
    controlElement.addEventListener('dragstart', pileDragHandler);

    controlElement.addEventListener('click', () => {
        if (leftClickAction) {
            leftClickAction(pile)
        }
    })

    controlElement.addEventListener('contextmenu', event => {
        if (rightClickAction) {
            event.preventDefault()
            rightClickAction(pile)
        }
    })

    return controlElement
}

function makePileElement(
    pile: Pile,
    dropOnPileHandler: EventListener,
    pileDragHandler?: EventListener,
    leftClickAction?: { (pile: Pile): void },
    rightClickAction?: { (pile: Pile): void }
): HTMLElement {
    const pileElement = document.createElement('div');
    pileElement.classList.add('pile')
    setPileElementAttributes(pile, pileElement)
    setPileElementPosition(pile, pileElement)

    pileElement.addEventListener('dragover', event => { event.preventDefault() });
    pileElement.addEventListener('dragenter', event => { event.preventDefault() });
    pileElement.addEventListener('drop', dropOnPileHandler);
    pileElement.setAttribute('droptarget', "true")


    const controlElement = makeControlElement(pile, pileDragHandler, leftClickAction, rightClickAction);
    pileElement.appendChild(controlElement)

    return pileElement
}

function getQuantityAttribute(quantity: number): string {
    if (quantity <= 1) { return 'none' }
    if (quantity <= 5) { return 'small' }
    if (quantity <= 10) { return 'medium' }
    if (quantity <= 15) { return 'big' }
    return 'huge'
}

function setPileElementPosition(pile: Pile, pileElement: Element) {
    (pileElement as HTMLElement).style.top = `${pile.y}px`;
    (pileElement as HTMLElement).style.left = `${pile.x}px`;
}

function setPileElementAttributes(pile: Pile, pileElement: Element) {

    if (pile.spread) {
        pileElement.classList.add('spread');
    } else {
        pileElement.classList.remove('spread');
    }

    if (pile.cards.length === 0) {
        pileElement.classList.add('no-cards');
    } else {
        pileElement.classList.remove('no-cards');
    }

    pileElement.setAttribute('quantity', getQuantityAttribute(pile.cards.length));
}

function removeCardElements(pileElement: Element) {
    [...pileElement.querySelectorAll('.card')].forEach(cardElement => {
        pileElement.removeChild(cardElement)
    })
}

function addCardElementToPileElement(pileElement: Element, cardElement: Element, atBottom = false) {
    //first card in the pile.cards array is the top card
    // so the last cardElements must be in reversed order (so the last element to be rendered is the one on top)
    if (atBottom) {
        pileElement.prepend(cardElement);
    } else {
        pileElement.appendChild(cardElement)
    }
}

export { makeCardElement, makePileElement, setPileElementAttributes, removeCardElements, addCardElementToPileElement, setPileElementPosition }