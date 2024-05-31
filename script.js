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

const jugadoresSeleccionados = [];

// Función para llenar los selectores con jugadores
function llenarSelectores() {
const selectores = document.querySelectorAll('select');
tablaPosiciones.forEach((jugador, index) => {
    const option = document.createElement('option');
    option.value = jugador.nombre;
    option.textContent = jugador.nombre;
    selectores.forEach(selector => {
        selector.appendChild(option.cloneNode(true));
    });
});
}

// Función para seleccionar jugadores
function seleccionarJugadores() {
jugadoresSeleccionados.length = 0; // Limpiar selección anterior
const selectores = document.querySelectorAll('select');
const nombresSeleccionados = new Set();

selectores.forEach(selector => {
    const nombre = selector.value;
    if (!nombresSeleccionados.has(nombre) && nombre) {
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

// generamos partidos solo si se han seleccionado los jugadores
generarPartidos(parejas);
}

// Función para generar los partidos basados en las parejas sorteadas
function generarPartidos(parejas) {
const partidos = [];

// Generar los partidos
parejas.forEach((pareja, index) => {
    for (let i = index + 1; i < parejas.length; i++) {
        partidos.push([pareja, parejas[i]]);
    }
});

// Mostrar los partidos generados (puedes modificar esto según tu diseño)
const partidosDiv = document.getElementById('partidos-generados');
partidosDiv.innerHTML = '';
partidos.forEach((partido, index) => {
    const div = document.createElement('div');
    div.textContent = `Partido ${index + 1}: ${partido[0][0]} y ${partido[0][1]} vs ${partido[1][0]} y ${partido[1][1]}`;
    partidosDiv.appendChild(div);
});
}

// Evento para llenar los selectores al cargar la página
window.onload = llenarSelectores;
