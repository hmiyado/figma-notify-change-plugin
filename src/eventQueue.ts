import { DeletePayload, Payload } from "./changeEventPayloads"

const queue: Payload[] = []

export const eventQueue = {
    length(): number {
        return queue.length
    },
    push(payload: Payload) {
        queue.push(payload)
    },
    dumpAllPayloads(): Payload[] {
        if (eventQueue.length() === 0) {
            return []
        }
        const eventMap = new Map<string, Exclude<Payload, DeletePayload>>()
        while (eventQueue.length() > 0) {
            const event = eventQueue.pop()
            if (event === undefined) { return [] }
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
            if (previousEvent === undefined) { return [] }
            eventMap.set(event.id, {
                ...previousEvent,
                changeProperties: {
                    ...previousEvent.changeProperties,
                    ...event.changeProperties,
                }
            })
        }
        return Array.from(eventMap.values())
    },
    pop(): Payload | undefined {
        return queue.shift()
    }
}