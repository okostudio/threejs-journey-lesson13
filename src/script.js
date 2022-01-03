import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { Vector3 } from 'three'

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
fontLoader.load(
    '/fonts/gotham.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'MAREK',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }
        )
        // Bounding box
        textGeometry.computeBoundingBox();
    
        const boxCenter = textGeometry.boundingBox.max.sub(textGeometry.boundingBox.min).multiply(new Vector3(0.5,0.5,0.5));
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
        textMaterial.matcap = matCapTextures[0];

        gui.add(textMaterial, 'matcap', matCapTextures)
        // text mesh
        const text = new THREE.Mesh(
            textGeometry, textMaterial
        );
        // center text on scene
        text.position.sub(boxCenter)
        scene.add(text);
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