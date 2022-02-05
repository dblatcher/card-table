import { animatedElementMove } from "../animation";
import { addCardElementToPileElement, makeCardElement, makePileElement, removeCardElements, setPileElementAttributes } from "./elements";
import { Pile } from "../pile";
import { TableModel } from "../TableModel";
import { Card } from "../card";


interface DragDataInput {
    pileIndex?: number
    cardIndex?: number
}

class CardOrPileDragData implements DragDataInput {
    readonly pileIndex?: number
    readonly sourcePile?: Pile
    readonly cardIndex?: number
    readonly sourceCard?: Card

    constructor(input: DragDataInput, app: TableApp) {
        this.pileIndex = input.pileIndex;
        this.sourcePile = typeof this.pileIndex === "number" ? app.piles[this.pileIndex] : undefined;
        this.cardIndex = input.cardIndex;
        this.sourceCard = typeof this.cardIndex === "number" && this.sourcePile ? this.sourcePile.cards[this.cardIndex] : undefined;
    }

    get type() {
        return this.sourceCard ? 'CARD_DRAG' : 'PILE_DRAG'
    }
}

class TableApp extends TableModel {

    constructor(piles: Pile[], tableElement: Element) {
        super(piles, tableElement)
        this.piles.forEach(pile => { this.registerPile(pile) });
        this.setUpTable()
    }

    addPile(pile = new Pile()): Pile {
        this.piles.push(pile)
        this.registerPile(pile)
        return pile;
    }

    spreadOrCollectPile(pile: Pile): void {
        pile.spread = !pile.spread
        if (pile.cards.length === 0) { pile.spread = false }
        setPileElementAttributes(pile, this.findElementForPile(pile))
    }

    turnOverPile(pile: Pile): void {
        const pileElement = this.findElementForPile(pile)
        animatedElementMove(
            pileElement as HTMLElement,
            () => {
                if (pile.spread) {
                    pile.flipCards()
                } else {
                    pile.turnOver()
                }
                setPileElementAttributes(pile, pileElement)
                this.removeAndRenderCards(pile, pileElement)
            },
            {
                time: .5,
                startingTransforms: {
                    "rotateY": "-180deg"
                }
            }
        )
    }

    moveCard(sourceCard: Card, sourcePile: Pile, targetPile: Pile) {
        const sourceCardElement = this.findElementForCard(sourceCard) as HTMLElement
        const sourcePileElement = this.findElementForPile(sourcePile) as HTMLElement
        const targetPileElement = this.findElementForPile(targetPile) as HTMLElement

        sourcePile.dealTo(targetPile, sourceCard)

        animatedElementMove(
            sourceCardElement as HTMLElement,
            () => {

                addCardElementToPileElement(targetPileElement, sourceCardElement)
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

    protected setUpTable() {
        this.tableElement.addEventListener('dragover', event => { event.preventDefault() });
        this.tableElement.addEventListener('dragenter', event => { event.preventDefault() });
        this.tableElement.addEventListener('drop', this.dropOnTableHandler.bind(this));
        this.tableElement.setAttribute('droptarget', "true")
    }

    protected registerPile(pile: Pile) {
        const pileElement = makePileElement(
            pile,
            this.dropOnPileHandler.bind(this),
            this.pileDragHandler.bind(this),
            this.spreadOrCollectPile.bind(this),
            this.turnOverPile.bind(this),
        );
        this.elementToPileMap.set(pileElement, pile);
        setPileElementAttributes(pile, pileElement)
        this.removeAndRenderCards(pile, pileElement)
        this.tableElement.appendChild(pileElement);
    }

    protected removeAndRenderCards(pile: Pile, pileElement: Element) {
        removeCardElements(pileElement)

        pile.cards.forEach(card => {
            const cardElement = makeCardElement(card, pile.faceDown, this.cardDragHandler.bind(this))
            addCardElementToPileElement(pileElement, cardElement, true)
            this.elementToCardMap.set(cardElement, card)
        })
    }

    protected parseDragData(event: DragEvent): CardOrPileDragData {
        let data: any = {}
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"))
        } catch (error) {
            console.warn(error)
        }

        return new CardOrPileDragData(data, this)
    }

    protected cardDragHandler(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";

        if (event.currentTarget instanceof HTMLElement) {
            const card = this.elementToCardMap.get(event.currentTarget)
            const pile = this.elementToPileMap.get(event.currentTarget.parentElement);
            if (!pile) { return }

            const data: DragDataInput = {
                pileIndex: this.piles.indexOf(pile),
                cardIndex: pile.spread ? pile.cards.indexOf(card) : 0,
            }
            event.dataTransfer.setData("text/plain", JSON.stringify(data));
        }
    }

    protected pileDragHandler(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";

        if (event.currentTarget instanceof HTMLElement) {
            // currentTarget will be the controlElement, which is a child of the pile
            const pile = this.elementToPileMap.get(event.currentTarget.parentElement);
            if (!pile) { return }

            const data: DragDataInput = {
                pileIndex: this.piles.indexOf(pile),
            }
            event.dataTransfer.setData("text/plain", JSON.stringify(data));
        }
    }

    protected dropOnPileHandler(event: DragEvent) {
        let targetPile: Pile, dropTarget: HTMLElement;
        const dragData = this.parseDragData(event)

        if (event.target instanceof HTMLElement) {
            dropTarget = event.target.closest('[droptarget]');
            if (dropTarget) {
                targetPile = this.elementToPileMap.get(dropTarget)
            }
        }

        if (!targetPile || !dragData.sourceCard) { return }
        this.moveCard(dragData.sourceCard, dragData.sourcePile, targetPile);
    }

    protected dropOnTableHandler(event: DragEvent) {
        let targetPile: Pile, dropTarget: HTMLElement;
        const dragData = this.parseDragData(event)

        if (event.target instanceof HTMLElement) {
            dropTarget = event.target.closest('[droptarget]');
            if (dropTarget) {
                targetPile = this.elementToPileMap.get(dropTarget)
            }
        }
        console.log(dropTarget == this.tableElement, dragData, event)
    }

}

export { TableApp }