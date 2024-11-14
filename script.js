

let paraulaSecreta = "";
let lletresEndevinades = [];
let vides = 6;
let horaInici;
let intervalCrono;
let estadistiques = [];
const modeDesament = "localStorage";

function obtenirParaulaAleatoria() {
    return PARAULES[Math.floor(Math.random() * PARAULES.length)].toUpperCase();
}

function iniciarPartida() {
    paraulaSecreta = obtenirParaulaAleatoria();
    lletresEndevinades = [];
    vides = 6;
    horaInici = Date.now();
    intervalCrono = setInterval(actualitzarCrono, 1000);

    document.getElementById("menu").style.display = "none";
    document.getElementById("joc").style.display = "block";
    mostrarParaula();
    document.getElementById("imatge-penjat").src = `penjat0.png`; 
}

function actualitzarCrono() {
    const tempsPassat = Math.floor((Date.now() - horaInici) / 1000);
    const minuts = String(Math.floor(tempsPassat / 60)).padStart(2, "0");
    const segons = String(tempsPassat % 60).padStart(2, "0");
    document.getElementById("temps-passat").textContent = `${minuts}:${segons}`;
}

function mostrarParaula() {
    const mostrar = paraulaSecreta
        .split('')
        .map(lletra => lletresEndevinades.includes(lletra) ? lletra : "_")
        .join(' ');
    document.getElementById("mostrar-paraula").textContent = mostrar;
}

function comprovarLletra() {
    const entrada = document.getElementById("entrada-lletra").value.toUpperCase();
    document.getElementById("entrada-lletra").value = '';
    if (entrada && !lletresEndevinades.includes(entrada)) {
        lletresEndevinades.push(entrada);
        if (paraulaSecreta.includes(entrada)) {
            mostrarParaula();
            if (paraulaSecreta.split('').every(lletra => lletresEndevinades.includes(lletra))) {
                acabarPartida(true);
            }
        } else {
            vides--;
            actualitzarImatgePenjat();
            if (vides === 0) {
                acabarPartida(false);
            }
        }
    }
}

function actualitzarImatgePenjat() {
    document.getElementById("imatge-penjat").src = `penjat${6 - vides}.png`;
}

function acabarPartida(guanyat) {
    clearInterval(intervalCrono);
    const tempsPassat = document.getElementById("temps-passat").textContent;
    const data = new Date().toLocaleString();
    estadistiques.unshift({ guanyat, tempsPassat, data });
    guardarEstadistiques();
    alert(guanyat ? "Has guanyat!" : `Has perdut! La paraula era ${paraulaSecreta}.`);
    reiniciarPartida();
}

function reiniciarPartida() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("joc").style.display = "none";
}

function mostrarEstadistiques() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("estadistiques").style.display = "block";
    carregarEstadistiques();
    const llistaEstadistiques = document.getElementById("llista-estadistiques");
    llistaEstadistiques.innerHTML = estadistiques.map(estat => 
        `<div>${estat.data} - ${estat.guanyat ? 'Guanyat' : 'Perdut'} - Temps: ${estat.tempsPassat}</div>`
    ).join('');
}

function tornarAlMenu() {
    document.getElementById("estadistiques").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function guardarEstadistiques() {
    if (modeDesament === "localStorage") {
        localStorage.setItem("estadistiques", JSON.stringify(estadistiques));}
}

function carregarEstadistiques() {
    if (modeDesament === "localStorage") {
        const estadGuardades = localStorage.getItem("estadistiques");
        estadistiques = estadGuardades ? JSON.parse(estadGuardades) : [];
    } else {
        const galetaEstad = document.cookie.split("; ").find(row => row.startsWith("estadistiques="));
        if (galetaEstad) {
            estadistiques = JSON.parse(galetaEstad.split("=")[1]);
        } else {
            estadistiques = [];
        }
    }
}
