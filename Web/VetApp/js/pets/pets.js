let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InserPets");
let form_action = document.getElementById('form_action');
let FormEdit = document.getElementById("editPets");
let loadingTable = document.getElementById("loadingTable");
let btn_add = document.getElementById('btn_add');
let CancelarE = document.getElementById('CancelarEdit');
let CancelarInfo = document.getElementById('CancelarInfo');
let CancelarI = document.getElementById('CancelarInsert');
let botonesEditar = document.getElementById("botonesEditar");
let loadingEditar = document.getElementById("loadingEditar");
let informacio = document.getElementById("informacio");
let form_action_info = document.getElementById('form_action_info');
let loadingInfo = document.getElementById("loadingInfo");
let Formdelete = document.getElementById("eliminarPet");
let btn_delete = document.getElementById('btn_delete');
let form_action_edit = document.getElementById('form_action_edit');
let botonesInsert = document.getElementById("botonesInsert");
let loadingInsert = document.getElementById("loadingInsert");
let form_action_tra = document.getElementById("form_action_tra");
let loadingtra = document.getElementById('loadingtra');
let tra = document.getElementById("tra");
let Cancelartra = document.getElementById('Cancelartra');
let Cardtt = document.getElementById("Cardtt");

const modal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
})

  
form_action.hidden = true;
form_action_edit.hidden = true;
loadingEditar.hidden = true;
loadingInsert.hidden = true;
form_action_info.hidden = true;
loadingInfo.hidden = true;
informacio.hidden = true;
loadingTable.hidden = false;
form_action_tra.hidden = true;
loadingtra.hidden = true;
tra.hidden = true;

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
Cancelartra.addEventListener('click',() =>{
    form_action_tra.hidden = true;
    
});

contenidolista = document.getElementById("listPets");

window.onload = function(){
    contenidolista = document.getElementById("listPets");
    getPets();
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
    InserPets(data);
});
Formdelete.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(Formdelete);
    deletePet(data);
});
FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditPets(data);
});

const getPets = async() =>{
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };

    

    let endpoing = ruta+"api/Pet/vet/"+vet;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        contenidolista.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'ACTIVO' ? 'table-success' : 'table-warning';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].namE_PET}</td>
                    <td>${response[i].racE_NAME}</td>
                    <td>${response[i].manageR_NAME}</td>
                    <td>${response[i].identificatioN_PET}</td>
                    <td>${response[i].state}</td>
                    <td>
                        <a href="#content" onclick="trabajos(${response[i].iD_PET})"><i class="fa fa-info-circle text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="info(${response[i].iD_PET})"><i class="fa fa-info-circle text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_PET})"><i class="fa fa-edit text-black"></i></a>
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



const InserPets = async(data) =>{
    botonesInsert.hidden = true;
    loadingInsert.hidden = false;

    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "iD_PET": 0,
        "iD_VET": vet,
        "identificatioN_PET": data.get("identification"),
        "namE_PET": data.get("name"),
        "iD_MANAGER": data.get("manager"),
        "iD_RACE": data.get("race"),
        "color": data.get("color"),
        "size": data.get("size"),
        "age": data.get("age"),
        "weight": data.get("weight"),
        "state": "string"
        
    };
    console.log(bodyJ);
    

    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Pet";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getPets();
        mensajes("creado con exito","success")
    }else{
        botonesInsert.hidden = false;
        loadingInsert.hidden = true;
        mensajes("Hubo un error","error")   
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

    

    let endpoing = ruta+"api/Pet/One/"+id+"/"+vet;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    if(consulta.ok){
        document.getElementById("name").value = response.namE_PET;
        document.getElementById("identification").value = response.identificatioN_PET;
        document.getElementById("size").value = response.size;
        document.getElementById("age").value = response.age;
        document.getElementById("weight").value = response.weight;
        document.getElementById("id").value = response.iD_PET;
        let managersR = await Managers();
        populateManagerSelect(response, managersR);
        
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

const EditPets = async(data) =>{
    botonesEditar.hidden = true;
    loadingEditar.hidden = false;
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });

    let bodyJ = {
        "identificatioN_PET": data.get("identification"),
        "namE_PET": data.get("name"),
        "iD_MANAGER": data.get("manager"),
        "size": data.get("size"),
        "age": data.get("age"),
        "weight": data.get("weight")
        
    };
    let idP = data.get("id");
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Pet/"+idP;
    console.log(endpoing);
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getPets();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes("Hubo un error","error")
    }
}

