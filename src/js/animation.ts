
function animatedElementMove(
    element: HTMLElement,
    moveFunction: Function,
    startingTransforms: { [index: string]: string },
    endingClasses: { [index: string]: boolean }
): Promise<HTMLElement> {

    const first = element.getBoundingClientRect()
    moveFunction()
    const last = element.getBoundingClientRect()

    let xInvert = first.x - last.x
    let yInvert = first.y - last.y

    let startingTransformsString = '';

    Object.keys(startingTransforms).forEach(propertyName => {
        if (propertyName === 'translateX') {
            xInvert += Number(startingTransforms[propertyName])
        } else if (propertyName === 'translateY') {
            yInvert += Number(startingTransforms[propertyName])
        } else {
            startingTransformsString += `${propertyName}(${startingTransforms[propertyName]}) `;
        }
    })

    element.style.transition = "none";
    element.style.zIndex = '10'
    element.style.transform = `translateX(${xInvert}px) translateY(${yInvert}px) ${startingTransformsString}`

    requestAnimationFrame(() => {
        element.style.transition = "transform 2s";
        element.style.zIndex = '10'
        element.style.transform = ""

        Object.keys(endingClasses).forEach(className => {
            if (endingClasses[className] === true) {
                element.classList.add(className)
            } else {
                element.classList.remove(className)
            }
        })
    })


    return new Promise(resolve => {
        element.addEventListener('transitionend',
            () => {
                element.style.transform = ''
                element.style.transition = ''
                element.style.zIndex = ''
                resolve(element)
            });
    })

}

export { animatedElementMove }