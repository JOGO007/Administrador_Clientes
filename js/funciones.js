function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.error('Error al conectar a la base de datos');
        }

        abrirConexion.onsuccess = function() {
            console.log('Conexión a la base de datos establecida correctamente');
            DB = abrirConexion.result;
        }
}

function imprimirAlerta(mensaje, tipo){

        // Verificar si ya existe una alerta
        const alertaExistente = document.querySelector('.alerta');
        // Si existe, eliminarla
        if(!alertaExistente) {
            // Crear el div de alerta
            const divMensaje = document.createElement('div');
            divMensaje.textContent = mensaje;
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

            if(tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            // Insertar en el DOM
            formulario.appendChild(divMensaje);

            // Eliminar la alerta después de 3 segundos
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);

        }
}