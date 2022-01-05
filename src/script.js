import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { Vector3 } from 'three'
// import {MeshWobbleMaterial} from 'drei';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axis Helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const fontLoader = new FontLoader();
const fontConfig = {
    size: 0.5,
    height: 0.1,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 3
}
fontLoader.load(
    '/fonts/gotham.json',
    (font) => {
        const textGeometry1 = new TextGeometry(
            'MAREK',
            {font: font,
                ...fontConfig}
        )
        const textGeometry2 = new TextGeometry(
            'SUCHANSKI',
            {font: font,
                ...fontConfig}
        )
        // Bounding box
        textGeometry1.computeBoundingBox();
        textGeometry2.computeBoundingBox();
    
        const boxCenter1 = textGeometry1.boundingBox.max.sub(textGeometry1.boundingBox.min).multiply(new Vector3(0.5,0.5,0.5));
        const boxCenter2 = textGeometry2.boundingBox.max.sub(textGeometry2.boundingBox.min).multiply(new Vector3(0.5,0.5,0.5));
        const matCapTextures = 
        [
            textureLoader.load('/textures/matcaps/1.png'),
            textureLoader.load('/textures/matcaps/2.png'),
            textureLoader.load('/textures/matcaps/3.png'),
            textureLoader.load('/textures/matcaps/4.png'),
            textureLoader.load('/textures/matcaps/5.png'),
            textureLoader.load('/textures/matcaps/6.png'),
            textureLoader.load('/textures/matcaps/7.png'),
            textureLoader.load('/textures/matcaps/8.png'),
        ]

        // text material
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matCapTextures[6];

        gui.add(textMaterial, 'matcap', matCapTextures)
        // text mesh
        const text1 = new THREE.Mesh(
            textGeometry1, textMaterial
        );
        const text2 = new THREE.Mesh(
            textGeometry2, textMaterial
        );
        // center text on scene
        text1.position.sub(boxCenter1)
        text2.position.sub(boxCenter2)
        text2.position.y -= 0.6;
        scene.add(text1, text2);
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()