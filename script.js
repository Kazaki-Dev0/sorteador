// ======================= FIREBASE IMPORTS ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// ======================= FIREBASE CONFIG ==========================
const firebaseConfig = {
    apiKey: "SEU_API_KEY_AQUI",
    authDomain: "SEU_AUTHDOMAIN.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEUBUCKET.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sorteioRef = collection(db, "sorteados");

// ======================== LISTA DE NOMES ==========================
let nomes = ["Kaique", "Maria", "João", "Ana", "Lucas", "Pedro", "Julia"];

// ======================== MOSTRAR SORTEADOS ======================
async function mostrarSorteados(){
    const area = document.getElementById("lista-sorteados");
    area.innerHTML = "";

    const dados = await getDocs(sorteioRef);

    if(dados.empty){
        area.innerHTML = "<p>Ninguém ainda 😅</p>";
        return;
    }

    dados.forEach(pessoa => {
        let div = document.createElement("p");
        div.textContent = pessoa.data().nome;
        area.appendChild(div);
    });
}

mostrarSorteados();

// ======================== FUNÇÃO SORTEAR ==========================
async function sortear(){

    const jaSorteados = await getDocs(sorteioRef);
    let usados = jaSorteados.docs.map(doc => doc.data().nome);

    let restantes = nomes.filter(n => !usados.includes(n));

    if(restantes.length === 0){
        alert("Todos já foram sorteados! 🎉");
        return;
    }

    let escolhido = restantes[Math.floor(Math.random() * restantes.length)];

    await addDoc(sorteioRef, {nome: escolhido});

    document.getElementById("resultado").textContent = "Você tirou: " + escolhido + " 🎁";
    mostrarSorteados();
}

// ======================== DESFAZER ÚLTIMO ==========================
async function desfazer(){
    const docsSalvos = await getDocs(sorteioRef);

    if(docsSalvos.empty){
        alert("Não há nada para desfazer 😁");
        return;
    }

    let ultimo = docsSalvos.docs[docsSalvos.docs.length - 1];
    await deleteDoc(doc(db, "sorteados", ultimo.id));

    mostrarSorteados();
}
// Função apenas para teste inicial
export function sortear() {
    alert("🎉 Função SORTear() está ativa e funcionando!");
}

export function desfazer() {
    alert("↩ DESFAZER também está funcionando!");
}