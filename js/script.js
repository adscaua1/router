let registros = JSON.parse(localStorage.getItem("equipeRouter")) || [];

document.getElementById("data").valueAsDate = new Date();

let editandoIndex = null;

function salvarDados() {
  localStorage.setItem("equipeRouter", JSON.stringify(registros));
}

function adicionarRegistro() {

  const data = document.getElementById("data").value;
  const pecas = Number(document.getElementById("pecas").value);
  const os = Number(document.getElementById("os").value);

  if (data === "" || pecas <= 0 || os <= 0) {
    alert("Preencha todos os campos!");
    return;
  }

  // EDITAR
  if (editandoIndex !== null) {

    registros[editandoIndex] = {
      data,
      pecas,
      os
    };

    editandoIndex = null;

    document.querySelector("button").innerText = "Salvar Registro";

  } else {

    // NOVO REGISTRO
    registros.push({
      data,
      pecas,
      os
    });

  }

  salvarDados();

  limparCampos();

  renderizar(registros);
}

function renderizar(lista) {

  const historico = document.getElementById("historico");

  historico.innerHTML = "";

  let totalPecas = 0;
  let totalOS = 0;

  lista.sort((a, b) => new Date(b.data) - new Date(a.data));

  lista.forEach((item, index) => {

    totalPecas += item.pecas;
    totalOS += item.os;

    historico.innerHTML += `
    
      <div class="item">

        <h3>${formatarData(item.data)}</h3>

        <p>📦 Peças entregues: <strong>${item.pecas}</strong></p>

        <p>📝 OS preenchidas: <strong>${item.os}</strong></p>

        <div class="acoes">

          <button class="editar"
            onclick="editarRegistro(${index})">
            Editar
          </button>

          <button class="deletar"
            onclick="deletarRegistro(${index})">
            Excluir
          </button>

        </div>

      </div>
    `;
  });

  document.getElementById("totalPecas").innerText = totalPecas;
  document.getElementById("totalOS").innerText = totalOS;
}

function editarRegistro(index) {

  const item = registros[index];

  document.getElementById("data").value = item.data;
  document.getElementById("pecas").value = item.pecas;
  document.getElementById("os").value = item.os;

  editandoIndex = index;

  document.querySelector("button").innerText = "Atualizar Registro";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deletarRegistro(index) {

  const confirmar = confirm("Deseja excluir esse registro?");

  if (!confirmar) return;

  registros.splice(index, 1);

  salvarDados();

  renderizar(registros);
}

function limparCampos() {

  document.getElementById("pecas").value = "";
  document.getElementById("os").value = "";

  document.getElementById("data").valueAsDate = new Date();
}

function filtrar(tipo) {

  if (tipo === "todos") {
    renderizar(registros);
    return;
  }

  const hoje = new Date();

  let filtrados = registros.filter(item => {

    const dataItem = new Date(item.data);

    const diferenca =
      (hoje - dataItem) / (1000 * 60 * 60 * 24);

    if (tipo === "hoje") {
      return diferenca < 1;
    }

    return diferenca <= tipo;
  });

  renderizar(filtrados);
}

function formatarData(data) {

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

renderizar(registros);