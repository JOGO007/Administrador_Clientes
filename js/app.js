(function() {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if( window.indexedDB.open('crm', 1) ) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    })

    function eliminarRegistro(e) {
        if( e.target.classList.contains('eliminar') ){
            const idEliminar = Number(e.target.dataset.cliente);
            const confirmar = confirm('¿Deseas eliminar este cliente?');

            if(confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    console.log(`Cliente con ID: ${idEliminar} eliminado correctamente`);
                    e.target.parentElement.parentElement.remove(); // Eliminar la fila de la tabla
                }

                transaction.onerror = function() {
                    console.log(`Error al eliminar el cliente con ID: ${idEliminar}`);
                }
            }
        }
    }

    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);
        // Manejo de errores al crear la base de datos
        crearDB.onerror = function(){
            console.log('Error al crear la base de datos');
        }

        crearDB.onsuccess = function() {
            console.log('Base de datos creada correctamente');
            // Aquí podrías llamar a una función para mostrar los clientes o realizar otras acciones
            DB = crearDB.result;
        }

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });
            console.log('Base de datos y objeto store creados correctamente');
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.error('Error al conectar a la base de datos');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if(cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;

                    listadoClientes.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    cursor.continue(); // Continuar con el siguiente registro
                } else {
                    console.log('No hay más clientes en la base de datos');
                }
            }
        }
    }

})();