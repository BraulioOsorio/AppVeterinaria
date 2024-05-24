let ruta = sessionStorage.getItem("ruta");
let contenidolista = null;

window.onload = function(){
    contenidolista = document.getElementById("listUsers");
    getUsers();
}

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

    let endpoing = "https://localhost:7256/api/User/vet/"+vet;
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
                </tr>
            `;
            
            contenidolista.innerHTML += temp;
        }
        
    }else{
        const response = await consulta.json();
        console.log(response+"error");
    }
    
}