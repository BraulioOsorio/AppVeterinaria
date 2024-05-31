let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InserVet");
let form_action = document.getElementById('form_action');
let FormEdit = document.getElementById("EditVet");
let informacio = document.getElementById("informacio");
let loadingTable = document.getElementById("loadingTable");
let form_action_info = document.getElementById('form_action_info');
let CancelarInfo = document.getElementById('CancelarInfo');

let btn_add = document.getElementById('btn_add');
let CancelarE = document.getElementById('CancelarEdit');
let CancelarI = document.getElementById('CancelarInsert');
let botonesEditar = document.getElementById("botonesEditar");
let loadingEditar = document.getElementById("loadingEditar");
let loadingInfo = document.getElementById("loadingInfo");
let Formdelete = document.getElementById("eliminarPet");
let btn_delete = document.getElementById('btn_delete');
let form_action_edit = document.getElementById('form_action_edit');
let botonesInsert = document.getElementById("botonesInsert");
let loadingInsert = document.getElementById("loadingInsert");


  
form_action.hidden = true;
form_action_info.hidden = true;
form_action_edit.hidden = true;
loadingEditar.hidden = true;
loadingInsert.hidden = true;
loadingInfo.hidden = true;
loadingTable.hidden = false;
informacio.hidden = true;


btn_add.addEventListener('click',async() =>{
    form_action.hidden = false;
});

CancelarEdit.addEventListener('click',() =>{
    form_action_edit.hidden = true;
    form_action_edit.reset()
});

CancelarInsert.addEventListener('click',() =>{
    form_action.hidden = true;
    form_action.reset()
});
CancelarInfo.addEventListener('click',() =>{
    form_action_info.hidden = true;
    
});


window.onload = function(){
    getVets();
    contenidolista = document.getElementById("listVets");
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

const deleteVet = async(id) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"api/Vet/"+id;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        getVets();
        mensajes("Cambiado con exito","success")
        
    }else{
        mensajes("Hubo un error","error")
    }
}

const getVets = async() =>{
    
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };

    let endpoing = ruta+"api/Vet";
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        contenidolista.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'ACTIVO' ? 'table-success' : 'table-warning';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].namE_VET}</td>
                    <td>${response[i].address}</td>
                    <td>
                        <a href="#content" onclick="info(${response[i].iD_VET})"><i class="fa fa-info-circle text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_VET})"><i class="fa fa-edit text-black"></i></a>
                    </td>
                    <td>
                        <a href="##" onclick="deleteVet(${response[i].iD_VET})"><i class="fa-solid fa-trash text-black"></i></a>
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
const InsertVets = async(data) =>{
    botonesInsert.hidden = true;
    loadingInsert.hidden = false;

    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "iD_VET": 0,
        "namE_VET": data.get("name"),
        "address": data.get("address"),
        "state": "string"      
    };
    console.log(bodyJ);
    

    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };
    
    let endpoing = ruta+"api/Vet";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getVets();
        mensajes("creado con exito","success")
    }else{
        botonesInsert.hidden = true;
        loadingInsert.hidden = false;
        mensajes("Hubo un error","error")   
    }
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

    

    let endpoing = ruta+"api/Vet/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    if(consulta.ok){
        document.getElementById("name").value = response.namE_VET;
        document.getElementById("address").value = response.address;
        document.getElementById("id").value = response.iD_VET;
        
    }else{
        mensajes("Hubo un error","error")
    }

    form_action_edit.hidden = false;
}

const EditVet = async(data) =>{
    botonesEditar.hidden = true;
    loadingEditar.hidden = false;
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "namE_VET": data.get("name"),        
        "address": data.get("address"),           
    };
    let idR = data.get("id");
    console.log(idR)
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Vet/"+idR;
    console.log(endpoing);
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getVets();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes("Hubo un error","error")
    }
}
FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditVet(data);
});

fromInser.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(fromInser);
    InsertVets(data);
});

const info = async(id) => {
    loadingInfo.hidden = false;
    CancelarInfo.hidden = true;
    informacio.hidden = true; 
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoing = ruta+"api/Vet/admin/"+id;
    const consulta = await fetch(endpoing,config);
    try {
        const response = await consulta.json();
        if(consulta.ok){
        
            document.getElementById("NombreInfo").innerHTML = `Nombre: <b class="text-black">${response.namE_VET} </b> `
            document.getElementById("direccion").innerHTML = `Identificación: <b class="text-black">${response.address} </b> `
            document.getElementById("DuenonameInfo").innerHTML = `Dueño: <b class="text-black">${response.name} ${response.lastname}</b> `
            document.getElementById("DuenophoneInfo").innerHTML = `Telefono Dueño: <b class="text-black"> ${response.phone}</b>`
            document.getElementById("emailInfo").innerHTML = `Color: <b class="text-black">${response.email} </b> `
            loadingInfo.hidden = true;
            informacio.hidden = false; 
            CancelarInfo.hidden = false;
            form_action_info.hidden = false;
        }else{
            
            mensajes("Hubo un error al consultar","error")
        }
    } catch (error) {
        form_action_info.hidden = true;
        mensajes("Todavia no tiene Admistrador","info")
    }
    
    
    

    
}







