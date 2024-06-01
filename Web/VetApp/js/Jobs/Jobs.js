let ruta = sessionStorage.getItem("ruta");
let vet = sessionStorage.getItem('vet');
let contenidolista = null;
let fromInser = document.getElementById("InsertJobs");
let btn_add = document.getElementById('btn_add');
let CancelarE = document.getElementById('CancelarEdit');

let Gananciasfil = document.getElementById('Gananciasfil');
let Gastosfil = document.getElementById('Gastosfil');
let Activosfil = document.getElementById('Activosfil');
let Finalizadosfil = document.getElementById('Finalizadosfil');
let Todosfil = document.getElementById('Todosfil');

let CancelarI = document.getElementById('CancelarInsert');
let botonesEditar = document.getElementById("botonesEditar");
let loadingEditar = document.getElementById("loadingEditar");
let FormEdit = document.getElementById("editJobs");
let form_action = document.getElementById('form_action');
let form_action_edit = document.getElementById('form_action_edit');
let botonesInsert = document.getElementById("botonesInsert");
let loadingInsert = document.getElementById("loadingInsert");
let loadingTable = document.getElementById("loadingTable");
let informacio = document.getElementById("informacio");
let form_action_info = document.getElementById('form_action_info');
let loadingInfo = document.getElementById("loadingInfo");
let CancelarInfo = document.getElementById('CancelarInfo');

form_action.hidden = true;
form_action_edit.hidden = true;
loadingEditar.hidden = true;
loadingInsert.hidden = true;
loadingTable.hidden = false;
form_action_info.hidden = true;
loadingInfo.hidden = true;
informacio.hidden = true;

btn_add.addEventListener('click', async() =>{
    form_action.hidden = false;
    let pets = await Pets();
    let users = await Users();
    populatePetSelectInsert(pets)
    populateTrabajadorSelectInsert(users)
});

CancelarE.addEventListener('click',() =>{
    form_action_edit.hidden = true;
    form_action_edit.reset()
});

Gananciasfil.addEventListener('click',() =>{
    getJobsFil("PROFITS");
});

Gastosfil.addEventListener('click',() =>{
    getJobsFil("LOSS");
});
Activosfil.addEventListener('click',() =>{
    getJobsFil("ACTIVO");
});
Finalizadosfil.addEventListener('click',() =>{
    getJobsFil("FINALIZADO");
});
Todosfil.addEventListener('click',() =>{
    getJobs();
    
});

CancelarInsert.addEventListener('click',() =>{
    form_action.hidden = true;
    form_action.reset()
});


window.onload = function(){
    contenidolista = document.getElementById("listJobs");
    getJobs();
    let role = sessionStorage.getItem('ROLE');
    if (role === 'PROPIETARIO') {
        let newLi = document.createElement('li');
        newLi.innerHTML = '<a href="users.html"><i class="fa fa-user yellow_color"></i> <span>Trabajadores</span></a>';
        let liReference = document.getElementById('liReference');
        liReference.parentNode.insertBefore(newLi, liReference.nextSibling);
    }
    
    
}
CancelarInfo.addEventListener('click',() =>{
    form_action_info.hidden = true;
    
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

const Users = async()=>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoingManager = ruta+"api/User/vet/"+vet;
    const consultaManager = await fetch(endpoingManager,config);
    const responseManager = await consultaManager.json();
    if(consultaManager.ok){
        return responseManager;
    }
}
const Pets = async()=>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'GET',
        headers:headers
    };

    let endpoingManager = ruta+"api/Pet/vet/"+vet;
    const consultaManager = await fetch(endpoingManager,config);
    const responseManager = await consultaManager.json();
    if(consultaManager.ok){
        return responseManager;
    }
}

fromInser.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(fromInser);
    insertUser(data);
    
});

FormEdit.addEventListener('submit', (e) =>{
    e.preventDefault();
    let data = new FormData(FormEdit);
    EditUser(data);
});

