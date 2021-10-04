var comentarios = [];
var arrayComentariosActuales = [];
var score = 1;
var imagen = "";

function imprimirProductosRelacionados(productos, prodRelacionados){

    let htmlContentToAppend = "";
    prodCount = 0;
    for(let i = 0; i < prodRelacionados.length; i++){
            let producto = productos[prodRelacionados[i]];
    
        // Se imprimen todos los productos del array actual menos los que no cumplen con el precio min/max
    
        console.log(prodCount);
        if(prodCount == 0){
            htmlContentToAppend += `<div class="card-deck">`
            console.log("Imprimo card-deck");
        }
    
        htmlContentToAppend += `
    
        <div class="card" style="width: 12rem;">
            <img src="` + producto.imgSrc + `" class="card-img-top" alt="...">
            <div class="card-body">
            <p class="card-text float-right font-weight-bold text-success" style="width: 4rem;">$` + Intl.NumberFormat("de-DE").format(producto.cost) + `</p>
            <h6 class="card-title text-primary font-weight-bolder">`+ producto.name +`</h6>
            <a href="product-info.html" class="stretched-link"></a>
            </div>
        </div>
        `
    
        if(prodCount == 3){
            htmlContentToAppend += `</div><br>`
            prodCount = 0;
            console.log("imprimo div");
        }else{
            prodCount++;
        }
        console.log(prodCount);
    }
    
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}


function imprimirProducto(producto){

    document.getElementById("productTitle").innerHTML = producto.name;
    document.getElementById("cost").innerHTML += Intl.NumberFormat("de-DE").format(producto.cost) + `<span class="font-italic" style="font-size:0.7rem;"> `+ producto.currency +`</span>`;
    document.getElementById("description").innerHTML = producto.description;
    document.getElementById("productInfo").innerHTML = `<a href="categories.html" style="color:#999;">Categoria: ` + producto.category + `</a> <br>` + `Vendidos: ` + producto.soldCount;

    var firstDot = true;
    for(imagen of producto.images){
        document.getElementById("imagenes").innerHTML += `<li><img src="`+ imagen +`"/></li>`;
        if(firstDot){
            document.getElementById("dots").innerHTML += `<li class="active"></li>`;
            firstDot = false;
        }
        else{
            document.getElementById("dots").innerHTML += `<li></li>`;
        }
    }

    productoEsqueleto(); //Imprimir el Producto
    fetch(PRODUCTS_URL) //Fetch para mostrar productos relacionados
    .then(respuesta => respuesta.json())
    .then(elemento => {
        productos = elemento;
        imprimirProductosRelacionados(productos, producto.relatedProducts);
    })
}


function imprimirComentarios(comentarios){
    for(comentario of comentarios){
        obtenerImagenEImprimir(comentario.user, comentario.description, new Date(comentario.dateTime), "⭐".repeat(comentario.score));
    }
}


//Función que se ejecuta cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", function(e){

    fetch(PRODUCT_INFO_URL)
    .then(respuesta => respuesta.json())
    .then(elemento => {
        var producto = elemento;
        //Por defecto se ordenan por Precio ascendente
        imprimirProducto(producto);
    })

    fetch(PRODUCT_INFO_COMMENTS_URL)
    .then(respuesta => respuesta.json())
    .then(elemento => {
        var comentarios = elemento;
        //Por defecto se ordenan por Precio ascendente
        imprimirComentarios(comentarios);
        document.getElementById("reviews").innerHTML = comentarios.length + ` calificaciones` //Se añade la cant de clasificaciones al producto
        //Calcular las estrellas del producto
        var cantEstrellasTotales = 0;
        for(comentario of comentarios){
            cantEstrellasTotales += Number(comentario.score);
        }
        document.getElementById("estrellasProducto").innerHTML = (`<li class="fa fa-fw fa-lg fa-star"></li>`).repeat(Math.floor(cantEstrellasTotales/comentarios.length))
    })

    obtenerImagenPerfil();
});

//Comentarios
function añadirComentarioHtml(nick, texto, fecha, score, imagen){
    document.getElementById("comentarios").innerHTML += `
    <div class="row" style="margin-bottom: 5%; margin-top: 5%; margin-left: 1%;"> 
        <div> 
            <img src="` + imagen + `" width="100px" height="100px" class="rounded-circle">
            <div class="d-flex justify-content-center"> 
            <a href="#" style="margin-top: 1%; font-weight: bold;"> `+ nick +` </a>
            </div>
        </div>
        <div style="margin-left: 5%; margin-top: 4%;">
            <p class="textComent">` + score + `</p>
            <p class="textComent">` + texto + `</p>
            <p class="textComent">` + fecha + `</p> 
        </div>
    </div>
    `
}

function obtenerImagenEImprimir(nick, texto, fecha, score){
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-api-key': '69dd18da-e65d-45e0-bc00-f332f4bab0cb',
        }),
    })
    .then(respuesta2 => respuesta2.json())
    .then(obj => {
        añadirComentarioHtml(nick, texto, fecha, score, obj[0].url);
    })
}

function obtenerImagenPerfil(){
    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-api-key': '69dd18da-e65d-45e0-bc00-f332f4bab0cb',
        }),
    })
    .then(respuesta2 => respuesta2.json())
    .then(obj => {
        imagen = obj[0].url;
    })
}

const url = "https://api.thecatapi.com/v1/images/search"

document.getElementById("enviar").addEventListener("click", function () {
    var texto = document.getElementById("floatingTextarea").value;
    var today = new Date();
    var fecha = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " " + today.getDate() + '-' + (today.getMonth() + 1) + "-" + today.getFullYear();
    var nick = localStorage.getItem("user");
    añadirComentarioHtml(nick, texto, fecha, "⭐".repeat(score), imagen);
});

function conseguirValorEstrella(cant){
    score = cant;
}