var productos = [];
var arrayProductosActuales = [];
var minCount = undefined;
var maxCount = undefined;

function ordenarProductos(criterio, arrayProductosActuales){
    let retorno = [];
    switch (criterio) {
        case "PrecioAc":
            retorno = arrayProductosActuales.sort(function(a, b) {
                if ( a.cost < b.cost ){ return -1; }
                if ( a.cost > b.cost ){ return 1; }
                return 0;
            });
        break;
        case "PrecioDc":
            retorno = arrayProductosActuales.sort(function(a, b) {
                if ( a.cost > b.cost ){ return -1; }
                if ( a.cost < b.cost ){ return 1; }
                return 0;
            });
        break;
        default: //Relevancia
            retorno = arrayProductosActuales.sort(function(a, b) {
                let aCount = parseInt(a.soldCount);
                let bCount = parseInt(b.soldCount);

                if ( aCount > bCount ){ return -1; }
                if ( aCount < bCount ){ return 1; }
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
    arrayProductosActuales = productos;
    arrayProductosActuales = ordenarProductos(criterio, arrayProductosActuales);
    //Muestro los productos ordenados
    imprimirProductos();
}

//Formato de tres cifras para el precio
function precioFormato(precio){
    return precio.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    document.getElementById("userName").innerHTML = localStorage.getItem("email");
    console.log(localStorage.getItem("email"));

    fetch(PRODUCTS_URL)
    .then(respuesta => respuesta.json())
    .then(elemento => {
        productos = elemento;
        console.log(elemento);
        ordenarProductosEImprimir("PrecioAc");
    })

    document.getElementById("PrecioAc").addEventListener("click", function(){
        ordenarProductosEImprimir("PrecioAc");
    });

    document.getElementById("PrecioDc").addEventListener("click", function(){
        ordenarProductosEImprimir("PrecioDc");
    });

    document.getElementById("Relevancia").addEventListener("click", function(){
        ordenarProductosEImprimir("Relevancia");
    });

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