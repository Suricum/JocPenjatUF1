window.addEventListener("message", (e) => { //'e' contiene informacion del origen y los datos enviados 

    if (e.data && e.data.src) { //El primero es los datos enviados en el mensaje y el segundo es si los datos recibidos contienen un src o no

        document.getElementById("imatge-penjat").src = e.data.src; 

    } 

})