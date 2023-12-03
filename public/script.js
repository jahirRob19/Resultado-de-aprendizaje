document.addEventListener('DOMContentLoaded', () => {
    const insertarForm = document.getElementById('insertarForm');
    const actualizarForm = document.getElementById('actualizarForm');
    const eliminarForm = document.getElementById('eliminarForm');
    const mensajeContainer = document.getElementById('mensajeContainer'); // Agregamos el elemento para mostrar mensajes

    // Evento para el formulario de inserción
    insertarForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(insertarForm);
        const usuarioData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioData),
            });

            const data = await response.json();
            mostrarMensaje(data.msg); // Mostramos el mensaje
        } catch (error) {
            console.error(error);
        }
    });

    actualizarForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(actualizarForm);
        const usuarioData = Object.fromEntries(formData.entries());
    
        try {
            console.log('Enviando solicitud PUT a:', `/api/usuarios`); // Actualiza la URL a '/api/usuarios'
            const response = await fetch(`/api/usuarios`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioData),
            });
    
            const data = await response.json();
            mostrarMensaje(data.msg); // Mostramos el mensaje
        } catch (error) {
            console.error(error);
            mostrarMensaje('Error al actualizar el usuario'); // Mostrar mensaje de error al usuario
        }
    });
    
    
    





    eliminarForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(eliminarForm);
        const usuarioData = Object.fromEntries(formData.entries());
    
        try {
            console.log('Enviando solicitud DELETE a:', `/api/usuarios/${usuarioData.correoEliminar}`); // Agrega esta línea para imprimir la URL
            const response = await fetch(`/api/usuarios/${usuarioData.correoEliminar}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
            mostrarMensaje(data.msg); // Mostramos el mensaje
        } catch (error) {
            console.error(error);
        }
    });
    

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje) {
        mensajeContainer.textContent = mensaje;
        setTimeout(() => {
            mensajeContainer.textContent = ''; // Limpiamos el mensaje después de unos segundos
        }, 3000); // Puedes ajustar el tiempo de visualización del mensaje
    }
});
