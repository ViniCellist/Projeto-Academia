const dias = {
        1: "Segunda-feira: Costa e Bíceps",
        2: "Terça-feira: Quadríceps",
        3: "Quarta-feira: Peito e Tríceps",
        4: "Quinta-feira: Posterior",
        5: "Sexta-feira: Ombro e Antebraço"
    };

    const hoje = new Date().getDay();
    const titulo = document.getElementById("dia-titulo");
    titulo.textContent = dias[hoje] || "Dia de descanso!";

    const container = document.getElementById("exercicios");
    const storageKey = `exercicios-dia-${hoje}`;

    function salvarNoStorage() {
        const dados = [];
        container.querySelectorAll(".card").forEach(card => {
        const nome = card.querySelector("input[type='text']").value;
        const series = card.querySelector("input[type='number']").value;
        const checks = [...card.querySelectorAll(".series-list input[type='checkbox']")].map(c => c.checked);
        const imagemPreview = card.querySelector(".imagem-preview");
        const imagemBase64 = imagemPreview && imagemPreview.src.startsWith("data:image") ? imagemPreview.src : null;
        dados.push({ nome, series, checks, imagem: imagemBase64 });
        });
        localStorage.setItem(storageKey, JSON.stringify(dados));
    }

    function carregarDoStorage() {
        const dados = JSON.parse(localStorage.getItem(storageKey)) || [];
        dados.forEach(dado => {
        adicionarExercicio(dado);
        });
    }

    function adicionarExercicio(dados = null) {
        const card = document.createElement("div");
        card.className = "card";

        const nome = document.createElement("input");
        nome.type = "text";
        nome.placeholder = "Nome do exercício";
        nome.value = dados?.nome || "";
        nome.oninput = salvarNoStorage;

        const concluido = document.createElement("span");
        concluido.className = "concluido-label";
        concluido.style.display = "none";
        concluido.textContent = " - Exercício concluído!";

        const imagemPreview = document.createElement("img");
        imagemPreview.className = "imagem-preview";
        imagemPreview.style.display = dados?.imagem ? "block" : "none";
        if (dados?.imagem) imagemPreview.src = dados.imagem;

        const imagem = document.createElement("input");
        imagem.type = "file";
        imagem.accept = "image/*";
        if (dados?.imagem) imagem.style.display = "none";
        imagem.onchange = () => {
            const file = imagem.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                imagemPreview.src = e.target.result;
                imagemPreview.style.display = "block";
                imagem.style.display = "none";
                salvarNoStorage();
                };
                reader.readAsDataURL(file);
            }
        };

        const series = document.createElement("input");
        series.type = "number";
        series.placeholder = "Quantidade de séries";
        series.value = dados?.series || "";

        const listaSeries = document.createElement("div");
        listaSeries.className = "series-list";

        function verificarConclusao() {
            const checkboxes = listaSeries.querySelectorAll("input[type='checkbox']");
            const todosMarcados = [...checkboxes].every(cb => cb.checked);
            if (todosMarcados && checkboxes.length > 0) {
                concluido.style.display = "inline";
                card.classList.add("completed");
            } else {
                concluido.style.display = "none";
                card.classList.remove("completed");
            }
        }

        series.onchange = function () {
            listaSeries.innerHTML = "";
            for (let i = 1; i <= this.value; i++) {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = dados?.checks?.[i - 1] || false;
                checkbox.onchange = () => {
                    verificarConclusao();
                    salvarNoStorage();
                };
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` Série ${i}`));
                listaSeries.appendChild(label);
            }
            verificarConclusao();
            salvarNoStorage();
        };

        if (dados?.series) series.onchange();

        const remover = document.createElement("button");
        remover.textContent = "Remover";
        remover.className = "remove-btn";
        remover.onclick = () => {
            card.remove();
            salvarNoStorage();
        };

        card.appendChild(nome);
        card.appendChild(concluido);
        card.appendChild(imagemPreview);
        card.appendChild(imagem);
        card.appendChild(series);
        card.appendChild(listaSeries);
        card.appendChild(remover);

        container.appendChild(card);
        if (dados?.series && !listaSeries.children.length) series.onchange();
    }

    carregarDoStorage();

    // Timer 1:30
    let tempo = 90;
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
        tempo = 90;
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