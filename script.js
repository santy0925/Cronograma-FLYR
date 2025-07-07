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
            nombre: "Castaño Rivera Esteban",
            puesto: "Software Engineer",
            equipo: "Platform",
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
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 5,
            nombre: "Alzate Zapata Valentina",
            puesto: "Business Analyst",
            equipo: "Producto",
            dias: ["Martes", "Miercoles"]
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
            dias: ["Jueves","Viernes"]
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
        }, 
        {
            id: 24,
            nombre: "Cuartas Castano David",
            puesto: "Software Engineer",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        }, 
        {
            id: 25,
            nombre: "Duque Fernandez Andrés",
            puesto: "Software Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 26,
            nombre: "Duran Londoño Cristian",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 27,
            nombre: "Echeverry Giraldo Daniel",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 28,
            nombre: "Eusse López Alejandra",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        }, 
        {
            id: 29,
            nombre: "Florez Cendales Julián",
            puesto: "Software Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 30,
            nombre: "Flórez Chalarca Jimena",
            puesto: "Product Manager",
            equipo: "Producto",
            dias: ["Martes", "Miércoles",]
        }, 
        {
            id: 31,
            nombre: "Franco Mejia Felipe",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes","Jueves","Viernes"]
        }, 
        {
            id: 32,
            nombre: "Juyar Galindo Sadai",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        }, 
        {
            id: 33,
            nombre: "Galvez Bedoya Santiago",
            puesto: "Quality Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 34,
            nombre: "Galvis Aguirre Yohana",
            puesto: "Quality Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 35,
            nombre: "Galvis Tabares Santiago",
            puesto: "Quality Engineer",
            equipo: "Automatizaciones",
            dias: ["Miercoles","Jueves"]
        }, 
        {
            id: 36,
            nombre: "Garcia Arango Juan",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 37,
            nombre: "García Giraldo Erika",
            puesto: "Quality Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 38,
            nombre: "García Grisales Sandra",
            puesto: "Software Engineer",
            equipo: "Custom 1",
            dias: ["Miercoles","Jueves","Viernes"]
        }, 
        {
            id: 39,
            nombre: "Giron Casierra William Alejandro",
            puesto: "Software Engineer",
            equipo: "Dynamics",
            dias: ["Martes", "Miércoles", "Jueves"]
        }, 
        {
            id: 40,
            nombre: "Gomez Ramirez Diego Bernabé",
            puesto: "Software Engineer",
            equipo: "Delta",
            dias: ["Lunes","Martes","Miércoles"]
        }, 
        {
            id: 42,
            nombre: "Gómez Castrillon Cindy",
            puesto: "Scrum Master",
            equipo: "Cyprus",
            dias: ["Miercoles", "Jueves", "Viernes"]
        }, 
        {
            id: 43,
            nombre: "Cumbal Benavides Andrea",
            puesto: "Scrum Master",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        }, 
        {
            id: 44,
            nombre: "Gomez Mercado Sara",
            puesto: "Project Manager",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        }, 
        {
            id: 45,
            nombre: "Gomez Tangarife Erika",
            puesto: "IT",
            equipo: "TI",
            dias: ["N/A"]
        }, 
        {
            id: 46,
            nombre: "González Hernández Leidy",
            puesto: "Quality Engineer",
            equipo: "Core I Y II",
            dias: ["Lunes","Jueves","Viernes"]
        }, 
        {
            id: 47,
            nombre: "Gonzalez Lopez Daniela",
            puesto: "Quality Engineer",
            equipo: "Producto",
            dias: ["Martes","Miércoles"]
        }, 
        {
            id: 48,
            nombre: "Rojas Tovar Angela",
            puesto: "Quality Engineer",
            equipo: "Dynamics",
            dias: ["Remoto"]
        }, 
        {
            id: 49,
            nombre: "Gonzalez Tamayo Andres",
            puesto: "Quality Engineer",
            equipo: "Automatizaciones",
            dias: ["Miercoles","Jueves"]
        },
        {
            id: 50,
            nombre: "Grajales Sanchez Miguel",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 51,
            nombre: "Guerrero Kevin",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 52,
            nombre: "Gutierrez Franco Nataly",
            puesto: "Scrum Master",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 53,
            nombre: "Henao Alexandra",
            puesto: "Product Manager",
            equipo: "Producto",
            dias: ["Martes","Miércoles"]
        },
        {
            id: 54,
            nombre: "Henao Burgos Jimena",
            puesto: "Quality Engineer",
            equipo: "Platform",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 55,
            nombre: "Hernandez Arias David",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 56,
            nombre: "Hernandez Rendon Luisa",
            puesto: "Quality Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 57,
            nombre: "Herrera Quintero Camila",
            puesto: "Quality Engineer",
            equipo: "Custom 5",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 58,
            nombre: "Infante Angie Carolina",
            puesto: "Quality Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 59,
            nombre: "Loaiza Bedoya Manuela",
            puesto: "Quality Engineer",
            equipo: "Custom 5",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 60,
            nombre: "Loaiza Agudelo Santiago",
            puesto: "Quality Engineer",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 61,
            nombre: "Loaiza Sanchez Leydi Johana",
            puesto: "Project Manager",
            equipo: "Message ",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 62,
            nombre: "Londoño González Angela",
            puesto: "Quality Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 63,
            nombre: "Londoño Holguin Maria Fernanda",
            puesto: "Quality Engineer",
            equipo: "Transversal",
            dias: ["N/A"]
        },
        {
            id: 64,
            nombre: "López Diana Lorena",
            puesto: "Quality Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 65,
            nombre: "Lopez Katherine",
            puesto: "Business Analyst",
            equipo: "Producto",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 66,
            nombre: "Lopez Hoyos Víctor",
            puesto: "Quality Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 67,
            nombre: "Mejia Buitrago Daniela",
            puesto: "Software Engineer",
            equipo: "Custom 2",
            dias: ["N/A"]
        },
        {
            id: 68,
            nombre: "Molina Cadavid Sergio",
            puesto: "Software Engineer",
            equipo: "Delta",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 69,
            nombre: "Montes Londoño Cristian",
            puesto: "Software Engineer",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 70,
            nombre: "Morales Herrera Juan",
            puesto: "Software Engineer",
            equipo: "CORE UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 71,
            nombre: "Morales Marin Juliana",
            puesto: "Project Manager",
            equipo: "N/A",
            dias: ["N/A"]
        },
        {
            id: 72,
            nombre: "Morales Velez Sebastian",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 73,
            nombre: "Ocampo Parra Melissa",
            puesto: "Business Analyst",
            equipo: "Producto",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 74,
            nombre: "Ortega Cupacan Cristian",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 75,
            nombre: "Osorio Giraldo Maria Fernanda",
            puesto: "Business Analyst",
            equipo: "Core I Y II",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 76,
            nombre: "Ospina Colorado Néstor",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 77,
            nombre: "Ospina Londoño Fabiana",
            puesto: "Quality Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 78,
            nombre: "Pineda Salas Deivinson",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 79,
            nombre: "Pineda Vasquez Juliana",
            puesto: "Quality Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 80,
            nombre: "Posada Garcia William",
            puesto: "Software Engineer",
            equipo: "Consilium",
            dias: ["Jueves","Viernes"]
        },
        {
            id: 81,
            nombre: "Posada Mejias Jerel",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Jueves","Lunes"]
        },
        {
            id: 82,
            nombre: "Reina Becerra Juan Pablo",
            puesto: "Software Engineer",
            equipo: "Dynamics",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 83,
            nombre: "Renteria Gutierrez Santiago",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 84,
            nombre: "Rios Cardona Yamid",
            puesto: "Software Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 85,
            nombre: "Rivera Castrillón Liseth",
            puesto: "Scrum Master",
            equipo: "Custom 5 - Dynamics",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 86,
            nombre: "Robles Ocampo Luis",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 87,
            nombre: "Rodriguez Pineda Johana",
            puesto: "Project Manager",
            equipo: "Producto",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 88,
            nombre: "Salazar Rendón Fabio",
            puesto: "Software Engineer",
            equipo: "Vueling",
            dias: ["Lunes","Jueves"]
        },
        {
            id: 89,
            nombre: "Sánchez Cortés Jhon",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 90,
            nombre: "Sánchez Valencia Carol",
            puesto: "Scrum Master",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 91,
            nombre: "Sanchéz Valencia Daiam",
            puesto: "Quality Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 92,
            nombre: "Sanchez Velasquez Paola",
            puesto: "Quality Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 93,
            nombre: "Sanchez Yepes Carolina",
            puesto: "Product Manager",
            equipo: "Transversal",
            dias: ["N/A"]
        },
        {
            id: 94,
            nombre: "Valencia Betancur Leonardo",
            puesto: "Software Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 95,
            nombre: "Valencia Martinez Sandra",
            puesto: "Manager",
            equipo: "Gerente",
            dias: ["N/A"]
        },
        {
            id: 96,
            nombre: "Valencia Valencia Jerson",
            puesto: "Software Engineer",
            equipo: "Platform",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 97,
            nombre: "Villalba Ballesteros Luis Felipe ",
            puesto: "Software Engineer",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 98,
            nombre: "Velasco Roman Brayan",
            puesto: "Project Manager",
            equipo: "Custom 1 - Platform",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 99,
            nombre: "Velasquez Quintero Sebastians",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 100,
            nombre: "Villa Valencia Natalia",
            puesto: "Product Manager",
            equipo: "Producto",
            dias: ["Martes", "Miércoles"]
        },
        {
            id: 101,
            nombre: "Yánez Malavé Luis",
            puesto: "Quality Engineer",
            equipo: "CORE UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 102,
            nombre: "Zuluaga Cardona Jenny",
            puesto: "Scrum Master",
            equipo: "Omega - Delta",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 103,
            nombre: "Castaño Velasquez Jhon Jairo",
            puesto: "Software Engineer",
            equipo: "Core I Y II",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 104,
            nombre: "Rubio Giraldo Danna Vanessa",
            puesto: "Software Engineer",
            equipo: "Custom 5",
            dias: ["Martes","Miércoles", "Jueves"]
        },
        {
            id: 106,
            nombre: "Naranjo Garcia Alejandra",
            puesto: "Software Engineer",
            equipo: "Core I Y II",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 107,
            nombre: "Salgado Castaño Juan Felipe",
            puesto: "Software Engineer",
            equipo: "Diseño",
            dias: ["N/A"]
        },
        {
            id: 108,
            nombre: "Aguirre Ocampo Jheidy Lizeth",
            puesto: "Quality Engineer",
            equipo: "Custom 1",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 109,
            nombre: "Gutierrez Rodas Carlos Alberto",
            puesto: "Software Engineer",
            equipo: "Core I Y II Transversal AV",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 110,
            nombre: "Tavera Orozco Natalia",
            puesto: "Software Engineer",
            equipo: "Core UI",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 111,
            nombre: "Mejia Mendoza Jhonatan Alejandro",
            puesto: "Software Engineer",
            equipo: "Platform",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 112,
            nombre: "Mejia Martinez Vanessa Paola",
            puesto: "Quality Engineer",
            equipo: "Omega",
            dias: ["Lunes","Martes","Viernes"]
        },
        {
            id: 113,
            nombre: "Loaiza Puerta Jorge Luis",
            puesto: "Software Engineer",
            equipo: "Riyadh",
            dias: ["Martes", "Jueves", "Viernes"]
        },
        {
            id: 114,
            nombre: "Montaño Torres Stefany",
            puesto: "Quality Engineer",
            equipo: "Custom 1",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 115,
            nombre: "Acosta Briceño Frank Sebastian",
            puesto: "Software Engineer",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 116,
            nombre: "Gomez Montoya Luis Fernando",
            puesto: "Software Engineer",
            equipo: "Omega",
            dias: ["Lunes","Martes","Miercoles"]
        },
        {
            id: 117,
            nombre: "Rubio Tabarez Hector David",
            puesto: "Software Engineer",
            equipo: "Infra de members",
            dias: ["N/A"]
        },
        {
            id: 118,
            nombre: "Salazar Giraldo Pedro Pablo",
            puesto: "Scrum Master",
            equipo: "Customer Sucess",
            dias: ["N/A"]
        },
        {
            id: 119,
            nombre: "Beltran Cardona Juan Manuel",
            puesto: "Software Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 120,
            nombre: "Grajales Giraldo JuanJose",
            puesto: "Software Engineer",
            equipo: "Dynamics",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 121,
            nombre: "Henao Ramirez Eduardo Andres",
            puesto: "Manager Engineering",
            equipo: "Custom 3",
            dias: ["Lunes","Jueves","Viernes"]
        },
        {
            id: 122,
            nombre: "Cardona Torres Santiago",
            puesto: "Quality Engineer",
            equipo: "Sun Express",
            dias: ["Martes", "Miércoles", "Viernes"]
        },
        {
            id: 123,
            nombre: "Ocampo Castaño Jose Brayan",
            puesto: "Quality Engineer",
            equipo: "Automatizaciones",
            dias: ["Miercoles","Jueves"]
        },
        {
            id: 124,
            nombre: "Cano Jaramillo Juan Pablo",
            puesto: "Application Support Specialist",
            equipo: "SRE",
            dias: ["N/A"]
        },
        {
            id: 125,
            nombre: "Albornoz Rodriguez Julian Andres",
            puesto: "Manager Engineering",
            equipo: "Custom 1 - Platform",
            dias: ["Miercoles", "Jueves", "Viernes"]
        },
        {
            id: 126,
            nombre: "Rodriguez Huertas Max Frank",
            puesto: "Director Engineering",
            equipo: "Transversal",
            dias: ["N/A"]
        },
        {
            id: 127,
            nombre: "Fontalvo Salgado Ivan Alberto ",
            puesto: "Manager Engineering",
            equipo: "Custom 5 - Dynamics",
            dias: ["Martes", "Miércoles", "Jueves"]
        },
        {
            id: 128,
            nombre: "Gonzalez Muñoz Laura Sofia ",
            puesto: "Software Engineer",
            equipo: "AM",
            dias: ["Lunes","Martes","Miércoles"]
        },
        {
            id: 129,
            nombre: "Cardona Calderon Cesar",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 130,
            nombre: "Galvez Restrepo Nelson ",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 131,
            nombre: "Bonilla Daniela ",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 132,
            nombre: "Diaz Tovar Cristian ",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 133,
            nombre: "Moreno Vargas Hernando  ",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 134,
            nombre: "Sanchez Arias Fernan",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 136,
            nombre: "Mejia Alarcon Julian Andres",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 137,
            nombre: "Cardona Herrera Santiago",
            puesto: "Intership",
            equipo: "Sena",
            dias: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
        },
        {
            id: 138,
            nombre: "Osorio Garcia Andres Enrique",
            puesto: "Ingeniero de Software",
            equipo: "N/A",
            dias: ["N/A"]
        },
        {
            id: 139,
            nombre: "Castellano Paula Alejandra",
            puesto: "Senior Manager, Engineering",
            equipo: "Transversal",
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