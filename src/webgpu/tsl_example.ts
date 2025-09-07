import {
    BoxGeometry,
    Group,
    Mesh,
    MeshStandardNodeMaterial,
    Node,
    SphereGeometry
} from "three/webgpu"

import {
    time,
    sin,
    vec3,
    Fn,
    positionLocal,
    rotateUV,
    vec2,
    If,
    abs,
    length,
    step,
    atan,
    cos,
    normalLocal,
    mx_worley_noise_vec3,
    uniform,
    color,
    mul,
    mx_noise_float,
    Loop,
    float,
    transformNormalToView
} from "three/tsl"

import type { ShaderNodeObject } from "three/tsl"

import Game from "./game"

class TSLExample {
    private game: Game = null!
    group: Group = null!

    private boxs: Array<Mesh> = null!

    constructor() {
        this.game = new Game()
        this.group = new Group()

        console.log("TSL Example initialized")

        this.boxs = new Array<Mesh>()

        this.create()
        this.group.position.y = 1
        this.game.view.scene.add(this.group)

        this.game.time.events.on("update", this.update)
    }

    private create = () => {
        const geometry: BoxGeometry = new BoxGeometry(1, 1, 1)
        const sphere_geometry: SphereGeometry = new SphereGeometry(0.7)

        //////////////////////

        const material0: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material0.colorNode = positionLocal

        const box0: Mesh = new Mesh(
            geometry,
            material0
        )

        box0.position.x = -2

        this.group.add(box0)
        this.boxs.push(box0)

        //////////////////////

        const r = sin(time.mul(2)).mul(0.5).add(0.5)
        const g = sin(time.add(1).mul(2)).mul(0.5).add(0.5)
        const b = sin(time.add(2).mul(2)).mul(0.5).add(0.5)

        const rgb_color = vec3(r, g, b)

        const material1: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material1.colorNode = rgb_color

        const box1: Mesh = new Mesh(
            geometry,
            material1
        )

        this.group.add(box1)
        this.boxs.push(box1)

        /////////////////////

        const main2 = Fn(() => {
            const p = positionLocal.toVar()

            p.assign(rotateUV(p.xy, time.mul(2), vec2()))

            If(abs(p.x).greaterThan(0.45), () => {
                p.x.assign(1)
                p.z.assign(1)
            })

            If(abs(p.y).greaterThan(0.45), () => {
                p.y.assign(1)
                p.z.assign(1)
            })

            return p
        })

        const material2: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material2.colorNode = main2()

        const box2: Mesh = new Mesh(
            geometry,
            material2
        )

        box2.position.x = 2

        this.group.add(box2)
        this.boxs.push(box2)

        /////////////////////

        const material3: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material3.fragmentNode = positionLocal.mul(3.9999).fract().step(0.5)

        const box3: Mesh = new Mesh(
            geometry,
            material3
        )

        box3.position.x = -2
        box3.position.y = 2

        this.group.add(box3)
        this.boxs.push(box3)

        /////////////////////

        const main4 = Fn(() => {
            const p = positionLocal.toVar()
            //p.assign(vec3(positionLocal.length().mul(15).fract().step(0.5)))

            p.assign(positionLocal.length())
            p.assign(sin(p.mul(32).add(time.mul(2))).div(8))
            p.assign(abs(p))
            p.assign(p.step(0.1))

            return p
        })

        const material4: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material4.colorNode = main4().mul(rgb_color)

        const box4: Mesh = new Mesh(
            geometry,
            material4
        )

        box4.position.y = 2

        this.group.add(box4)
        this.boxs.push(box4)

        /////////////////////

        const main5 = Fn(() => {
            const p = positionLocal.toVar()

            p.mulAssign(3)
            p.assign(p.fract().sub(0.5))
            p.assign(length(p))
            p.assign(sin(p.mul(5).add(time)))
            p.assign(abs(p))
            p.assign(step(0.5, p))

            return p
        })

        const material5: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material5.colorNode = main5().mul(vec3(positionLocal.y, 1, 1))

        const box5: Mesh = new Mesh(
            geometry,
            material5
        )

        box5.position.x = 2
        box5.position.y = 2

        this.group.add(box5)
        this.boxs.push(box5)

        /////////////////////

        const main6 = Fn(() => {
            const p = positionLocal.toVar()

            p.assign(rotateUV(p.xy, time, vec2()))
            p.assign(length(p.mul(5)).sub(atan(p.zy, p.zx)).mul(5))
            p.sinAssign()
            p.mulAssign(5)
            p.assign(vec3(p.x.add(sin(time).mul(5)), p.y.add(cos(time).mul(5)), 0))

            return p
        })

        const material6: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material6.colorNode = main6()

        const box6: Mesh = new Mesh(
            sphere_geometry,
            material6
        )

        box6.position.x = -2
        box6.position.y = 4

        this.group.add(box6)
        this.boxs.push(box6)

        /////////////////////

        const material7: MeshStandardNodeMaterial = new MeshStandardNodeMaterial({ roughness: 0.1 })
        material7.colorNode = mx_worley_noise_vec3(normalLocal.mul(3).add(time.mul(2)))

        const box7: Mesh = new Mesh(
            sphere_geometry,
            material7
        )

        box7.position.y = 4

        this.group.add(box7)
        this.boxs.push(box7)

        /////////////////////

        const material8 = new MeshStandardNodeMaterial({
            color: '#271442',
            roughness: 0.1
        })

        const emissiveColor = uniform(color('#0aadff'))
        const emissiveLow = uniform(-0.1)
        const emissiveHigh = uniform(0.4)
        const emissivePower = uniform(10)
        const largeWavesFrequency = uniform(vec2(5, 5))
        const largeWavesSpeed = uniform(3)
        const largeWavesMultiplier = uniform(0.15)
        const smallWavesIterations = uniform(5)
        const smallWavesFrequency = uniform(0.2)
        const smallWavesSpeed = uniform(0.3)
        const smallWavesMultiplier = uniform(0.2)
        const normalComputeShift = uniform(0.1)

        const wavesElevation = Fn<[ShaderNodeObject<Node>]>(([position]) => {
            const elevation = mul(
                sin(position.x.mul(largeWavesFrequency.x).add(time.mul(largeWavesSpeed))),
                sin(position.z.mul(largeWavesFrequency.y).add(time.mul(largeWavesSpeed))),
                largeWavesMultiplier
            ).toVar()

            Loop({ start: float(1), end: smallWavesIterations.add(1) }, ({ i }) => {
                const noiseInput = vec3(
                    position.xz.add(2).mul(smallWavesFrequency).mul(i),
                    time.mul(smallWavesSpeed)
                )

                const wave = mx_noise_float(noiseInput, 1, 0).mul(smallWavesMultiplier).div(i).abs()
                elevation.subAssign(wave)
            })

            return elevation
        })

        const elevation = wavesElevation(positionLocal)
        const position = positionLocal.add(vec3( 0, elevation, 0))
        material8.positionNode = position

        let positionA = positionLocal.add(vec3(normalComputeShift, 0, 0))
        let positionB = positionLocal.add(vec3(0, 0, normalComputeShift.negate()))

        positionA = positionA.add(vec3(0, wavesElevation(positionA), 0))
        positionB = positionB.add(vec3(0, wavesElevation(positionB), 0))

        const toA = positionA.sub(position).normalize()
        const toB = positionB.sub(position).normalize()
        const normal = toA.cross(toB)

		material8.normalNode = transformNormalToView(normal)

        const emissive = elevation.remap(emissiveHigh, emissiveLow).pow(emissivePower)
        material8.emissiveNode = emissiveColor.mul(emissive)

        const box8: Mesh = new Mesh(
            sphere_geometry,
            material8
        )

        box8.position.x = 2
        box8.position.y = 4

        this.group.add(box8)
        this.boxs.push(box8)
    }

    update = (delta: number) => {
        this.boxs.forEach((box: Mesh) => {
            box.rotation.y += delta
        })

        // Camera animate
        this.game.view.camera.position.set(
            Math.cos(performance.now() * 0.0003) * 7,
            Math.cos(performance.now() * 0.0002) * 2 + 4,
            Math.sin(performance.now() * 0.0003) * 7
        )

        this.game.view.camera.lookAt(0, 3, 0)
    }
}

export default TSLExample