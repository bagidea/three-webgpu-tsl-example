import {
    ACESFilmicToneMapping,
    Color,
    PerspectiveCamera,
    PostProcessing,
    Scene,
    WebGPURenderer
} from "three/webgpu"

import Stats from "stats-gl"

import Game from "./game"

class View {
    private game: Game = null!
    private stats: Stats = null!

    renderer: WebGPURenderer = null!
    scene: Scene = null!
    camera: PerspectiveCamera = null!

    postProcrssing: PostProcessing = null!

    private container: HTMLDivElement = null!
    private canvas: HTMLCanvasElement = null!

    constructor(container: HTMLDivElement, canvas: HTMLCanvasElement) {
        this.game = new Game()

        console.log("View initialized")

        // Canvas init
        if (!container || !canvas) throw new Error("View error :: Container or canvas not found!")

        this.container = container
        this.canvas = canvas

        // Renderer init
        this.renderer = new WebGPURenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.toneMapping = ACESFilmicToneMapping
        this.renderer.shadowMap.enabled = true

        // Scene init
        this.scene = new Scene ()
        this.scene.background = new Color(0x000000)

        // Camera init
        this.camera = new PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000.0)
        //this.camera.position.set(5, 5, 5)
        //this.camera.lookAt(0, 0, 0)

        // Post Processing
        this.postProcrssing = new PostProcessing(this.renderer)

        // Render
        this.game.time.events.on("update", this.render)

        // On window resize
        window.addEventListener("resize", this.on_window_rezize)

        // Stats init
        this.stats = new Stats({
            trackGPU: true,
            trackHz: true,
            trackCPT: true,
            //logsPerSecond: 4,
            //graphsPerSecond: 30,
            //samplesLog: 40, 
            //samplesGraph: 10, 
            precision: 3,
            horizontal: false,
            //minimal: false, 
            //mode: 2
        })

        this.stats.init(this.renderer)

        this.container.appendChild(this.stats.dom)
    }

    render = async () => {
        //await this.renderer.renderAsync(this.scene, this.camera)
        await this.postProcrssing.renderAsync()
        await this.renderer.resolveTimestampsAsync()
        this.stats.update()
    }

    on_window_rezize = () => {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
    }
}

export default View