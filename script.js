import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc,
  query, orderBy, limit, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvtL1FsIyvIeIZgGahSH4IgIRasZ4Dm0w",
  authDomain: "amigochocolate-a3508.firebaseapp.com",
  projectId: "amigochocolate-a3508",
  storageBucket: "amigochocolate-a3508.firebasestorage.app",
  messagingSenderId: "145498462878",
  appId: "1:145498462878:web:9b1167e59b4c05f8e7f98f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let participantesBase = [
    "Ana Mendes","Miyashiro","Ana Julia","Carlos","Eduardo",
    "Enzo","Felipe","Kaique","Pedro","Marina","Manu","Julia"
];
let participantes = [...participantesBase];

// 🔄 Atualiza lista na tela
async function carregarSorteados(){
    const snap = await getDocs(collection(db,"sorteados"));
    let nomes = [];
    snap.forEach(d => nomes.push(d.data().nome));

    document.getElementById("lista").innerHTML =
       nomes.length ? nomes.join("<br>") : "<i>Ninguém ainda 😁</i>";

    participantes = participantesBase.filter(n=>!nomes.includes(n));
}

// 🎡 Função sortear
async function sortear(){
    await carregarSorteados();
    if(participantes.length === 0)
        return document.getElementById("resultado").innerHTML="Todos foram sorteados 🎉";

    let index = Math.floor(Math.random()*participantes.length);
    let escolhido = participantes[index];

    let roleta = document.getElementById("roleta");
    let giros = 360*6;
    let final = Math.random()*360;

    roleta.style.transition="6s cubic-bezier(.1,.6,.3,1)";
    roleta.style.transform=`rotate(${giros+final}deg)`;

    setTimeout(async()=>{
        await addDoc(collection(db,"sorteados"),{nome:escolhido});
        document.getElementById("resultado").innerHTML=`Você tirou: <b>${escolhido}</b> 🍫`;
        carregarSorteados();
    },6000);
}

// ↩ Desfazer último sorteio
async function desfazer(){
    const q = query(collection(db,"sorteados"), orderBy("__name__", "desc"), limit(1));
    const snap = await getDocs(q);
    if(snap.empty) return alert("Nenhum sorteio para desfazer!");

    let ultimo = snap.docs[0];
    await deleteDoc(doc(db,"sorteados",ultimo.id));

    alert(`Sorteio desfeito: ${ultimo.data().nome}`);

    carregarSorteados();
    document.getElementById("resultado").innerHTML="Sorteio cancelado! Pode rodar de novo 🎡";
}

carregarSorteados();

// 🔥 BOTÕES FUNCIONANDO (isso resolve seu erro)
document.getElementById("btn-sortear").addEventListener("click", sortear);
document.getElementById("btn-desfazer").addEventListener("click", desfazer);

async function resetarTudo(){
    const snap = await getDocs(collection(db,"sorteados"));
    snap.forEach(async d => await deleteDoc(doc(db,"sorteados", d.id)));

    alert("🔥 Todos os resultados foram apagados!");
    carregarSorteados();
}
window.resetarTudo = resetarTudo;