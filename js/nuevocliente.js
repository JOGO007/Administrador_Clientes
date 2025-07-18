(function() {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        //Leer los inputs del formulario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //Crear un objeto con la información del cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }

        cliente.id = Date.now(); // Asignar un ID único basado en la fecha actual

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
                window.location.href = 'index.html'; // Redirigir a la página principal después de agregar el cliente
            }, 3000);
        }
    }

})();