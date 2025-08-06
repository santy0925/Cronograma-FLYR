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
    
    // Evento para búsqueda en tiempo real por nombre
    document.getElementById('buscarNombre').addEventListener('input', function() {
        if (this.value.length >= 2) {
            buscarEmpleado();
        } else if (this.value.length === 0) {
            document.getElementById('resultadoBusqueda').innerHTML = '';
        }
    });

    // Evento para búsqueda en tiempo real por equipo
    document.getElementById('buscarEquipo').addEventListener('input', function() {
        if (this.value.length >= 2) {
            buscarPorEquipo();
        } else if (this.value.length === 0) {
            document.getElementById('resultadoBusquedaEquipo').innerHTML = '';
        }
    });

    // Evento para la edición masiva de días por equipo
    document.getElementById('btn-editar-equipo').addEventListener('click', editarDiasPorEquipo);
}

// Función para registrar empleado
function registrarEmpleado(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const cargo = document.getElementById('cargo').value.trim();
    const equipo = document.getElementById('equipo').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const region = document.getElementById('region').value.trim();
    const tipoAsistencia = document.getElementById('tipoAsistencia').value.trim();
    const genero = document.getElementById('genero').value.trim();

    // Obtener días seleccionados
    const diasCheckboxes = document.querySelectorAll('input[name="dias"]:checked');
    const dias = Array.from(diasCheckboxes).map(cb => cb.value);
    
    // Validaciones
    if (dias.length === 0) {
        mostrarMensaje('Por favor selecciona al menos un día de trabajo.', 'error');
        return;
    }
    
    // Verificar si el empleado ya existe (para evitar duplicados al editar)
    const empleadoExiste = empleados.find(emp => emp.nombre.toLowerCase() === nombre.toLowerCase());
    if (empleadoExiste) {
        mostrarMensaje('Este empleado ya está registrado.', 'error');
        return;
    }
    
    // Crear objeto empleado
    const empleado = {
        id: Date.now(),
        nombre: nombre,
        cargo: cargo,
        equipo: equipo,
        ciudad: ciudad,
        region: region,
        tipoAsistencia: tipoAsistencia,
        genero: genero,
        dias: dias
    };
    
    // Agregar a la base de datos
    empleados.push(empleado);
    
    // Limpiar formulario
    document.getElementById('employeeForm').reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('Empleado registrado exitosamente.', 'success');
    
    // Guardar los cambios en localStorage
    guardarEmpleados();
    
    // Actualizar lista de empleados
    actualizarListaEmpleados();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo, idDiv = 'message') {
    const messageDiv = document.getElementById(idDiv);
    messageDiv.innerHTML = `<div class="${tipo}-message">${mensaje}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}

// Función para buscar empleado por nombre
function buscarEmpleado() {
    const nombre = document.getElementById('buscarNombre').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    
    if (!nombre) {
        resultadoDiv.innerHTML = '';
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
        html += crearTarjetaEmpleado(emp, true);
    });
    
    resultadoDiv.innerHTML = html;
}

// Función para buscar empleado por equipo
function buscarPorEquipo() {
    const equipo = document.getElementById('buscarEquipo').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultadoBusquedaEquipo');

    if (!equipo) {
        resultadoDiv.innerHTML = '';
        return;
    }

    // Buscar empleados que coincidan con el equipo
    const empleadosEncontrados = empleados.filter(emp =>
        emp.equipo.toLowerCase().includes(equipo)
    );

    if (empleadosEncontrados.length === 0) {
        resultadoDiv.innerHTML = '<div class="error-message">No se encontró ningún empleado en ese equipo.</div>';
        return;
    }

    // Mostrar resultados
    let html = '';
    empleadosEncontrados.forEach(emp => {
        html += crearTarjetaEmpleado(emp, true);
    });

    resultadoDiv.innerHTML = html;
}

// Función para crear tarjeta de empleado
function crearTarjetaEmpleado(empleado, conBoton = false) {
    const botonEditar = conBoton ? `<button class="btn edit-btn" onclick="editarEmpleadoIndividual(${empleado.id})">Editar</button>` : '';

    return `
        <div class="employee-info">
            <h3>👤 ${empleado.nombre}</h3>
            <div class="info-item">
                <strong>Cargo:</strong> ${empleado.cargo}
            </div>
            <div class="info-item">
                <strong>Equipo:</strong> ${empleado.equipo}
            </div>
            <div class="info-item">
                <strong>Ciudad:</strong> ${empleado.ciudad}
            </div>
            <div class="info-item">
                <strong>Región:</strong> ${empleado.region}
            </div>
            <div class="info-item">
                <strong>Tipo de Asistencia:</strong> ${empleado.tipoAsistencia}
            </div>
            <div class="info-item">
                <strong>Género:</strong> ${empleado.genero}
            </div>
            <div class="info-item">
                <strong>Días de trabajo:</strong> 
                <div class="days-list">
                    ${empleado.dias.map(dia => `<span class="day-tag">${dia}</span>`).join('')}
                </div>
            </div>
            ${botonEditar}
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
                <span><strong>${emp.nombre}</strong> - ${emp.cargo} (${emp.equipo})</span>
                <button class="btn edit-btn" onclick="editarEmpleadoIndividual(${emp.id})">Editar</button>
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

// Nueva función para editar un empleado individualmente
function editarEmpleadoIndividual(id) {
    const empleado = empleados.find(emp => emp.id === id);
    if (empleado) {
        // Cargar datos en el formulario de registro
        document.getElementById('nombre').value = empleado.nombre;
        document.getElementById('cargo').value = empleado.cargo;
        document.getElementById('equipo').value = empleado.equipo;
        document.getElementById('ciudad').value = empleado.ciudad;
        document.getElementById('region').value = empleado.region;
        document.getElementById('tipoAsistencia').value = empleado.tipoAsistencia;
        document.getElementById('genero').value = empleado.genero;
        
        // Desmarcar todos los checkboxes de días primero
        document.querySelectorAll('input[name="dias"]').forEach(cb => cb.checked = false);
        
        // Seleccionar días
        empleado.dias.forEach(dia => {
            const checkbox = document.querySelector(`input[name="dias"][value="${dia}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Eliminar el empleado actual para que se pueda registrar el actualizado
        eliminarEmpleado(id);
        
        // Hacer scroll hacia el formulario
        document.querySelector('.section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Nueva función para editar los días de trabajo de un equipo completo
function editarDiasPorEquipo() {
    const equipo = document.getElementById('equipoAEditar').value.trim().toLowerCase();
    
    if (!equipo) {
        mostrarMensaje('Por favor ingresa un nombre de equipo para editar.', 'error', 'messageEquipo');
        return;
    }

    const nuevosDiasCheckboxes = document.querySelectorAll('input[name="edit-dias"]:checked');
    const nuevosDias = Array.from(nuevosDiasCheckboxes).map(cb => cb.value);

    if (nuevosDias.length === 0) {
        mostrarMensaje('Por favor selecciona al menos un día de trabajo.', 'error', 'messageEquipo');
        return;
    }
    
    // Encontrar empleados del equipo
    const empleadosDelEquipo = empleados.filter(emp => emp.equipo.toLowerCase().includes(equipo));

    if (empleadosDelEquipo.length === 0) {
        mostrarMensaje(`No se encontró el equipo "${equipo}".`, 'error', 'messageEquipo');
        return;
    }
    
    // Actualizar los días de trabajo de cada empleado en el equipo
    empleadosDelEquipo.forEach(emp => {
        emp.dias = nuevosDias;
    });

    // Limpiar campos y actualizar la lista
    document.getElementById('equipoAEditar').value = '';
    document.querySelectorAll('input[name="edit-dias"]').forEach(cb => cb.checked = false);
    
    // Guardar los cambios en localStorage
    guardarEmpleados();

    actualizarListaEmpleados();
    mostrarMensaje(`Se han actualizado los días para ${empleadosDelEquipo.length} empleados del equipo "${equipo}".`, 'success', 'messageEquipo');
}

// Función para cargar datos iniciales
function cargarDatosIniciales() {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
        empleados = JSON.parse(empleadosGuardados);
    } else {
        // La lista de empleados original se mantiene
        empleados = [
            {
                id: 1,
                nombre: "Castaño Rivera Esteban",
                cargo: "Software Engineer",
                equipo: "Platform",
                ciudad: "Chinchiná",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: [ "N/A" ]
            },
            {
                id: 2,
                nombre: "Acero Duarte Marisol",
                cargo: "Head of Quality Manager",
                equipo: "Transversal",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 3,
                nombre: "Alarcon Garcia Emilia",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 5,
                nombre: "Alzate Zapata Valentina",
                cargo: "Business Analyst",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["Martes", "Miercoles"]
            },
            {
                id: 6,
                nombre: "Arango Ramirez Luisa",
                cargo: "Quality Engineer",
                equipo: "Infras",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["Miercoles", "Jueves", "Viernes"]
            },
            {
                id: 7,
                nombre: "Arbelaez Calle Alejandro",
                cargo: "Software Engineer",
                equipo: "Consilium",
                ciudad: "Man",
                region: "Zona Cafetera",
                tipoAsistencia: "Presencial",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 8,
                nombre: "Arias Escudero Nicolas",
                cargo: "Software Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 9,
                nombre: "Arias Valencia John",
                cargo: "Software Engineer",
                equipo: "Core UI ",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 10,
                nombre: "Aristizabal Andres",
                cargo: "Software Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 11,
                nombre: "Benavides Guevara Paula",
                cargo: "Quality Engineer",
                equipo: "Cyprus",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 12,
                nombre: "Betancourt Montoya Gewralds",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 13,
                nombre: "Bocanegra Acosta Natalia",
                cargo: "Product Manager",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 14,
                nombre: "Buitrago Ramirez Darwin",
                cargo: "Software Engineer",
                equipo: "Core I Y II",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 15,
                nombre: "Buritica Atehortua Oscar",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "Presencial",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 16,
                nombre: "Bustamante Rojas Cristian",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "Híbrido",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 17,
                nombre: "Calderon Carranza George",
                cargo: "Software Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 18,
                nombre: "Cañon Peña Yurani",
                cargo: "Scrum Master",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 19,
                nombre: "Cardona Mendoza Birman",
                cargo: "Software Engineer",
                equipo: "Members",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 20,
                nombre: "Carreño Alvarez Elizabeth",
                cargo: "Business Analyst",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 21,
                nombre: "Castaño Serna Juan",
                cargo: "Software Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 22,
                nombre: "Ceballos Rojas Diego Fernando",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 23,
                nombre: "Cruz Barrera Christian David",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 24,
                nombre: "Cuartas Castano David",
                cargo: "Software Engineer",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 25,
                nombre: "Duque Fernandez Andres",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Caldas",
                tipoAsistencia: "Presencial",
                genero: "Masculino",
                dias: ["Martes", "Miércoles", "Viernes"]
            }, 
            {
                id: 26,
                nombre: "Duran Londoño Cristian",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 27,
                nombre: "Echeverry Giraldo Daniel",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 28,
                nombre: "Eusse Lopez Alejandra",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 29,
                nombre: "Florez Cendales Julian",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 30,
                nombre: "Florez Chalarca Jimena",
                cargo: "Product Manager",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 31,
                nombre: "Franco Mejia Felipe",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 32,
                nombre: "Juyar Galindo Sadai",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 33,
                nombre: "Galvez Bedoya Santiago",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 34,
                nombre: "Galvis Aguirre Yohana",
                cargo: "Quality Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 35,
                nombre: "Galvis Tabares Santiago",
                cargo: "Quality Engineer",
                equipo: "Automatizaciones",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 36,
                nombre: "Garcia Arango Juan",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 37,
                nombre: "Garcia Giraldo Erika",
                cargo: "Quality Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 38,
                nombre: "Garcia Grisales Sandra",
                cargo: "Software Engineer",
                equipo: "Custom 1",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 39,
                nombre: "Giron Casierra William Alejandro",
                cargo: "Software Engineer",
                equipo: "Dynamics",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            }, 
            {
                id: 40,
                nombre: "Gomez Ramirez Diego Bernabe",
                cargo: "Software Engineer",
                equipo: "Delta",
                ciudad: "Cali",
                region: "Valle del Cauca",
                tipoAsistencia: "Híbrido",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles"]
            }, 
            {
                id: 42,
                nombre: "Gomez Castrillon Cindy",
                cargo: "Scrum Master",
                equipo: "Cyprus",
                ciudad: "Manizales",
                region: "Caldas",
                tipoAsistencia: "Presencial",
                genero: "Femenino",
                dias: ["Miercoles", "Jueves", "Viernes"]
            }, 
            {
                id: 43,
                nombre: "Cumbal Benavides Andrea",
                cargo: "Scrum Master",
                equipo: "Riyadh",
                ciudad: "Bogotá",
                region: "Cundinamarca",
                tipoAsistencia: "Remoto",
                genero: "Femenino",
                dias: ["Martes", "Jueves", "Viernes"]
            }, 
            {
                id: 44,
                nombre: "Gomez Mercado Sara",
                cargo: "Project Manager",
                equipo: "Sun Express",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Presencial",
                genero: "Femenino",
                dias: ["Martes", "Miércoles", "Viernes"]
            }, 
            {
                id: 45,
                nombre: "Gomez Tangarife Erika",
                cargo: "IT",
                equipo: "TI",
                ciudad: "Manizales",
                region: "Caldas",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 46,
                nombre: "Gonzalez Hernandez Leidy",
                cargo: "Quality Engineer",
                equipo: "Core I Y II",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 47,
                nombre: "Gonzalez Lopez Daniela",
                cargo: "Quality Engineer",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            }, 
            {
                id: 48,
                nombre: "Rojas Tovar Angela",
                ciudad: "Pitalito",
                region: "Zona Sur Occidente",
                tipoAsistencia: "Remoto",
                equipo: "Dynamics",
                genero: "Femenino",
                cargo: "Quality Engineer",
                dias: ["N/A"]
            }, 
            {
                id: 49,
                nombre: "Gonzalez Tamayo Andres",
                cargo: "Quality Engineer",
                equipo: "Automatizaciones",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 50,
                nombre: "Grajales Sanchez Miguel",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 51,
                nombre: "Guerrero Kevin",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 52,
                nombre: "Gutierrez Franco Nataly",
                cargo: "Scrum Master",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 53,
                nombre: "Henao Alexandra",
                cargo: "Product Manager",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 54,
                nombre: "Henao Burgos Jimena",
                cargo: "Quality Engineer",
                equipo: "Platform",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 55,
                nombre: "Hernandez Arias David",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 56,
                nombre: "Hernandez Rendon Luisa",
                cargo: "Quality Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 57,
                nombre: "Herrera Quintero Camila",
                cargo: "Quality Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 58,
                nombre: "Infante Angie Carolina",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 59,
                nombre: "Loaiza Bedoya Manuela",
                cargo: "Quality Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 60,
                nombre: "Loaiza Agudelo Santiago",
                cargo: "Quality Engineer",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 61,
                nombre: "Loaiza Sanchez Leydi Johana",
                cargo: "Project Manager",
                equipo: "Message ",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 62,
                nombre: "Londoño Gonzalez Angela",
                cargo: "Quality Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 63,
                nombre: "Londoño Holguin Maria Fernanda",
                cargo: "Quality Engineer",
                equipo: "Transversal",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 64,
                nombre: "Lopez Diana Lorena",
                cargo: "Quality Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 65,
                nombre: "Lopez Katherine",
                cargo: "Business Analyst",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 66,
                nombre: "Lopez Hoyos Victor",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 67,
                nombre: "Mejia Buitrago Daniela",
                cargo: "Software Engineer",
                equipo: "Custom 2",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 68,
                nombre: "Molina Cadavid Sergio",
                cargo: "Software Engineer",
                equipo: "Delta",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 69,
                nombre: "Montes Londoño Cristian",
                cargo: "Software Engineer",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 70,
                nombre: "Morales Herrera Juan",
                cargo: "Software Engineer",
                equipo: "CORE UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/Manizales"]
            },
            {
                id: 71,
                nombre: "Morales Marin Juliana",
                cargo: "Project Manager",
                equipo: "N/A",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 72,
                nombre: "Morales Velez Sebastian",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 73,
                nombre: "Ocampo Parra Melissa",
                cargo: "Business Analyst",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 74,
                nombre: "Ortega Cupacan Cristian",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 75,
                nombre: "Osorio Giraldo Maria Fernanda",
                cargo: "Business Analyst",
                equipo: "Core I Y II",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 76,
                nombre: "Ospina Colorado Nestor",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 77,
                nombre: "Ospina Londoño Fabiana",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 78,
                nombre: "Pineda Salas Deivinson",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 79,
                nombre: "Pineda Vasquez Juliana",
                cargo: "Quality Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 80,
                nombre: "Posada Garcia William",
                cargo: "Software Engineer",
                equipo: "Consilium",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 81,
                nombre: "Posada Mejias Jerel",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 82,
                nombre: "Reina Becerra Juan Pablo",
                cargo: "Software Engineer",
                equipo: "Dynamics",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 83,
                nombre: "Renteria Gutierrez Santiago",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 84,
                nombre: "Rios Cardona Yamid",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 85,
                nombre: "Rivera Castrillon Liseth",
                cargo: "Scrum Master",
                equipo: "Custom 5 - Dynamics",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 86,
                nombre: "Robles Ocampo Luis",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 87,
                nombre: "Rodriguez Pineda Johana",
                cargo: "Project Manager",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 88,
                nombre: "Salazar Rendon Fabio",
                cargo: "Software Engineer",
                equipo: "Vueling",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 89,
                nombre: "Sanchez Cortes Jhon",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 90,
                nombre: "Sanchez Valencia Carol",
                cargo: "Scrum Master",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 91,
                nombre: "Sanchez Valencia Daiam",
                cargo: "Quality Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 92,
                nombre: "Sanchez Velasquez Paola",
                cargo: "Quality Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 93,
                nombre: "Sanchez Yepes Carolina",
                cargo: "Product Manager",
                equipo: "Transversal",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "Remote",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 94,
                nombre: "Valencia Betancur Leonardo",
                cargo: "Software Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 95,
                nombre: "Valencia Martinez Sandra",
                cargo: "Manager",
                equipo: "Gerente",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "N/A",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 96,
                nombre: "Valencia Valencia Jerson",
                cargo: "Software Engineer",
                equipo: "Platform",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 97,
                nombre: "Villalba Ballesteros Luis Felipe ",
                cargo: "Software Engineer",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 98,
                nombre: "Velasco Roman Brayan",
                cargo: "Project Manager",
                equipo: "Custom 1 - Platform",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 99,
                nombre: "Velasquez Quintero Sebastian",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 100,
                nombre: "Villa Valencia Natalia",
                cargo: "Product Manager",
                equipo: "Producto",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 101,
                nombre: "Yanez Malave Luis",
                cargo: "Quality Engineer",
                equipo: "CORE UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 102,
                nombre: "Zuluaga Cardona Jenny",
                cargo: "Scrum Master",
                equipo: "Omega - Delta",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "Presencial",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 103,
                nombre: "Castaño Velasquez Jhon Jairo",
                cargo: "Software Engineer",
                equipo: "Core I Y II",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 104,
                nombre: "Rubio Giraldo Danna Vanessa",
                cargo: "Software Engineer",
                equipo: "Custom 5",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 106,
                nombre: "Naranjo Garcia Alejandra",
                cargo: "Software Engineer",
                equipo: "Core I Y II",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 107,
                nombre: "Salgado Castaño Juan Felipe",
                cargo: "Software Engineer",
                equipo: "Diseño",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 108,
                nombre: "Aguirre Ocampo Jheidy Lizeth",
                cargo: "Quality Engineer",
                equipo: "Custom 1",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 109,
                nombre: "Gutierrez Rodas Carlos Alberto",
                cargo: "Software Engineer",
                equipo: "Core I Y II Transversal AV",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 110,
                nombre: "Tavera Orozco Natalia",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 111,
                nombre: "Mejia Mendoza Jhonatan Alejandro",
                cargo: "Software Engineer",
                equipo: "Platform",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 112,
                nombre: "Mejia Martinez Vanessa Paola",
                cargo: "Quality Engineer",
                equipo: "Omega",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 113,
                nombre: "Loaiza Puerta Jorge Luis",
                cargo: "Software Engineer",
                equipo: "Riyadh",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 114,
                nombre: "Montaño Torres Stefany",
                cargo: "Quality Engineer",
                equipo: "Custom 1",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 115,
                nombre: "Acosta Briceño Frank Sebastian",
                cargo: "Software Engineer",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 116,
                nombre: "Gomez Montoya Luis Fernando",
                cargo: "Software Engineer",
                equipo: "Omega",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 117,
                nombre: "Rubio Tabarez Hector David",
                cargo: "Software Engineer",
                equipo: "Infra de members",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 118,
                nombre: "Salazar Giraldo Pedro Pablo",
                cargo: "Scrum Master",
                equipo: "Customer Sucess",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 119,
                nombre: "Beltran Cardona Juan Manuel",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 120,
                nombre: "Grajales Giraldo JuanJose",
                cargo: "Software Engineer",
                equipo: "Dynamics",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "Remoto",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 121,
                nombre: "Henao Ramirez Eduardo Andres",
                cargo: "Manager Engineering",
                equipo: "Custom 3",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 122,
                nombre: "Cardona Torres Santiago",
                cargo: "Quality Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 123,
                nombre: "Ocampo Castaño Jose Brayan",
                cargo: "Quality Engineer",
                equipo: "Automatizaciones",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 124,
                nombre: "Cano Jaramillo Juan Pablo",
                cargo: "Application Support Specialist",
                equipo: "SRE",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 125,
                nombre: "Albornoz Rodriguez Julian Andres",
                cargo: "Manager Engineering",
                equipo: "Custom 1 - Platform",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 126,
                nombre: "Rodriguez Huertas Max Frank",
                cargo: "Director Engineering",
                equipo: "Transversal",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 127,
                nombre: "Fontalvo Salgado Ivan Alberto ",
                cargo: "Manager Engineering",
                equipo: "Custom 5 - Dynamics",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 128,
                nombre: "Gonzalez Muñoz Laura Sofia ",
                cargo: "Software Engineer",
                equipo: "AM",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 129,
                nombre: "Cardona Calderon Cesar",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 130,
                nombre: "Galvez Restrepo Nelson ",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 131,
                nombre: "Bonilla Daniela ",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 132,
                nombre: "Diaz Tovar Cristian ",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 133,
                nombre: "Moreno Vargas Hernando  ",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 134,
                nombre: "Sanchez Arias Fernan",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 136,
                nombre: "Mejia Alarcon Julian Andres",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 137,
                nombre: "Cardona Herrera Santiago",
                cargo: "Intership",
                equipo: "Sena",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
            },
            {
                id: 138,
                nombre: "Osorio Garcia Andres Enrique",
                cargo: "Ingeniero de Software",
                equipo: "N/A",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 139,
                nombre: "Castellano Paula Alejandra",
                cargo: "Senior Manager, Engineering",
                equipo: "Transversal",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 141,
                nombre: "Buitrago Guzman Franzi",
                cargo: "Software Engineer",
                equipo: "Diseño",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remoto",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 142,
                nombre: "Pacheco Escobar Ricardo",
                cargo: "Software Engineer",
                equipo: "Avianca",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remoto",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 143,
                nombre: "Quintero Gaitan Laura",
                cargo: "Quality Engineer",
                equipo: "Riyadh",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remoto",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 144,
                nombre: "Minotta Medina Lina",
                cargo: "Quality Engineer",
                equipo: "Vueling",
                ciudad: "Cali",
                region: "Zona Pacífico",
                tipoAsistencia: "Remoto",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 145,
                nombre: "Tavera Orozco Luis",
                cargo: "Software Engineer",
                equipo: "Migración",
                ciudad: "Cali",
                region: "Zona Pacífico",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 146,
                nombre: "Narvaez Erazo Alexander",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Ipiales - Nariño ",
                region: "Zona Amazonas",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 147,
                nombre: "Ramirez Parra Cristian",
                cargo: "Software Engineer",
                equipo: "Accesibilidad",
                ciudad: "Libano  ",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 148,
                nombre: "Bocanegra Acosta Maritza",
                cargo: "Core I Y II",
                equipo: "Scrum Master   ",
                ciudad: "Armenia",
                region: "Zona Cafetera",
                tipoAsistencia: "Remoto",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 149,
                nombre: "Gonzalez Olviera Yeffran",
                cargo: "Software Engineer",
                equipo: "Infra AV",
                ciudad: "barranquilla",
                region: "Costa Atlántica",
                tipoAsistencia: "Remoto",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 150,
                nombre: "Carrascal Rojas Yorman",
                cargo: "Software Engineer",
                equipo: "Infra AV",
                ciudad: "Ocaña",
                region: "Santander",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 151,
                nombre: "Corrales Ortiz Juan",
                cargo: "Software Engineer",
                equipo: "Mantenimiento & Suporte",
                ciudad: "Risaralda",
                region: "Zona Cafetera",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 152,
                nombre: "Duque Fernandez Andres",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Manizales",
                region: "Zona Cafetera",
                tipoAsistencia: "On-Site",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 153,
                nombre: "Gonzalez Garcia Lombardo",
                cargo: "Software Engineer",
                equipo: "Avianca",
                ciudad: "Momil",
                region: "Cordoba",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 154,
                nombre: "Tamayo Toro Julian",
                cargo: "Software Engineer",
                equipo: "Core I Y II",
                ciudad: "Bogota",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 155,
                nombre: "Vallejo Arango Emersson",
                cargo: "Software Engineer",
                equipo: "Delta",
                ciudad: "Cali",
                region: "Zona Pacífico",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 156,
                nombre: "Holguin Quiroz Stefania",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 157,
                nombre: "Holguin Quiroz Stefania",
                cargo: "Software Engineer",
                equipo: "Core UI",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 158,
                nombre: "Montoya Moreno Esteban",
                cargo: "Quality Engineer",
                equipo: "Sun Express",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 159,
                nombre: "Suarez Díaz Leoana",
                cargo: "Software Engineer",
                equipo: "Core I Y II",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 160,
                nombre: "Puerta Florez Jonathan",
                cargo: "Software Engineer",
                equipo: "Omega",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 161,
                nombre: "Restrepo Juliana",
                cargo: "Quality Engineer",
                equipo: "Avianca",
                ciudad: "Medellín",
                region: "Antioquia",
                tipoAsistencia: "Remote",
                genero: "Femenino",
                dias: ["N/A"]
            },
            {
                id: 162,
                nombre: "Aguilar Junca Christian",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Paipa",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 163,
                nombre: "Aguilar Junca Christian",
                cargo: "Software Engineer",
                equipo: "Sun Express",
                ciudad: "Paipa",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 164,
                nombre: "González Franco Jorge",
                cargo: "Product Manager",
                equipo: "Customer Success",
                ciudad: "Pereira",
                region: "Zona Cafetera",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 165,
                nombre: "Preciado Guevara Oscar",
                cargo: "Quality Engineer",
                equipo: "Dynamics",
                ciudad: "Pereira",
                region: "Zona Cafetera",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 166,
                nombre: "Perez Bolaños Juan Manuel",
                cargo: "Product Manager",
                equipo: "Cusromer Success",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 167,
                nombre: "Ramirez Nicolas ",
                cargo: "Application Support Specialist II",
                equipo: "SRE",
                ciudad: "Soacha",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 168,
                nombre: "Mantilla Barbosa Hector ",
                cargo: "Senior Product Manager",
                equipo: "N/A",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 169,
                nombre: "Mantilla Barbosa Hector ",
                cargo: "Senior Product Manager",
                equipo: "N/A",
                ciudad: "Bogotá",
                region: "Zona Andina",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            },
            {
                id: 170,
                nombre: "Ceron Bolaños Jesus Andres ",
                cargo: "Application Support Specialist",
                equipo: "SRE",
                ciudad: "Cali",
                region: "Zona Pacífico",
                tipoAsistencia: "Remote",
                genero: "Masculino",
                dias: ["N/A"]
            }
        ];
    }
}

// Función para guardar los empleados en localStorage
function guardarEmpleados() {
    localStorage.setItem('empleados', JSON.stringify(empleados));
}

// Funciones adicionales
function eliminarEmpleado(id) {
    empleados = empleados.filter(emp => emp.id !== id);
    guardarEmpleados();
    actualizarListaEmpleados();
}

// Las funciones de exportar e importar se mantienen sin cambios
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

function importarDatos(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                empleados = datos;
                guardarEmpleados();
                actualizarListaEmpleados();
                mostrarMensaje('Datos importados exitosamente.', 'success');
            } catch (error) {
                mostrarMensaje('Error al importar datos. Verifica el formato del archivo.', 'error');
            }
        };
        reader.readAsText(file);
    }
}