// varibles 
const form = document.querySelector("#formulario");
const containerCotizacion = document.querySelector("#resultado");
const selectCriptos = document.querySelector("#criptomonedas");
const selectMoneda = document.querySelector("#moneda");

// Eventos
window.onload = ()=>{
    cargarAPI();
}
form.addEventListener("submit",validarForm);

// Funciones

/* promise para "cargarAPI */
const obtenerCriptos = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

function cargarAPI() {
    const key = "01a18d2159e78ffe6fe6fb8d6db1fba8102918b886a75c70f6cb2563b45364a3";
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key={${key}}`; 
    fetch(url)
        .then(data => data.json())
        .then(result => obtenerCriptos(result.Data))
        .then( criptos => crearOptions(criptos));
}

function crearOptions(objArray) {
    console.log("trajo las criptos de la api");
    objArray.forEach(e => {
        const {FullName, Internal, Id} = e.CoinInfo;
        
        // creo el html
        let opt = document.createElement("option");
        opt.value = Internal;
        opt.dataset.id = Id;
        opt.textContent = FullName;
        // lo agrego a el select
        selectCriptos.appendChild(opt);
    });
} 

function validarForm(e) {
    e.preventDefault();
    if (selectMoneda.value == "" || selectCriptos.value == "") {
        mostrarMensaje("Formulario Incompleto","error");
        return
    }
    traemosDatosCotizacion(selectMoneda.value, selectCriptos.value)
}

function traemosDatosCotizacion(moneda,cripto){
    const key = "01a18d2159e78ffe6fe6fb8d6db1fba8102918b886a75c70f6cb2563b45364a3";
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}&api_key={${key}} `;
    mostrarSpinner();
    setTimeout(() => {
        fetch(url)
        .then(data => data.json() )
        .then(result => {
            mostrarCotizacion(result,moneda,cripto);
        } )
    }, 1000);
}

function mostrarCotizacion(json,moneda,cripto) {
    // Limpio cotizacion previa
    limpiarHTML(containerCotizacion);
    
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = json.DISPLAY[cripto][moneda];

    // CREO HTML    
    const divInfo = document.createElement("DIV"); 
    divInfo.classList.add("max-w-full", "flex", "gap-3", "flex-col", "justify-center");

    const divMaxMin = document.createElement("DIV"); 
    divMaxMin.classList.add("gap-3", "max-w-full","flex","flex-row", "flex-nowrap", "items-center", "justify-evenly");

    const precio = document.createElement("p");
    precio.classList.add("precio","text-center","shadowPrecio");
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;
    
    const precioMax = document.createElement("p");
    precioMax.classList.add("precioM","text-center","shadowPrecio");
    precioMax.innerHTML = `Max 24hs: <span>${HIGHDAY}</span>`;
    
    const precioMin = document.createElement("p");
    precioMin.classList.add("precioM","text-center","shadowPrecio");
    precioMin.innerHTML = `Min 24hs: <span>${LOWDAY}</span>`;

    divInfo.appendChild(precio);
    divMaxMin.appendChild(precioMax);
    divMaxMin.appendChild(precioMin);
    divInfo.appendChild(divMaxMin);
    containerCotizacion.appendChild(divInfo)
}

function mostrarSpinner() {
  limpiarHTML(containerCotizacion);
  
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
    <div class="cube1"></div>
    <div class="cube2"></div>
  `;
  containerCotizacion.appendChild(spinner)
}

function mostrarMensaje(mensaje,tipo) {
    const alertaPrevia = document.querySelector(".alerta");
    alertaPrevia?.remove();
    
    const p = document.createElement("p");
    p.classList.add('alerta','bg-red-100','uppercase','font-bold','px-4','py-4','rounded','max-w-5xl','mx-auto','mt-6','text-center');
    p.innerHTML = mensaje;
    if (tipo == "error") {
        p.classList.add('border-red-500','text-red-600');
    }
    else{
        p.classList.add('border-yellow-500','text-yellow-500');
    }
    form.appendChild(p)
    setTimeout(() => {
        p.remove()
    }, 2000);
}

function limpiarHTML(container) {
    while (container.firstChild) {
        container.firstChild.remove();
    }
}