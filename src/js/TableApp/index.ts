import { animatedElementMove } from "../animation";
import { makeCardElement, makePileElement, setPileElementAttributes } from "./elements";
import { Pile } from "../pile";
import { TableModel } from "../TableModel";

interface CardDragData {
    pileIndex?: number
    cardIndex?: number
}

class TableApp extends TableModel {

    constructor(piles: Pile[], tableElement: Element) {
        super(piles, tableElement)
        this.piles.forEach(pile => { this.registerPile(pile) });
    }

    addPile(pile = new Pile([])): Pile {
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
        if (pile.spread) {
            pile.flipCards()
        } else {
            pile.turnOver()
        }

        const pileElement = this.findElementForPile(pile)
        setPileElementAttributes(pile, pileElement)
        this.removeAndRenderCards(pile, pileElement)
    }

    protected registerPile(pile: Pile) {
        const pileElement = makePileElement(
            pile,
            this.dropOnPileHandler.bind(this),
            this.spreadOrCollectPile.bind(this),
            this.turnOverPile.bind(this),
        );
        this.elementToPileMap.set(pileElement, pile);
        setPileElementAttributes(pile, pileElement)
        this.removeAndRenderCards(pile, pileElement)
        this.tableElement.appendChild(pileElement);
    }

    protected removeAndRenderCards(pile: Pile, pileElement: Element) {
        while (pileElement.childElementCount > 0) {
            pileElement.removeChild(pileElement.firstElementChild)
        }
        pile.cards.forEach(card => {
            const cardElement = makeCardElement(card, pile.faceDown, this.cardDragHandler.bind(this))
            pileElement.prepend(cardElement);
            this.elementToCardMap.set(cardElement, card)
        })
    }

    protected parseCardDragData(event: DragEvent): CardDragData {
        let data: any = {}
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"))
        } catch (error) {
            console.warn(error)
        }
        return data
    }

    protected cardDragHandler(event: DragEvent) {
        event.dataTransfer.effectAllowed = "move";

        if (event.currentTarget instanceof HTMLElement) {
            const card = this.elementToCardMap.get(event.currentTarget)
            const pile = this.elementToPileMap.get(event.currentTarget.parentElement);

            if (!pile) { return }

            const data: CardDragData = {
                pileIndex: this.piles.indexOf(pile),
                cardIndex: pile.spread ? pile.cards.indexOf(card) : 0,
            }

            event.dataTransfer.setData("text/plain", JSON.stringify(data));
        }
    }

    protected dropOnPileHandler(event: DragEvent) {
        let targetPile: Pile, targetPileElement: HTMLElement, sourceCardElement: HTMLElement, sourcePileElement: HTMLElement;

        const data = this.parseCardDragData(event)
        const sourcePile = this.piles[data.pileIndex];
        const sourceCard = sourcePile?.cards[data.cardIndex];

        if (event.target instanceof HTMLElement) {
            targetPileElement = event.target.closest('[droptarget]');
            if (targetPileElement) {
                targetPile = this.elementToPileMap.get(targetPileElement)
            }
        }

        if (!targetPile || !sourcePile) { return }

        sourceCardElement = this.findElementForCard(sourceCard) as HTMLElement
        sourcePileElement = this.findElementForPile(sourcePile) as HTMLElement

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

}

export { TableApp }