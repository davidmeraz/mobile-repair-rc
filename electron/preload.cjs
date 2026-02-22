const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
});

// Since contextIsolation is false, we can attach directly to window
window.api = {
    readData: () => ipcRenderer.invoke('db:read'),
    writeData: (data) => ipcRenderer.invoke('db:write', data)
};
