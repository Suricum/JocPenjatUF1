let paraulaSecreta = "";
let lletresEndevinades = [];
let vides = 6
let horaInici
let intervalCrono
let estadistiques = []
let popupVentana
let modeDesament = "localStorage"
let lletresIncorrectes = [];

function obtenirParaulaAleatoria() {

    return PARAULES[Math.floor(Math.random() * PARAULES.length)].toUpperCase()

}

function iniciarPartida() {

    paraulaSecreta = obtenirParaulaAleatoria();
    lletresEndevinades = [];
    horaInici = Date.now();
    intervalCrono = setInterval(actualitzarCrono, 1000);

    document.getElementById("menu").style.display = "none"
    document.getElementById("joc").style.display = "block"
    mostrarParaula();

    abrirPopup();
    enviarImatge(`penjat${6-vides}.png`);

}

function abrirPopup() {

    if (!popupVentana || popupVentana.closed) {

        popupVentana = window.open("penjatImatge.html", "", "width=100,height=200")

    }

}

function enviarImatge(imatge) {

    if (popupVentana || !popupVentana.closed) {

        popupVentana.postMessage({ src: imatge }, "*")

    }

}

function actualitzarCrono() {

    let tempsPassat = Math.floor((Date.now() - horaInici) / 1000)
    const minuts = String(Math.floor(tempsPassat / 60)).padStart(2, "0")
    const segons = String(tempsPassat % 60).padStart(2, "0")
    document.getElementById("temps-passat").textContent = `${minuts}:${segons}`

}

function mostrarParaula() {

    let mostrar = paraulaSecreta.split('')
    .map(lletra => lletresEndevinades.includes(lletra) ? lletra : "_")
    .join(' ')
    document.getElementById("mostrar-paraula").textContent = mostrar

}

function comprovarLletra() {

    let entrada = document.getElementById("entrada-lletra").value.toUpperCase()
    document.getElementById("entrada-lletra").value = '';

    if (entrada && !lletresEndevinades.includes(entrada)) {

        lletresEndevinades.push(entrada)

        if (paraulaSecreta.includes(entrada)) {

            mostrarParaula();
            if (paraulaSecreta.split('').every(lletra => lletresEndevinades.includes(lletra))) {
                acabarPartida(true);
            }

        } else {
            lletresIncorrectes.push(entrada);
            actualitzarLletresIncorrectes();
            vides--;
            actualitzarImatgePenjat();
            if (vides === 0) {
                acabarPartida(false);
            }

        }
        
    }

}

function actualitzarImatgePenjat() {

    let imatge = `penjat${6-vides}.png`
    enviarImatge(imatge);

}

function acabarPartida(guanyat) {

    clearInterval(intervalCrono);
    let tempsPassat = document.getElementById("temps-passat").textContent
    let data = new Date().toLocaleString();
    estadistiques.unshift({ guanyat, tempsPassat, data })
    guardarEstadistiques();

    if (popupVentana && !popupVentana.closed) {
        popupVentana.close()
    }
    alert(guanyat ? "Has guanyat!" : `Has perdut! La paraula era ${paraulaSecreta}.`)
    reiniciarPartida();
    
}

function reiniciarPartida() {

    document.getElementById("menu").style.display = "block";
    document.getElementById("joc").style.display = "none";

}

function mostrarEstadistiques() {

    document.getElementById("menu").style.display = "none"
    document.getElementById("estadistiques").style.display = "block"
    carregarEstadistiques();

    let llistaEstadistiques = document.getElementById("llista-estadistiques")
    llistaEstadistiques.innerHTML = estadistiques.map(estat => 
        `<div>${estat.data} - ${estat.guanyat ? 'Guanyat' : 'Perdut'} - Temps: ${estat.tempsPassat}</div>`
    ).join('')

}

function tornarAlMenu() {

    document.getElementById("estadistiques").style.display = "none"
    document.getElementById("menu").style.display = "block"

}

function guardarEstadistiques() {

    if (modeDesament === "localStorage") {
        localStorage.setItem("estadistiques", JSON.stringify(estadistiques))
    } else {
        document.cookie = `estadistiques=${JSON.stringify(estadistiques)}; path=/`
    }

}

function carregarEstadistiques() {

    if (modeDesament === "localStorage") {

        let estadGuardades = localStorage.getItem("estadistiques")
        estadistiques = estadGuardades ? JSON.parse(estadGuardades) : [];

    } else {

        let galetaEstad = document.cookie.split("; ").find(row => row.startsWith("estadistiques="))
        if (galetaEstad) {
            estadistiques = JSON.parse(galetaEstad.split("=")[1])
        } else {
            estadistiques = [];
        }

    }
    
}

function actualitzarLletresIncorrectes() {

    document.getElementById("lletres-incorrectes").textContent = `Lletres incorrectes: ${lletresIncorrectes.join(', ')}`

}
