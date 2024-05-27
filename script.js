// Datos de los jugadores
let jugadores = [
    { nombre: "Agustin", puntos: 27, puntosAFavor: 309, puntosEnContra: 253, diferenciaPuntos: 56 },
    { nombre: "Jan", puntos: 18, puntosAFavor: 211, puntosEnContra: 157, diferenciaPuntos: 54 },
    { nombre: "Héctor", puntos: 18, puntosAFavor: 200, puntosEnContra: 183, diferenciaPuntos: 17 },
    { nombre: "Pere", puntos: 16, puntosAFavor: 268, puntosEnContra: 271, diferenciaPuntos: -3 },
    { nombre: "Mario", puntos: 16, puntosAFavor: 274, puntosEnContra: 298, diferenciaPuntos: -24 },
    { nombre: "Jason", puntos: 12, puntosAFavor: 105, puntosEnContra: 87, diferenciaPuntos: 18 },
    { nombre: "Gonzalo", puntos: 12, puntosAFavor: 282, puntosEnContra: 297, diferenciaPuntos: -15 },
    { nombre: "Ale", puntos: 9, puntosAFavor: 186, puntosEnContra: 206, diferenciaPuntos: -20 },
    { nombre: "Diego", puntos: 7, puntosAFavor: 250, puntosEnContra: 287, diferenciaPuntos: -37},
    { nombre: "Abel", puntos: 4, puntosAFavor: 87, puntosEnContra: 107, diferenciaPuntos: -20 },
    { nombre: "Sergi", puntos: 3, puntosAFavor: 86, puntosEnContra: 112, diferenciaPuntos: -26 },
    { nombre: "Adriá", puntos: 0, puntosAFavor: 0, puntosEnContra: 0, diferenciaPuntos: 0 },
    { nombre: "Roger", puntos: 0, puntosAFavor: 0, puntosEnContra: 0, diferenciaPuntos: 0 },
];

// Función para calcular la tabla de posiciones
function calcularTablaPosiciones() {
    // Calcular la diferencia de puntos para cada jugador
    jugadores.forEach(jugador => {
        jugador.diferenciaPuntos = jugador.puntosAFavor - jugador.puntosEnContra;
    });

    // Ordenar jugadores por puntos y luego por diferencia de puntos (descendente)
    jugadores.sort((a, b) => {
        if (a.puntos !== b.puntos) {
            return b.puntos - a.puntos; // Ordenar por puntos
        } else {
            return b.diferenciaPuntos - a.diferenciaPuntos; // Ordenar por diferencia de puntos
        }
    });

    // Actualizar la tabla de posiciones en el HTML
    let tablaCuerpo = document.getElementById("tabla-cuerpo");
    tablaCuerpo.innerHTML = "";
    jugadores.forEach((jugador, index) => {
        let fila = `<tr>
                        <td>${index + 1}</td>
                        <td>${jugador.nombre}</td>
                        <td>${jugador.puntos}</td>
                        <td>${jugador.puntosAFavor}</td>
                        <td>${jugador.puntosEnContra}</td>
                        <td>${jugador.diferenciaPuntos}</td>
                    </tr>`;
        tablaCuerpo.innerHTML += fila;
    });
}

// Función para realizar el sorteo basado en la posición en la tabla de posiciones
function realizarSorteoPorPosicion() {
    // Obtener los nombres seleccionados
    let nombresSeleccionados = [];
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        nombresSeleccionados.push(checkbox.value);
    });

    // Verificar si se seleccionaron exactamente 8 nombres
    if (nombresSeleccionados.length === 8) {
        // Filtrar jugadores seleccionados y ordenarlos por puntos
        let jugadoresSeleccionados = jugadores.filter(jugador => nombresSeleccionados.includes(jugador.nombre));
        jugadoresSeleccionados.sort((a, b) => b.puntos - a.puntos);

        // Generar los partidos asegurando que cada jugador de los primeros cuatro juegue con cada jugador de los últimos cuatro
        let partidosGenerados = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 4; j < 8; j++) {
                let partido = `Partido ${i * 4 + j - 3}: ${jugadoresSeleccionados[i].nombre} - ${jugadoresSeleccionados[j].nombre} vs ${jugadoresSeleccionados[j].nombre} - ${jugadoresSeleccionados[i].nombre}`;
                partidosGenerados.push(partido);
            }
        }

        // Mostrar los partidos sorteados en el HTML
        let resultadoSorteo = document.getElementById("resultado-sorteo");
        resultadoSorteo.innerHTML = "<h3>Partidos sorteados:</h3>";
        partidosGenerados.forEach(partido => {
            resultadoSorteo.innerHTML += `<p>${partido}</p>`;
        });
    } else {
        alert("Por favor, selecciona exactamente 8 nombres.");
    }
}



document.addEventListener("DOMContentLoaded", function() {
    calcularTablaPosiciones();
});

