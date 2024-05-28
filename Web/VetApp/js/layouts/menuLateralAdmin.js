document.addEventListener('DOMContentLoaded', function() {
    // Utiliza fetch para cargar el contenido del menú
    fetch('menuLateralAdmin.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el menú');
        }
        return response.text();
      })
      .then(menuHTML => {
        // Inserta el contenido del menú en el elemento con el id 'menu'
        document.getElementById('menuL').innerHTML = menuHTML;
      })
      .catch(error => {
        console.error(error);
      });
  });
  