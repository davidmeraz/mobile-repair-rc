const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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

    // Export handler — save database to a user-chosen location
    ipcMain.handle('db:export', async () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const result = await dialog.showSaveDialog(mainWindow, {
                title: 'Export Database Backup',
                defaultPath: `mobile-repair-backup-${timestamp}.json`,
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (result.canceled || !result.filePath) {
                return { success: false, canceled: true };
            }

            const raw = fs.readFileSync(dbPath, 'utf-8');
            fs.writeFileSync(result.filePath, raw, 'utf-8');
            return { success: true, path: result.filePath };
        } catch (error) {
            console.error('Error exporting DB:', error);
            return { success: false, error: error.message };
        }
    });

    // Import handler — load database from a user-chosen file
    ipcMain.handle('db:import', async () => {
        try {
            const result = await dialog.showOpenDialog(mainWindow, {
                title: 'Import Database Backup',
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All Files', extensions: ['*'] }
                ],
                properties: ['openFile']
            });

            if (result.canceled || result.filePaths.length === 0) {
                return { success: false, canceled: true };
            }

            const raw = fs.readFileSync(result.filePaths[0], 'utf-8');
            const data = JSON.parse(raw);

            // Validate the structure has at least one expected key
            const validKeys = ['deviceModels', 'customers', 'repairs', 'parts'];
            const hasValidKey = validKeys.some(key => Array.isArray(data[key]));

            if (!hasValidKey) {
                return { success: false, error: 'Invalid database format. The file must contain at least one of: deviceModels, customers, repairs, parts.' };
            }

            // Write to the actual database
            const mergedData = {
                deviceModels: data.deviceModels || [],
                customers: data.customers || [],
                repairs: data.repairs || [],
                parts: data.parts || []
            };
            fs.writeFileSync(dbPath, JSON.stringify(mergedData, null, 2), 'utf-8');

            return { success: true, data: mergedData, path: result.filePaths[0] };
        } catch (error) {
            console.error('Error importing DB:', error);
            return { success: false, error: error.message };
        }
    });
}

function createMainWindow() {
    const { screen } = require('electron');
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.floor(width * 0.80),
        height: Math.floor(height * 0.90),
        resizable: false, // Prevent resizing
        maximizable: false,
        movable: false, // Prevent moving
        center: true, // Center on screen explicitly
        show: false, // Start hidden
        frame: false, // Frameless window — custom title bar
        autoHideMenuBar: true,
        backgroundColor: '#020617', // Pre-fill with correct background to avoid white flash
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    // Window control IPC handlers
    ipcMain.on('window:minimize', () => mainWindow?.minimize());
    ipcMain.on('window:maximize', () => {
        if (mainWindow?.isMaximized()) mainWindow.unmaximize();
        else mainWindow?.maximize();
    });
    ipcMain.on('window:close', () => mainWindow?.close());

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
