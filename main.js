const {app, BrowserWindow, Tray, Menu, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');

if (process.env.NODE_ENV == 'development'){
    require('electron-reload')(__dirname);
}

app.setAppUserModelId('cbm.ap.gov.br.electron-curso');

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

app.on('ready', createWindow);