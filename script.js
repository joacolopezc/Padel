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

function generarPartidos(parejas) {
    const partidos = [];
    const parejasUtilizadas = new Set();

    // Función para verificar si una pareja ya ha sido utilizada en un partido
    function parejaUtilizada(pareja) {
        const parejaStr = pareja.join('|'); // Convertir la pareja en una cadena para comparación en el Set
        return parejasUtilizadas.has(parejaStr);
    }

    // Función para verificar si un jugador ya está en una pareja
    function jugadorRepetido(jugador, pareja) {
        return pareja.includes(jugador);
    }

    // Generar los partidos
    while (partidos.length < 8) {
        const index1 = Math.floor(Math.random() * parejas.length);
        const index2 = Math.floor(Math.random() * parejas.length);

        const pareja1 = parejas[index1];
        const pareja2 = parejas[index2];

        // Verificar si la pareja ya fue utilizada o si hay jugadores repetidos en la pareja
        if (index1 !== index2 &&
            !parejaUtilizada(pareja1) &&
            !parejaUtilizada(pareja2) &&
            !jugadorRepetido(pareja1[0], pareja2) &&
            !jugadorRepetido(pareja1[1], pareja2) &&
            !jugadorRepetido(pareja2[0], pareja1) &&
            !jugadorRepetido(pareja2[1], pareja1)) {

            const partido = [pareja1, pareja2];
            partidos.push(partido);

            // Marcar parejas como utilizadas
            parejasUtilizadas.add(pareja1.join('|'));
            parejasUtilizadas.add(pareja2.join('|'));
        }
    }

    // Mostrar los partidos en la lista
    const listaPartidos = document.getElementById('partidos-americana');
    listaPartidos.innerHTML = ''; // Limpiar lista anterior

    // Mostrar los partidos agrupados de dos en dos
    for (let i = 0; i < partidos.length; i += 2) {
        const li = document.createElement('li');
        li.textContent = `Partido ${i / 2 + 1}: ${partidos[i][0][0]} - ${partidos[i][0][1]} vs ${partidos[i][1][0]} - ${partidos[i][1][1]}, ${partidos[i + 1][0][0]} - ${partidos[i + 1][0][1]} vs ${partidos[i + 1][1][0]} - ${partidos[i + 1][1][1]}`;
        listaPartidos.appendChild(li);
    }
}

// Función para llenar los selectores y la tabla de posiciones al cargar la página
window.onload = function () {
    llenarSelectores();
    llenarTablaPosiciones();
};