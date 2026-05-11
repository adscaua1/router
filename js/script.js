// ==========================================
// IMPORTS FIREBASE
// ==========================================

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


// ==========================================
// CONFIG FIREBASE
// COLE SUA CONFIG REAL AQUI
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyChtqZkp03_JDaGGqfmvecruqgn8JimEkU",
  authDomain: "router-5e460.firebaseapp.com",
  projectId: "router-5e460",
  storageBucket: "router-5e460.firebasestorage.app",
  messagingSenderId: "976849939188",
  appId: "1:976849939188:web:84cf901d2a3d5f22460ca1",
  measurementId: "G-Z4MR8KCV3C"
};


// ==========================================
// INICIAR FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==========================================
// ELEMENTOS HTML
// ==========================================

const historico =
  document.getElementById("historico");

const totalPecasElemento =
  document.getElementById("totalPecas");

const totalOSElemento =
  document.getElementById("totalOS");

const btnSalvar =
  document.getElementById("btnSalvar");


// ==========================================
// DATA AUTOMÁTICA
// ==========================================

document.getElementById("data").valueAsDate =
  new Date();


// ==========================================
// VARIÁVEIS
// ==========================================

let editandoId = null;

let registros = [];


// ==========================================
// SALVAR REGISTRO
// ==========================================

btnSalvar.addEventListener("click", async () => {

  const data =
    document.getElementById("data").value;

  const pecas =
    Number(
      document.getElementById("pecas").value
    );

  const os =
    Number(
      document.getElementById("os").value
    );

  // VALIDAÇÃO
  if (!data || pecas <= 0 || os <= 0) {

    alert("Preencha todos os campos!");

    return;
  }

  try {

    // ==========================================
    // EDITAR
    // ==========================================

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

      // ==========================================
      // NOVO REGISTRO
      // ==========================================

      await addDoc(
        collection(db, "registros"),
        {
          data,
          pecas,
          os,
          criadoEm: new Date()
        }
      );

    }

    limparCampos();

  } catch (erro) {

    console.error(erro);

    alert("Erro ao salvar!");

  }

});


// ==========================================
// TEMPO REAL
// ==========================================

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


// ==========================================
// RENDERIZAR HISTÓRICO
// ==========================================

function renderizar(lista) {

  historico.innerHTML = "";

  let somaPecas = 0;

  let somaOS = 0;

  // ORDENAR POR DATA
  lista.sort((a, b) =>
    new Date(b.data) - new Date(a.data)
  );

  lista.forEach((item) => {

    somaPecas += Number(item.pecas);

    somaOS += Number(item.os);

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

  totalPecasElemento.innerText =
    somaPecas;

  totalOSElemento.innerText =
    somaOS;

}


// ==========================================
// EDITAR REGISTRO
// ==========================================

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


// ==========================================
// DELETAR REGISTRO
// ==========================================

window.deletarRegistro =
  async function (id) {

    const confirmar =
      confirm("Deseja excluir?");

    if (!confirmar) return;

    try {

      await deleteDoc(
        doc(db, "registros", id)
      );

    } catch (erro) {

      console.error(erro);

      alert("Erro ao excluir!");

    }

  };


// ==========================================
// FILTROS
// ==========================================

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

      if (tipo === "hoje") {

        return diferenca < 1;

      }

      return diferenca <= tipo;

    });

  renderizar(filtrados);

};


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

  const partes = data.split("-");

  return `
    ${partes[2]}/${partes[1]}/${partes[0]}
  `;
}


// ==========================================
// LIMPAR CAMPOS
// ==========================================

function limparCampos() {

  document.getElementById("pecas").value =
    "";

  document.getElementById("os").value =
    "";

  document.getElementById("data").valueAsDate =
    new Date();

}