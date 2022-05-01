(( /* App */ ) => {
    let firstGameStart = true;
    const gameOver = document.querySelector('#gameOver');
    const startGame = document.querySelector('.startGame');

    const mainHelp = document.querySelector('.main-help')
    const level = document.querySelector('.level span');
    const pointsBox = document.querySelector('.points-box');

    const board = document.querySelector('#board');
    let widthBord = board.offsetWidth;
    let heightBord = board.offsetHeight;

    const jet = document.querySelector('#jet');
    const rocks = document.getElementsByClassName('rocks');

    const shot = document.querySelector('#shot');
    const explosion = document.querySelector('#explosion');


    const maxlevel = 8;
    const minDificult = 800;
    let currentIntervalId = null;
    let dificult = 5000;
    let kill = maxlevel;
    let atualLevel = 1;

    function dificultGame() {
        dificult <= minDificult ? dificult = minDificult : dificult -= 500;

        currentIntervalId = setInterval(createRocks, dificult);
    }

    function updateDificult() {
        if (dificult !== minDificult) kill--;
        if (dificult === minDificult) level.innerText = 'Max'
        if (kill === 0) {
            if (currentIntervalId) clearInterval(currentIntervalId);
            dificultGame();
            atualLevel++;
            level.innerText = atualLevel

            kill = maxlevel;
        }
    }

    function createRocks() {
        if (widthBord !== board.offsetWidth) widthBord = board.offsetWidth;
        if (heightBord !== board.offsetHeight) heightBord = board.offsetHeight;

        let rock = document.createElement('div');
        rock.classList.add('rocks');
        rock.style.left = Math.floor(Math.random() * (widthBord - 50)) + 'px';

        board.appendChild(rock);
    }

    function startTheGame() {
        window.addEventListener('keydown', keyboardCapture);

        function keyboardCapture(e) {
            let tecla = e.code;

            let left = parseInt(window.getComputedStyle(jet).getPropertyValue('left'));
            let bullet = document.createElement('div');

            if (tecla === 'ArrowLeft' && left > 0) toLeft();
            if (tecla === 'ArrowRight' && left <= widthBord - 40) toRigth();
            if (tecla === 'ArrowUp' || tecla === 'Space') activeGun();

            function toLeft() {
                jet.style.left = left - 10 + 'px';
            }

            function toRigth() {
                jet.style.left = left + 10 + 'px';
            }

            function activeGun() {
                bullet.classList.add('bullets');
                board.appendChild(bullet);
                shot.play();
                shot.currentIime = 0;

                const movebullet = setInterval(() => {

                    for (let rock of rocks) {
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

                                updateDificult();
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
        };


        const moverocks = setInterval(() => {

            if (rocks != undefined) {
                for (let rock of rocks) {
                    let rocktop = parseInt(
                        window.getComputedStyle(rock).getPropertyValue('top')
                    );
                    if (rocktop >= heightBord - 25) {
                        clearInterval(moverocks);
                        clearInterval(currentIntervalId);
                        window.removeEventListener('keydown', keyboardCapture);
                        gameOver.style.display = 'block'
                        return;
                    }

                    rock.style.top = rocktop + 25 + 'px';
                }
            }
        }, 450);
    }


    document.onclick = restartGame;

    function restartGame(e) {
        if (e.target.id === 'help') mainHelp.style.display = 'flex';
        if (e.target.id === 'close') mainHelp.style.display = 'none';
        if (e.target.id === 'start' || e.target.id === 'restart') {
            if (firstGameStart) {
                firstGameStart = false;
                startGame.style.display = 'none'
            } else {
                dificult = 5000;
                atualLevel = 1;
                pointsBox.textContent = 0;
                [...document.getElementsByClassName("bullets")].map(n => n && n.remove());
                [...document.getElementsByClassName("rocks")].map(n => n && n.remove());
                gameOver.style.display = 'none'
            }
            dificultGame();
            startTheGame();
        }
        if (e.target.id === 'active-gun') {
            window.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'Space'
            }));
        }
        if (e.target.id === 'to-left') {
            window.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'ArrowLeft'
            }));
        }
        if (e.target.id === 'to-rigth') {
            window.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'ArrowRight'
            }));
        }
    }

})();