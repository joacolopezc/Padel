// ====================================================================
// GESTIÓN DE ALMACENAMIENTO (localStorage)
// ====================================================================
// Esta clase maneja toda la persistencia de datos en el navegador
// localStorage permite guardar información que persiste aunque cierres el navegador

class Almacenamiento {
    // Método para guardar datos en localStorage
    // JSON.stringify convierte objetos JavaScript a texto
    static guardar(clave, datos) {
        try {
            localStorage.setItem(clave, JSON.stringify(datos));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    }

    // Método para recuperar datos de localStorage
    // JSON.parse convierte texto a objetos JavaScript
    static obtener(clave) {
        try {
            const datos = localStorage.getItem(clave);
            return datos ? JSON.parse(datos) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    }

    // Método para eliminar datos específicos
    static eliminar(clave) {
        localStorage.removeItem(clave);
    }

    // Método para limpiar todo el almacenamiento
    static limpiarTodo() {
        localStorage.clear();
    }
}


// ====================================================================
// CLASE JUGADOR
// ====================================================================
// Representa a un jugador individual con todas sus estadísticas
// Esta estructura hace más fácil trabajar con los datos de cada jugador

class Jugador {
    constructor(nombre, puntos = 0, puntosAFavor = 0, puntosEnContra = 0) {
        this.nombre = nombre;
        this.puntos = puntos;
        this.puntosAFavor = puntosAFavor;
        this.puntosEnContra = puntosEnContra;
    }

    // Propiedad calculada: no se guarda, se calcula cuando se necesita
    get diferenciaPuntos() {
        return this.puntosAFavor - this.puntosEnContra;
    }

    // Método para actualizar estadísticas después de un partido
    actualizarEstadisticas(gano, puntosAFavor, puntosEnContra) {
        this.puntosAFavor += puntosAFavor;
        this.puntosEnContra += puntosEnContra;

        // En americana: 3 puntos por ganar, 0 por perder
        if (gano) {
            this.puntos += 3;
        }
    }

    // Convierte el jugador a un objeto simple (útil para guardar en localStorage)
    toJSON() {
        return {
            nombre: this.nombre,
            puntos: this.puntos,
            puntosAFavor: this.puntosAFavor,
            puntosEnContra: this.puntosEnContra
        };
    }

    // Crea un jugador desde un objeto simple (útil al cargar de localStorage)
    static fromJSON(json) {
        return new Jugador(
            json.nombre,
            json.puntos,
            json.puntosAFavor,
            json.puntosEnContra
        );
    }
}


// ====================================================================
// GESTOR DE JUGADORES
// ====================================================================
// Esta clase maneja toda la lista de jugadores y sus operaciones
// Patrón Singleton: solo existe una instancia en toda la aplicación

class GestorJugadores {
    constructor() {
        this.jugadores = [];
        this.cargarJugadores();
    }

    // Carga jugadores desde localStorage o usa datos por defecto
    cargarJugadores() {
        const datosGuardados = Almacenamiento.obtener('jugadores');

        if (datosGuardados && datosGuardados.length > 0) {
            // Si hay datos guardados, los carga
            this.jugadores = datosGuardados.map(j => Jugador.fromJSON(j));
        } else {
            // Si no hay datos, usa la lista por defecto
            this.inicializarJugadoresPorDefecto();
        }
    }

    // Inicializa con los jugadores que ya tenías
    inicializarJugadoresPorDefecto() {
        const jugadoresPorDefecto = [
            { nombre: "Agus", puntos: 27, puntosAFavor: 309, puntosEnContra: 253 },
            { nombre: "Jan", puntos: 18, puntosAFavor: 211, puntosEnContra: 157 },
            { nombre: "Héctor", puntos: 18, puntosAFavor: 200, puntosEnContra: 183 },
            { nombre: "Pere", puntos: 16, puntosAFavor: 268, puntosEnContra: 271 },
            { nombre: "Mario", puntos: 16, puntosAFavor: 274, puntosEnContra: 298 },
            { nombre: "Jason", puntos: 12, puntosAFavor: 105, puntosEnContra: 87 },
            { nombre: "Gon", puntos: 12, puntosAFavor: 282, puntosEnContra: 297 },
            { nombre: "Ale", puntos: 9, puntosAFavor: 186, puntosEnContra: 206 },
            { nombre: "Diego", puntos: 7, puntosAFavor: 250, puntosEnContra: 287 },
            { nombre: "Abel", puntos: 4, puntosAFavor: 87, puntosEnContra: 107 },
            { nombre: "Sergi", puntos: 3, puntosAFavor: 86, puntosEnContra: 112 }
        ];

        this.jugadores = jugadoresPorDefecto.map(j =>
            new Jugador(j.nombre, j.puntos, j.puntosAFavor, j.puntosEnContra)
        );

        this.guardar();
    }

    // Guarda todos los jugadores en localStorage
    guardar() {
        Almacenamiento.guardar('jugadores', this.jugadores.map(j => j.toJSON()));
    }

    // Obtiene todos los jugadores ordenados por puntos
    obtenerJugadoresOrdenados() {
        return [...this.jugadores].sort((a, b) => {
            // Primero ordena por puntos (descendente)
            if (b.puntos !== a.puntos) {
                return b.puntos - a.puntos;
            }
            // Si tienen los mismos puntos, ordena por diferencia de puntos
            return b.diferenciaPuntos - a.diferenciaPuntos;
        });
    }

    // Obtiene un jugador por su nombre
    obtenerJugadorPorNombre(nombre) {
        return this.jugadores.find(j => j.nombre === nombre);
    }

    // Agrega un nuevo jugador
    agregarJugador(nombre) {
        if (this.obtenerJugadorPorNombre(nombre)) {
            throw new Error('Ya existe un jugador con ese nombre');
        }

        const nuevoJugador = new Jugador(nombre);
        this.jugadores.push(nuevoJugador);
        this.guardar();
        return nuevoJugador;
    }

    // Elimina un jugador por nombre
    eliminarJugador(nombre) {
        const index = this.jugadores.findIndex(j => j.nombre === nombre);
        if (index !== -1) {
            this.jugadores.splice(index, 1);
            this.guardar();
            return true;
        }
        return false;
    }

    // Resetea las estadísticas de todos los jugadores
    resetearEstadisticas() {
        this.jugadores.forEach(jugador => {
            jugador.puntos = 0;
            jugador.puntosAFavor = 0;
            jugador.puntosEnContra = 0;
        });
        this.guardar();
    }
}


// ====================================================================
// GESTOR DE PARTIDOS - ALGORITMO ROUND-ROBIN
// ====================================================================
// Implementa el algoritmo Round-Robin para americana de pádel
// Garantiza que todos los jugadores jueguen entre sí de manera equitativa

class GestorPartidos {
    constructor() {
        this.jugadoresSeleccionados = [];
        this.rondas = []; // Array de rondas, cada ronda tiene 2 partidos simultáneos
        this.todasLasParejas = []; // Registro de todas las parejas generadas
    }

    // Selecciona los 8 jugadores que jugarán
    seleccionarJugadores(nombresJugadores) {
        // Validar que sean exactamente 8 jugadores únicos
        const nombresUnicos = [...new Set(nombresJugadores)];

        if (nombresUnicos.length !== 8) {
            throw new Error('Debes seleccionar exactamente 8 jugadores diferentes');
        }

        this.jugadoresSeleccionados = nombresUnicos;
        return true;
    }

    // ====================================================================
    // ALGORITMO ROUND-ROBIN PARA AMERICANA
    // ====================================================================
    // Este algoritmo garantiza que:
    // 1. Cada jugador juega exactamente 7 partidos (todos contra todos)
    // 2. Cada jugador tiene 7 compañeros diferentes a lo largo del torneo
    // 3. Cada jugador enfrenta a todos los demás jugadores
    // 4. En cada ronda, todos los 8 jugadores juegan simultáneamente (2 partidos de 4)

    generarAmericanaCompleta() {
        if (this.jugadoresSeleccionados.length !== 8) {
            throw new Error('Necesitas seleccionar 8 jugadores primero');
        }

        // Resetear datos previos
        this.rondas = [];
        this.todasLasParejas = [];

        // Para 8 jugadores, se generan 7 rondas
        // En cada ronda, hay 2 partidos simultáneos (4v4)
        const jugadores = [...this.jugadoresSeleccionados];

        // Algoritmo Round-Robin modificado para americana
        // Fijamos el primer jugador y rotamos los demás 7
        const fijo = jugadores[0];
        const rotables = jugadores.slice(1);

        for (let ronda = 0; ronda < 7; ronda++) {
            // Crear array temporal para esta ronda
            const jugadoresRonda = [fijo, ...rotables];

            // Generar los 2 partidos de esta ronda
            const partidosRonda = this._generarPartidosRonda(jugadoresRonda, ronda + 1);

            this.rondas.push({
                numero: ronda + 1,
                partidos: partidosRonda
            });

            // Rotar los jugadores rotables para la siguiente ronda
            // El último pasa al principio
            rotables.unshift(rotables.pop());
        }

        return this.rondas;
    }

    // Genera los 2 partidos de una ronda específica
    // Usa un patrón fijo para asegurar que todos jueguen contra todos
    _generarPartidosRonda(jugadores, numeroRonda) {
        // Patrones de emparejamiento para cada ronda
        // Cada patrón define: [pareja1_jugador1, pareja1_jugador2, pareja2_jugador1, pareja2_jugador2]
        const patrones = [
            // Ronda 1: (0,1 vs 2,3) y (4,5 vs 6,7)
            [[0, 1, 2, 3], [4, 5, 6, 7]],
            // Ronda 2: (0,2 vs 1,4) y (3,6 vs 5,7)
            [[0, 2, 1, 4], [3, 6, 5, 7]],
            // Ronda 3: (0,3 vs 5,6) y (1,7 vs 2,4)
            [[0, 3, 5, 6], [1, 7, 2, 4]],
            // Ronda 4: (0,4 vs 3,7) y (1,5 vs 2,6)
            [[0, 4, 3, 7], [1, 5, 2, 6]],
            // Ronda 5: (0,5 vs 1,6) y (2,7 vs 3,4)
            [[0, 5, 1, 6], [2, 7, 3, 4]],
            // Ronda 6: (0,6 vs 2,5) y (1,3 vs 4,7)
            [[0, 6, 2, 5], [1, 3, 4, 7]],
            // Ronda 7: (0,7 vs 4,6) y (1,2 vs 3,5)
            [[0, 7, 4, 6], [1, 2, 3, 5]]
        ];

        const patron = patrones[numeroRonda - 1];
        const partidos = [];

        patron.forEach((indices, indexPartido) => {
            const pareja1 = [jugadores[indices[0]], jugadores[indices[1]]];
            const pareja2 = [jugadores[indices[2]], jugadores[indices[3]]];

            // Registrar las parejas
            this.todasLasParejas.push(pareja1);
            this.todasLasParejas.push(pareja2);

            partidos.push({
                numeroPartido: indexPartido + 1,
                pareja1: pareja1,
                pareja2: pareja2,
                resultado: null, // null = no jugado aún
                jugado: false
            });
        });

        return partidos;
    }

    // Obtiene todas las parejas únicas que se han formado
    obtenerParejasUnicas() {
        const parejasSet = new Set();
        const parejasUnicas = [];

        this.todasLasParejas.forEach(pareja => {
            const key = [...pareja].sort().join('|');
            if (!parejasSet.has(key)) {
                parejasSet.add(key);
                parejasUnicas.push(pareja);
            }
        });

        return parejasUnicas;
    }

    // Obtiene todos los partidos en formato plano (sin agrupar por rondas)
    obtenerTodosLosPartidos() {
        const partidos = [];
        this.rondas.forEach(ronda => {
            ronda.partidos.forEach(partido => {
                partidos.push({
                    ...partido,
                    ronda: ronda.numero
                });
            });
        });
        return partidos;
    }

    // Obtiene estadísticas de un jugador en el torneo
    obtenerEstadisticasJugador(nombreJugador) {
        const partidos = this.obtenerTodosLosPartidos();
        const partidosDelJugador = partidos.filter(partido =>
            partido.pareja1.includes(nombreJugador) ||
            partido.pareja2.includes(nombreJugador)
        );

        const compañeros = new Set();
        const rivales = new Set();

        partidosDelJugador.forEach(partido => {
            const enPareja1 = partido.pareja1.includes(nombreJugador);
            const pareja = enPareja1 ? partido.pareja1 : partido.pareja2;
            const rivalesPartido = enPareja1 ? partido.pareja2 : partido.pareja1;

            // Agregar compañero
            const compañero = pareja.find(j => j !== nombreJugador);
            if (compañero) compañeros.add(compañero);

            // Agregar rivales
            rivalesPartido.forEach(rival => rivales.add(rival));
        });

        return {
            jugador: nombreJugador,
            partidosTotal: partidosDelJugador.length,
            compañerosDiferentes: compañeros.size,
            rivalesDiferentes: rivales.size,
            compañeros: Array.from(compañeros),
            rivales: Array.from(rivales)
        };
    }

    // Verifica que el torneo esté correctamente generado
    verificarIntegridadTorneo() {
        const errores = [];
        const warnings = [];

        // Verificar que hay 7 rondas
        if (this.rondas.length !== 7) {
            errores.push(`Deberían ser 7 rondas, pero hay ${this.rondas.length}`);
        }

        // Verificar que cada jugador juega 7 partidos
        this.jugadoresSeleccionados.forEach(jugador => {
            const stats = this.obtenerEstadisticasJugador(jugador);
            if (stats.partidosTotal !== 7) {
                errores.push(`${jugador} debería jugar 7 partidos, pero juega ${stats.partidosTotal}`);
            }
            if (stats.compañerosDiferentes !== 7) {
                warnings.push(`${jugador} debería tener 7 compañeros diferentes, pero tiene ${stats.compañerosDiferentes}`);
            }
            if (stats.rivalesDiferentes !== 7) {
                warnings.push(`${jugador} debería enfrentar a 7 rivales diferentes, pero enfrenta a ${stats.rivalesDiferentes}`);
            }
        });

        return {
            esValido: errores.length === 0,
            errores: errores,
            warnings: warnings
        };
    }

    // ====================================================================
    // REGISTRO DE RESULTADOS
    // ====================================================================

    // Registra el resultado de un partido específico
    registrarResultado(numeroRonda, numeroPartido, puntosPareja1, puntosPareja2) {
        // Validaciones
        if (numeroRonda < 1 || numeroRonda > this.rondas.length) {
            throw new Error(`Ronda ${numeroRonda} no existe`);
        }

        const ronda = this.rondas[numeroRonda - 1];
        if (numeroPartido < 1 || numeroPartido > ronda.partidos.length) {
            throw new Error(`Partido ${numeroPartido} no existe en la ronda ${numeroRonda}`);
        }

        // Validar puntos
        if (puntosPareja1 < 0 || puntosPareja2 < 0) {
            throw new Error('Los puntos no pueden ser negativos');
        }

        if (puntosPareja1 === puntosPareja2) {
            throw new Error('No puede haber empates en pádel');
        }

        const partido = ronda.partidos[numeroPartido - 1];

        // Registrar el resultado
        partido.resultado = {
            puntosPareja1: puntosPareja1,
            puntosPareja2: puntosPareja2,
            ganadorPareja1: puntosPareja1 > puntosPareja2
        };
        partido.jugado = true;

        // Actualizar estadísticas de los jugadores
        this._actualizarEstadisticasPartido(partido);

        // Guardar en localStorage
        this.guardar();

        return partido;
    }

    // Actualiza las estadísticas de los jugadores después de un partido
    _actualizarEstadisticasPartido(partido) {
        if (!partido.resultado) return;

        const { puntosPareja1, puntosPareja2, ganadorPareja1 } = partido.resultado;

        // Actualizar jugadores de la pareja 1
        partido.pareja1.forEach(nombreJugador => {
            const jugador = gestorJugadores.obtenerJugadorPorNombre(nombreJugador);
            if (jugador) {
                jugador.actualizarEstadisticas(ganadorPareja1, puntosPareja1, puntosPareja2);
            }
        });

        // Actualizar jugadores de la pareja 2
        partido.pareja2.forEach(nombreJugador => {
            const jugador = gestorJugadores.obtenerJugadorPorNombre(nombreJugador);
            if (jugador) {
                jugador.actualizarEstadisticas(!ganadorPareja1, puntosPareja2, puntosPareja1);
            }
        });

        // Guardar jugadores actualizados
        gestorJugadores.guardar();
    }

    // Obtiene un partido específico
    obtenerPartido(numeroRonda, numeroPartido) {
        if (numeroRonda < 1 || numeroRonda > this.rondas.length) {
            return null;
        }

        const ronda = this.rondas[numeroRonda - 1];
        if (numeroPartido < 1 || numeroPartido > ronda.partidos.length) {
            return null;
        }

        return ronda.partidos[numeroPartido - 1];
    }

    // Obtiene el estado general del torneo
    obtenerEstadoTorneo() {
        let partidosJugados = 0;
        let partidosPendientes = 0;

        this.rondas.forEach(ronda => {
            ronda.partidos.forEach(partido => {
                if (partido.jugado) {
                    partidosJugados++;
                } else {
                    partidosPendientes++;
                }
            });
        });

        const totalPartidos = partidosJugados + partidosPendientes;
        const porcentajeCompletado = totalPartidos > 0
            ? Math.round((partidosJugados / totalPartidos) * 100)
            : 0;

        return {
            totalPartidos,
            partidosJugados,
            partidosPendientes,
            porcentajeCompletado,
            torneoCompleto: partidosPendientes === 0
        };
    }

    // Guarda el torneo en localStorage
    guardar() {
        Almacenamiento.guardar('torneo', {
            jugadoresSeleccionados: this.jugadoresSeleccionados,
            rondas: this.rondas,
            todasLasParejas: this.todasLasParejas
        });
    }

    // Carga el torneo desde localStorage
    cargar() {
        const datos = Almacenamiento.obtener('torneo');
        if (datos) {
            this.jugadoresSeleccionados = datos.jugadoresSeleccionados || [];
            this.rondas = datos.rondas || [];
            this.todasLasParejas = datos.todasLasParejas || [];
            return true;
        }
        return false;
    }

    // Limpia toda la información de partidos
    limpiar() {
        this.jugadoresSeleccionados = [];
        this.rondas = [];
        this.todasLasParejas = [];
        Almacenamiento.eliminar('torneo');
    }
}


// ====================================================================
// INTERFAZ DE USUARIO (UI)
// ====================================================================
// Estas funciones manejan la actualización del HTML y la interacción con el usuario

class InterfazUsuario {
    constructor(gestorJugadores, gestorPartidos) {
        this.gestorJugadores = gestorJugadores;
        this.gestorPartidos = gestorPartidos;
    }

    // Renderiza la tabla de posiciones
    renderizarTablaPosiciones() {
        const tbody = document.getElementById('tablaPosicionesBody');
        tbody.innerHTML = '';

        const jugadoresOrdenados = this.gestorJugadores.obtenerJugadoresOrdenados();

        jugadoresOrdenados.forEach((jugador, index) => {
            const fila = document.createElement('tr');

            // Agrega clase especial para el primer lugar
            if (index === 0) {
                fila.classList.add('primer-lugar');
            }

            fila.innerHTML = `
                <td class="nombre-jugador">${jugador.nombre}</td>
                <td class="puntos">${jugador.puntos}</td>
                <td>${jugador.puntosAFavor}</td>
                <td>${jugador.puntosEnContra}</td>
                <td class="${jugador.diferenciaPuntos >= 0 ? 'positivo' : 'negativo'}">
                    ${jugador.diferenciaPuntos > 0 ? '+' : ''}${jugador.diferenciaPuntos}
                </td>
            `;

            tbody.appendChild(fila);
        });
    }

    // Llena los selectores con los nombres de los jugadores
    llenarSelectores() {
        const selectores = document.querySelectorAll('select[id^="jugador"]');
        const jugadores = this.gestorJugadores.jugadores;

        selectores.forEach(selector => {
            selector.innerHTML = '<option value="">Seleccionar jugador</option>';

            jugadores.forEach(jugador => {
                const option = document.createElement('option');
                option.value = jugador.nombre;
                option.textContent = jugador.nombre;
                selector.appendChild(option);
            });
        });
    }

    // Obtiene los jugadores seleccionados en el formulario
    obtenerJugadoresSeleccionados() {
        const jugadores = [];
        for (let i = 1; i <= 8; i++) {
            const select = document.getElementById(`jugador${i}`);
            if (select.value) {
                jugadores.push(select.value);
            }
        }
        return jugadores;
    }

    // Muestra las parejas únicas generadas en el torneo
    mostrarParejasUnicas(parejas) {
        const listaParejas = document.getElementById('parejas-generadas');
        listaParejas.innerHTML = '';

        // Mensaje informativo
        const mensaje = document.createElement('div');
        mensaje.classList.add('info-parejas');
        mensaje.innerHTML = `
            <p>Se generaron <strong>${parejas.length} parejas únicas</strong> para el torneo.</p>
            <p>Cada jugador jugará con <strong>7 compañeros diferentes</strong>.</p>
        `;
        listaParejas.appendChild(mensaje);

        // Mostrar todas las parejas
        parejas.forEach((pareja, index) => {
            const li = document.createElement('li');
            li.classList.add('pareja-item');
            li.innerHTML = `
                <span class="pareja-numero">Pareja ${index + 1}:</span>
                <span class="pareja-jugadores">${pareja[0]} y ${pareja[1]}</span>
            `;
            listaParejas.appendChild(li);
        });
    }

    // Muestra los partidos organizados por rondas
    mostrarPartidosPorRondas(rondas) {
        const listaPartidos = document.getElementById('partidos-americana');
        listaPartidos.innerHTML = '';

        // Obtener estado del torneo
        const estadoTorneo = this.gestorPartidos.obtenerEstadoTorneo();

        // Mensaje informativo del torneo con progreso
        const infoTorneo = document.createElement('div');
        infoTorneo.classList.add('info-torneo');
        infoTorneo.innerHTML = `
            <p><strong>🎾 Torneo Americana - ${rondas.length} Rondas</strong></p>
            <p>Cada jugador jugará ${rondas.length} partidos. En cada ronda, todos juegan simultáneamente.</p>
            <div class="progreso-torneo">
                <div class="progreso-bar-container">
                    <div class="progreso-bar" style="width: ${estadoTorneo.porcentajeCompletado}%"></div>
                </div>
                <p class="progreso-texto">
                    ${estadoTorneo.partidosJugados} de ${estadoTorneo.totalPartidos} partidos jugados
                    (${estadoTorneo.porcentajeCompletado}%)
                </p>
            </div>
        `;
        listaPartidos.appendChild(infoTorneo);

        // Mostrar cada ronda con sus partidos
        rondas.forEach((ronda) => {
            const rondaDiv = document.createElement('div');
            rondaDiv.classList.add('ronda-container');

            // Encabezado de la ronda
            const headerRonda = document.createElement('div');
            headerRonda.classList.add('ronda-header');
            headerRonda.innerHTML = `
                <h3>Ronda ${ronda.numero}</h3>
                <span class="ronda-badge">${ronda.partidos.length} partidos simultáneos</span>
            `;
            rondaDiv.appendChild(headerRonda);

            // Partidos de la ronda
            const partidosDiv = document.createElement('div');
            partidosDiv.classList.add('ronda-partidos');

            ronda.partidos.forEach((partido, indexPartido) => {
                const partidoDiv = document.createElement('div');
                partidoDiv.classList.add('partido-item');

                // Agregar clase si está jugado
                if (partido.jugado) {
                    partidoDiv.classList.add('partido-jugado');
                }

                const pareja1Texto = partido.pareja1.join(' - ');
                const pareja2Texto = partido.pareja2.join(' - ');

                // HTML base del partido
                let partidoHTML = `
                    <div class="partido-header">
                        <span class="partido-numero">Pista ${indexPartido + 1}</span>
                        ${partido.jugado ? '<span class="badge-jugado">✓ Jugado</span>' : '<span class="badge-pendiente">Pendiente</span>'}
                    </div>
                    <div class="partido-detalle">
                        <span class="pareja ${partido.jugado && partido.resultado && partido.resultado.ganadorPareja1 ? 'ganador' : ''}">${pareja1Texto}</span>
                        <span class="vs">VS</span>
                        <span class="pareja ${partido.jugado && partido.resultado && !partido.resultado.ganadorPareja1 ? 'ganador' : ''}">${pareja2Texto}</span>
                    </div>
                `;

                // Si el partido ya fue jugado, mostrar resultado
                if (partido.jugado && partido.resultado) {
                    partidoHTML += `
                        <div class="partido-resultado">
                            <div class="resultado-marcador">
                                <span class="marcador ${partido.resultado.ganadorPareja1 ? 'ganador-marcador' : ''}">
                                    ${partido.resultado.puntosPareja1}
                                </span>
                                <span class="separador">-</span>
                                <span class="marcador ${!partido.resultado.ganadorPareja1 ? 'ganador-marcador' : ''}">
                                    ${partido.resultado.puntosPareja2}
                                </span>
                            </div>
                        </div>
                    `;
                } else {
                    // Si no está jugado, mostrar formulario para registrar resultado
                    partidoHTML += `
                        <div class="partido-formulario">
                            <form class="form-resultado" data-ronda="${ronda.numero}" data-partido="${indexPartido + 1}">
                                <div class="input-grupo">
                                    <label>Puntos ${pareja1Texto.split(' - ')[0].split(' ')[0]}...</label>
                                    <input type="number" class="input-puntos" name="puntos1" min="0" max="99" required>
                                </div>
                                <span class="vs-small">-</span>
                                <div class="input-grupo">
                                    <label>Puntos ${pareja2Texto.split(' - ')[0].split(' ')[0]}...</label>
                                    <input type="number" class="input-puntos" name="puntos2" min="0" max="99" required>
                                </div>
                                <button type="submit" class="btn-registrar">Registrar</button>
                            </form>
                        </div>
                    `;
                }

                partidoDiv.innerHTML = partidoHTML;
                partidosDiv.appendChild(partidoDiv);
            });

            rondaDiv.appendChild(partidosDiv);
            listaPartidos.appendChild(rondaDiv);
        });

        // Agregar event listeners a los formularios
        this._agregarEventListenersFormularios();
    }

    // Agrega event listeners a los formularios de resultados
    _agregarEventListenersFormularios() {
        const formularios = document.querySelectorAll('.form-resultado');

        formularios.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const ronda = parseInt(form.dataset.ronda);
                const partido = parseInt(form.dataset.partido);
                const puntos1 = parseInt(form.querySelector('[name="puntos1"]').value);
                const puntos2 = parseInt(form.querySelector('[name="puntos2"]').value);

                this.registrarResultadoPartido(ronda, partido, puntos1, puntos2);
            });
        });
    }

    // Registra el resultado de un partido y actualiza la interfaz
    registrarResultadoPartido(ronda, partido, puntos1, puntos2) {
        try {
            // Registrar resultado
            this.gestorPartidos.registrarResultado(ronda, partido, puntos1, puntos2);

            // Actualizar tabla de posiciones
            this.renderizarTablaPosiciones();

            // Recargar partidos para mostrar el resultado
            this.mostrarPartidosPorRondas(this.gestorPartidos.rondas);

            // Mensaje de éxito
            this.mostrarMensaje(`✅ Resultado registrado: ${puntos1} - ${puntos2}`, 'success');

            // Verificar si el torneo está completo
            const estado = this.gestorPartidos.obtenerEstadoTorneo();
            if (estado.torneoCompleto) {
                this.mostrarMensaje('🏆 ¡Torneo completado! Todos los partidos han sido jugados.', 'success');
            }

        } catch (error) {
            this.mostrarMensaje('❌ ' + error.message, 'error');
        }
    }

    // Muestra estadísticas de un jugador específico
    mostrarEstadisticasJugador(nombreJugador, stats) {
        const mensaje = `
            <strong>${nombreJugador}</strong>:
            ${stats.partidosTotal} partidos,
            ${stats.compañerosDiferentes} compañeros diferentes,
            ${stats.rivalesDiferentes} rivales diferentes
        `;
        this.mostrarMensaje(mensaje, 'info');
    }

    // Muestra un mensaje al usuario
    mostrarMensaje(mensaje, tipo = 'info') {
        // Crea un elemento de mensaje temporal
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `mensaje mensaje-${tipo}`;
        mensajeDiv.textContent = mensaje;

        document.body.appendChild(mensajeDiv);

        // Lo elimina después de 3 segundos
        setTimeout(() => {
            mensajeDiv.remove();
        }, 3000);
    }
}


