// Este archivo contiene las funciones para leer, escribir e inicializar las burbujas desde un archivo JSON.

const fs = require('fs');
const path = require('path');

const bubblesFilePath = path.join(__dirname, 'bubbles.json');

const defaultBubbles = [
    { id: 1, name: 'Bubble 1', color: 'red' },
    { id: 2, name: 'Bubble 2', color: 'blue' }
];

function readBubbles() {
    return new Promise((resolve, reject) => {
        fs.readFile(bubblesFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log('Burbujas leídas del archivo:', data); // Mensaje de depuración
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeBubbles(bubbles) {
    return new Promise((resolve, reject) => {
        fs.writeFile(bubblesFilePath, JSON.stringify(bubbles, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Burbujas escritas en el archivo:', bubbles); // Mensaje de depuración
                resolve();
            }
        });
    });
}

function initializeBubbles() {
    return new Promise((resolve, reject) => {
        fs.access(bubblesFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                // El archivo no existe, créalo con burbujas predeterminadas
                console.log('El archivo no existe. Creando con burbujas predeterminadas.'); // Mensaje de depuración
                writeBubbles(defaultBubbles).then(resolve).catch(reject);
            } else {
                // El archivo existe, léelo y verifica si está vacío
                readBubbles().then((bubbles) => {
                    if (bubbles.length === 0) {
                        console.log('El archivo está vacío. Escribiendo burbujas predeterminadas.'); // Mensaje de depuración
                        writeBubbles(defaultBubbles).then(resolve).catch(reject);
                    } else {
                        console.log('El archivo ya contiene burbujas:', bubbles); // Mensaje de depuración
                        resolve();
                    }
                }).catch(reject);
            }
        });
    });
}

module.exports = {
    readBubbles,
    writeBubbles,
    initializeBubbles
};
