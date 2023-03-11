const KeySlackWebhookUrl = 'slackWebhookUrl'

figma.showUI(__uiFiles__.postToSlack, {
  visible: false
})
figma.on('run', ({ parameters }) => {
  const slackWehookUrl = parameters?.[KeySlackWebhookUrl]
  console.log(slackWehookUrl)
  figma.clientStorage.setAsync(KeySlackWebhookUrl, slackWehookUrl)
})

figma.on('documentchange', (event) => {
  (async () => {
    for (const changes of event.documentChanges) {
      console.log(changes)
      const slackWebhookUrl = await figma.clientStorage.getAsync(KeySlackWebhookUrl)
      console.log(slackWebhookUrl)
      figma.ui.postMessage({
        type: 'onDocumentChange',
        content: {
          slackWebhookUrl,
          changes
        }
      })
    }
  })()
})
