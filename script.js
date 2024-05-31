const tablaPosiciones = [{
        nombre: "Agus",
        puntos: 27,
        puntosAFavor: 309,
        puntosEnContra: 253,
        diferenciaPuntos: 56
    },
    {
        nombre: "Jan",
        puntos: 18,
        puntosAFavor: 211,
        puntosEnContra: 157,
        diferenciaPuntos: 54
    },
    {
        nombre: "Héctor",
        puntos: 18,
        puntosAFavor: 200,
        puntosEnContra: 183,
        diferenciaPuntos: 17
    },
    {
        nombre: "Pere",
        puntos: 16,
        puntosAFavor: 268,
        puntosEnContra: 271,
        diferenciaPuntos: -3
    },
    {
        nombre: "Mario",
        puntos: 16,
        puntosAFavor: 274,
        puntosEnContra: 298,
        diferenciaPuntos: -24
    },
    {
        nombre: "Jason",
        puntos: 12,
        puntosAFavor: 105,
        puntosEnContra: 87,
        diferenciaPuntos: 18
    },
    {
        nombre: "Gon",
        puntos: 12,
        puntosAFavor: 282,
        puntosEnContra: 297,
        diferenciaPuntos: -15
    },
    {
        nombre: "Ale",
        puntos: 9,
        puntosAFavor: 186,
        puntosEnContra: 206,
        diferenciaPuntos: -20
    },
    {
        nombre: "Diego",
        puntos: 7,
        puntosAFavor: 250,
        puntosEnContra: 287,
        diferenciaPuntos: -37
    },
    {
        nombre: "Abel",
        puntos: 4,
        puntosAFavor: 87,
        puntosEnContra: 107,
        diferenciaPuntos: -20
    },
    {
        nombre: "Sergi",
        puntos: 3,
        puntosAFavor: 86,
        puntosEnContra: 112,
        diferenciaPuntos: -26
    }
];

// Función para llenar la tabla de posiciones
function llenarTablaPosiciones() {
    const tablaBody = document.getElementById('tablaPosicionesBody');
    tablaBody.innerHTML = ''; // Limpiar tabla anterior
    tablaPosiciones.forEach(jugador => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jugador.nombre}</td>
            <td>${jugador.puntos}</td>
            <td>${jugador.puntosAFavor}</td>
            <td>${jugador.puntosEnContra}</td>
            <td>${jugador.diferenciaPuntos}</td>
        `;
        tablaBody.appendChild(row);
    });
}



// Función para llenar los selectores con jugadores
function llenarSelectores() {
    const selectores = document.querySelectorAll('select');
    selectores.forEach(selector => {
        selector.innerHTML = ''; // Limpiar opciones anteriores
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Seleccionar jugador';
        selector.appendChild(option);
        tablaPosiciones.forEach(jugador => {
            const option = document.createElement('option');
            option.value = jugador.nombre;
            option.textContent = jugador.nombre;
            selector.appendChild(option);
        });
    });
}


let jugadoresSeleccionados = [];

// Función para seleccionar jugadores
function seleccionarJugadores() {
    jugadoresSeleccionados = []; // Limpiar selección anterior
    const selectores = document.querySelectorAll('select');
    const nombresSeleccionados = new Set();

    selectores.forEach(selector => {
        const nombre = selector.value;
        if (nombre && !nombresSeleccionados.has(nombre)) {
            nombresSeleccionados.add(nombre);
            jugadoresSeleccionados.push(nombre);
        }
    });

    if (jugadoresSeleccionados.length === 8) {
        generarYMostrarParejas();
    } else {
        alert('Debe seleccionar 8 jugadores diferentes.');
    }
}


// Función para generar las parejas
function generarParejas(jugadores) {
    const parejas = [];
    const primerosCuatro = jugadores.slice(0, 4);
    const ultimosCuatro = jugadores.slice(4, 8);

    // Generar las parejas entre los primeros cuatro y los últimos cuatro
    primerosCuatro.forEach(jugador1 => {
        ultimosCuatro.forEach(jugador2 => {
            const pareja = [jugador1, jugador2];
            parejas.push(pareja);
        });
    });

    return parejas;
}

// Función para generar y mostrar las parejas
function generarYMostrarParejas() {
    const parejas = generarParejas(jugadoresSeleccionados);
    const parejasGeneradas = document.getElementById('parejas-generadas');
    parejasGeneradas.innerHTML = ''; // Limpiar parejas anteriores

    parejas.forEach((pareja, index) => {
        const li = document.createElement('li');
        li.textContent = `Pareja ${index + 1}: ${pareja[0]} y ${pareja[1]}`;
        parejasGeneradas.appendChild(li);
    });

    // Guardar las parejas globalmente
    window.parejas = parejas;
}

// Función para generar los partidos basados en las parejas sorteadas
function generarPartidos(parejas) {
    const partidos = [];
    const jugadoresPorPartido = new Set();

    while (partidos.length < 8) {
        const index1 = Math.floor(Math.random() * parejas.length);
        const index2 = Math.floor(Math.random() * parejas.length);

        const pareja1 = parejas[index1];
        const pareja2 = parejas[index2];

        if (index1 !== index2 && !seRepiteJugador(pareja1, pareja2)) {
            const partido = [pareja1, pareja2];
            partidos.push(partido);

            // Agregar jugadores del partido al conjunto de jugadores
            partido.forEach(pareja => {
                pareja.forEach(jugador => {
                    jugadoresPorPartido.add(jugador);
                });
            });
        }
    }

    const listaPartidos = document.getElementById('partidos-americana');
    listaPartidos.innerHTML = ''; // Limpiar lista anterior

    partidos.forEach((partido, index) => {
        const li = document.createElement('li');
        li.textContent = `Partido ${index + 1}: ${partido[0][0]} - ${partido[0][1]} vs ${partido[1][0]} - ${partido[1][1]}`;
        listaPartidos.appendChild(li);
    });
}

// Función para verificar si algún jugador se repite en dos parejas
function seRepiteJugador(pareja1, pareja2) {
    return pareja1.some(jugador => pareja2.includes(jugador));
}

// Mostrar los partidos generados (puedes modificar esto según tu diseño)
const partidosDiv = document.getElementById('partidos-americana');
partidosDiv.innerHTML = '';
// No necesitamos esta parte, ya que generaremos los partidos más tarde con la función generarPartidos
// partidos.forEach((partido, index) => {
//     const div = document.createElement('div');
//     div.textContent = `Partido ${index + 1}: ${partido[0][0]} y ${partido[0][1]} vs ${partido[1][0]} y ${partido[1][1]}`;
//     partidosDiv.appendChild(div);
// });


// Función para llenar los selectores y la tabla de posiciones al cargar la página
window.onload = function () {
    llenarSelectores();
    llenarTablaPosiciones();
};
