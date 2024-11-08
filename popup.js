window.addEventListener("message", (e) => { 

    if (e.data && e.data.src) { 

        document.getElementById("imatge-penjat").src = e.data.src; 

    } 

})