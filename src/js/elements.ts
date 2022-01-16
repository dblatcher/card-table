import { Card } from "./card";
import { Pile } from "./pile";

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
    face.innerHTML = `<span class="value">${card.symbol}</span>`
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
    if (pile.spread) { pileElement.classList.add('spread') }

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

function setPileElementAttributes(pile: Pile, pileElement: Element)  {

    if (pile.spread) {
        pileElement.classList.add('spread');
    } else {
        pileElement.classList.remove('spread');
    }

    pileElement.setAttribute('quantity', getQuantityAttribute(pile.cards.length));
}

export { makeCardElement, makePileElement, setPileElementAttributes }