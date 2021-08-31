//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
});

document.getElementById("ingresar").addEventListener("click", function(){
    console.log(document.getElementById("email").value);
    var email = document.getElementById("email").value;
    localStorage.setItem("email", email);
    console.log(localStorage.getItem("email"));
});