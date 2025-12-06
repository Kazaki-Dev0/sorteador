// ---- imports firebase (se usar firebase) ----
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit } 
  from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// ---- coloque sua config do firebase aqui ----
const firebaseConfig = {
  apiKey: "COLOQUE_SUA_APIKEY",
  authDomain: "SEU_AUTHDOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sorteioRef = collection(db, "sorteados");

// ---- lista exemplo (adeque se precisar) ----
let nomes = ["Ana", "Carlos", "Felipe", "Kaique", "Marina"];

// ---- função sortear ----
async function sortear(){
  // teste rápido (descomente se só quiser testar)
  // alert("sortear() rodando!");

  // exemplo simples de sorteio sem firebase (se quiser testar sem DB)
  // let escolhido = nomes[Math.floor(Math.random()*nomes.length)];
  // document.getElementById("resultado").innerHTML = `Você tirou: <b>${escolhido}</b>`;

  // versão com Firestore (assume regras liberadas)
  const docs = await getDocs(sorteioRef);
  const usados = docs.docs.map(d => d.data().nome);
  const restantes = nomes.filter(n => !usados.includes(n));
  if(restantes.length === 0){
    document.getElementById("resultado").textContent = "Todos já foram sorteados 🎉";
    return;
  }
  const escolhido = restantes[Math.floor(Math.random()*restantes.length)];
  await addDoc(sorteioRef, { nome: escolhido, ts: Date.now() });
  document.getElementById("resultado").innerHTML = `Você tirou: <b>${escolhido}</b> 🍫`;
  atualizarLista();
}
window.sortear = sortear; // <-- EXPÕE a função para o onclick do HTML

// ---- função desfazer ----
async function desfazer(){
  const q = query(sorteioRef, orderBy("ts", "desc"), limit(1));
  const snap = await getDocs(q);
  if(snap.empty) { alert("Nada para desfazer"); return; }
  const ultimo = snap.docs[0];
  await deleteDoc(doc(db, "sorteados", ultimo.id));
  alert(`Sorteio desfeito: ${ultimo.data().nome}`);
  atualizarLista();
}
window.desfazer = desfazer; // <-- EXPÕE também

// ---- função para atualizar a lista na tela ----
async function atualizarLista(){
  const listaEl = document.getElementById("lista") || document.getElementById("lista-sorteados");
  if(!listaEl) return;
  const snap = await getDocs(sorteioRef);
  if(snap.empty){
    listaEl.innerHTML = "<i>Ninguém ainda 😁</i>";
    return;
  }
  const nomesS = snap.docs.map(d => d.data().nome);
  listaEl.innerHTML = nomesS.join("<br>");
}
atualizarLista();