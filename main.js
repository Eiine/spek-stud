const { app, BrowserWindow, globalShortcut, clipboard, screen, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

app.on('ready', () => {
  // Crea la ventana principal
  mainWindow = new BrowserWindow({
    width: 320,
    height: 225,
    show: false, // Evita que la ventana principal se muestre inmediatamente
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload", 'main.js')
    }
  });

  // Carga el archivo HTML en la ventana principal
  mainWindow.loadFile(path.join(__dirname, "/view", 'index.html'));

  // Obtén el tamaño de la pantalla primaria
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Calcula las coordenadas para la esquina inferior derecha
  const x = width - mainWindow.getSize()[0]; // Ancho de la pantalla menos el ancho de la ventana
  const y = height - mainWindow.getSize()[1]; // Altura de la pantalla menos la altura de la ventana

  // Establece la posición de la ventana principal
  mainWindow.setPosition(x, y);

  // Crea un icono personalizado en la bandeja del sistema
  tray = new Tray(path.join(__dirname,"/view" ,'robo.png'));

  // Define el menú contextual para el icono de la bandeja
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() }
  ]);

  // Establece el menú contextual para el icono de la bandeja
  tray.setContextMenu(contextMenu);

  // Muestra la ventana principal cuando se hace doble clic en el icono de la bandeja
  tray.on('double-click', () => {
    mainWindow.show();
  });

  // Oculta la ventana principal cuando se minimiza
  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });

  // Registra un atajo de teclado global
  globalShortcut.register('CommandOrControl+A', () => {
    const text = clipboard.readText()
    mainWindow.webContents.send("leer", text)

  });
});

app.on('will-quit', () => {
  // Desregistra el atajo de teclado global al salir de la aplicación
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});