const getJobs = async() =>{
    loadingTable.hidden = false;
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };
    
    

    let endpoing = ruta+"api/Jobs/TheVet/"+vet;
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        
        contenidolista.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'FINALIZADO' ? 'table-success' : 'table-warning';
            let stateEspa = response[i].statE_MONEY === 'PROFITS' ? 'GANANCIA' : 'GASTO';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].name} ${response[i].lastname}</td>
                    <td>${response[i].namE_PET}</td>
                    <td>${response[i].job}</td>
                    <td>${response[i].costs.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</td>
                    <td>${response[i].fullname}</td>
                    <td>${response[i].state}</td>
                    <td>${stateEspa}</td>
                    <td>
                        <a href="#content" onclick="info(${response[i].iD_JOBS})"><i class="fa fa-info text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_JOBS})"><i class="fa fa-edit text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="deleteUser(${response[i].iD_JOBS})"><i class="fa fa-check-circle text-black"></i></a>
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

const getJobsFil = async(status) =>{
    loadingTable.hidden = false;
    let headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json"
    });

    const config ={
        method:'GET',
        headers:headers
    };
    let endpoing;
    if(status ==="LOSS" || status === "PROFITS"){
        endpoing = ruta+"api/Jobs/StatusMoney/"+vet+"/"+status;
        
    }else{
        endpoing = ruta+"api/Jobs/Status/"+vet+"/"+status;
    }

    
    const consulta = await fetch(endpoing,config);
    if(consulta.ok){

        const response = await consulta.json();
        
        contenidolista.innerHTML = "";


        for (var i = 0; i < response.length; i++) {
            let stateClass = response[i].state === 'FINALIZADO' ? 'table-success' : 'table-warning';
            let stateEspa = response[i].statE_MONEY === 'PROFITS' ? 'GANANCIA' : 'GASTO';
            
            let temp = `
                <tr class="${stateClass}">
                    <td>${response[i].name} ${response[i].lastname}</td>
                    <td>${response[i].namE_PET}</td>
                    <td>${response[i].job}</td>
                    <td>${response[i].costs.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</td>
                    <td>${response[i].fullname}</td>
                    <td>${response[i].state}</td>
                    <td>${stateEspa}</td>
                    <td>
                        <a href="#content" onclick="info(${response[i].iD_JOBS})"><i class="fa fa-info text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="editar(${response[i].iD_JOBS})"><i class="fa fa-edit text-black"></i></a>
                    </td>
                    <td>
                        <a href="#content" onclick="deleteUser(${response[i].iD_JOBS})"><i class="fa fa-check-circle text-black"></i></a>
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
        "iD_JOBS": 0,
        "iD_VET": vet,
        "iD_USER": data.get("trabajador"),
        "identificatioN_PET": data.get("mascota"),
        "job": data.get("job"),
        "costs": data.get("costs"),
        "cosT_DESCRIPTION": data.get("costDes"),
        "state": "string",
        "statE_MONEY": data.get("typeG")
        
    };
    const config ={
        method:'POST',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Jobs";
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action.hidden = true;
        loadingInsert.hidden = true;
        botonesInsert.hidden = false;
        fromInser.reset()
        getJobs();
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

    let endpoing = ruta+"api/Jobs/OneJob/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    if(consulta.ok){

        
        document.getElementById("jobE").value = response.job;
        document.getElementById("costE").value = response.costs;
        document.getElementById("costDesE").value = response.cosT_DESCRIPTION;
        document.getElementById("id").value = response.iD_JOBS;
        
    }else{
        mensajes("Hubo un error","error") 
    }
    let pets = await Pets();
    let users = await Users();
    populateUserSelect(response,users)
    populatePetSelect(response,pets)
    populateGasSelectInsert(response)

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
        "iD_USER": data.get("trabajador"),
        "identificatioN_PET": data.get("mascota"),
        "job": data.get("job"),
        "costs": data.get("costs"),
        "cosT_DESCRIPTION": data.get("costDes"),
        "statE_MONEY": data.get("typeG")
        
    };
    let idJ = data.get("id");
    const config ={
        method:'PUT',
        headers:headers,
        body : JSON.stringify(bodyJ)
    };

    let endpoing = ruta+"api/Jobs/"+idJ;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        form_action_edit.hidden = true;
        loadingEditar.hidden = true;
        botonesEditar.hidden = false;
        FormEdit.reset()
        getJobs();
        mensajes("Editado con exito","success")
    }else{
        botonesEditar.hidden = false;
        loadingEditar.hidden = true;
        mensajes("Hubo un error","error")
    }
}

const deleteUser = async(id) =>{
    let headers = new Headers({
        "accept": "*/*",
        "Content-Type": "application/json"
    });
    const config ={
        method:'DELETE',
        headers:headers,
    };

    let endpoing = ruta+"api/Jobs/"+id;
    const consulta = await fetch(endpoing,config);
    if (consulta.ok) {
        getJobs();
        mensajes("Cambiado con exito","success")
        modal.hide();
    }else{
        mensajes("Hubo un error","error")
    }
}
function populateTrabajadorSelectInsert(uses) {
    const select = document.getElementById('TrabajadorSelect');
    select.innerHTML = '';

    uses.forEach(user => {
    
        let option = document.createElement('option');
        option.value = user.iD_USER;
        option.textContent = user.name+" "+user.lastname;
        select.appendChild(option);
        
    });
}
function populateGasSelectInsert(jobs) {
    const select = document.getElementById('typeGE');
    select.innerHTML = '';

    
    if(jobs.statE_MONEY ==="PROFITS"){
        let option = document.createElement('option');
        option.value = jobs.statE_MONEY;
        option.textContent = "GANANCIA";
        select.appendChild(option);

        let option2 = document.createElement('option');
        option2.value = "LOSS";
        option2.textContent = "GASTO";
        select.appendChild(option2);
    }else{
        let option = document.createElement('option');
        option.value = jobs.statE_MONEY;
        option.textContent = "GASTO";
        select.appendChild(option);

        let option2 = document.createElement('option');
        option2.value = "PROFITS";
        option2.textContent = "GANANCIA";
        select.appendChild(option2);
    }
    
    
        
    
}

function populatePetSelectInsert(pets) {
    const select = document.getElementById('mascotaSelect');
    select.innerHTML = '';

    pets.forEach(pet => {
    
        let option = document.createElement('option');
        option.value = pet.iD_PET;
        option.textContent = pet.namE_PET;
        select.appendChild(option);
        
    });
}

function populatePetSelect(jobsResponse, petResponse) {
    const select = document.getElementById('mascotaSelectE');
    select.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.value = jobsResponse.iD_PET;
    firstOption.textContent = jobsResponse.namE_PET;
    select.appendChild(firstOption);


    petResponse.forEach(pet => {
        if (pet.iD_PET !== jobsResponse.iD_PET) {
            let option = document.createElement('option');
            option.value = pet.iD_PET;
            option.textContent = pet.namE_PET;
            select.appendChild(option);
        }
    });

    select.value = jobsResponse.iD_PET;
}
function populateUserSelect(jobsResponse, userResponse) {
    const select = document.getElementById('TrabajadorSelectE');
    select.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.value = jobsResponse.iD_USER;
    firstOption.textContent = jobsResponse.name+" "+jobsResponse.lastname;
    select.appendChild(firstOption);

    userResponse.forEach(user => {
        if (user.iD_USER !== jobsResponse.iD_USER) {
            let option = document.createElement('option');
            option.value = user.iD_USER;
            option.textContent = user.name+""+user.lastname;
            select.appendChild(option);
        }
    });

    select.value = jobsResponse.iD_USER;
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

    let endpoing = ruta+"api/Jobs/OneJob/"+id;
    const consulta = await fetch(endpoing,config);
    const response = await consulta.json();
    console.table(response)
    if(consulta.ok){
        document.getElementById("jobinfo").innerHTML = `Trabajo Realizado: <b class="text-black">${response.job} </b> `
        document.getElementById("trabajadorinfo").innerHTML = `Trabajador: <b class="text-black">${response.name} ${response.lastname}</b> `
        document.getElementById("costsinfo").innerHTML = `Costo: <b class="text-black">${response.costs} </b> `
        document.getElementById("cosT_DESCRIPTIONinfo").innerHTML = `Descripcion del Costo: <b class="text-black"> ${response.cosT_DESCRIPTION}</b>`
        document.getElementById("namE_PETinfo").innerHTML = `Mascota: <b class="text-black">${response.namE_PET} </b> `
        document.getElementById("raceinfo").innerHTML = `Rasa: <b class="text-black">${response.race} </b> `
        document.getElementById("fullnameinfo").innerHTML = `Dueño: <b class="text-black">${response.fullname}	</b>`
        document.getElementById("addresS_MANAGERinfo").innerHTML = `Dirección del Dueño: <b class="text-black">${response.addresS_MANAGER} </b> `
        document.getElementById("phonE_MANAGERinfo").innerHTML = `Telefono del Dueño: <b class="text-black">${response.phonE_MANAGER} </b> `
        loadingInfo.hidden = true;
        informacio.hidden = false; 
        CancelarInfo.hidden = false;
    }else{
        mensajes("Hubo un error al consultar","error")
    }

    form_action_info.hidden = false;
}

