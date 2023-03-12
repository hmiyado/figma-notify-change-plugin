import { Payload, convertPayloadsToText } from './changeEventPayloads'
import { NodeToPayloadConverter } from './convertNodeToPayload'

const KeySlackWebhookUrl = 'slackWebhookUrl'

figma.showUI(__uiFiles__.postToSlack, {
  visible: false
})
figma.on('run', ({ parameters }) => {
  const slackWehookUrl = parameters?.[KeySlackWebhookUrl]
  console.log(slackWehookUrl)
  figma.clientStorage.setAsync(KeySlackWebhookUrl, slackWehookUrl)
})

async function postToSlack(text: string) {
  const slackWebhookUrl = await figma.clientStorage.getAsync(KeySlackWebhookUrl)
  figma.ui.postMessage({
    type: 'onDocumentChange',
    content: {
      slackWebhookUrl,
      text,
    }
  })
}

figma.on('documentchange', (event) => {
  (async () => {
    const payloads: Payload[] = []
    for (const change of event.documentChanges) {
      console.log(change)
      if (['STYLE_CREATE', 'STYLE_PROPERTY_CHANGE', 'STYLE_DELETE'].find((e) => e === change.type) !== undefined) {
        continue
      }
      if (change.type === 'CREATE') {
        const payload = NodeToPayloadConverter.toCreateNode(change.node)
        payloads.push(payload)
        continue
      }
      if (change.type === 'PROPERTY_CHANGE') {
        const node = change.node
        const payload = NodeToPayloadConverter.toChangeNode(node, change.properties)
        payloads.push(payload)
        continue
      }
      if (change.type === 'DELETE') {
        const node = change.node
        const payload = NodeToPayloadConverter.toDeleteNode(node)
        payloads.push(payload)
      }
    }
    const text = convertPayloadsToText(payloads)
    await postToSlack(text)
  })()
})
