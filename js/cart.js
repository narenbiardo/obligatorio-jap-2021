//url para carrito https://virmorrone.github.io/veterinaria-api/carrito-final.json


let productosCarrito = [];
let monedaActual = "UYU";
let porcentajeEnvioActual = 0;


/*completa la función para actualizar el subtotal del producto al modificar la cantidad del mismo*/
function updateProductoSubtotal(productosCarrito) {
    total = document.getElementById(`total`);
    total.innerHTML = "";
    totalFinal = document.getElementById(`totalFinal`);
    totalFinal.innerHTML = "";
    let sumaTotal = 0;
    let contador = 0;
    for (let articulo of productosCarrito) {
        sumaTotal += document.getElementById(`boton${contador}`).value * articulo.unitCost;
        document.getElementById(`subtotal${contador}`).innerHTML = articulo.currency + ' $' + (document.getElementById(`boton${contador}`).value * articulo.unitCost);
        contador++;
    }
    total.innerHTML += `${monedaActual} $` + sumaTotal;
    if (porcentajeEnvioActual > 0) {
        totalFinal.innerHTML += `${monedaActual} $` + Math.round(sumaTotal + ((sumaTotal * porcentajeEnvioActual) / 100));
    } else {
        totalFinal.innerHTML = "";
    }
}

function transformarMoneda(moneda) {
    contador = 0;

    for (let producto of productosCarrito) {
        if (moneda == "UYU" && producto.currency == "USD") {
            producto.unitCost = producto.unitCost * 40;
            producto.currency = "UYU";
            if (document.getElementById(`boton${contador}`) != null) {
                producto.count = document.getElementById(`boton${contador}`).value;
            }
        }
        else if (moneda == "USD" && producto.currency == "UYU") {
            producto.unitCost = producto.unitCost / 40;
            producto.currency = "USD";
            if (document.getElementById(`boton${contador}`) != null) {
                producto.count = document.getElementById(`boton${contador}`).value;
            }
        }
        contador++;
    }
    monedaActual = moneda;
    showCarrito();
    updateProductoSubtotal(productosCarrito);
}


/*modificar la función showCarrito para que aparezca el subtotal del producto en base a la cantidad y precio unitario*/
function showCarrito() {

    /*mostrar los productos del carrito con el input correspondiente a la cantidad*/
    let htmlToAppend = "";
    let contador = 0;
    for (let article of productosCarrito) {

        htmlToAppend += `
        <tr>
        <td><img src="${article.src}" class = "img-fluid" style ="max-width:50px!important"></td>
        <td class="align-middle">${article.name}</td>
        <td class="align-middle">${article.currency} $${article.unitCost}</td>
        <td class="align-middle"><input type="number" min ="1" value=${article.count} id="boton${contador}" onchange="recalcularSubtotal()"></td>
        <td class="align-middle" id="subtotal${contador}">${article.currency} ${article.unitCost * article.count}</td>
        </tr>`

        contador++;



    }
    document.getElementById("carrito").innerHTML = htmlToAppend;


}



function getCarrito(url) {

    return fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })

}

document.addEventListener("DOMContentLoaded", function (e) {
    getCarrito(LINK_CARRITO_DOS_PRODUCTOS)
        .then(respuesta => {
            productosCarrito = respuesta.articles;
            transformarMoneda(monedaActual);
        })

    if (document.getElementById("pago1").checked == true) { //Esconder las areas del campo no seleccionado por defecto
        esconderCampos(1);
    } else {
        esconderCampos(2);
    }
})

function recalcularSubtotal() {
    updateProductoSubtotal(productosCarrito);
}

function esconderCampos(num) {  //Esconder las areas del campo no seleccionado al seleccionar otro tipo de pago
    if (num == 1) {
        document.getElementById("numcuenta").disabled = true;
        document.getElementById("numTarjetaCredito").disabled = false;
        document.getElementById("cvc").disabled = false;
        document.getElementById("fechaCaducidad").disabled = false;
    } else {
        document.getElementById("numcuenta").disabled = false;
        document.getElementById("numTarjetaCredito").disabled = true;
        document.getElementById("cvc").disabled = true;
        document.getElementById("fechaCaducidad").disabled = true;
    }
}

function porcentajeEnvio(pEnvio) {

    porcentajeEnvioActual = pEnvio;
    document.getElementById('pEnvio').innerHTML = pEnvio + '%';
    updateProductoSubtotal(productosCarrito);
}

function validar() {
    if (document.getElementById("inputDireccion").value == "") {
        document.getElementById("labelDireccion").innerHTML += '<p style="color: #DB3544;">Debes ingresar una dirección de envío</p>';
        document.getElementById("inputDireccion").style = 'border-color: #DB3544';
    } else if (document.getElementById("inputPais").value == "") {
        document.getElementById("labelPais").innerHTML += '<p style="color: #DB3544;">Debes ingresar un país</p>';
        document.getElementById("inputPais").style = 'border-color: #DB3544';
    } else if (!document.getElementById("envio1").checked && !document.getElementById("envio2").checked && !document.getElementById("envio3").checked) {
        document.getElementById("labelTipoEnvio").innerHTML += '<p style="color: #DB3544;">Debes ingresar un tipo de envío</p>';
    } else if (document.getElementById("numTarjetaCredito").value == "" || document.getElementById("cvc").value == "" || document.getElementById("fechaCaducidad").value == "") {
        document.getElementById("labelFormaPago").innerHTML += '<p style="color: #DB3544;">Debes ingresar una forma de pago</p>';
    } else {
        $("#modalAgradecimiento").modal({backdrop: 'static', keyboard: false}); //backdrop y keyboard false permiten que no se pueda sacar el modal de ninguna manera
        sleepbeforeRedirectInicio();
    }

}

function sleepbeforeRedirectInicio() { //Esperar 3 segundos y redireccionar al inicio
    setTimeout(function () {
        location.href = 'inicio.html';;
    }, 3000);
}