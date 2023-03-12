import { CreatePayload, Payload, convertPayloadsToText } from './changeEventPayloads'

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
        const node = change.node
        if (node.removed) {
          payloads.push({
            type: 'DELETE',
            id: node.id,
          })
          continue
        }
        const parentFrame = getNearestParentFrame(node)
        const payload: CreatePayload = {
          type: 'CREATE',
          nodeType: node.type,
          id: node.id,
          name: node.name,
          frame: parentFrame?.name,
        }
        payloads.push(payload)
        continue
      }
      if (change.type === 'PROPERTY_CHANGE') {
        const node = change.node
        if (node.removed) {
          payloads.push({
            type: 'DELETE',
            id: node.id,
          })
          continue
        }
        const parentFrame = getNearestParentFrame(node)
        const payload: Payload = {
          type: change.type,
          nodeType: node.type,
          id: node.id,
          name: node.name,
          changeProperties: change.properties.map((p) => p.toString()),
          frame: parentFrame?.name,
        }
        payloads.push(payload)
      }
      if (change.type === 'DELETE') {
        const node = change.node
        payloads.push({
          type: 'DELETE',
          id: node.id,
        })
      }
    }
    const text = convertPayloadsToText(payloads)
    await postToSlack(text)
  })()
})

function getNearestParentFrame(node: (BaseNode & ChildrenMixin) | SceneNode): FrameNode | null {
  if (node.type === 'FRAME') {
    return node
  }
  if (node.parent === null) {
    return null
  }
  return getNearestParentFrame(node.parent)
}