// ====================================================================
// INICIALIZACIÓN Y EVENTOS
// ====================================================================
// Aquí se conecta todo cuando se carga la página

// Variables globales (instancias únicas)
let gestorJugadores;
let gestorPartidos;
let interfazUsuario;

// Función que se ejecuta al cargar la página
window.onload = function() {
    // Inicializa los gestores
    gestorJugadores = new GestorJugadores();
    gestorPartidos = new GestorPartidos();
    interfazUsuario = new InterfazUsuario(gestorJugadores, gestorPartidos);

    // Renderiza la interfaz inicial
    interfazUsuario.renderizarTablaPosiciones();
    interfazUsuario.llenarSelectores();

    // Intentar cargar torneo guardado
    const torneoExiste = gestorPartidos.cargar();
    if (torneoExiste && gestorPartidos.rondas.length > 0) {
        // Mostrar torneo cargado
        const parejasUnicas = gestorPartidos.obtenerParejasUnicas();
        interfazUsuario.mostrarParejasUnicas(parejasUnicas);
        interfazUsuario.mostrarPartidosPorRondas(gestorPartidos.rondas);

        const estado = gestorPartidos.obtenerEstadoTorneo();
        interfazUsuario.mostrarMensaje(
            `📂 Torneo cargado: ${estado.partidosJugados}/${estado.totalPartidos} partidos jugados`,
            'info'
        );

        console.log('✅ Aplicación inicializada correctamente - Torneo cargado');
    } else {
        console.log('✅ Aplicación inicializada correctamente');
    }
};

