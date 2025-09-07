import { HalfFloatType, TextureLoader } from "three"
import {
    UltraHDRLoader
} from "three/examples/jsm/Addons.js"

class Loaders {
    textureLoader: TextureLoader = null!
    ultraHDRLoader: UltraHDRLoader = null!

    constructor() {
        console.log("Loaders initialized")

        // TextureLoader
        this.textureLoader = new TextureLoader()

        // UltraHDRLoader
        this.ultraHDRLoader = new UltraHDRLoader()
        this.ultraHDRLoader.setDataType(HalfFloatType)
    }
}

export default Loaders