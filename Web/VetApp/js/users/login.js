let ruta = sessionStorage.getItem("ruta");
let FormLogin = document.getElementById("formLogin");
let login_section = document.getElementById('login_section');
let loading = document.getElementById('loading');
loading.hidden = true;
FormLogin.addEventListener('submit',(e)=>{
    e.preventDefault();
    let data = new FormData(FormLogin);
    inicio(data);
});

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
});

const mensajes = (mensaje,tipo)=>{
    
    Toast.fire({
      icon: tipo,
      title: mensaje
    });
}

const inicio = async(data) =>{
    login_section.hidden = true;
    loading.hidden = false;
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "email": data.get("email"),
        "pass": data.get("password")

    };
    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"Login";
    console.log(endpoing);
    const consulta = await fetch(endpoing,config);
    console.log(consulta)
    let response = await consulta.json()
    if (consulta.ok) {
        
        let rol = response.rol;
        let vet = response.vet;
        console.log(rol);
        sessionStorage.setItem('vet',vet);
        if (rol ==='TRABAJADOR'){
            window.location = "Mascotas.html"
        }else if(rol === 'PROPIETARIO'){
            window.location = "users.html"
        }else if(rol === 'ADMIN'){
            window.location = "usersAdmin.html"
        }
    }else{
        login_section.hidden = false;
        loading.hidden = true;
        console.log(response);
        mensajes(response.message,"error")    
    }
}