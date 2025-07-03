// Base de datos en memoria
let empleados = [];

// Función principal que se ejecuta cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    cargarDatosIniciales();
    actualizarListaEmpleados();
});

// Función para inicializar todos los eventos
function inicializarEventos() {
    // Evento para el formulario de registro
    document.getElementById('employeeForm').addEventListener('submit', registrarEmpleado);
    
    // Evento para búsqueda en tiempo real
    document.getElementById('buscarNombre').addEventListener('input', function() {
        if (this.value.length >= 2) {
            buscarEmpleado();
        } else if (this.value.length === 0) {
            document.getElementById('resultadoBusqueda').innerHTML = '';
        }
    });
}

// Función para registrar empleado
function registrarEmpleado(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const puesto = document.getElementById('puesto').value.trim();
    const equipo = document.getElementById('equipo').value.trim();
    
    // Obtener días seleccionados
    const diasCheckboxes = document.querySelectorAll('input[name="dias"]:checked');
    const dias = Array.from(diasCheckboxes).map(cb => cb.value);
    
    // Validaciones
    if (dias.length === 0) {
        mostrarMensaje('Por favor selecciona al menos un día de trabajo.', 'error');
        return;
    }
    
    // Verificar si el empleado ya existe
    const empleadoExiste = empleados.find(emp => emp.nombre.toLowerCase() === nombre.toLowerCase());
    if (empleadoExiste) {
        mostrarMensaje('Este empleado ya está registrado.', 'error');
        return;
    }
    
    // Crear objeto empleado
    const empleado = {
        id: Date.now(),
        nombre: nombre,
        puesto: puesto,
        equipo: equipo,
        dias: dias
    };
    
    // Agregar a la base de datos
    empleados.push(empleado);
    
    // Limpiar formulario
    document.getElementById('employeeForm').reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('Empleado registrado exitosamente.', 'success');
    
    // Actualizar lista de empleados
    actualizarListaEmpleados();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${tipo}-message">${mensaje}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}

// Función para buscar empleado
function buscarEmpleado() {
    const nombre = document.getElementById('buscarNombre').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    
    if (!nombre) {
        resultadoDiv.innerHTML = '<div class="error-message">Por favor ingresa un nombre para buscar.</div>';
        return;
    }
    
    // Buscar empleados que coincidan
    const empleadosEncontrados = empleados.filter(emp => 
        emp.nombre.toLowerCase().includes(nombre)
    );
    
    if (empleadosEncontrados.length === 0) {
        resultadoDiv.innerHTML = '<div class="error-message">No se encontró ningún empleado con ese nombre.</div>';
        return;
    }
    
    // Mostrar resultados
    let html = '';
    empleadosEncontrados.forEach(emp => {
        html += crearTarjetaEmpleado(emp);
    });
    
    resultadoDiv.innerHTML = html;
}

// Función para crear tarjeta de empleado
function crearTarjetaEmpleado(empleado) {
    return `
        <div class="employee-info">
            <h3>👤 ${empleado.nombre}</h3>
            <div class="info-item">
                <strong>Puesto:</strong> ${empleado.puesto}
            </div>
            <div class="info-item">
                <strong>Equipo:</strong> ${empleado.equipo}
            </div>
            <div class="info-item">
                <strong>Días de trabajo:</strong> 
                <div class="days-list">
                    ${empleado.dias.map(dia => `<span class="day-tag">${dia}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Función para actualizar la lista de empleados
function actualizarListaEmpleados() {
    const listaDiv = document.getElementById('listaEmpleados');
    
    if (empleados.length === 0) {
        listaDiv.innerHTML = '<div class="error-message">No hay empleados registrados.</div>';
        return;
    }
    
    let html = '<div class="employees-list">';
    empleados.forEach(emp => {
        html += `
            <div class="employee-card" onclick="mostrarDetalleEmpleado('${emp.nombre}')">
                <strong>${emp.nombre}</strong> - ${emp.puesto} (${emp.equipo})
            </div>
        `;
    });
    html += '</div>';
    
    listaDiv.innerHTML = html;
}

// Función para mostrar detalle de empleado al hacer clic
function mostrarDetalleEmpleado(nombre) {
    document.getElementById('buscarNombre').value = nombre;
    buscarEmpleado();
    
    // Hacer scroll hacia la sección de búsqueda
    document.querySelector('.search-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Función para cargar datos iniciales
function cargarDatosIniciales() {
    empleados = [
        {
            id: 1,
            nombre: "Costeño Rivera Esteban",
            puesto: "Software Engineer",
            equipo: "Platform",
            cantidadEquipo: "3",
            dias: [ "Miercoles", "Jueves", "Viernes" ]
        },
        {
            id: 2,
            nombre: "Acero Duarte Marisol",
            puesto: "Head of Quality Manager",
            equipo: "Transversal",
            dias: ["Lunes", "Martes", "Jueves"]
        },
        {
            id: 3,
            nombre: "Alarcon Garcia Emilia",
            puesto: "Quality Engineer",
            equipo: "Riyadh",
            dias: ["Lunes", "Miercoles", "Jueves"]
        },
        {
            id: 4,
            nombre: "Alarcon Garcia Juliana",
            puesto: "Quality Engineer",
            equipo: "Custom 3",
            dias: ["Martes", "Miércoles","Viernes"]
        },
        {
            id: 5,
            nombre: "Alzate Zapata Valentina",
            puesto: "Business Analyst",
            equipo: "Producto",
            dias: ["Jueves", "Viernes"]
        },
        {
            id: 6,
            nombre: "Arango Ramirez Luisa",
            puesto: "Quality Engineer",
            equipo: "Infras",
            dias: ["Lunes","Martes", "Viernes",]
        },
        {
            id: 7,
            nombre: "Arbelaez Calle Alejandro",
            puesto: "Software Engineer",
            equipo: "Consilium",
            dias: ["Lunes", "Miércoles", "Viernes", "Domingo"]
        },
        {
            id: 8,
            nombre: "Arias Escudero Nicolas",
            puesto: "Software Engineer",
            equipo: "Custom 5",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 9,
            nombre: "Arias Valencia John",
            puesto: "Software Engineer",
            equipo: "Core UI ",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 10,
            nombre: "Aristizabal Andres",
            puesto: "Software Engineer",
            equipo: "Custom 5",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 11,
            nombre: "Benavides Guevara Paula",
            puesto: "Quality Engineer",
            equipo: "Cyprus",
            dias: ["Miércoles", "Jueves", "Viernes"]
        },
        {
            id: 12,
            nombre: "Betancourt Montoya Gewralds",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes","Jueves", "Viernes"]
        },
        {
            id: 13,
            nombre: "Bocanegra Acosta Natalia",
            puesto: "Product Manager",
            equipo: "Producto",
            dias: ["Martes","Miércoles"]
        },
        {
            id: 14,
            nombre: "Buitrago Ramirez Darwin",
            puesto: "Software Engineer",
            equipo: "Core I Y II",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 15,
            nombre: "Buritica Atehortua Oscar",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 16,
            nombre: "Bustamante Rojas Cristian",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 17,
            nombre: "Calderon Carranza George",
            puesto: "Software Engineer",
            equipo: "Custom 5",
            dias: ["Martes","Miercoles","Jueves"]
        }, 
        {
            id: 18,
            nombre: "Cañón Peña Yurani",
            puesto: "Scrum Master",
            equipo: "Core UI",
            dias: ["Lunes", "Jueves", "Viernes"]
        }, 
        {
            id: 19,
            nombre: "Cardona Mendoza Birman",
            puesto: "Software Engineer",
            equipo: "Members",
            dias: ["Miércoles", "Jueves", "Viernes"]
        }, 
        {
            id: 20,
            nombre: "Carreño Alvarez Elizabeth",
            puesto: "Business Analyst",
            equipo: "Producto",
            dias: ["Martes","Miércoles"]
        }, 
        {
            id: 21,
            nombre: "Castaño Serna Juan",
            puesto: "Software Engineer",
            equipo: "Custom 5",
            dias: ["Martes","Miércoles", "Jueves"]
        }, 
        {
            id: 22,
            nombre: "Ceballos Rojas Diego Fernando",
            puesto: "Software Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 23,
            nombre: "Cruz Barrera Christian David",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        }
        
    ];
}

// Funciones adicionales para futuras mejoras

// Función para eliminar empleado
function eliminarEmpleado(id) {
    empleados = empleados.filter(emp => emp.id !== id);
    actualizarListaEmpleados();
    mostrarMensaje('Empleado eliminado exitosamente.', 'success');
}

// Función para editar empleado
function editarEmpleado(id) {
    const empleado = empleados.find(emp => emp.id === id);
    if (empleado) {
        // Cargar datos en el formulario
        document.getElementById('nombre').value = empleado.nombre;
        document.getElementById('puesto').value = empleado.puesto;
        document.getElementById('equipo').value = empleado.equipo;
        document.getElementById('cantidadEquipo').value = empleado.cantidadEquipo;
        
        // Seleccionar días
        empleado.dias.forEach(dia => {
            const checkbox = document.querySelector(`input[value="${dia}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Eliminar el empleado actual para que se pueda actualizar
        eliminarEmpleado(id);
        
        // Hacer scroll hacia el formulario
        document.querySelector('.section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Función para exportar datos (futuro)
function exportarDatos() {
    const datos = JSON.stringify(empleados, null, 2);
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'empleados.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Función para importar datos (futuro)
function importarDatos(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                empleados = datos;
                actualizarListaEmpleados();
                mostrarMensaje('Datos importados exitosamente.', 'success');
            } catch (error) {
                mostrarMensaje('Error al importar datos. Verifica el formato del archivo.', 'error');
            }
        };
        reader.readAsText(file);
    }
}