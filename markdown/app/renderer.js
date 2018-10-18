const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
const currentWindow = remote.getCurrentWindow()

const marked = require('marked')
const path = require('path')

const markdownView = document.querySelector('#markdown')
const htmlView = document.querySelector('#html')
const newFileButton = document.querySelector('#new-file')
const openFileButton = document.querySelector('#open-file')
const saveMarkdownButton = document.querySelector('#save-markdown')
const revertButton = document.querySelector('#revert')
const saveHtmlButton = document.querySelector('#save-html')
const showFileButton = document.querySelector('#show-file')
const openInDefaultButton = document.querySelector('#open-in-default')

let filePath = null
let originContent = ''

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true })
}

const updateUserInterface = () => {
  let title = 'Markdown Editor'
  if (filePath) title = `${path.basename(filePath)} - ${title}`
  currentWindow.setTitle(title)
}

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent)
})

newFileButton.addEventListener('click', () => {
  mainProcess.createWindow()
})

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser(currentWindow)
})
      
ipcRenderer.on('file-opened', (event, file, content) => {
  filePath = file
  originContent = content 
  markdownView.value = content
  renderMarkdownToHtml(content)
  updateUserInterface()
})



