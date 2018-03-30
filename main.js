const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const url = require('url');
const path = require('path');

if (process.env.NODE_ENV == 'development'){
    require('electron-reload')(__dirname);
}

app.setAppUserModelId('cbm.ap.gov.br.electron-curso');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    let file = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    });

    mainWindow.loadURL(file);

    if (process.env.NODE_ENV == 'development'){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('maximize', () => console.log('maximizado'));
    mainWindow.on('unmaximize', () => console.log('restaurando do maximizado'));
    mainWindow.on('minimize', () => console.log('minimizado'));
    mainWindow.on('restore', () => console.log('restaurado'));
    mainWindow.on('close', () => console.log('fechando'));
    mainWindow.on('resize', () => console.log('tamanho alterado'));

    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Mostar aplicativo', click: function(){
                mainWindow.show();
            }
        },
        {
            label: 'sair', click: function(){
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    let tray = new Tray(path.join(__dirname, 'tray.png'));
    tray.setContextMenu(contextMenu);

    mainWindow.on('minimize', function(e){
        e.preventDefault();
        mainWindow.hide();

        // if (!mainWindow.isVisible()){
        //     mainWindow.show();
        // }
    });

    mainWindow.on('close', function(e){
        if(!app.isQuiting){
            e.preventDefault();
            mainWindow.hide();
        }
    });

    // tray.on('click', function(){
    //     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    // });

    mainWindow.on('show', function(){
        tray.setHighlightMode('always');
    });

    globalShortcut.register('CommandOrControl+x', function(){
        console.log('Quem disse que você pode recortar isso');
    });

    globalShortcut.register('Alt+a', function(){
        console.log('Alt+A foi pressionado');
    });
}

function sendStatusToWindow(text){
    log.info(text);
    const dialogOpts = {
        type: 'info',
        buttons: ['ok'],
        title: 'Atualização do aplicativo',
        message: 'Detalhes:',
        detail: text
    }

    dialog.showMessageBox(dialogOpts);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update available');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Erro in auto-updater');
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Download ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total;
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update Downloaded');
});

app.on('ready', function(){
    autoUpdater.checkForUpdatesAndNotify();
    createWindow();
});