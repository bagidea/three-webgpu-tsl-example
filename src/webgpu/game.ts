import Time from "./time"
import Loaders from "./loaders"
import View from "./view"
import TSLExample from "./tsl_example"
import Environment from "./environment"
import PostProcessing from "./post_processing"

class Game {
    private static instance: Game = null!

    view: View = null!
    tsl_example: TSLExample = null!
    environment: Environment = null!
    postProcessing: PostProcessing = null!

    time: Time = null!
    loaders: Loaders = null!

    constructor() {
        if (Game.instance) return Game.instance

        Game.instance = this

        console.log("Game initialized")

        this.time = new Time()
        this.loaders = new Loaders()

        const container: HTMLDivElement = document.getElementById("game-container") as HTMLDivElement
        const canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement

        this.view = new View(container, canvas)

        // TSLExample init
        this.tsl_example = new TSLExample()

        // Environment init
        this.environment = new Environment()

        // PostProcrssing init
        this.postProcessing = new PostProcessing()
    }
}

export default Game