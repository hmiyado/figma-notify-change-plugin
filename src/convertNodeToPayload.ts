import { FramePayload, Payload } from "./changeEventPayloads"

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
    toCreateNode(node: SceneNode | RemovedNode): Payload {
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
    toChangeNode(node: SceneNode | RemovedNode, changedProperties: NodeChangeProperty[]): Payload {
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
    toDeleteNode(node: SceneNode | RemovedNode): Payload {
        return {
            type: 'DELETE',
            id: node.id,
        }
    }
}