const deletePet = async(data) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    let idPet = data.get("identificationP");
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"api/Pet/"+idPet+"/"+vet;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        Formdelete.reset()
        getPets();
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

    let endpoing = ruta+"api/Pet/One/"+id+"/"+vet;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    // console.table(response)
    if(consulta.ok){
        document.getElementById("NombreInfo").innerHTML = `Nombre: <b class="text-black">${response.namE_PET} </b> `
        document.getElementById("IdentificaciónInfo").innerHTML = `Identificación: <b class="text-black">${response.identificatioN_PET} </b> `
        document.getElementById("DuenoInfo").innerHTML = `Dueño: <b class="text-black">${response.manageR_NAME} </b> `
        document.getElementById("DuenoPhoneInfo").innerHTML = `Telefono Dueño: <b class="text-black"> ${response.manageR_PHONE}</b>`
        document.getElementById("TamanoInfo").innerHTML = `Tamaño: <b class="text-black">${response.size} </b> `
        document.getElementById("ColorInfo").innerHTML = `Color: <b class="text-black">${response.color} </b> `
        document.getElementById("EdadInfo").innerHTML = `Edad: <b class="text-black">${response.age}	</b>`
        document.getElementById("PesoInfo").innerHTML = `Peso: <b class="text-black">${response.weight} </b> `
        document.getElementById("RaceInfo").innerHTML = `Rasa: <b class="text-black">${response.racE_NAME} </b> `
        document.getElementById("veterinariaInfo").innerHTML = `Veterinaria: <b class="text-black">${response.veT_NAME} </b> `
        loadingInfo.hidden = true;
        informacio.hidden = false; 
        CancelarInfo.hidden = false;
    }else{
        mensajes("Hubo un error al consultar","error")
    }

    form_action_info.hidden = false;
}

const trabajos = async(id) => {
    loadingtra.hidden = false;
    Cancelartra.hidden = true;
    tra.hidden = true; 
    
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoing = ruta+"api/Jobs/ThePet/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    console.table(response)
    
    if(consulta.ok){
        console.log(Cardtt)
        Cardtt.innerHTML = "";
        
        if(response.length > 0){
            for (var i = 0; i < response.length; i++) {
                let stateClass = response[i].state === 'FINALIZADO' ? 'border border-success' : 'border border-warning';
                let temp  = `
                <div class="card col-6 mx-auto mb-2${stateClass}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${response[i].namE_PET}</h5>
                        <h6 class="card-subtitle mb-2 text-body-dark ">Rasa: ${response[i].race}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Trabajo: ${response[i].job}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Costo: ${response[i].costs}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Descripción del Costo: ${response[i].cosT_DESCRIPTION}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Dueño: ${response[i].fullname}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Telefono Dueño: ${response[i].phonE_MANAGER}</h6>
                        <h6 class="card-subtitle mb-2 text-body-dark">Trabajador: ${response[i].name} ${response[i].lastname}</h6>
                    </div>
                </div>
            `;
                
                Cardtt.innerHTML += temp;
            }
            loadingtra.hidden = true;
            tra.hidden = false; 
            Cancelartra.hidden = false;
            form_action_tra.hidden = false;
        }else{
            
            mensajes("No tiene Trabajos realizados","info")
            Cancelartra.hidden = true;
            loadingtra.hidden = true;
            form_action_tra.hidden = true;
        }
        
    }else{
        mensajes("Hubo un error al consultar","error")
    }

    
}


