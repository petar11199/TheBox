
import * as THREE from './ext/three.module.js'
import TWEEN from './ext/tween.js'
import UI from './js/ui.js'

const ui = new UI()

const centerBoxEl = document.querySelector('.center-box')
const mainLogoEl = document.querySelector('.logo')
const openInfoButton = document.querySelector('.open-info-button')

let camera, scene, renderer, points
let pointsMaterial, centerBoxMesh, boxLineMesh
let positionX = 0, positionY = 0
let openedInfo = false

const primaryColor = '#e6e6e6'
const secondaryColor = '#3c3940'
const pointsColor = '#ff2cff'


init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 20000)
  camera.position.z = 10
  camera.position.y = 10

  scene = new THREE.Scene()
  scene.background = new THREE.Color(primaryColor)
  {
    const color = primaryColor
    const near = 10
    const far = 10000
    scene.fog = new THREE.Fog(color, near, far)
  }

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight )
  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', windowResize, false)
  window.addEventListener('mousemove', mouseMove, false)
  centerBoxEl.addEventListener('mouseenter', mouseEnter, false)
  centerBoxEl.addEventListener('mouseleave', mouseLeave, false)
  openInfoButton.addEventListener('click', openInfo, false)
	document.addEventListener('touchstart', mobileMovement, false)
	document.addEventListener('touchmove', mobileMovement, false)
  addParticles()
  addCenterBox()
}

function animate (time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
  render(time)
}

function render (time) {
  // pointsMaterial.color.setHSL( time / 10000, 0.3, 0.7 )
  if (openedInfo) camera.position.z += (positionX - camera.position.z) * 0.03
  else  camera.position.x += (positionX - camera.position.x) * 0.03
  camera.position.y += (-positionY - camera.position.y) * 0.03

  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}

function addParticles () {
  let vertices = []
  
  for (let i = 0; i < 5000; i ++) {
    let x = Math.random() * 200 - 100
    let y = Math.random() * 200 - 100
    let z = Math.random() * 200 - 100
  
    vertices.push(x, y, z)
  }
  
  {
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const pointSprite = new THREE.TextureLoader().load('resources/images/pointImg.png')
    pointsMaterial = new THREE.PointsMaterial({color: pointsColor, size: 3, map: pointSprite, transparent: true, alphaTest: 0.5})
    points = new THREE.Points(bufferGeometry, pointsMaterial)
  }

  {
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200, 0, 0, 0)
    const boxEdges = new THREE.EdgesGeometry(boxGeometry)
    boxLineMesh = new THREE.LineSegments(boxEdges, new THREE.LineBasicMaterial({color: 0xffffff}))
  }
  
  scene.add(points)
  scene.add(boxLineMesh)
}

function addCenterBox () {
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)
  const boxLogoSprite = new THREE.TextureLoader().load('resources/images/logoDark.png')
  const boxMaterial = new THREE.MeshBasicMaterial({map: boxLogoSprite, transparent: true, side: THREE.DoubleSide})
  centerBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial)

  scene.add(centerBoxMesh)
}

function numberBetween (number, limit) {
  if (number >= limit) return limit
  else if (number <= -limit) return -limit
  else return number
}

function windowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function mouseMove () {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  positionX = numberBetween(event.clientX - centerX, 400)
  positionY = numberBetween(event.clientY - centerY, 400)
}

function mouseEnter () {
  scene.fog.far = 50
  scene.fog.color = new THREE.Color(secondaryColor)
  scene.background = new THREE.Color(secondaryColor)
  points.material.color = new THREE.Color(primaryColor)

  document.documentElement.style.setProperty('--primaryColor', secondaryColor)
  document.documentElement.style.setProperty('--secondaryColor', primaryColor)

  centerBoxMesh.material.map = new THREE.TextureLoader().load('resources/images/logoLight.png')
  mainLogoEl.src = './resources/images/logoLight.png'
}
function mouseLeave () {
  scene.fog.far = 10000
  scene.fog.color = new THREE.Color(primaryColor)
  scene.background = new THREE.Color(primaryColor)
  points.material.color = new THREE.Color(pointsColor)
  
  document.documentElement.style.setProperty('--primaryColor', primaryColor)
  document.documentElement.style.setProperty('--secondaryColor', secondaryColor)
  
  centerBoxMesh.material.map = new THREE.TextureLoader().load('resources/images/logoDark.png')
  mainLogoEl.src = './resources/images/logoDark.png'
}

function mobileMovement () {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  positionX = numberBetween(event.touches[0].pageX - centerX, 400) * 4
  positionY = numberBetween(event.touches[0].pageY - centerY, 400) * 4
}

function openInfo () {
  openedInfo = true
  centerBoxMesh.visible = false

  ui.openInfo(closeInfo)

  new TWEEN.Tween(boxLineMesh.rotation)
  .to({x: 0, y: 6.28319 * 3, z: 0}, 5000)
  .delay(1000)
  .easing(TWEEN.Easing.Quartic.InOut)
  .start()

  setTimeout(() => {
    {
      const boxGeometry = new THREE.TorusKnotBufferGeometry(100, 30, 100, 16)
      boxLineMesh.geometry = new THREE.EdgesGeometry(boxGeometry)
    }
  }, 4000)

  const pointsShrink = new TWEEN.Tween(points.scale)
  .to({x: 0.3, y: 0.3, z: 0.3}, 2000)
  .easing(TWEEN.Easing.Exponential.In)

  const pointsExpand = new TWEEN.Tween(points.scale)
  .to({x: 10, y: 10, z: 10}, 4000)
  .easing(TWEEN.Easing.Exponential.Out)

  pointsShrink.chain(pointsExpand)
  pointsShrink.start()
}

function closeInfo () {
  new TWEEN.Tween(boxLineMesh.rotation)
  .to({x: 0, y: 0, z: 0}, 3000)
  .easing(TWEEN.Easing.Quartic.InOut)
  .start()

  setTimeout(() => {
    {
      const boxGeometry = new THREE.BoxGeometry(200, 200, 200, 0, 0, 0)
      boxLineMesh.geometry = new THREE.EdgesGeometry(boxGeometry)
    }
  }, 3000)

  new TWEEN.Tween(points.scale)
  .to({x: 1, y: 1, z: 1}, 3000)
  .easing(TWEEN.Easing.Exponential.In)
  .start()

  new TWEEN.Tween(camera.position)
  .to({x: 0, y: 10, z: 10}, 1000)
  .delay(2000)
  .easing(TWEEN.Easing.Exponential.In)
  .start()

  openedInfo = false
  centerBoxMesh.visible = true
}