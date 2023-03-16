import { DeletePayload, Payload, convertPayloadsToText } from './changeEventPayloads'
import { NodeToPayloadConverter } from './convertNodeToPayload'
import { eventQueue } from './eventQueue'
import { FigmaParameter } from './figmaParameter'

figma.showUI(__uiFiles__.postToSlack, {
  visible: false
})
figma.on('run', ({ parameters }) => {
  if (!parameters) {
    return
  }
  FigmaParameter.initWithParameters(parameters)
})

async function postToSlack(text: string) {
  const slackWebhookUrl = await FigmaParameter.slackWebhookUrl()
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
    for (const change of event.documentChanges) {
      console.log(change)
      if (['STYLE_CREATE', 'STYLE_PROPERTY_CHANGE', 'STYLE_DELETE'].find((e) => e === change.type) !== undefined) {
        continue
      }
      if (change.type === 'CREATE') {
        const payload = NodeToPayloadConverter.toCreateNode(change.node)
        eventQueue.push(await payload)
        continue
      }
      if (change.type === 'PROPERTY_CHANGE') {
        const node = change.node
        const payload = NodeToPayloadConverter.toChangeNode(node, change.properties)
        eventQueue.push(await payload)
        continue
      }
      if (change.type === 'DELETE') {
        const node = change.node
        const payload = NodeToPayloadConverter.toDeleteNode(node)
        eventQueue.push(await payload)
      }
    }
  })()
})

setInterval(() => {
  if (eventQueue.length() === 0) {
    return
  }
  const eventMap = new Map<string, Exclude<Payload, DeletePayload>>()
  while (eventQueue.length() > 0) {
    const event = eventQueue.pop()
    if (event === undefined) { return }
    if (event.type === 'CREATE') {
      eventMap.set(event.id, event)
      continue
    }
    if (event.type === 'DELETE') {
      eventMap.delete(event.id)
      continue
    }
    // event.type === 'PROPERTY_CHANGE'
    if (!eventMap.has(event.id)) {
      eventMap.set(event.id, event)
      continue
    }
    const previousEvent = eventMap.get(event.id)
    if (previousEvent === undefined) { return }
    eventMap.set(event.id, {
      ...previousEvent,
      changeProperties: {
        ...previousEvent.changeProperties,
        ...event.changeProperties,
      }
    })
  }
  const payloads = Array.from(eventMap.values())
  const text = convertPayloadsToText(payloads)
  postToSlack(text)
}, 60 * 1000)