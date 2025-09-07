import Event from "./event"

class Time {
    private last: number = 0
    
    events: Event = null!

    constructor() {
        console.log("Time initialized")

        this.last = performance.now()

        this.events = new Event()

        requestAnimationFrame(this.tick)
    }

    tick = (now: DOMHighResTimeStamp) => {
        const delta: number = (now - this.last) / 1000
        this.last = now

        this.events.trigger("update", delta)

        requestAnimationFrame(this.tick)
    }
}

export default Time