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
}

// Función para registrar empleado
function registrarEmpleado(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const cargo = document.getElementById('cargo').value.trim(); // Changed from puesto to cargo
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
        cargo: cargo, // Changed from puesto to cargo
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

// Función para buscar empleado por nombre
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

// Función para buscar empleado por equipo
function buscarPorEquipo() {
    const equipo = document.getElementById('buscarEquipo').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultadoBusquedaEquipo');

    if (!equipo) {
        resultadoDiv.innerHTML = '<div class="error-message">Por favor ingresa un equipo para buscar.</div>';
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
                <strong>${emp.nombre}</strong> - ${emp.cargo} (${emp.equipo})
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
            nombre: "Castaño Rivera Esteban",
            cargo: "Software Engineer",
            equipo: "Platform",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: [ "Miercoles", "Jueves", "Viernes" ]
        },
        {
            id: 2,
            nombre: "Acero Duarte Marisol",
            cargo: "Head of Quality Manager",
            equipo: "Transversal",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes", "Martes", "Jueves"]
        },
        {
            id: 3,
            nombre: "Alarcon Garcia Emilia",
            cargo: "Quality Engineer",
            equipo: "Riyadh",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 4,
            nombre: "Alarcon Garcia Juliana",
            cargo: "Quality Engineer",
            equipo: "Custom 3",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 5,
            nombre: "Alzate Zapata Valentina",
            cargo: "Business Analyst",
            equipo: "Producto",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes", "Miercoles"]
        },
        {
            id: 6,
            nombre: "Arango Ramirez Luisa",
            cargo: "Quality Engineer",
            equipo: "Infras",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 7,
            nombre: "Arbelaez Calle Alejandro",
            cargo: "Software Engineer",
            equipo: "Consilium",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Jueves","Viernes"]
        },
        {
            id: 8,
            nombre: "Arias Escudero Nicolas",
            cargo: "Software Engineer",
            equipo: "Custom 5",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 9,
            nombre: "Arias Valencia John",
            cargo: "Software Engineer",
            equipo: "Core UI ",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 10,
            nombre: "Aristizabal Andres",
            cargo: "Software Engineer",
            equipo: "Custom 5",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 11,
            nombre: "Benavides Guevara Paula",
            cargo: "Quality Engineer",
            equipo: "Cyprus",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Miércoles", "Jueves", "Viernes"]
        },
        {
            id: 12,
            nombre: "Betancourt Montoya Gewralds",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Martes","Jueves","Viernes"]
        },
        {
            id: 13,
            nombre: "Bocanegra Acosta Natalia",
            cargo: "Product Manager",
            equipo: "Producto",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes","Miércoles"]
        },
        {
            id: 14,
            nombre: "Buitrago Ramirez Darwin",
            cargo: "Software Engineer",
            equipo: "Core I Y II",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 15,
            nombre: "Buritica Atehortua Oscar",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 16,
            nombre: "Bustamante Rojas Cristian",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 17,
            nombre: "Calderon Carranza George",
            cargo: "Software Engineer",
            equipo: "Custom 5",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes","Miercoles","Jueves"]
        }, 
        {
            id: 18,
            nombre: "Cañon Peña Yurani",
            cargo: "Scrum Master",
            equipo: "Core UI",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes", "Martes", "Miercoles"]
        }, 
        {
            id: 19,
            nombre: "Cardona Mendoza Birman",
            cargo: "Software Engineer",
            equipo: "Members",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miércoles", "Jueves", "Viernes"]
        }, 
        {
            id: 20,
            nombre: "Carreño Alvarez Elizabeth",
            cargo: "Business Analyst",
            equipo: "Producto",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes","Miércoles"]
        }, 
        {
            id: 21,
            nombre: "Castaño Serna Juan",
            cargo: "Software Engineer",
            equipo: "Custom 5",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes","Miércoles", "Jueves"]
        }, 
        {
            id: 22,
            nombre: "Ceballos Rojas Diego Fernando",
            cargo: "Software Engineer",
            equipo: "Sun Express",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 23,
            nombre: "Cruz Barrera Christian David",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        }, 
        {
            id: 24,
            nombre: "Cuartas Castano David",
            cargo: "Software Engineer",
            equipo: "AM",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
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
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 27,
            nombre: "Echeverry Giraldo Daniel",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 28,
            nombre: "Eusse Lopez Alejandra",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 29,
            nombre: "Florez Cendales Julian",
            cargo: "Software Engineer",
            equipo: "Sun Express",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 30,
            nombre: "Florez Chalarca Jimena",
            cargo: "Product Manager",
            equipo: "Producto",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Martes", "Miércoles",]
        }, 
        {
            id: 31,
            nombre: "Franco Mejia Felipe",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes","Jueves","Viernes"]
        }, 
        {
            id: 32,
            nombre: "Juyar Galindo Sadai",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles"]
        }, 
        {
            id: 33,
            nombre: "Galvez Bedoya Santiago",
            cargo: "Quality Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 34,
            nombre: "Galvis Aguirre Yohana",
            cargo: "Quality Engineer",
            equipo: "Custom 3",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 35,
            nombre: "Galvis Tabares Santiago",
            cargo: "Quality Engineer",
            equipo: "Automatizaciones",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles","Jueves"]
        }, 
        {
            id: 36,
            nombre: "Garcia Arango Juan",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 37,
            nombre: "Garcia Giraldo Erika",
            cargo: "Quality Engineer",
            equipo: "Custom 3",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 38,
            nombre: "Garcia Grisales Sandra",
            cargo: "Software Engineer",
            equipo: "Custom 1",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Miercoles","Jueves","Viernes"]
        }, 
        {
            id: 39,
            nombre: "Giron Casierra William Alejandro",
            cargo: "Software Engineer",
            equipo: "Dynamics",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
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
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        }, 
        {
            id: 46,
            nombre: "Gonzalez Hernandez Leidy",
            cargo: "Quality Engineer",
            equipo: "Core I Y II",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 47,
            nombre: "Gonzalez Lopez Daniela",
            cargo: "Quality Engineer",
            equipo: "Producto",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Martes","Miércoles"]
        }, 
        {
            id: 48,
            nombre: "Rojas Tovar Angela",
            cargo: "Quality Engineer",
            equipo: "Dynamics",
            ciudad: "Pitalito",
            region: "Zona Sur Occidente",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Remoto"]
        }, 
        {
            id: 49,
            nombre: "Gonzalez Tamayo Andres",
            cargo: "Quality Engineer",
            equipo: "Automatizaciones",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Miercoles","Jueves"]
        },
        {
            id: 50,
            nombre: "Grajales Sanchez Miguel",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 51,
            nombre: "Guerrero Kevin",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 52,
            nombre: "Gutierrez Franco Nataly",
            cargo: "Scrum Master",
            equipo: "Vueling",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 53,
            nombre: "Henao Alexandra",
            cargo: "Product Manager",
            equipo: "Producto",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes","Miércoles"]
        },
        {
            id: 54,
            nombre: "Henao Burgos Jimena",
            cargo: "Quality Engineer",
            equipo: "Platform",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 55,
            nombre: "Hernandez Arias David",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 56,
            nombre: "Hernandez Rendon Luisa",
            cargo: "Quality Engineer",
            equipo: "Vueling",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 57,
            nombre: "Herrera Quintero Camila",
            cargo: "Quality Engineer",
            equipo: "Custom 5",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 58,
            nombre: "Infante Angie Carolina",
            cargo: "Quality Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 59,
            nombre: "Loaiza Bedoya Manuela",
            cargo: "Quality Engineer",
            equipo: "Custom 5",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 60,
            nombre: "Loaiza Agudelo Santiago",
            cargo: "Quality Engineer",
            equipo: "AM",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 61,
            nombre: "Loaiza Sanchez Leydi Johana",
            cargo: "Project Manager",
            equipo: "Message ",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 62,
            nombre: "Londoño Gonzalez Angela",
            cargo: "Quality Engineer",
            equipo: "Vueling",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 63,
            nombre: "Londoño Holguin Maria Fernanda",
            cargo: "Quality Engineer",
            equipo: "Transversal",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        },
        {
            id: 64,
            nombre: "Lopez Diana Lorena",
            cargo: "Quality Engineer",
            equipo: "Sun Express",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 65,
            nombre: "Lopez Katherine",
            cargo: "Business Analyst",
            equipo: "Producto",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 66,
            nombre: "Lopez Hoyos Victor",
            cargo: "Quality Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 67,
            nombre: "Mejia Buitrago Daniela",
            cargo: "Software Engineer",
            equipo: "Custom 2",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        },
        {
            id: 68,
            nombre: "Molina Cadavid Sergio",
            cargo: "Software Engineer",
            equipo: "Delta",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 69,
            nombre: "Montes Londoño Cristian",
            cargo: "Software Engineer",
            equipo: "AM",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 70,
            nombre: "Morales Herrera Juan",
            cargo: "Software Engineer",
            equipo: "CORE UI",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 71,
            nombre: "Morales Marin Juliana",
            cargo: "Project Manager",
            equipo: "N/A",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        },
        {
            id: 72,
            nombre: "Morales Velez Sebastian",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 73,
            nombre: "Ocampo Parra Melissa",
            cargo: "Business Analyst",
            equipo: "Producto",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 74,
            nombre: "Ortega Cupacan Cristian",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 75,
            nombre: "Osorio Giraldo Maria Fernanda",
            cargo: "Business Analyst",
            equipo: "Core I Y II",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 76,
            nombre: "Ospina Colorado Nestor",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 77,
            nombre: "Ospina Londoño Fabiana",
            cargo: "Quality Engineer",
            equipo: "Riyadh",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 78,
            nombre: "Pineda Salas Deivinson",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 79,
            nombre: "Pineda Vasquez Juliana",
            cargo: "Quality Engineer",
            equipo: "Vueling",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 80,
            nombre: "Posada Garcia William",
            cargo: "Software Engineer",
            equipo: "Consilium",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Jueves","Viernes"]
        },
        {
            id: 81,
            nombre: "Posada Mejias Jerel",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 82,
            nombre: "Reina Becerra Juan Pablo",
            cargo: "Software Engineer",
            equipo: "Dynamics",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 83,
            nombre: "Renteria Gutierrez Santiago",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 84,
            nombre: "Rios Cardona Yamid",
            cargo: "Software Engineer",
            equipo: "Sun Express",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 85,
            nombre: "Rivera Castrillon Liseth",
            cargo: "Scrum Master",
            equipo: "Custom 5 - Dynamics",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 86,
            nombre: "Robles Ocampo Luis",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 87,
            nombre: "Rodriguez Pineda Johana",
            cargo: "Project Manager",
            equipo: "Producto",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 88,
            nombre: "Salazar Rendon Fabio",
            cargo: "Software Engineer",
            equipo: "Vueling",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 89,
            nombre: "Sanchez Cortes Jhon",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 90,
            nombre: "Sanchez Valencia Carol",
            cargo: "Scrum Master",
            equipo: "AM",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 91,
            nombre: "Sanchez Valencia Daiam",
            cargo: "Quality Engineer",
            equipo: "Custom 3",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 92,
            nombre: "Sanchez Velasquez Paola",
            cargo: "Quality Engineer",
            equipo: "Custom 3",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 93,
            nombre: "Sanchez Yepes Carolina",
            cargo: "Product Manager",
            equipo: "Transversal",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        },
        {
            id: 94,
            nombre: "Valencia Betancur Leonardo",
            cargo: "Software Engineer",
            equipo: "Custom 3",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 95,
            nombre: "Valencia Martinez Sandra",
            cargo: "Manager",
            equipo: "Gerente",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
        },
        {
            id: 96,
            nombre: "Valencia Valencia Jerson",
            cargo: "Software Engineer",
            equipo: "Platform",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 97,
            nombre: "Villalba Ballesteros Luis Felipe ",
            cargo: "Software Engineer",
            equipo: "AM",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 98,
            nombre: "Velasco Roman Brayan",
            cargo: "Project Manager",
            equipo: "Custom 1 - Platform",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 99,
            nombre: "Velasquez Quintero Sebastian",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 100,
            nombre: "Villa Valencia Natalia",
            cargo: "Product Manager",
            equipo: "Producto",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 101,
            nombre: "Yanez Malave Luis",
            cargo: "Quality Engineer",
            equipo: "CORE UI",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 102,
            nombre: "Zuluaga Cardona Jenny",
            cargo: "Scrum Master",
            equipo: "Omega - Delta",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 103,
            nombre: "Castaño Velasquez Jhon Jairo",
            cargo: "Software Engineer",
            equipo: "Core I Y II",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 104,
            nombre: "Rubio Giraldo Danna Vanessa",
            cargo: "Software Engineer",
            equipo: "Custom 5",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 106,
            nombre: "Naranjo Garcia Alejandra",
            cargo: "Software Engineer",
            equipo: "Core I Y II",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 107,
            nombre: "Salgado Castaño Juan Felipe",
            cargo: "Software Engineer",
            equipo: "Diseño",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "N/A",
            genero: "Masculino",
            dias: ["N/A"]
        },
        {
            id: 108,
            nombre: "Aguirre Ocampo Jheidy Lizeth",
            cargo: "Quality Engineer",
            equipo: "Custom 1",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 109,
            nombre: "Gutierrez Rodas Carlos Alberto",
            cargo: "Software Engineer",
            equipo: "Core I Y II Transversal AV",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 110,
            nombre: "Tavera Orozco Natalia",
            cargo: "Software Engineer",
            equipo: "Core UI",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 111,
            nombre: "Mejia Mendoza Jhonatan Alejandro",
            cargo: "Software Engineer",
            equipo: "Platform",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 112,
            nombre: "Mejia Martinez Vanessa Paola",
            cargo: "Quality Engineer",
            equipo: "Omega",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miercoles"]
        },
        {
            id: 113,
            nombre: "Loaiza Puerta Jorge Luis",
            cargo: "Software Engineer",
            equipo: "Riyadh",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 114,
            nombre: "Montaño Torres Stefany",
            cargo: "Quality Engineer",
            equipo: "Custom 1",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Femenino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 115,
            nombre: "Acosta Briceño Frank Sebastian",
            cargo: "Software Engineer",
            equipo: "Custom 3",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 116,
            nombre: "Gomez Montoya Luis Fernando",
            cargo: "Software Engineer",
            equipo: "Omega",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miercoles"]
        },
        {
            id: 117,
            nombre: "Rubio Tabarez Hector David",
            cargo: "Software Engineer",
            equipo: "Infra de members",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miércoles", "Jueves", "Viernes"]
        },
        {
            id: 118,
            nombre: "Salazar Giraldo Pedro Pablo",
            cargo: "Scrum Master",
            equipo: "Customer Sucess",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "N/A",
            genero: "Masculino",
            dias: ["N/A"]
        },
        {
            id: 119,
            nombre: "Beltran Cardona Juan Manuel",
            cargo: "Software Engineer",
            equipo: "Sun Express",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 120,
            nombre: "Grajales Giraldo JuanJose",
            cargo: "Software Engineer",
            equipo: "Dynamics",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 121,
            nombre: "Henao Ramirez Eduardo Andres",
            cargo: "Manager Engineering",
            equipo: "Custom 3",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 122,
            nombre: "Cardona Torres Santiago",
            cargo: "Quality Engineer",
            equipo: "Sun Express",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 123,
            nombre: "Ocampo Castaño Jose Brayan",
            cargo: "Quality Engineer",
            equipo: "Automatizaciones",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles","Jueves"]
        },
        {
            id: 124,
            nombre: "Cano Jaramillo Juan Pablo",
            cargo: "Application Support Specialist",
            equipo: "SRE",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "N/A",
            genero: "Masculino",
            dias: ["N/A"]
        },
        {
            id: 125,
            nombre: "Albornoz Rodriguez Julian Andres",
            cargo: "Manager Engineering",
            equipo: "Custom 1 - Platform",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 126,
            nombre: "Rodriguez Huertas Max Frank",
            cargo: "Director Engineering",
            equipo: "Transversal",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "N/A",
            genero: "Masculino",
            dias: ["N/A"]
        },
        {
            id: 127,
            nombre: "Fontalvo Salgado Ivan Alberto ",
            cargo: "Manager Engineering",
            equipo: "Custom 5 - Dynamics",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 128,
            nombre: "Gonzalez Muñoz Laura Sofia ",
            cargo: "Software Engineer",
            equipo: "AM",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 129,
            nombre: "Cardona Calderon Cesar",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 130,
            nombre: "Galvez Restrepo Nelson ",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 131,
            nombre: "Bonilla Daniela ",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Femenino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 132,
            nombre: "Diaz Tovar Cristian ",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 133,
            nombre: "Moreno Vargas Hernando  ",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 134,
            nombre: "Sanchez Arias Fernan",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "Híbrido",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 136,
            nombre: "Mejia Alarcon Julian Andres",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Manizales",
            region: "Caldas",
            tipoAsistencia: "Presencial",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 137,
            nombre: "Cardona Herrera Santiago",
            cargo: "Intership",
            equipo: "Sena",
            ciudad: "Bogotá",
            region: "Cundinamarca",
            tipoAsistencia: "Remoto",
            genero: "Masculino",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 138,
            nombre: "Osorio Garcia Andres Enrique",
            cargo: "Ingeniero de Software",
            equipo: "N/A",
            ciudad: "Medellín",
            region: "Antioquia",
            tipoAsistencia: "N/A",
            genero: "Masculino",
            dias: ["N/A"]
        },
        {
            id: 139,
            nombre: "Castellano Paula Alejandra",
            cargo: "Senior Manager, Engineering",
            equipo: "Transversal",
            ciudad: "Cali",
            region: "Valle del Cauca",
            tipoAsistencia: "N/A",
            genero: "Femenino",
            dias: ["N/A"]
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
        document.getElementById('cargo').value = empleado.cargo; // Changed from puesto to cargo
        document.getElementById('equipo').value = empleado.equipo;
        document.getElementById('ciudad').value = empleado.ciudad;
        document.getElementById('region').value = empleado.region;
        document.getElementById('tipoAsistencia').value = empleado.tipoAsistencia;
        document.getElementById('genero').value = empleado.genero;
        
        // Desmarcar todos los checkboxes de días primero
        document.querySelectorAll('input[name="dias"]').forEach(cb => cb.checked = false);
        
        // Seleccionar días
        empleado.dias.forEach(dia => {
            const checkbox = document.querySelector(`input[value="${dia}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Eliminar el empleado actual para que se pueda actualizar
        // (Esto es un enfoque simple para "editar", en un sistema real se manejaría un ID de edición)
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