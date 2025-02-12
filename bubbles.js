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
                console.log('Bubbles read from file:', data); // Debug message
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
                console.log('Bubbles written to file:', bubbles); // Debug message
                resolve();
            }
        });
    });
}

function initializeBubbles() {
    return new Promise((resolve, reject) => {
        fs.access(bubblesFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist, create it with default bubbles
                console.log('File does not exist. Creating with default bubbles.'); // Debug message
                writeBubbles(defaultBubbles).then(resolve).catch(reject);
            } else {
                // File exists, read and check if it's empty
                readBubbles().then((bubbles) => {
                    if (bubbles.length === 0) {
                        console.log('File is empty. Writing default bubbles.'); // Debug message
                        writeBubbles(defaultBubbles).then(resolve).catch(reject);
                    } else {
                        console.log('File already contains bubbles:', bubbles); // Debug message
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
