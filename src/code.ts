let slackUrl = ''
figma.showUI(__uiFiles__.postToSlack, {
  visible: false
})
figma.on('run', ({ parameters }) => {
  slackUrl = parameters?.['slackWebhookUrl']
})

let count = 1
figma.on('documentchange', (event) => {
  count += 1
  if (count > 5) {
    return
  }
  for (const changes of event.documentChanges) {
    console.log(changes)
    figma.ui.postMessage({
      type: 'onDocumentChange',
      content: {
        slackUrl,
        changes
      }
    })
  }
})
