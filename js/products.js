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
    for(let i = 0; i < arrayProductosActuales.length; i++){
        let producto = arrayProductosActuales[i];

        // Se imprimen todos los productos del array actual menos los que no cumplen con el precio min/max
        if (((minCount == undefined) || (minCount != undefined && parseInt(producto.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(producto.cost) <= maxCount))){

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + producto.imgSrc + `" alt="` + producto.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ producto.name +`</h4>
                            <small class="text-muted"> $` + precioFormato(producto.cost) + `</small>
                        </div>
                        <p class="mb-1">` + producto.description + `</p>
                    </div>
                </div>
                <small class="mt-auto float-right"> Vendidos: ` + producto.soldCount + `</small>
            </a>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function ordenarProductosEImprimir(criterio){
    arrayProductosActuales = productos; //No modifico nunca el array original, asi no tengo que volver a hacer un fetch
    arrayProductosActuales = ordenarProductos(criterio, arrayProductosActuales);    //Filtro los productos y los guardo en el nuevo array
    imprimirProductos();    //Muestro los productos ordenados
}

//Formato de tres cifras para el precio
function precioFormato(precio){
    return precio.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

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