// Función llamada cuando se hace clic en "Sortear Parejas"
// Ahora genera directamente todo el torneo con el algoritmo Round-Robin
function seleccionarJugadores() {
    try {
        const jugadores = interfazUsuario.obtenerJugadoresSeleccionados();

        // Valida y selecciona jugadores
        gestorPartidos.seleccionarJugadores(jugadores);

        // Genera el torneo completo con el algoritmo Round-Robin
        const rondas = gestorPartidos.generarAmericanaCompleta();

        // Obtiene todas las parejas únicas del torneo
        const parejasUnicas = gestorPartidos.obtenerParejasUnicas();

        // Muestra las parejas únicas
        interfazUsuario.mostrarParejasUnicas(parejasUnicas);

        // Muestra los partidos organizados por rondas
        interfazUsuario.mostrarPartidosPorRondas(rondas);

        // Verifica la integridad del torneo
        const verificacion = gestorPartidos.verificarIntegridadTorneo();

        if (verificacion.esValido) {
            interfazUsuario.mostrarMensaje(
                `✅ Torneo generado correctamente: ${rondas.length} rondas, ${parejasUnicas.length} parejas únicas`,
                'success'
            );

            // Log de estadísticas en consola para debugging
            console.log('📊 Estadísticas del Torneo:');
            jugadores.forEach(jugador => {
                const stats = gestorPartidos.obtenerEstadisticasJugador(jugador);
                console.log(`  ${jugador}: ${stats.partidosTotal} partidos, ${stats.compañerosDiferentes} compañeros, ${stats.rivalesDiferentes} rivales`);
            });
        } else {
            console.error('Errores en el torneo:', verificacion.errores);
            interfazUsuario.mostrarMensaje('⚠️ El torneo se generó pero hay inconsistencias', 'error');
        }

    } catch (error) {
        interfazUsuario.mostrarMensaje('❌ ' + error.message, 'error');
        console.error('Error al generar torneo:', error);
    }
}

