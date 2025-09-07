class Event {
    private listeners: Map<string, Array<(...args: any) => void>> = null!

    constructor() {
        console.log("Event initialized")

        this.listeners = new Map<string, Array<(...args: any) => void>>()
    }

    on = (event: string, callback: (...args: any) => void) => {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }

        this.listeners.get(event)?.push(callback)
    }

    trigger = (event: string, ...args: any) => {
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.forEach((callback: (...args: any) => void) => callback(...args))
        }
    }
}

export default Event