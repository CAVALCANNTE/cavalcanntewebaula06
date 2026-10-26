document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('space-container');
    const ship = document.getElementById('enterprise-ship');
    const inimigo = document.getElementById('inimigo');
    const disparosEl = document.getElementById('disparos');
    const abatesEl = document.getElementById('abates');
    const recordeEl = document.getElementById('recorde');

    let disparos = 0;
    let abates = 0;
    let recorde = localStorage.getItem('recorde') || 0;
    recordeEl.textContent = recorde;

    // nave segue o mouse na vertical
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        let y = e.clientY - rect.top - 60;
        if (y < 10) y = 10;
        if (y > 260) y = 260;
        ship.style.top = y + 'px';
    });

    // clique dispara dois lasers
    container.addEventListener('mousedown', (e) => {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const shipTop = parseFloat(ship.style.top) || 100;

        criarLaser(380, shipTop + 35, clickX, clickY);
        criarLaser(380, shipTop + 45, clickX, clickY);

        disparos++;
        disparosEl.textContent = disparos;
    });

    function criarLaser(x, y, alvoX, alvoY) {
        const laser = document.createElement('div');
        laser.classList.add('laser');
        laser.style.left = x + 'px';
        laser.style.top = y + 'px';

        const angulo = Math.atan2(alvoY - y, alvoX - x);
        laser.style.transform = `rotate(${angulo}rad)`;
        container.appendChild(laser);

        const velocidade = 15;

        function mover() {
            x += velocidade * Math.cos(angulo);
            y += velocidade * Math.sin(angulo);
            laser.style.left = x + 'px';
            laser.style.top = y + 'px';

            // colisão com o inimigo
            const bateu =
                inimigo.style.display !== 'none' &&
                x > inimigo.offsetLeft && x < inimigo.offsetLeft + inimigo.offsetWidth &&
                y > inimigo.offsetTop && y < inimigo.offsetTop + inimigo.offsetHeight;

            if (bateu) {
                acertou();
                laser.remove();
                return;
            }

            // saiu da tela: remove para não vazar memória
            if (x > container.clientWidth || x < 0 || y > container.clientHeight || y < 0) {
                laser.remove();
            } else {
                requestAnimationFrame(mover);
            }
        }
        requestAnimationFrame(mover);
    }

    function acertou() {
        inimigo.style.display = 'none';
        abates++;
        abatesEl.textContent = abates;

        if (abates > recorde) {
            recorde = abates;
            recordeEl.textContent = recorde;
            localStorage.setItem('recorde', recorde);
        }

        // inimigo volta depois de 1 segundo em outra altura
        setTimeout(() => {
            inimigo.style.top = (40 + Math.random() * 280) + 'px';
            inimigo.style.display = 'block';
        }, 1000);
    }
});
