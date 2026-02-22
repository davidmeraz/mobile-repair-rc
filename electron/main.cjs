const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');


let splashWindow;
let mainWindow;

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 400,
        backgroundColor: '#020617', // Matching the CSS background
        frame: false, // Frameless
        alwaysOnTop: true,
        transparent: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    splashWindow.loadFile(path.join(__dirname, 'splash.html'));
    splashWindow.center();
}

function setupDatabaseIPC() {
    const dbPath = path.join(app.getPath('userData'), 'database.json');

    // Default empty structure
    const defaultData = {
        deviceModels: [],
        customers: [],
        repairs: [],
        parts: []
    };

    // Ensure file exists
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    }

    // Read handler
    ipcMain.handle('db:read', async () => {
        try {
            const raw = fs.readFileSync(dbPath, 'utf-8');
            return JSON.parse(raw);
        } catch (error) {
            console.error('Error reading DB:', error);
            return defaultData;
        }
    });

    // Write handler
    ipcMain.handle('db:write', async (event, data) => {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
            return true;
        } catch (error) {
            console.error('Error writing DB:', error);
            return false;
        }
    });
}

function createMainWindow() {
    const { screen } = require('electron');
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.floor(width * 0.80),
        height: Math.floor(height * 0.86),
        resizable: false, // Prevent resizing
        maximizable: false,
        movable: false, // Prevent moving
        center: true, // Center on screen explicitly
        show: false, // Start hidden
        autoHideMenuBar: true,
        backgroundColor: '#020617', // Pre-fill with correct background to avoid white flash
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;

    if (process.env.ELECTRON_START_URL) {
        mainWindow.loadURL(startUrl);
        // Open DevTools in development
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        // Add a small delay for the "loading" effect or wait for content
        setTimeout(() => {
            if (splashWindow) {
                splashWindow.close();
                splashWindow = null;
            }
            mainWindow.show();
            mainWindow.focus();
        }, 3000); // 3 seconds splash screen
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function initApp() {
    setupDatabaseIPC();
    createSplashWindow();
    createMainWindow();
}

app.on('ready', initApp);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
