(function() {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);
            const confirmar = confirm('¿Deseas eliminar este cliente?');

            if(confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    console.log(`Cliente con ID: ${idEliminar} eliminado correctamente`);
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function() {
                    console.log(`Error al eliminar el cliente con ID: ${idEliminar}`);
                }
            }
        }
    }

    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        //Manejo de errores al crear la base de datos
        crearDB.onerror = function() {
            console.log('Error al crear la base de datos');
        }

        crearDB.onsuccess = function() {
            console.log('Base de datos creada correctamente');
            DB = crearDB.result;
            obtenerClientes();
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
        const objectStore = DB.transaction('crm').objectStore('crm');

        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                pintarCliente(cursor.value);
                cursor.continue();
            } else {
                console.log('No hay mas clientes en la base de datos');
            }
        }
    }

    function pintarCliente(cliente) {
        const { nombre, empresa, email, telefono, id } = cliente;

        const fila = document.createElement('tr');

        const celdaContacto = document.createElement('td');
        celdaContacto.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');

        const nombreCliente = document.createElement('p');
        nombreCliente.classList.add('text-sm', 'leading-5', 'font-medium', 'text-gray-700', 'text-lg', 'font-bold');
        nombreCliente.textContent = nombre;

        const emailCliente = document.createElement('p');
        emailCliente.classList.add('text-sm', 'leading-10', 'text-gray-700');
        emailCliente.textContent = email;

        celdaContacto.appendChild(nombreCliente);
        celdaContacto.appendChild(emailCliente);

        const celdaTelefono = document.createElement('td');
        celdaTelefono.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');

        const telefonoCliente = document.createElement('p');
        telefonoCliente.classList.add('text-gray-700');
        telefonoCliente.textContent = telefono;

        celdaTelefono.appendChild(telefonoCliente);

        const celdaEmpresa = document.createElement('td');
        celdaEmpresa.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'leading-5', 'text-gray-700');

        const empresaCliente = document.createElement('p');
        empresaCliente.classList.add('text-gray-600');
        empresaCliente.textContent = empresa;

        celdaEmpresa.appendChild(empresaCliente);

        const celdaAcciones = document.createElement('td');
        celdaAcciones.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'text-sm', 'leading-5');

        const enlaceEditar = document.createElement('a');
        enlaceEditar.href = `editar-cliente.html?id=${id}`;
        enlaceEditar.classList.add('text-teal-600', 'hover:text-teal-900', 'mr-5');
        enlaceEditar.textContent = 'Editar';

        const enlaceEliminar = document.createElement('a');
        enlaceEliminar.href = '#';
        enlaceEliminar.dataset.cliente = id;
        enlaceEliminar.classList.add('text-red-600', 'hover:text-red-900', 'eliminar');
        enlaceEliminar.textContent = 'Eliminar';

        celdaAcciones.appendChild(enlaceEditar);
        celdaAcciones.appendChild(enlaceEliminar);

        fila.appendChild(celdaContacto);
        fila.appendChild(celdaTelefono);
        fila.appendChild(celdaEmpresa);
        fila.appendChild(celdaAcciones);

        listadoClientes.appendChild(fila);
    }

})();
