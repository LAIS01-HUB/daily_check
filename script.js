const API = "http://localhost:3000"

// ================= HOME =================
async function carregarTarefas() {
  const container = document.getElementById("cards")
  if (!container) return

  try {
    const res = await fetch(API + "/tarefa/listar")

    if (!res.ok) {
      throw new Error("Erro ao buscar tarefas")
    }

    const tarefas = await res.json()

    container.innerHTML = ""

    tarefas.forEach(t => {
      container.innerHTML += `
        <div class="card">
          <div class="card-content">
            <h3>${t.nome}</h3>
            <p>${t.descricao || ''}</p>
          </div>
        </div>
      `
    })

  } catch (err) {
    console.error("Erro ao carregar tarefas:", err)
  }
}

carregarTarefas()

// ================= MODAL =================
function abrirModal() {
  const modal = document.getElementById("modal")
  if (modal) modal.style.display = "flex"
}

// ================= SALVAR =================
async function salvarTarefa() {
  try {
    const nome = document.getElementById("nome").value
    const imagem = document.getElementById("imagem").value
    const dataInicio = document.getElementById("inicio").value
    const dataFim = document.getElementById("fim").value
    const descricao = document.getElementById("descricao").value

    // VALIDAÇÃO
    if (!nome || !dataInicio || !dataFim) {
      alert("Preencha nome, data início e data fim!")
      return
    }

    const data = {
      nome,
      imagem,
      dataInicio,
      dataFim,
      descricao
    }

    console.log("ENVIANDO:", data)

    const res = await fetch(API + "/tarefa/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const erro = await res.text()
      console.error("Erro backend:", erro)
      alert("Erro ao salvar tarefa")
      return
    }

    const result = await res.json()
    console.log("SALVO:", result)

    alert("Tarefa salva com sucesso!")
    window.location.href = "index.html"

  } catch (err) {
    console.error("Erro geral:", err)
    alert("Erro ao salvar")
  }
}

// ================= TEMPERATURA =================
async function buscarClima() {
  const cidade = document.getElementById("cidade").value
  const resultado = document.getElementById("resultado")

  const key = "895184db34ae3b44a20cc199f23e6fbc"

  if (!cidade) {
    resultado.innerText = "Digite uma cidade!"
    return
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`

    console.log("URL:", url)

    const res = await fetch(url)
    const data = await res.json()

    console.log("CLIMA:", data)

    if (data.cod !== 200) {
      resultado.innerText = "Cidade não encontrada!"
      return
    }

    resultado.innerText = `
${data.name}
🌡️ ${data.main.temp}°C
☁️ ${data.weather[0].description}
💧 Umidade: ${data.main.humidity}%
    `

  } catch (err) {
    console.error("Erro clima:", err)
    resultado.innerText = "Erro ao buscar clima"
  }
}