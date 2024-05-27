let ruta = sessionStorage.getItem("ruta");
// sessionStorage.setItem('ID_VET',vet);
console.log(ruta);
let contenidolista = null;
let fromInser = document.getElementById("InsertUser");
let btn_add = document.getElementById('btn_add');
let btn_delete = document.getElementById('btn_delete');
let form_action = document.getElementById('form_action');
console.log(fromInser);
form_action.hidden = true;

btn_add.addEventListener('click',() =>{
    form_action.hidden = false;
});
window.onload = function(){
    contenidolista = document.getElementById("listUsers");
    getUsers();
}

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

fromInser.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(fromInser);
    insertUser(data);
});

const getUsers = async() =>{
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };
    let vet = 1;
    

    let endpoing = ruta+"api/User/vet/"+vet;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        console.log(response);
        contenidolista.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'ACTIVO' ? 'table-success' : 'table-warning';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].name} ${response[i].lastname}</td>
                    <td>${response[i].phone}</td>
                    <td>${response[i].email}</td>
                    <td>${response[i].identification}</td>
                    <td>${response[i].cargo}</td>
                    <td>${response[i].state}</td>
                    <td>
                        <a onclick="editar(${response[i].iD_USER})" href="dashboard.html"><i class="fa fa-edit text-black"></i></a>

                    </td>
                </tr>
            `;
            
            contenidolista.innerHTML += temp;
        }
        
    }else{
        const response = await consulta.json();
        console.log(response+"error");
    }
    
}
const insertUser = async(data) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    console.log(data);

    let bodyJ = {
        "iD_USER": 0,
        "identification": data.get("identification"),
        "iD_VET": 1,
        "phone": data.get("phone"),
        "name": data.get("name"),
        "lastname": data.get("apellido"),
        "email": data.get("email"),
        "pass": data.get("pass"),
        "cargo": "TRABAJADOR",
        "state": "string"
        
    };
    // JSON.stringify(bodyJ)
    console.log(bodyJ)
    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/User";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        fromInser.reset()
        getUsers();
        mensajes("creado con exito","success")
    }else{
        console.log("error al crear un usuario de tipo camellador");
    }
}


