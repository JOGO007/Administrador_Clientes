(function() {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.error('Error al conectar a la base de datos');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e) {
        e.preventDefault();

        //Leer los inputs del formulario
        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const telefono = document.querySelector('#telefono').value.trim();
        const empresa = document.querySelector('#empresa').value.trim();

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexEmail.test(email)) {
            imprimirAlerta('El correo no tiene un formato valido', 'error');
            return;
        }

        //Crear un objeto con la información del cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');
        objectStore.add(cliente);

        transaction.onerror = function() {
            imprimirAlerta('Error al agregar el cliente', 'error');
        }

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente agregado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html'; // Redirigir a la pagina principal despues de agregar el cliente
            }, 3000);
        }
    }
})();
