
import "../scss/base.scss";


function turnOver(card: Element) {
    card.classList.toggle('flip')
}

function init() {

    const cards = [...document.querySelectorAll('.card')];
    console.log(cards)

    cards.forEach(card => {
        card.addEventListener('click', () => {
            turnOver(card)
        })
    })

}

window.addEventListener('load', init, { once: false });
