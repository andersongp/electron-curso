const { remote } = require('electron');
const mainWindow = remote.BrowserWindow.getFocusedWindow();
const path = require('path');
const Mousetrap = require('mousetrap');

let minimizar = document.getElementById('minimizar');
minimizar.addEventListener('click', function(e){
    e.preventDefault();
    mainWindow.minimize();
});

let maximizar = document.getElementById('maximizar');
maximizar.addEventListener('click', function(e){
    e.preventDefault();
    if (mainWindow.isMaximized()){
        maximizar.textContent = 'maximizar';
        mainWindow.unmaximize();
    }
    else{
        maximizar.textContent = 'restaurar';
        mainWindow.maximize();
    }
});

let fechar = document.getElementById('fechar');
fechar.addEventListener('click', function(e){
    e.preventDefault();
    mainWindow.close();
});

let fullscreen = document.getElementById('fullscreen');
fullscreen.addEventListener('click', function(e){
    e.preventDefault();
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

// let getgif = document.getElementById('getgif');
// getgif.addEventListener('click', function(e){
//     e.preventDefault();
//     httpRequest = new XMLHttpRequest();
//     httpRequest.onreadstatechange = function(){
//         if (httpRequest.status == 200){
//             let response = JSON.parse(httpRequest.response);
//             let imgUrl = response.data.image_url;
//             document.getElementById('show-gif').innerHTML = `<img src="${imgUrl}"/>`;
//         }
//     }
//     httpRequest.open('GET', '');
//     httpRequest.send();
// });

let notification = document.getElementById('notification');
notification.addEventListener('click', function(e){
    e.preventDefault();

    let notification = new Notification('Minha notificação', {
        body: 'Esta é minha notificação bem bacana do meu app',
        icon: path.join(__dirname, 'tray.png')
    });

    notification.onclick = function(){
        alert('clicado com sucesso');
    }
});

Mousetrap.bind('up up down down left right t', function(){
    alert('Erik\s Win');
});