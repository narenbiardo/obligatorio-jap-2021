//Guarda el email en el local storage

document.getElementById("ingresar").addEventListener("click", function(){
    console.log(document.getElementById("email").value);
    var email = document.getElementById("email").value;
    localStorage.setItem("email", email);
    console.log(localStorage.getItem("email"));
});