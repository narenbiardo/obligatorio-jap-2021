var comentarios = [];
var arrayComentariosActuales = [];
var score = 1;
var tieneImagen = false;
var imagen = "";


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

    productoEsqueleto();
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
    })
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
            <p>` + score + `</p>
            <p>` + texto + `</p>
            <p>` + fecha + `</p> 
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
        if(!tieneImagen){
            imagen = obj[0].url;
            tieneImagen = true;
        }
        añadirComentarioHtml(nick, texto, fecha, score, obj[0].url);
    })
}

const url = "https://api.thecatapi.com/v1/images/search"

document.getElementById("enviar").addEventListener("click", function () {
    var texto = document.getElementById("floatingTextarea").value;
    var today = new Date();
    var fecha = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " " + today.getDate() + '-' + (today.getMonth() + 1) + "-" + today.getFullYear();
    var nick = localStorage.getItem("user");
    if(!tieneImagen){
        obtenerImagenEImprimir(nick, texto, fecha, "⭐".repeat(score));
    }else{
        añadirComentarioHtml(nick, texto, fecha, "⭐".repeat(score), imagen);
    }
});

function conseguirValorEstrella(cant){
    score = cant;
}