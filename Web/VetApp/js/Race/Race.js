let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InserRace");
let form_action = document.getElementById('form_action');
let FormEdit = document.getElementById("editRace");

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


window.onload = function(){
    getRaces();
    contenidolista = document.getElementById("listRaces");
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

const deleteRace = async(id) =>{
    console.log(id);
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"api/Race/"+id;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        getRaces();
        mensajes("Cambiado con exito","success")
        
    }else{
        mensajes("Hubo un error","error")
    }
}

const getRaces = async() =>{
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };

    let endpoing = ruta+"RaceVet/"+vet;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        contenidolista.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'ACTIVO' ? 'table-success' : 'table-warning';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].race}</td>
                    <td>${response[i].state}</td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_RACE})"><i class="fa fa-edit text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="deleteRace(${response[i].iD_RACE})"><i class="fa-solid fa-trash text-black"></i></a>
                    </td>
                </tr>
            `;
            
            contenidolista.innerHTML += temp;
        }
        
    }else{
        mensajes("Hubo un error","error")
    }
    
}
const InsertRace = async(data) =>{
    botonesInsert.hidden = true;
    loadingInsert.hidden = false;

    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "iD_RACE": 0,
        "race": data.get("name"),
        "iD_VET": vet,
        "state": "string"      
    };
    console.log(bodyJ);
    

    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };
    
    let endpoing = ruta+"api/Race";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getRaces();
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

    

    let endpoing = ruta+"api/Race/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    if(consulta.ok){
        document.getElementById("name").value = response.race;
        document.getElementById("id").value = response.iD_RACE;
        
    }else{
        mensajes("Hubo un error","error")
    }

    form_action_edit.hidden = false;
}
FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditRace(data);
});
const EditRace = async(data) =>{
    botonesEditar.hidden = true;
    loadingEditar.hidden = false;
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "race": data.get("name"),        
        "iD_VET": vet,        
    };
    let idR = data.get("id");
    console.log(idR)
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Race/"+idR;
    console.log(endpoing);
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getRaces();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes("Hubo un error","error")
    }
}

fromInser.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(fromInser);
    InsertRace(data);
});







