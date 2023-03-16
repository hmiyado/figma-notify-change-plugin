export type Payload = CreatePayload | DeletePayload | ChangePayload | DeletePayloadWithPreviousNode

export type CreatePayload = {
    type: 'CREATE'
    changeProperties?: {
        [key: string]: string
    }
} & NodePayload

export type ChangePayload = {
    type: 'PROPERTY_CHANGE'
    changeProperties: {
        [key: string]: string
    }
} & NodePayload

export type DeletePayload = {
    type: 'DELETE'
    id: string
}

export type DeletePayloadWithPreviousNode = DeletePayload & {
    previousNode: NodePayload
}

export type FramePayload = {
    name: string
    link: string
}

type NodePayload = {
    id: string
    nodeType: NodeType
    name: string
    frame?: FramePayload
    version?: string
}

export function convertPayloadsToText(payloads: Payload[]): string {
    const text = payloads.map((p) => {
        if (p.type === 'DELETE') {
            if ('previousNode' in p) {
                return getHead(':wastebasket:', p.previousNode)
            }
            return `:wastebasket: ${p.id}`
        }
        if (p.type === 'CREATE') {
            const body = p.changeProperties !== undefined ?
                Object.entries(p.changeProperties).reduce((acc, v) => `${acc}\n${v[0]}: ${v[1]}`, '')
                : ''
            const head = getHead(':new:', p)
            return `${head}${body !== '' ? `\n${body}` : ''}`
        }
        if (p.type === 'PROPERTY_CHANGE') {
            const head = getHead(':pencil2:', p)
            const body = Object.entries(p.changeProperties).reduce((acc, v) => `${acc}\n${v[0]}: ${v[1]}`, '')
            return `${head}\n${body}`
        }
        return ''
    }).join('\n')
    return text
}

function convertFramePayloadToText(frame: FramePayload | undefined): string {
    if (frame === undefined) {
        return '[No Parent Frame]'
    }
    return toSlackLink(frame.name, frame.link)
}

function getHead(icon: string, node: NodePayload): string {
    const presentation = `${node.name}: ${node.nodeType}`
    return `${icon} ${toSlackLink(presentation, getNodeLink(node.id, node.version))} < ${convertFramePayloadToText(node.frame)}`
}

function getNodeLink(id: string, version?: string): string {
    const versionParam = version ? `&version-id=${version}` : ''
    return `https://www.figma.com/file/${figma.fileKey}/${figma.root.name}?node-id=${encodeURIComponent(id)}${versionParam}`
}

function toSlackLink(text: string, link: string): string {
    return `<${link}|${text}>`
}
