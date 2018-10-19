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
let originalContent = ''

const renderFile = (file, content) => {
  filePath = file
  originalContent = content
  markdownView.value = content
  renderMarkdownToHtml(content)
  updateUserInterface(false)
}

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true })
}

const updateUserInterface = (isEdited) => {
  let title = 'Markdown Editor'
  if (filePath) title = `${path.basename(filePath)} - ${title}`
  if (isEdited) title = `${title} (Edited)`
  currentWindow.setTitle(title)
  currentWindow.setDocumentEdited(isEdited)
  saveMarkdownButton.disabled = !isEdited
  revertButton.disabled = !isEdited
}

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent)
  updateUserInterface(currentContent !== originalContent)
})

newFileButton.addEventListener('click', () => {
  mainProcess.createWindow()
})

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser(currentWindow)
})

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(currentWindow, htmlView.innerHTML)
})

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value)
})

revertButton.addEventListener('click', () => {
  markdownView.value = originalContent
  renderMarkdownToHtml(originalContent)
})

ipcRenderer.on('file-changed', (event, file, content) => {
  const result = remote.dialog.showMessageBox(currentWindow, {
    type: 'warning',
    title: 'Overwrite Current Unsaved Changes?',
    message: 'Another application has changed this file. Load changes?',
    buttons: [
      'Yes',
      'Cancel'
    ],
    defaultId: 0,
    cancelId: 1
  })
  renderFile(file, content)
})
      
ipcRenderer.on('file-opened', (event, file, content) => {
  if (currentWindow.isDocumentEdited()) {
    const result = remote.dialog.showMessageBox(currentWindow, {
      type: 'warning',
      title: 'Overwrite Current Unsaved Changes?',
      message: 'Opening a new file in this window will overwrite your unsaved changes. Open this file anyway?',
      buttons: [
        'Yes',
        'Cancel'
      ],
      defaultId: 0,
      cancelId: 1
    })
    if (result === 1) return
  }
  renderFile(file, content)
})

ipcRenderer.on('save-markdown', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value)
})

ipcRenderer.on('save-html', () => {
  mainProcess.saveHtml(currentWindow, filePath, markdownView.value)
})

document.addEventListener('dragstart', event => event.preventDefault())
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('dragleave', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

const getDraggedFile = event => event.dataTransfer.items[0]
const getDroppedFile = event => event.dataTransfer.files[0]

const fileTypeIsSupported = file => {
  return ['text/markdown', 'text/plain', 'text/x-markdown'].includes(file.type)
}

markdownView.addEventListener('dragover', (event) => {
  const file = getDraggedFile(event)
  console.log(file)
  if (fileTypeIsSupported(file)) {
    markdownView.classList.add('drag-over')
  } else {
    markdownView.classList.add('drag-error')
  }
})

markdownView.addEventListener('dragleave', () => {
  markdownView.classList.remove('drag-over')
  markdownView.classList.remove('drag-error')
})

markdownView.addEventListener('drop', (event) => {
  const file = getDroppedFile(event)
  if (fileTypeIsSupported(file)) {
    mainProcess.openFile(currentWindow, file.path)
  } else {
    alert('Oof, that file type is not supported')
  }
  markdownView.classList.remove('drag-over')
  markdownView.classList.remove('drag-error')
})