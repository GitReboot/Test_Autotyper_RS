import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url';
import processWindows from 'node-process-windows'
import activeWin from 'active-win';

import AutoTyper from './autotyper.js';
import Store from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AutoHyperApp {
    constructor() {
        this.win = null;
        this.store = new Store();
        this.autotyper = new AutoTyper();
        this.setupAppEvents();
        this.setupIpcHandlers();
        this.autotyper.start();
    }

    setupAppEvents() {
        app.whenReady().then(() => {
            this.createMainWindow();
        });

        app.on('activate', () => {
            if(BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
    }

    setupIpcHandlers() {
        ipcMain.on('window-minimize', () => {
            if(this.win) {
                this.win.minimize();
            }
        });

        ipcMain.on('window-close', () => {
            if(this.win) {
                this.win.close();
            }
        });
        
        ipcMain.on('autotype', (event, text) => {
            console.log('Autotyping: ' + text);
            this.autotyper.typeText(text);
        });

        ipcMain.on('autotype-pause-toggle', () => {
            this.autotyper.togglePause();
        });

        ipcMain.on('autotype-pause', () => {
            this.autotyper.pause();
        });

        ipcMain.on('autotype-resume', () => {
            this.autotyper.resume();
        });

        ipcMain.on('disable-window-zoom', () => {
            webFrame.setZoomLevel(0);
            webFrame.setVisualZoomLevelLimits(1, 1);
        });
        
        ipcMain.handle('save-messages', async (event, title, messages) => {
            console.log('Saving messages: ' + title + ' - ' + messages);
            const currentStore = await this.store.load();
            let existingListWithTitle = currentStore.lists.find(list => list.title === title);

            if(existingListWithTitle) {
                existingListWithTitle.messages = messages;
            } else {
                currentStore.lists.push({
                    title: title,
                    messages: messages
                });
            }

            await this.store.save(currentStore);
        });

        ipcMain.handle('delete-message-list', (event, title) => {
            this.store.update(store => {
                store.lists = store.lists.filter(list => list.title !== title);
            });
        });

        ipcMain.handle('get-message-lists', async () => {
            const currentStore = await this.store.load();

            return currentStore.lists;
        });

        ipcMain.handle('get-min-delay', async () => {
            const currentStore = await this.store.load();

            return currentStore.minDelay;
        });

        ipcMain.handle('set-min-delay', async (event, delay) => {
            this.store.update(store => {
                store.minDelay = delay;
            });
        });

        ipcMain.handle('get-max-delay', async () => {
            const currentStore = await this.store.load();

            return currentStore.maxDelay;
        });

        ipcMain.handle('set-max-delay', async (event, delay) => {
            this.store.update(store => {
                store.maxDelay = delay;
            });
        });

        ipcMain.handle('get-open-applications', async () => {
            return new Promise((resolve) => {
                processWindows.getProcesses(function(err, processes) {
                    resolve(processes.filter(process => process.mainWindowTitle !== ''));
                });
            });
        });

        ipcMain.handle('get-active-window', async () => {
            const result = await activeWin();

            if(result) {
                return {
                    title: result.title,
                    pid: result.owner.processId
                }
            }

            return null;
        });
    }

    createMainWindow() {
        this.win = new BrowserWindow({
            width: 800,
            height: 500,
            resizable: false,
            maximizable: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.cjs'),
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: false
            },
            frame: false
        });
        
        this.win.webContents.on('before-input-event', (event, input) => {
            if (input.control && (input.key === '-' || input.key === '+' || input.key === '=')) {
              event.preventDefault();
            }
        });

        const isDev = !!process.env.VITE_DEV_SERVER_URL;

        if (isDev) {
            this.win.loadURL(process.env.VITE_DEV_SERVER_URL);
        } else {
            this.win.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
        }
    }
}

new AutoHyperApp();