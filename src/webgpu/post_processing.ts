import {
    Group,
} from "three/webgpu"

import {
    pass,
    vec3,
} from "three/tsl"

import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js"
import { dof } from "three/examples/jsm/tsl/display/DepthOfFieldNode.js"

import Game from "./game"

class PostProcessing {
    private game: Game = null!
    group: Group = null!

    constructor() {
        this.game = new Game()
        this.group = new Group()

        console.log("Post Processing initialized")

        this.create()
        this.game.view.scene.add(this.group)
    }

    private create = () => {
        // Scene Pass
        const scenePass = pass(this.game.view.scene, this.game.view.camera, { depthBuffer: true })

        // Compose and Denoise

        // Bloom
        const bloomPass = bloom(scenePass.getTextureNode(), 0.005, 0.5, 3).mul(vec3(1, 1, 0))

        // DOF
        const scenePassViewZ = scenePass.getViewZNode()
        const dofPass = dof(scenePass.getTextureNode(), scenePassViewZ, 7, 20, 5)

        const scenePassColor = scenePass.add(bloomPass).add(dofPass)

        // Post Procrssing
        this.game.view.postProcrssing.outputNode = scenePassColor
    }
}

export default PostProcessing