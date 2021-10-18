//url para carrito https://virmorrone.github.io/veterinaria-api/carrito-final.json


let productosCarrito = [];
let monedaActual = "UYU";


/*completa la función para actualizar el subtotal del producto al modificar la cantidad del mismo*/
function updateProductoSubtotal(productosCarrito) {
    total = document.getElementById(`total`);
    total.innerHTML = "Total: ";
    let sumaTotal = 0;
    let contador = 0;
    for (let articulo of productosCarrito) {
        sumaTotal += document.getElementById(`boton${contador}`).value * articulo.unitCost;
        document.getElementById(`subtotal${contador}`).innerHTML = articulo.currency + ' $' + (document.getElementById(`boton${contador}`).value * articulo.unitCost);
        contador++;
    }
    total.innerHTML += `${monedaActual} $` + sumaTotal;
}

function transformarMoneda(moneda) {
    contador = 0;

    for (let producto of productosCarrito) {
        if (moneda == "UYU" && producto.currency == "USD") {
            producto.unitCost = producto.unitCost * 40;
            producto.currency = "UYU";
            if(document.getElementById(`boton${contador}`) != null){
                producto.count = document.getElementById(`boton${contador}`).value;
            }
        }
        else if (moneda == "USD" && producto.currency == "UYU") {
            producto.unitCost = producto.unitCost / 40;
            producto.currency = "USD";
            if(document.getElementById(`boton${contador}`) != null){
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
    document.getElementById("cantProductos").innerHTML = `Cantidad de productos: ${productosCarrito.length}`
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

})

function recalcularSubtotal() {
    updateProductoSubtotal(productosCarrito);
}