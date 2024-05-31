let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InserManager");
let form_action = document.getElementById('form_action');
let form_action_info = document.getElementById('form_action_info');
let FormEdit = document.getElementById("editManager");
let informacio = document.getElementById("informacio");
let Cardtt = document.getElementById("Cardtt");
let Formdelete = document.getElementById("eliminarManager");

let btn_add = document.getElementById('btn_add');
let CancelarE = document.getElementById('CancelarEdit');
let CancelarInfo = document.getElementById('CancelarInfo');
let CancelarI = document.getElementById('CancelarInsert');
let botonesEditar = document.getElementById("botonesEditar");
let loadingEditar = document.getElementById("loadingEditar");
let loadingInfo = document.getElementById("loadingInfo");
let btn_delete = document.getElementById('btn_delete');
let form_action_edit = document.getElementById('form_action_edit');
let botonesInsert = document.getElementById("botonesInsert");
let loadingInsert = document.getElementById("loadingInsert");

const modal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
})

  
form_action.hidden = true;
form_action_info.hidden = true;
form_action_edit.hidden = true;
loadingEditar.hidden = true;
loadingInsert.hidden = true;
loadingInfo.hidden = true;
informacio.hidden = true;

const Races = async()=>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoingRace = ruta+"RaceVet/"+vet;
    const consultaRace = await fetch(endpoingRace,config);
    const responseRace = await consultaRace.json();
    if(consultaRace.ok){
        return responseRace;
    }
}

const Managers = async()=>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoingManager = ruta+"api/Manager/vet/"+vet;
    const consultaManager = await fetch(endpoingManager,config);
    const responseManager = await consultaManager.json();
    if(consultaManager.ok){
        return responseManager;
    }
}

btn_add.addEventListener('click',async() =>{
    form_action.hidden = false;
    let managersR = await Managers();
    populateManagerSelectInsert(managersR)
    let rasa = await Races();
    populateRaceSelectInsert(rasa);
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
    contenidolista = document.getElementById("listManager");
    getManager();
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
    InserManager(data);
});
Formdelete.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(Formdelete);
    deleteManager(data);
});
FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditManager(data);
});

const getManager = async() =>{
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };

    

    let endpoing = ruta+"api/Manager/vet/"+vet;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        contenidolista.innerHTML = "";
        console.table(response)

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'ACTIVO' ? 'table-success' : 'table-warning';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].fullname}</td>
                    <td>${response[i].addresS_MANAGER}</td>
                    <td>${response[i].phonE_MANAGER}</td>
                    <td>${response[i].state}</td>
                    <td>
                        <a href="#content" onclick="info(${response[i].iD_MANAGER})"><i class="fa-solid fa-paw  text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_MANAGER})"><i class="fa fa-edit text-black"></i></a>
                    </td>
                </tr>
            `;
            
            contenidolista.innerHTML += temp;
        }
        
    }else{
        mensajes("Hubo un error","error")
    }
    
}



const InserManager = async(data) =>{
    botonesInsert.hidden = true;
    loadingInsert.hidden = false;

    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "iD_MANAGER": 0,
        "iD_VET": vet,
        "addresS_MANAGER": data.get("direccion"),
        "phonE_MANAGER": data.get("phone"),
        "fullname": data.get("name"),
        "state": "string"
        
    };
    console.log(bodyJ);
    

    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Manager";
    const consulta = await fetch(endpoing,config);
    let response = await consulta.json()
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getManager();
        mensajes("creado con exito","success")
    }else{
        botonesInsert.hidden = false;
        loadingInsert.hidden = true;
        mensajes(response.errors.PHONE_MANAGER,"error")   
    }
}

const editar = async(id) => {
    console.log("Edir")
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    

    let endpoing = ruta+"api/Manager/"+id+"/"+vet;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    if(consulta.ok){
        document.getElementById("name").value = response.fullname;
        document.getElementById("phone").value = response.phonE_MANAGER;
        document.getElementById("direccion").value = response.addresS_MANAGER;
        document.getElementById("id").value = response.iD_MANAGER;
        
    }else{
        mensajes("Hubo un error","error")
    }

    form_action_edit.hidden = false;
}



function populateManagerSelect(petResponse, managersResponse) {
    const select = document.getElementById('managerSelect');
    console.log(petResponse)
    select.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.value = petResponse.iD_MANAGER;
    firstOption.textContent = petResponse.manageR_NAME;
    select.appendChild(firstOption);

    managersResponse.forEach(manager => {
        if (manager.iD_MANAGER !== petResponse.iD_MANAGER) {
            let option = document.createElement('option');
            option.value = manager.iD_MANAGER;
            option.textContent = manager.fullname;
            select.appendChild(option);
        }
    });

    select.value = petResponse.iD_MANAGER;
}

function populateManagerSelectInsert(managersResponse) {
    const select = document.getElementById('managerSelectInsert');
    select.innerHTML = '';

    managersResponse.forEach(manager => {
    
        let option = document.createElement('option');
        option.value = manager.iD_MANAGER;
        option.textContent = manager.fullname;
        select.appendChild(option);
        
    });
}

function populateRaceSelectInsert(race) {
    const select = document.getElementById('RaceSelectInsert');
    select.innerHTML = '';

    race.forEach(rassa => {
    
        let option = document.createElement('option');
        option.value = rassa.iD_RACE;
        option.textContent = rassa.race;
        select.appendChild(option);
        
    });
}

const EditManager = async(data) =>{
    botonesEditar.hidden = true;
    loadingEditar.hidden = false;
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "addresS_MANAGER": data.get("direccion"),
        "phonE_MANAGER": data.get("phone"),
        "fullname": data.get("name"),
        
    };
    let idM = data.get("id");
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Manager/"+idM;
    console.log(endpoing);
    const consulta = await fetch(endpoing,config);
    let response = await consulta.json()
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getManager();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes(response.errors.PHONE_MANAGER,"error")   
    }
}

const deleteManager = async(data) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    let idManager = data.get("identificationM");
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"api/Manager/"+idManager+"/"+vet;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        Formdelete.reset()
        getManager();
        mensajes("Cambiado con exito","success")
        console.log(modal)
        modal.hide();
    }else{
        mensajes("Hubo un error","error")
    }
}

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

    let endpoing = ruta+"api/Pet/Manager/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    console.table(response)
    
    if(consulta.ok){
        console.log(Cardtt)
        Cardtt.innerHTML = "";
        
        if(response.length > 0){
            for (var i = 0; i < response.length; i++) {
                let stateClass = response[i].state === 'ACTIVO' ? 'border border-success' : 'border border-warning';
                let temp  = `
                <div class="card col-4 mx-auto mb-2 ${stateClass}">
                    <div class="card-body">
                        <h5 class="card-title">${response[i].namE_PET}</h5>
                        <h6 class="card-subtitle mb-2 text-body-dark">Rasa: ${response[i].racE_NAME}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Color: ${response[i].color}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Tamaño: ${response[i].size}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Edad: ${response[i].age}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Peso: ${response[i].weight}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Dueño: ${response[i].manageR_NAME}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Telefono Dueño: ${response[i].manageR_PHONE}</h6>
                    </div>
                </div>
            `;
                
                Cardtt.innerHTML += temp;
            }
            loadingInfo.hidden = true;
            informacio.hidden = false; 
            CancelarInfo.hidden = false;
        }else{
            
            mensajes("No tiene mascotas","info")
            CancelarInfo.hidden = true;
            loadingInfo.hidden = true;
        }
        
    }else{
        mensajes("Hubo un error al consultar","error")
    }

    form_action_info.hidden = false;
}


