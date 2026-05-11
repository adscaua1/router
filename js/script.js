// IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// CONFIG FIREBASE
const firebaseConfig = {

  apiKey: "SUA_API_KEY",

  authDomain: "SEU_PROJETO.firebaseapp.com",

  projectId: "SEU_PROJECT_ID",

  storageBucket: "SEU_PROJETO.appspot.com",

  messagingSenderId: "SEU_ID",

  appId: "SEU_APP_ID"

};


// INICIAR FIREBASE
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ELEMENTOS
const historico =
  document.getElementById("historico");

const totalPecas =
  document.getElementById("totalPecas");

const totalOS =
  document.getElementById("totalOS");

const btnSalvar =
  document.getElementById("btnSalvar");


// DATA AUTOMÁTICA
document.getElementById("data").valueAsDate =
  new Date();


// VARIÁVEIS
let editandoId = null;

let registros = [];


// SALVAR
btnSalvar.addEventListener("click", async () => {

  const data =
    document.getElementById("data").value;

  const pecas =
    Number(document.getElementById("pecas").value);

  const os =
    Number(document.getElementById("os").value);

  if (!data || pecas <= 0 || os <= 0) {

    alert("Preencha todos os campos!");

    return;
  }

  // EDITAR
  if (editandoId) {

    await updateDoc(
      doc(db, "registros", editandoId),
      {
        data,
        pecas,
        os
      }
    );

    editandoId = null;

    btnSalvar.innerText =
      "Salvar Registro";

  } else {

    // NOVO
    await addDoc(
      collection(db, "registros"),
      {
        data,
        pecas,
        os
      }
    );

  }

  limparCampos();

});


// TEMPO REAL
onSnapshot(

  collection(db, "registros"),

  (snapshot) => {

    registros = [];

    snapshot.forEach((docItem) => {

      registros.push({

        id: docItem.id,

        ...docItem.data()

      });

    });

    renderizar(registros);

  }

);


// RENDER
function renderizar(lista) {

  historico.innerHTML = "";

  let totalPecas = 0;

  let totalOS = 0;

  lista.sort((a, b) =>
    new Date(b.data) - new Date(a.data)
  );

  lista.forEach((item) => {

    totalPecas += item.pecas;

    totalOS += item.os;

    historico.innerHTML += `

      <div class="item">

        <h3>${formatarData(item.data)}</h3>

        <p>
          📦 Peças:
          <strong>${item.pecas}</strong>
        </p>

        <p>
          📝 OS:
          <strong>${item.os}</strong>
        </p>

        <div class="acoes">

          <button
            class="editar"
            onclick="editarRegistro('${item.id}')"
          >
            Editar
          </button>

          <button
            class="deletar"
            onclick="deletarRegistro('${item.id}')"
          >
            Excluir
          </button>

        </div>

      </div>

    `;
  });

  totalPecas.innerText = totalPecas;

  totalOS.innerText = totalOS;

}


// EDITAR
window.editarRegistro = function (id) {

  const item =
    registros.find(
      reg => reg.id === id
    );

  if (!item) return;

  document.getElementById("data").value =
    item.data;

  document.getElementById("pecas").value =
    item.pecas;

  document.getElementById("os").value =
    item.os;

  editandoId = id;

  btnSalvar.innerText =
    "Atualizar Registro";

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

};


// DELETAR
window.deletarRegistro =
  async function (id) {

    const confirmar =
      confirm("Deseja excluir?");

    if (!confirmar) return;

    await deleteDoc(
      doc(db, "registros", id)
    );

  };


// FILTRAR
window.filtrar = function (tipo) {

  if (tipo === "todos") {

    renderizar(registros);

    return;
  }

  const hoje = new Date();

  const filtrados =
    registros.filter(item => {

      const dataItem =
        new Date(item.data);

      const diferenca =
        (hoje - dataItem)
        / (1000 * 60 * 60 * 24);

      return diferenca <= tipo;

    });

  renderizar(filtrados);

};


// FORMATAR DATA
function formatarData(data) {

  const partes = data.split("-");

  return `
    ${partes[2]}/${partes[1]}/${partes[0]}
  `;
}


// LIMPAR
function limparCampos() {

  document.getElementById("pecas").value =
    "";

  document.getElementById("os").value =
    "";

  document.getElementById("data").valueAsDate =
    new Date();

}