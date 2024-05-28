document.addEventListener('DOMContentLoaded', function() {
    // Utiliza fetch para cargar el contenido del menú
    fetch('menuSuperiorAdmin.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el menú');
        }
        return response.text();
      })
      .then(menuSHTML => {
        // Inserta el contenido del menú en el elemento con el id 'menu'
        document.getElementById('menuS').innerHTML = menuSHTML;
      })
      .catch(error => {
        console.error(error);
      });
  });
  