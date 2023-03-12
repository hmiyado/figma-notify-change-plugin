export type Payload = CreatePayload | DeletePayload | ChangePayload | DeletePayloadWithPreviousNode
export type CreatePayload = {
    type: 'CREATE'
    nodeType: NodeType
    id: string
    name: string
    frame?: FramePayload
}
export type ChangePayload = {
    type: 'PROPERTY_CHANGE'
    nodeType: NodeType
    id: string
    name: string
    changeProperties: string[]
    frame?: FramePayload
}
export type DeletePayload = {
    type: 'DELETE'
    id: string
}
export type DeletePayloadWithPreviousNode = DeletePayload & {
    previousNode: {
        version: string
        name: string
        nodeType: NodeType
        frame?: FramePayload
    }
}

export type FramePayload = {
    name: string
    link: string
}

export function convertPayloadsToText(payloads: Payload[]): string {
    const text = payloads.map((p) => {
        if (p.type === 'DELETE') {
            if ('previousNode' in p) {
                return `:wastebasket: ${p.previousNode.name} (${p.previousNode.nodeType}) < ${convertFramePayloadToText(p.previousNode.frame)}`
            }
            return `:wastebasket: ${p.id}`
        }
        if (p.type === 'CREATE') {
            return `:new: ${p.name} (${p.nodeType}) < ${convertFramePayloadToText(p.frame)}`
        }
        if (p.type === 'PROPERTY_CHANGE') {
            return `:pencil2: ${p.name} (${p.nodeType}) ${p.changeProperties.join(', ')} < ${convertFramePayloadToText(p.frame)}`
        }
        return ''
    }).join('\n')
    return text
}

function convertFramePayloadToText(frame: FramePayload | undefined): string {
    if (frame === undefined) {
        return '[No Parent Frame]'
    }
    return `<${frame.link}|${frame.name}>`
}