// Función llamada cuando se hace clic en "Armar Partidos"
// Esta función ahora está integrada en seleccionarJugadores()
// La mantenemos para compatibilidad pero ya no es necesaria
function generarPartidos() {
    try {
        // Si ya hay rondas generadas, solo las muestra
        if (gestorPartidos.rondas.length > 0) {
            interfazUsuario.mostrarPartidosPorRondas(gestorPartidos.rondas);
            interfazUsuario.mostrarMensaje('✅ Mostrando partidos del torneo', 'info');
        } else {
            interfazUsuario.mostrarMensaje('⚠️ Primero debes seleccionar jugadores y generar parejas', 'error');
        }

    } catch (error) {
        interfazUsuario.mostrarMensaje('❌ ' + error.message, 'error');
    }
}

// Función para resetear el sorteo (útil para empezar de nuevo)
function resetearSorteo() {
    gestorPartidos.limpiar();

    document.getElementById('parejas-generadas').innerHTML = '';
    document.getElementById('partidos-americana').innerHTML = '';

    // Resetea los selectores
    const selectores = document.querySelectorAll('select[id^="jugador"]');
    selectores.forEach(selector => {
        selector.value = '';
    });

    interfazUsuario.mostrarMensaje('🔄 Sorteo reseteado', 'info');
}
