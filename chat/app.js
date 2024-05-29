const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const port = 3700;

// Configurar Express para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'pagina.html'));
});

// Crear servidor HTTP y enlazarlo con Socket.io
const server = http.createServer(app);
const io = socketIO(server);

// Configurar Socket.io para manejar conexiones
io.on('connection', function(socket) {
    console.log('A user connected');

    // Emitir mensaje de bienvenida al nuevo usuario
    socket.emit("message", { message: "¡Bienvenido al chat en tiempo real!" });

    // Manejar el evento 'send' para enviar mensajes
    socket.on('send', function(data) {
        io.emit('message', data);
    });

    // Manejar el evento 'disconnect' para desconectar usuarios
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
});

// Iniciar el servidor
server.listen(port, function() {
    console.log("Servidor escuchando en el puerto " + port);
});
