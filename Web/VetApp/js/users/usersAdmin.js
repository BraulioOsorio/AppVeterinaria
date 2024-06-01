let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InsertUser");
let btn_add = document.getElementById('btn_add');
let CancelarE = document.getElementById('CancelarEdit');
let CancelarI = document.getElementById('CancelarInsert');
let botonesEditar = document.getElementById("botonesEditar");
let loadingEditar = document.getElementById("loadingEditar");
let FormEdit = document.getElementById("editUser");
let Formdelete = document.getElementById("eliminarUser");
let btn_delete = document.getElementById('btn_delete');
let form_action = document.getElementById('form_action');
let form_action_edit = document.getElementById('form_action_edit');
let botonesInsert = document.getElementById("botonesInsert");
let loadingInsert = document.getElementById("loadingInsert");
let loadingTable = document.getElementById("loadingTable");

const modal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
  })
form_action.hidden = true;
form_action_edit.hidden = true;
loadingEditar.hidden = true;
loadingInsert.hidden = true;
loadingTable.hidden = false;



CancelarEdit.addEventListener('click',() =>{
    form_action_edit.hidden = true;
    form_action_edit.reset()
});

CancelarInsert.addEventListener('click',() =>{
    form_action.hidden = true;
    form_action.reset()
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

const Veterinarias = async()=>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoingVet = ruta+"api/Vet";
    const consultaVet = await fetch(endpoingVet,config);
    const responseVet = await consultaVet.json();
    if(consultaVet.ok){
        return responseVet;
    }
}
btn_add.addEventListener('click', async () =>{
    form_action.hidden = false;
    let vets = await Veterinarias();
    populateManagerSelectInsert(vets)
});

fromInser.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(fromInser);
    insertUser(data);
});
Formdelete.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(Formdelete);
    deleteUser(data);
});
FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditUser(data);
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
    
    

    let endpoing = ruta+"api/User/admins";
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
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
                        <a href="#content" onclick="editar(${response[i].iD_USER})"><i class="fa fa-edit text-black"></i></a>

                    </td>
                </tr>
            `;
            
            contenidolista.innerHTML += temp;
        }
        
    }else{
        mensajes("Hubo un error","error")
    }
    loadingTable.hidden = true;
    
}

const insertUser = async(data) =>{
    botonesInsert.hidden = true;
    loadingInsert.hidden = false;
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "iD_USER": 0,
        "identification": data.get("identification"),
        "iD_VET": data.get("vet"),
        "phone": data.get("phone"),
        "name": data.get("name"),
        "lastname": data.get("apellido"),
        "email": data.get("email"),
        "pass": data.get("pass"),
        "cargo": "PROPIETARIO",
        "state": "string"
        
    };
    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/User";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getUsers();
        mensajes("creado con exito","success")
    }else{
        botonesInsert.hidden = true;
        loadingInsert.hidden = false;
        mensajes("Hubo un error","error")    }
}
const editar = async(id) => {
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoing = ruta+"api/User/Admin/"+id;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        
        document.getElementById("phone").value = response.phone;
        document.getElementById("name").value = response.name;
        document.getElementById("lastname").value = response.lastname;
        document.getElementById("email").value = response.email;
        document.getElementById("id").value = response.iD_USER;
        let vets = await Veterinarias();
        populateManagerSelect(response,vets)
        
    }else{
        const response = await consulta.json();
        console.log(response+"error");
    }

    form_action_edit.hidden = false;
}

const EditUser = async(data) =>{
    botonesEditar.hidden = true;
    loadingEditar.hidden = false;
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "phone": data.get("phone"),
        "name": data.get("name"),
        "iD_VET": data.get("vet"),
        "lastname": data.get("lastname"),
        "email": data.get("email")
        
    };
    let idUser = data.get("id");
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/User/"+idUser;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getUsers();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes("Hubo un error","error")
    }
}

const deleteUser = async(data) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    let idUser = data.get("identification");
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"admins/"+idUser;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        Formdelete.reset()
        getUsers();
        mensajes("Cambiado con exito","success")
        modal.hide();
    }else{
        mensajes("Hubo un error","error")
    }
}

function populateManagerSelectInsert(vetResponse) {
    const select = document.getElementById('vetSelectInsert');
    select.innerHTML = '';

    vetResponse.forEach(vet => {
    
        let option = document.createElement('option');
        option.value = vet.iD_VET;
        option.textContent = vet.namE_VET;
        select.appendChild(option);
        
    });
}

function populateManagerSelect(adminResponse, vetResponse) {
    const select = document.getElementById('vetSelect');
    console.log(adminResponse)
    select.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.value = adminResponse.iD_VET;
    firstOption.textContent = adminResponse.namE_VET;
    console.table(vetResponse)
    select.appendChild(firstOption);

    vetResponse.forEach(vet => {
        if (vet.iD_VET !== adminResponse.iD_VET) {
            let option = document.createElement('option');
            option.value = vet.iD_VET;
            option.textContent = vet.namE_VET;
            select.appendChild(option);
        }
    });

    select.value = adminResponse.iD_VET;
}



