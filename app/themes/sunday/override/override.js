document.addEventListener("DOMContentLoaded", () => {
    function scrollTo(element) {

        const styles = element.currentStyle || window.getComputedStyle(element);
        let marginTop = 0;

        if (styles) {
            if (styles.marginTop) {
                marginTop = parseInt(styles.marginTop);
            }
        }

        const distance = document.documentElement.scrollTop + element.getBoundingClientRect().top - marginTop;

        window.scroll({
            behavior: 'smooth',
            left: 0,
            top: distance
        });
    }


    const anchorsBtn = document.querySelectorAll('[href^="#"]');

    anchorsBtn.forEach(anchorBtn => {
        anchorBtn.addEventListener('click', e => {
            e.preventDefault();

            const href = anchorBtn.getAttribute("href");
            const target = document.querySelector(href);

            console.log(target)

            if (target) {
                scrollTo(target);
            }

        }, false);
    });

    /*
    |
    | Set variables
    |----------------
    */
    setVariables();
    window.addEventListener('resize', setVariables, false);

    function setVariables() {
        const header = document.querySelector('#header');
        const aside = document.querySelector('#header > .container > .aside');
        const asideWidth = aside.clientWidth;

        if (aside) {
            header.style.setProperty('--side-width', `${asideWidth}px`);
        }
    }
});