export type Payload = CreatePayload | DeletePayload | ChangePayload
export type CreatePayload = {
    type: 'CREATE'
    nodeType: NodeType
    id: string
    name: string
    frame?: string
}
export type ChangePayload = {
    type: 'PROPERTY_CHANGE'
    nodeType: NodeType
    id: string
    name: string
    changeProperties: string[]
    frame?: string
}
export type DeletePayload = {
    type: 'DELETE'
    id: string
}


export function convertPayloadsToText(payloads: Payload[]): string {
    const text = payloads.map((p) => {
        if (p.type === 'DELETE') {
            return `:wastebasket: ${p.id}`
        }
        if (p.type === 'CREATE') {
            return `:new: ${p.name} (${p.nodeType})`
        }
        if (p.type === 'PROPERTY_CHANGE') {
            return `:pencil2: ${p.name} (${p.nodeType}) ${p.changeProperties.join(', ')}`
        }
        return ''
    }).join('\n')
    return text
}
