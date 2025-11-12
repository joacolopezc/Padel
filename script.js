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
// GESTOR DE PARTIDOS
// ====================================================================
// Maneja la generación de parejas y partidos para la americana

class GestorPartidos {
    constructor() {
        this.jugadoresSeleccionados = [];
        this.parejas = [];
        this.partidos = [];
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

    // Genera las parejas entre los 8 jugadores seleccionados
    // Algoritmo: divide los jugadores en dos grupos y hace todas las combinaciones posibles
    generarParejas() {
        if (this.jugadoresSeleccionados.length !== 8) {
            throw new Error('Necesitas seleccionar 8 jugadores primero');
        }

        this.parejas = [];

        // Divide en dos grupos de 4
        const grupo1 = this.jugadoresSeleccionados.slice(0, 4);
        const grupo2 = this.jugadoresSeleccionados.slice(4, 8);

        // Genera todas las parejas posibles entre grupo1 y grupo2
        // Esto genera 16 parejas (4 x 4)
        grupo1.forEach(jugador1 => {
            grupo2.forEach(jugador2 => {
                this.parejas.push([jugador1, jugador2]);
            });
        });

        return this.parejas;
    }

    // Genera los partidos de la americana
    // Cada pareja debe jugar una vez y cada jugador no puede jugar contra sí mismo
    generarPartidos() {
        if (this.parejas.length === 0) {
            throw new Error('Necesitas generar parejas primero');
        }

        this.partidos = [];
        const parejasUsadas = new Set();

        // Intenta generar 8 partidos (todas las parejas juegan una vez)
        let intentos = 0;
        const maxIntentos = 1000; // Previene loops infinitos

        while (this.partidos.length < 8 && intentos < maxIntentos) {
            intentos++;

            // Selecciona dos parejas al azar
            const index1 = Math.floor(Math.random() * this.parejas.length);
            const index2 = Math.floor(Math.random() * this.parejas.length);

            if (index1 === index2) continue;

            const pareja1 = this.parejas[index1];
            const pareja2 = this.parejas[index2];

            // Verifica que las parejas no se hayan usado
            const key1 = pareja1.join('|');
            const key2 = pareja2.join('|');

            if (parejasUsadas.has(key1) || parejasUsadas.has(key2)) {
                continue;
            }

            // Verifica que no haya jugadores repetidos
            const todosJugadores = [...pareja1, ...pareja2];
            const jugadoresUnicos = new Set(todosJugadores);

            if (jugadoresUnicos.size === 4) {
                // Partido válido!
                this.partidos.push({
                    pareja1: pareja1,
                    pareja2: pareja2,
                    resultado: null // null = no jugado aún
                });

                parejasUsadas.add(key1);
                parejasUsadas.add(key2);
            }
        }

        if (this.partidos.length < 8) {
            console.warn('No se pudieron generar todos los partidos. Se generaron:', this.partidos.length);
        }

        return this.partidos;
    }

    // Limpia toda la información de partidos
    limpiar() {
        this.jugadoresSeleccionados = [];
        this.parejas = [];
        this.partidos = [];
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

    // Muestra las parejas generadas
    mostrarParejas(parejas) {
        const listaParejas = document.getElementById('parejas-generadas');
        listaParejas.innerHTML = '';

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

    // Muestra los partidos generados
    mostrarPartidos(partidos) {
        const listaPartidos = document.getElementById('partidos-americana');
        listaPartidos.innerHTML = '';

        partidos.forEach((partido, index) => {
            const li = document.createElement('li');
            li.classList.add('partido-item');

            const pareja1Texto = partido.pareja1.join(' - ');
            const pareja2Texto = partido.pareja2.join(' - ');

            li.innerHTML = `
                <div class="partido-header">
                    <span class="partido-numero">Partido ${index + 1}</span>
                </div>
                <div class="partido-detalle">
                    <span class="pareja">${pareja1Texto}</span>
                    <span class="vs">VS</span>
                    <span class="pareja">${pareja2Texto}</span>
                </div>
            `;

            listaPartidos.appendChild(li);
        });
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

    console.log('✅ Aplicación inicializada correctamente');
};

// Función llamada cuando se hace clic en "Sortear Parejas"
function seleccionarJugadores() {
    try {
        const jugadores = interfazUsuario.obtenerJugadoresSeleccionados();

        // Valida y selecciona jugadores
        gestorPartidos.seleccionarJugadores(jugadores);

        // Genera las parejas
        const parejas = gestorPartidos.generarParejas();

        // Muestra las parejas
        interfazUsuario.mostrarParejas(parejas);

        interfazUsuario.mostrarMensaje('✅ Parejas generadas correctamente', 'success');

    } catch (error) {
        interfazUsuario.mostrarMensaje('❌ ' + error.message, 'error');
    }
}

// Función llamada cuando se hace clic en "Armar Partidos"
function generarPartidos() {
    try {
        const partidos = gestorPartidos.generarPartidos();
        interfazUsuario.mostrarPartidos(partidos);

        interfazUsuario.mostrarMensaje(`✅ Se generaron ${partidos.length} partidos`, 'success');

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
