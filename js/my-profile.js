function loadData(email){
    var perfil = localStorage.getItem(email.toString());
    if(perfil){
        var perfilParseado = JSON.parse(perfil);
        document.getElementById("inputNombre").value = perfilParseado.nombre;
        document.getElementById("inputEdad").value = perfilParseado.edad;
        document.getElementById("inputEmail").value = perfilParseado.email;
        document.getElementById("inputTelefono").value = perfilParseado.telefono;
    }
}

function saveData() {
    var email = document.getElementById("inputEmail").value;

    localStorage.setItem(email.toString(), JSON.stringify({
        nombre: document.getElementById("inputNombre").value,
        edad: document.getElementById("inputEdad").value,
        email: document.getElementById("inputEmail").value,
        telefono: document.getElementById("inputTelefono").value
    }));
}

document.addEventListener("DOMContentLoaded", function (e) {
    loadData(localStorage.getItem("user").toString());
});
