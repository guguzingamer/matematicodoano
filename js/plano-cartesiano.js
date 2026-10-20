export function init() {
    // AI generated warning!

    const canvas = document.getElementById('plano');

    const estilos = getComputedStyle(document.documentElement)
    let cores = {
        grade: estilos.getPropertyValue('--cnv-grid').trim(),
        ponto: estilos.getPropertyValue('--cnv-point').trim(),
        eixo: estilos.getPropertyValue('--cnv-axis').trim(),
        texto: estilos.getPropertyValue('--txt-standard').trim()
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
        console.warn('Canvas #plano não encontrado.');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ponto = { x: 2, y: 3 };
    const estado = {
        largura: canvas.width,
        altura: canvas.height,
        escala: 40,
        origem: { x: canvas.width / 2, y: canvas.height / 2 },
        arrastando: false
    };
    const raioPonto = 8;

    canvas.style.display = 'block';
    canvas.style.width = '800px';
    canvas.style.maxWidth = 'calc(100vw - 40px)';
    canvas.style.height = 'auto';

    function atualizarTamanho() {
        const rect = canvas.getBoundingClientRect();
        const largura = Math.max(1, rect.width || canvas.width);
        const altura = Math.max(1, rect.height || canvas.height);
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.round(largura * pixelRatio);
        canvas.height = Math.round(altura * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        estado.largura = largura;
        estado.altura = altura;
        estado.escala = Math.min(largura / 20, altura / 12);
        estado.origem = { x: largura / 2, y: altura / 2 };
    }

    function coordenadaParaTela(x, y) {
        return {
            x: estado.origem.x + x * estado.escala,
            y: estado.origem.y - y * estado.escala
        };
    }

    function telaParaCoordenada(x, y) {
        return {
            x: (x - estado.origem.x) / estado.escala,
            y: (estado.origem.y - y) / estado.escala
        };
    }

    function desenharGrade() {
        ctx.strokeStyle = cores.grade;
        ctx.lineWidth = 1;

        const inicioX = Math.floor(-estado.origem.x / estado.escala);
        const fimX = Math.ceil((estado.largura - estado.origem.x) / estado.escala);
        const inicioY = Math.floor((estado.origem.y - estado.altura) / estado.escala);
        const fimY = Math.ceil(estado.origem.y / estado.escala);

        for (let x = inicioX; x <= fimX; x += 1) {
            const posicao = coordenadaParaTela(x, 0).x;
            ctx.beginPath();
            ctx.moveTo(posicao, 0);
            ctx.lineTo(posicao, estado.altura);
            ctx.stroke();
        }

        for (let y = inicioY; y <= fimY; y += 1) {
            const posicao = coordenadaParaTela(0, y).y;
            ctx.beginPath();
            ctx.moveTo(0, posicao);
            ctx.lineTo(estado.largura, posicao);
            ctx.stroke();
        }
    }

    function desenharEixos() {
        const { x: origemX, y: origemY } = estado.origem;
        ctx.strokeStyle = cores.eixo;
        ctx.fillStyle = cores.eixo;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, origemY);
        ctx.lineTo(estado.largura, origemY);
        ctx.moveTo(origemX, 0);
        ctx.lineTo(origemX, estado.altura);
        ctx.stroke();

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const inicioX = Math.floor(-origemX / estado.escala);
        const fimX = Math.ceil((estado.largura - origemX) / estado.escala);
        for (let x = inicioX; x <= fimX; x += 1) {
            if (x === 0) continue;
            const posicao = coordenadaParaTela(x, 0).x;
            ctx.beginPath();
            ctx.moveTo(posicao, origemY - 4);
            ctx.lineTo(posicao, origemY + 4);
            ctx.stroke();
            ctx.fillText(String(x), posicao, origemY + 7);
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const inicioY = Math.floor((origemY - estado.altura) / estado.escala);
        const fimY = Math.ceil(origemY / estado.escala);
        for (let y = inicioY; y <= fimY; y += 1) {
            if (y === 0) continue;
            const posicao = coordenadaParaTela(0, y).y;
            ctx.beginPath();
            ctx.moveTo(origemX - 4, posicao);
            ctx.lineTo(origemX + 4, posicao);
            ctx.stroke();
            ctx.fillText(String(y), origemX - 8, posicao);
        }

        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('x', estado.largura - 14, origemY - 8);
        ctx.fillText('y', origemX + 8, 14);
    }

    function desenharPonto() {
        const posicao = coordenadaParaTela(ponto.x, ponto.y);
        ctx.fillStyle = cores.ponto;
        ctx.strokeStyle = cores.ponto;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(posicao.x, posicao.y, raioPonto, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = cores.texto;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`P (${ponto.x}, ${ponto.y})`, posicao.x + 12, posicao.y - 10);
    }

    function desenhar() {
        cores = {
            grade: estilos.getPropertyValue('--cnv-grid').trim(),
            ponto: estilos.getPropertyValue('--cnv-point').trim(),
            eixo: estilos.getPropertyValue('--cnv-axis').trim(),
            texto: estilos.getPropertyValue('--txt-standard').trim()
        }

        ctx.clearRect(0, 0, estado.largura, estado.altura);
        desenharGrade();
        desenharEixos();
        desenharPonto();
    }

    function obterPosicao(evento) {
        const rect = canvas.getBoundingClientRect();
        return { x: evento.clientX - rect.left, y: evento.clientY - rect.top };
    }

    function pontoFoiSelecionado(posicao) {
        const pontoNaTela = coordenadaParaTela(ponto.x, ponto.y);
        return Math.hypot(posicao.x - pontoNaTela.x, posicao.y - pontoNaTela.y) <= raioPonto + 8;
    }

    function iniciarArraste(evento) {
        if (!pontoFoiSelecionado(obterPosicao(evento))) return;
        estado.arrastando = true;
        canvas.setPointerCapture?.(evento.pointerId);
        canvas.style.cursor = 'grabbing';
        evento.preventDefault();
    }

    function moverPonto(evento) {
        if (!estado.arrastando) return;
        const posicao = obterPosicao(evento);
        const coordenada = telaParaCoordenada(posicao.x, posicao.y);
        ponto.x = Math.round(coordenada.x);
        ponto.y = Math.round(coordenada.y);
        desenhar();
        evento.preventDefault();
    }

    function finalizarArraste(evento) {
        if (!estado.arrastando) return;
        estado.arrastando = false;
        canvas.releasePointerCapture?.(evento.pointerId);
        canvas.style.cursor = 'grab';
    }


    atualizarTamanho();
    desenhar();
    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', iniciarArraste);
    canvas.addEventListener('pointermove', moverPonto);
    canvas.addEventListener('pointerup', finalizarArraste);
    canvas.addEventListener('pointercancel', finalizarArraste);
    window.addEventListener('resize', () => {
        atualizarTamanho();
        desenhar();
    });
    window.addEventListener("theme-changed", () => {
        desenhar()
    })
}
