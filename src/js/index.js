
console.log("--INDEX SCRIPT--");

import "../scss/base.scss";


function turnOver(card) {
    card.classList.toggle('flip')
}

function init() {

    const cards = [...document.querySelectorAll('.card')];
    console.log(cards)

    cards.forEach(card => {
        card.addEventListener('click',e => {
            turnOver(card)
        })
    })

}

window.addEventListener('load', init, { once: false });
