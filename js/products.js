var productos = [];
var arrayProductosActuales = [];
var minCount = undefined;
var maxCount = undefined;

function ordenarProductos(criterio, arrayProductosActuales){
    let retorno = [];
    switch (criterio) {
        //Se le da al sort el array de productos actuales y se evalua de a dos elementos segun las condiciones que evaluemos debajo
        case "PrecioAc":
            retorno = arrayProductosActuales.sort(function(a, b) {
                let aint = parseInt(a.cost);
                let bint = parseInt(b.cost);
                if ( aint < bint ){ return -1; }
                if ( aint > bint ){ return 1; }
                return 0;
            });
        break;
        case "PrecioDc":
            retorno = arrayProductosActuales.sort(function(a, b) {
                let aint = parseInt(a.cost);
                let bint = parseInt(b.cost);
                if ( aint > bint ){ return -1; }
                if ( aint < bint ){ return 1; }
                return 0;
            });
        break;
        default: //Relevancia
            retorno = arrayProductosActuales.sort(function(a, b) {
                let aint = parseInt(a.soldCount);
                let bint = parseInt(b.soldCount);

                if ( aint > bint ){ return -1; }
                if ( aint < bint ){ return 1; }
                return 0;
            });
        break;
    }
    return retorno;
}

function imprimirProductos(){

    let htmlContentToAppend = "";
    prodCount = 0;
    for(let i = 0; i < arrayProductosActuales.length; i++){
        let producto = arrayProductosActuales[i];

        // Se imprimen todos los productos del array actual menos los que no cumplen con el precio min/max
        if (((minCount == undefined) || (minCount != undefined && parseInt(producto.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(producto.cost) <= maxCount))){

            console.log(prodCount);
            if(prodCount == 0){
                htmlContentToAppend += `<div class="card-deck">`
            }

            htmlContentToAppend += `

            <div class="card" style="width: 18rem;">
                <img src="` + producto.imgSrc + `" class="card-img-top" alt="...">
                <div class="card-body">
                <p class="card-text float-right font-weight-bold text-success">$` + Intl.NumberFormat("de-DE").format(producto.cost) + `</p>
                <h5 class="card-title text-primary font-weight-bolder">`+ producto.name +`</h5>
                <p class="card-text text-secondary">` + producto.description + `</p>
                <p class="card-text float-left"><small class="text-muted">Vendidos: ` + producto.soldCount + `</small></p>
                <a href="product-info.html" class="stretched-link"></a>
                </div>
            </div>
            `

            if(prodCount == 3){
                htmlContentToAppend += `</div><br>`
                prodCount = 0;
            }else{
                prodCount++;
            }
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

/*             <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="card mb-3" style="max-width: 740px;">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                        <img src="` + producto.imgSrc + `" class="card-img" alt="` + producto.description + `">
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                        <p class="card-text float-right"><small class="text-muted">$` + precioFormato(producto.cost) + `</small></p>
                            <h5 class="card-title">`+ producto.name +`</h5>
                            <p class="card-text">` + producto.description + `</p>
                            <p class="card-text float-right"><small class="text-muted">Vendidos: ` + producto.soldCount + `</small></p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </a>

            asi se le pone texto dentro de la imagen:
                            <div class="card-img-overlay">
                    <p class="card-text float-right font-weight-bold">$` + precioFormato(producto.cost) + `</p>
                </div>
*/

function ordenarProductosEImprimir(criterio){
    arrayProductosActuales = productos; //No modifico nunca el array original, asi no tengo que volver a hacer un fetch
    arrayProductosActuales = ordenarProductos(criterio, arrayProductosActuales);    //Filtro los productos y los guardo en el nuevo array
    imprimirProductos();    //Muestro los productos ordenados
}

/*Formato de tres cifras para el precio (Ya no se usa)
function precioFormato(precio){
    return precio.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
*/

//Función que se ejecuta cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", function(e){

    fetch(PRODUCTS_URL)
    .then(respuesta => respuesta.json())
    .then(elemento => {
        productos = elemento;
        //Por defecto se ordenan por Precio ascendente
        ordenarProductosEImprimir("PrecioAc");
    })
    //Cuando se apreta el boton de PrecioAc se manda a ordenas los Productos
    document.getElementById("PrecioAc").addEventListener("click", function(){
        ordenarProductosEImprimir("PrecioAc");
    });

    document.getElementById("PrecioDc").addEventListener("click", function(){
        ordenarProductosEImprimir("PrecioDc");
    });

    document.getElementById("Relevancia").addEventListener("click", function(){
        ordenarProductosEImprimir("Relevancia");
    });
    //Para borrar los campos de rango de precio
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        imprimirProductos();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        //Importante que el valor no sea indefinido, vacio o menor o igual a 0
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        imprimirProductos();
    });
});