const KeySlackWebhookUrl = 'slackWebhookUrl'

figma.showUI(__uiFiles__.postToSlack, {
  visible: false
})
figma.on('run', ({ parameters }) => {
  const slackWehookUrl = parameters?.[KeySlackWebhookUrl]
  console.log(slackWehookUrl)
  figma.clientStorage.setAsync(KeySlackWebhookUrl, slackWehookUrl)
})

async function postToSlack() {
  const slackWebhookUrl = await figma.clientStorage.getAsync(KeySlackWebhookUrl)
  figma.ui.postMessage({
    type: 'onDocumentChange',
    content: {
      slackWebhookUrl,
    }
  })
}

figma.on('documentchange', (event) => {
  (async () => {
    for (const change of event.documentChanges) {
      console.log(change)
      await postToSlack()
    }
  })()
})
