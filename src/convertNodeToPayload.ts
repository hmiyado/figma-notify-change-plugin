import { Payload } from "./changeEventPayloads"

function getNearestParentFrame(node: (BaseNode & ChildrenMixin) | SceneNode): FrameNode | null {
    if (node.type === 'FRAME') {
        return node
    }
    if (node.parent === null) {
        return null
    }
    return getNearestParentFrame(node.parent)
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
            frame: parentFrame?.name,
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
            frame: parentFrame?.name,
        }
    },
    toDeleteNode(node: SceneNode | RemovedNode): Payload {
        return {
            type: 'DELETE',
            id: node.id,
        }
    }
}