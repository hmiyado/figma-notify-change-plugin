import { DeletePayloadWithPreviousNode, FramePayload, Payload } from "./changeEventPayloads"
import { WebApiRepository } from "./webApi/webApiRepository"

function getNearestParentFrame(node: (BaseNode & ChildrenMixin) | SceneNode): FrameNode | undefined {
    if (node.type === 'FRAME') {
        return node
    }
    if (node.parent === null) {
        return undefined
    }
    return getNearestParentFrame(node.parent)
}

function getFrameLink(frame: FrameNode | undefined): string {
    if (frame === undefined) { return '' }
    return `https://www.figma.com/file/${figma.fileKey}/${figma.root.name}?node-id=${encodeURIComponent(frame.id)}`
}

function toFramePayload(frame: FrameNode | undefined): FramePayload | undefined {
    if (frame === undefined) { return undefined }
    return {
        name: frame.name,
        link: getFrameLink(frame),
    }
}

export const NodeToPayloadConverter = {
    async toCreateNode(node: SceneNode | RemovedNode): Promise<Payload> {
        if (node.removed) {
            return this.toDeleteNode(node)
        }
        const parentFrame = getNearestParentFrame(node)
        return {
            type: 'CREATE',
            nodeType: node.type,
            id: node.id,
            name: node.name,
            frame: toFramePayload(parentFrame),
        }
    },
    async toChangeNode(node: SceneNode | RemovedNode, changedProperties: NodeChangeProperty[]): Promise<Payload> {
        if (node.removed) {
            return this.toDeleteNode(node)
        }
        const parentFrame = getNearestParentFrame(node)
        return {
            type: 'PROPERTY_CHANGE',
            nodeType: node.type,
            id: node.id,
            name: node.name,
            changeProperties: changedProperties.map((p) => p.toString()),
            frame: toFramePayload(parentFrame),
        }
    },
    async toDeleteNode(node: SceneNode | RemovedNode): Promise<Payload> {
        const previoousVersion = await WebApiRepository.fetchPreviousVersion()
        if (previoousVersion === null) {
            return {
                type: 'DELETE',
                id: node.id,
            }
        }
        const previousNodes = await WebApiRepository.fetchNodes({ ids: [node.id], version: previoousVersion })
        const previousNode = previousNodes[node.id]
        if (!previousNode) {
            return {
                type: 'DELETE',
                id: node.id,
            }
        }
        const payload: DeletePayloadWithPreviousNode = {
            type: 'DELETE',
            id: node.id,
            previousNode: {
                id: node.id,
                version: previoousVersion,
                name: previousNode.document.name,
                nodeType: previousNode.document.type,
            },
        }
        return payload
    }
}