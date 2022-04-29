(( /* App */ ) => {

    const board = document.querySelector('#board');
    const jet = document.querySelector('#jet');
    const pointsBox = document.querySelector('.points-box');
    const gameOver = document.querySelector('#gameOver');
    const mainHelp = document.querySelector('.main-help')
    const shot = document.querySelector('#shot');
    const explosion = document.querySelector('#explosion')
    const rocks = document.getElementsByClassName('rocks');

    let widthBord = board.offsetWidth;

    window.addEventListener('keydown', (e) => {
        let tecla = e.code;

        let left = parseInt(window.getComputedStyle(jet).getPropertyValue('left'));

        if (tecla === 'ArrowLeft' && left > 0)
            jet.style.left = left - 10 + 'px';
        if (tecla === 'ArrowRight' && left <= widthBord - 40)
            jet.style.left = left + 10 + 'px';
        if (tecla === 'ArrowUp' || tecla === 'Space') {
            let bullet = document.createElement('div');
            bullet.classList.add('bullets');
            board.appendChild(bullet);
            shot.play();
            shot.currentIime = 0;

            const movebullet = setInterval(() => {
                for (let i = 0; i < rocks.length; i++) {
                    let rock = rocks[i];
                    if (rock !== 'undefined') {
                        let rockbound = rock.getBoundingClientRect();
                        let bulletbound = bullet.getBoundingClientRect();
                        if (
                            bulletbound.left >= rockbound.left &&
                            bulletbound.right <= rockbound.right &&
                            bulletbound.top <= rockbound.top &&
                            bulletbound.bottom <= rockbound.bottom
                        ) {
                            rock.parentElement.removeChild(rock);
                            pointsBox.textContent =
                                parseInt(pointsBox.textContent) + 1;
                            explosion.play();
                            explosion.currentIime = 0;
                        }
                    }
                }
                let bulletbottom = parseInt(
                    window.getComputedStyle(bullet).getPropertyValue('bottom')
                );
                if (bulletbottom >= 500) clearInterval(movebullet);

                bullet.style.left = left + 'px';
                bullet.style.bottom = bulletbottom + 3 + 'px';
            });
        }
    });

    const generaterocks = setInterval(() => {
        if (widthBord !== board.offsetWidth) widthBord = board.offsetWidth;

        let rock = document.createElement('div');
        rock.classList.add('rocks');
        rock.style.left = Math.floor(Math.random() * (widthBord - 50)) + 'px';

        board.appendChild(rock);
    }, 1000);

    const moverocks = setInterval(() => {

        if (rocks != undefined) {
            for (let i = 0; i < rocks.length; i++) {
                let rock = rocks[i];
                let rocktop = parseInt(
                    window.getComputedStyle(rock).getPropertyValue('top')
                );
                if (rocktop >= 475) {
                    clearInterval(moverocks);
                    clearInterval(generaterocks);
                    gameOver.style.display = 'block'
                    return
                }

                rock.style.top = rocktop + 25 + 'px';
            }
        }
    }, 450);

    document.onclick = restartGame;

    function restartGame(e) {
        if (e.target.id === 'help') mainHelp.style.display = 'flex';
        if (e.target.id === 'close') mainHelp.style.display = 'none';
        if (e.target.id === 'restart') return window.location.reload();
    }

})();