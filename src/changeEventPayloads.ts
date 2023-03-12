export type Payload = CreatePayload | DeletePayload | ChangePayload
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

export type FramePayload = {
    name: string
    link: string
}

export function convertPayloadsToText(payloads: Payload[]): string {
    const text = payloads.map((p) => {
        if (p.type === 'DELETE') {
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
