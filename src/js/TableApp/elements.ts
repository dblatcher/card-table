import { Card } from "../card";
import { Pile } from "../pile";

function makeCardElement(
    card: Card,
    faceDown = false,
    cardDragHandler?: EventListener
): HTMLElement {
    const cardElement = document.createElement('figure');
    cardElement.classList.add('card');
    if (faceDown) { cardElement.classList.add('flip') }

    cardElement.setAttribute('suit', card.suit);
    cardElement.setAttribute('draggable', "true");

    const face = document.createElement('section');
    face.classList.add('face');
    face.innerHTML = `
    <span class="top-value">
        <span>${card.suitSymbol}</span>
        <span>${card.symbol}</span>
    </span>
    <span class="middle">${card.symbol}</span>
    <span class="bottom-value">
        <span>${card.suitSymbol}</span>
        <span>${card.symbol}</span>
    </span>
    `
    cardElement.appendChild(face)

    const back = document.createElement('section');
    back.classList.add('back');
    cardElement.appendChild(back)

    cardElement.addEventListener('dragstart', cardDragHandler);

    return cardElement;
}

function makePileElement(
    pile: Pile,
    dropOnPileHandler: EventListener,
    leftClickAction?: { (pile: Pile): void },
    rightClickAction?: { (pile: Pile): void }
): HTMLElement {
    const pileElement = document.createElement('div');
    pileElement.classList.add('pile')
    setPileElementAttributes(pile,pileElement)
    setPileElementPosition(pile,pileElement)

    pileElement.addEventListener('dragover', event => { event.preventDefault() });
    pileElement.addEventListener('dragenter', event => { event.preventDefault() });
    pileElement.addEventListener('drop', dropOnPileHandler);
    pileElement.setAttribute('droptarget', "true")

    pileElement.addEventListener('click', () => {
        if (leftClickAction) {
            leftClickAction(pile)
        }
    })

    pileElement.addEventListener('contextmenu', event => {
        if (rightClickAction) {
            event.preventDefault()
            rightClickAction(pile)
        }
    })

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

    pileElement.setAttribute('quantity', getQuantityAttribute(pile.cards.length));
}

function removeCardElements(pileElement:Element) {
    while (pileElement.childElementCount > 0) {
        pileElement.removeChild(pileElement.firstElementChild)
    }
}

function addCardElementToPileElement(pileElement:Element, cardElement:Element, atBottom = false) {
    //first card in the pile.cards array is the top card
    // so the last cardElements must be in reversed order (so the last element to be rendered is the one on top)
    if (atBottom) {
        pileElement.prepend(cardElement);
    } else {
        pileElement.appendChild(cardElement)
    }
}

export { makeCardElement, makePileElement, setPileElementAttributes, removeCardElements, addCardElementToPileElement }