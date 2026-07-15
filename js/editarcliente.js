(function() {

    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        //Verificar si hay un ID en la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        conectarDB();

        //Actualizar el registro de cliente
        formulario.addEventListener('submit', actualizarCliente);
    });

    function actualizarCliente(e) {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const empresa = empresaInput.value.trim();

        //Validar campos del formulario
        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexEmail.test(email)) {
            imprimirAlerta('El correo no tiene un formato valido', 'error');
            return;
        }

        //Actualizar el cliente
        const clienteActualizado = {
            nombre,
            email,
            telefono,
            empresa,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente actualizado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        };

        transaction.onerror = function() {
            imprimirAlerta('Error al actualizar el cliente', 'error');
        };
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const peticion = objectStore.get(Number(id));

        peticion.onsuccess = function() {
            if(peticion.result) {
                llenarFormulario(peticion.result);
            }
        };

        peticion.onerror = function() {
            console.error('Error al obtener el cliente');
        };
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.error('Error al conectar a la base de datos');
        }

        abrirConexion.onsuccess = function() {
            console.log('Conexion a la base de datos establecida correctamente');
            DB = abrirConexion.result;

            if(idCliente) {
                obtenerCliente(idCliente);
            }
        }
    }
})();
