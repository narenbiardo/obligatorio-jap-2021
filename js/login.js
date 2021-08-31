//Guarda el email en el local storage

document.getElementById("ingresar").addEventListener("click", function(){
    var email = document.getElementById("email").value;
    localStorage.setItem("user", email);
});