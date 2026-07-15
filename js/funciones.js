function conectarDB() {
          const abrirConexion = window.indexedDB.open('crm', 1);

  abrirConexion.onerror = function() {
              console.error('Error al conectar a la base de datos');
  }

  abrirConexion.onsuccess = function() {
              console.log('Conexion a la base de datos establecida correctamente');
              DB = abrirConexion.result;
  }
}

function imprimirAlerta(mensaje, tipo) {
          const formulario = document.querySelector('#formulario');
          if (!formulario) return;

  const alertaExistente = document.querySelector('.alerta');
          if (alertaExistente) {
                      alertaExistente.remove();
          }

  const divMensaje = document.createElement('div');
          divMensaje.textContent = mensaje;
          divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

  if (tipo === 'error') {
              divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
  } else {
              divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
  }

  formulario.appendChild(divMensaje);

  setTimeout(() => {
              divMensaje.remove();
  }, 3000);
}
