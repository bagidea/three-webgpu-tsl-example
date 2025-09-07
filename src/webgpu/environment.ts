import {
    BoxGeometry,
    DataTexture,
    DirectionalLight,
    EquirectangularReflectionMapping,
    Group,
    Mesh,
    MeshStandardNodeMaterial,
    RepeatWrapping,
    SRGBColorSpace,
    Texture
} from "three/webgpu"

import {
    Fn,
    rangeFogFactor,
    reflector,
    texture,
    textureBicubic,
    time,
    uv,
    vec2,
    vec4
} from "three/tsl"

import Game from "./game"

class Environment {
    private game: Game = null!
    group: Group = null!

    constructor() {
        this.game = new Game()
        this.group = new Group()

        console.log("Environment initialized")

        this.create()
        this.game.view.scene.add(this.group)
    }

    private create = () => {
        const dir_light: DirectionalLight = new DirectionalLight(0xffffff, 0.5)
        dir_light.position.set(0, 50, 0)
        this.group.add(dir_light)

        // Background and Environment
        this.game.loaders.ultraHDRLoader.load("spruit_sunrise_2k.hdr.jpg", (texture: DataTexture) => {
            texture.mapping = EquirectangularReflectionMapping
            texture.needsUpdate = true

            this.game.view.scene.background = texture
            this.game.view.scene.environment = texture
        })

        // Floor
        const water = Fn(() => {
            // blur reflection using textureBicubic()
            const dirtyReflection = textureBicubic(reflection, roughness.mul(0.9))

            // falloff opacity by distance like an opacity-fog
            const opacity = rangeFogFactor(7, 25).oneMinus()

            return vec4(dirtyReflection.rgb, opacity)
        })


        const perlinMap: Texture = this.game.loaders.textureLoader.load("rgb-256x256.png")
        perlinMap.wrapS = RepeatWrapping
        perlinMap.wrapT = RepeatWrapping
        perlinMap.colorSpace = SRGBColorSpace

        const reflection = reflector({
            resolutionScale: 0.5,
            bounces: false,
            generateMipmaps: true
        })

        reflection.target.rotateX(-Math.PI / 2)
        this.group.add(reflection.target)

        const animatedUV = uv().mul(10).add(vec2(time.mul(0.1), 0))
        const roughness = texture(perlinMap, animatedUV).r.mul(2).saturate()

        const floorMaterial: MeshStandardNodeMaterial = new MeshStandardNodeMaterial()
        floorMaterial.transparent = true
        floorMaterial.metalness = 1
        floorMaterial.roughnessNode = roughness.mul(0.2)
        floorMaterial.colorNode = water()

        const floor: Mesh = new Mesh(
            new BoxGeometry(50, 0.001, 50),
            floorMaterial
        )

        this.group.add(floor)
    }
}

export default Environment