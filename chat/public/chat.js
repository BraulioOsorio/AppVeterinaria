$(document).ready(function() {
    const socket = io.connect("http://localhost:3700");
    const field = $('#field');
    const nameInput = $('#name');
    const sendButton = $('#send');
    const saveNameButton = $('#saveName');
    let username = '';

    // Manejar el evento 'message' para mostrar mensajes recibidos
    socket.on('message', function(data) {
        if (data.message) {
            $('#content').append('<b>' + (data.username ? data.username : 'Server') + ':</b> ' + data.message + '<br />');
            // Scroll al fondo del contenedor de mensajes
            $('#content').scrollTop($('#content')[0].scrollHeight);
        } else {
            console.log("Problema:", data);
        }
    });

    // Guardar nombre de usuario cuando se haga clic en el botón
    saveNameButton.click(function() {
        username = nameInput.val();
        if (username) {
            nameInput.prop('disabled', true);
            saveNameButton.prop('disabled', true);
        }
    });

    // Manejar el evento 'click' del botón de enviar mensaje
    sendButton.click(function() {
        const text = field.val();
        if (text && username) {
            socket.emit('send', { message: text, username: username });
            field.val(''); // Limpiar el campo de texto después de enviar el mensaje
        } else {
            alert('Por favor ingresa un nombre y un mensaje');
        }
    });

    // Manejar el evento 'keypress' para enviar mensaje al presionar Enter
    field.keypress(function(e) {
        if (e.which === 13 && !e.shiftKey) { // Verificar si se presionó Enter sin Shift
            e.preventDefault(); // Prevenir el comportamiento por defecto (nueva línea en el textarea)
            sendButton.click(); // Simular clic en el botón de enviar mensaje
        }
    });
});
