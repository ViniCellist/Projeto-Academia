// Timer 1:30
    let tempo = 60;
    let intervalo = null;

    function atualizarTimer() {
      const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
      const segundos = String(tempo % 60).padStart(2, '0');
      document.getElementById("timer").textContent = `${minutos}:${segundos}`;

      if (tempo > 0) {
        tempo--;
      } else {
        clearInterval(intervalo);
        intervalo = null;
      }
    }

    function resetTimer() {
      tempo = 60;
      atualizarTimer();
    }

    function toggleTimer() {
      if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
      } else {
        intervalo = setInterval(atualizarTimer, 1000);
      }
    }

    atualizarTimer();

    // Verificar conclusão
    function verificarConclusao(checkbox) {
      const card = checkbox.closest(".card");
      const checkboxes = card.querySelectorAll(".series-list input[type='checkbox']");
      const concluidoLabel = card.querySelector(".concluido-label");

      const todosMarcados = [...checkboxes].every(cb => cb.checked);

      if (todosMarcados && checkboxes.length > 0) {
        concluidoLabel.style.display = "inline";
        card.classList.add("completed");
      } else {
        concluidoLabel.style.display = "none";
        card.classList.remove("completed");
      }
    }

    // Alternar variação de exercícios
    function alternarVariação(dia) {
      const padrao = document.getElementById(`${dia}-padrao`);
      const variacao = document.getElementById(`${dia}-variacao`);

      const estaMostrandoPadrao = padrao.style.display !== 'none';

      padrao.style.display = estaMostrandoPadrao ? 'none' : 'block';
      variacao.style.display = estaMostrandoPadrao ? 'block' : 'none';
    }

    // Mostrar dia selecionado
    function mostrarDiaSelecionado() {
      const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
      const titulos = {
        segunda: 'Treino de Costas e Bíceps',
        terca: 'Quadríceps',
        quarta: 'Peito e Tríceps',
        quinta: 'Posterior',
        sexta: 'Ombro e Antebraço'
      };

      const selecao = document.getElementById('select-dia').value;

      dias.forEach(dia => {
        const blocoPadrao = document.getElementById(`${dia}-padrao`);
        const blocoVariacao = document.getElementById(`${dia}-variacao`);
        if (blocoPadrao) blocoPadrao.style.display = 'none';
        if (blocoVariacao) blocoVariacao.style.display = 'none';
      });

      const blocoSelecionado = document.getElementById(`${selecao}-padrao`);
      const titulo = document.getElementById('titulo-dia');
      const botoes = document.querySelector('#botoes-variante');

      if (blocoSelecionado) {
        blocoSelecionado.style.display = 'block';
        titulo.textContent = titulos[selecao] || '';
        botoes.innerHTML = `<button onclick="alternarVariação('${selecao}')">Trocar variação</button>`;
      }
    }