
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow

console.log(process.versions.chrome);
console.log('electron ' + process.versions.electron);
console.log(process.versions.node);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 880,
    height: 640,
    frame: true, // tira a barra padrão do SO
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.loadURL("https://web.whatsapp.com", {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.215 Safari/537.36"
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Eventos vindos do renderer (botões de controle)
ipcMain.on('window-control', (event, action) => {
  if (!mainWindow) return
  switch (action) {
    case 'minimize':
      mainWindow.minimize()
      break
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
      break
    case 'close':
      mainWindow.close()
      break
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  // Atalho: Cmd+Opt+I no macOS, Ctrl+Shift+I no Windows/Linux
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools()
      }
    })
  }
})
