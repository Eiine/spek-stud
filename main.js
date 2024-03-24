const { app, BrowserWindow, globalShortcut, ipcMain,clipboard, screen } = require('electron');
const path= require('path')
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 225,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload",'main.js')
    }
  });
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow.setPosition(width - 320, height - 220)

  
  mainWindow.loadFile(path.join(__dirname,"/view",'index.html'));

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true)
  })

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false)
  })

  // Registra un atajo de teclado global
   globalShortcut.register('CommandOrControl+A', () => {
    const text=clipboard.readText()
    mainWindow.webContents.send("leer",text)

  });
  globalShortcut.register('CommandOrControl+P', () => {
    
    mainWindow.webContents.send("pause",true)

  });
  globalShortcut.register('CommandOrControl+s', () => {
    mainWindow.webContents.send("stop",false)
  })

  globalShortcut.register('CommandOrControl+v', () => {
    mainWindow.webContents.send("speedUp","incremento")
  })
});

app.on('will-quit', () => {
  // Desregistra el atajo de teclado global al salir de la aplicación
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

