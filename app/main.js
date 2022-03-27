'use strict'

require('v8-compile-cache')
const {app, ipcMain,protocol} = require('electron')
const Store = require('electron-store')
const config = new Store()
const DiscordRpc = require("discord-rpc");
if (!app.requestSingleInstanceLock()){app.quit()}

const switchLoader = require('./loaders/switchLoader')
switchLoader(app, config)
const windowLoader = require('./loaders/windowLoader')

app.once('ready', () => {
	protocol.registerFileProtocol('null-swap', (request, callback) => {
		callback(decodeURI(request.url.replace(/null-swap:/, '')))
	})
	windowLoader.initSplashWin(config)
})
app.on('window-close-all', () => {
    app.quit();
})
ipcMain.handle('get-app-info', () => ({
	name: app.name,
	version: app.getVersion(),
	platform: process.platform,
}))

const {ipcRenderer} = require('electron')

module.exports = () => {

  const runRpc = () => {
    const dat = (() => {
      try {
        return window.getGameActivity()
      } catch (excp) {
        console.error(excp)
        return {}
      }
    })()
    ipcRenderer.invoke("rpc-activity", dat)
  };
  runRpc();
  setInterval(() => {runRpc()}, 15e3)
}

ipcMain.handle("rpc-activity",
        async (_, activity) => { await setActivity(activity); })

const clientId = "952098700933615626";
const rpc = new DiscordRpc.Client({transport : 'ipc'});

const setActivity =
async (gameInfo) => {
console.log(gameInfo)



try {
let name
let text
gameInfo.class.name == "Triggerman" ? `${name = "trigger", text = "Triggerman"};` :  text = gameInfo.class.name
gameInfo.class.name == "Run N Gun" ? `${name = "rungun", text = "Run N Gun"};` :  text = gameInfo.class.name
gameInfo.class.name == "Hunter" ? `${name = "hunter", text = "Hunter"};` :  text = gameInfo.class.name
gameInfo.class.name == "Marksman" ? `${name = "marksman", text = "Marksman"};` :  text =gameInfo.class.name

//name,text= gameInfo.class.name == "Run N Gun" ?  `${"rungun","Run N Gun 1"}` :  
console.log(name, text)

rpc.setActivity({
details : gameInfo.mode ? gameInfo.mode : "Playing Krunker",
state : gameInfo.map ? gameInfo.map : "doing da ting!",
endTimestamp : Date.now() + gameInfo.time * 1000,
largeImageText : gameInfo.user ? gameInfo.user : "Loading...",
largeImageKey : "xclient", 
smallImageKey : name ? name : "custom",
smallImageText : text

})
} catch {
}
}

rpc.login(clientId)
      

