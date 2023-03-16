import { Payload } from "./changeEventPayloads"

const queue: Payload[] = []

export const eventQueue = {
    length(): number {
        return queue.length
    },
    push(payload: Payload) {
        queue.push(payload)
    },
    pop(): Payload | undefined {
        return queue.shift()
    }
}