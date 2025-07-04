"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  Map,
  Home,
  Banknote,
  Briefcase,
  Package,
  Github,
  Twitter,
  DiscIcon as Discord,
  ArrowRight,
  Play,
  Globe,
  Zap,
} from "lucide-react"

// Three.js Scene Component
function ThreeScene() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const charactersRef = useRef([])
  const particlesRef = useRef([])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.5)
    pointLight1.position.set(0, 5, 0)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.3)
    pointLight2.position.set(-3, 3, 3)
    scene.add(pointLight2)

    // Create Business Character
    function createBusinessCharacter(x, z) {
      const character = new THREE.Group()

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15)
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xfdbcb4 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.7, 0)
      character.add(head)

      // Hair
      const hairGeometry = new THREE.SphereGeometry(0.16)
      const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.set(0, 1.8, -0.05)
      character.add(hair)

      // Body (suit)
      const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937 })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 1.2, 0)
      character.add(body)

      // Tie
      const tieGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.02)
      const tieMaterial = new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      const tie = new THREE.Mesh(tieGeometry, tieMaterial)
      tie.position.set(0, 1.3, 0.11)
      character.add(tie)

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1)
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xfdbcb4 })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.25, 1.1, 0)
      character.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.25, 1.1, 0)
      character.add(rightArm)

      // Legs
      const legGeometry = new THREE.BoxGeometry(0.12, 0.6, 0.12)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x374151 })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.1, 0.6, 0)
      character.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.1, 0.6, 0)
      character.add(rightLeg)

      // Briefcase
      const briefcaseGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.2)
      const briefcaseMaterial = new THREE.MeshStandardMaterial({ color: 0x92400e })
      const briefcase = new THREE.Mesh(briefcaseGeometry, briefcaseMaterial)
      briefcase.position.set(0.4, 0.9, 0)
      character.add(briefcase)

      character.position.set(x, 0, z)
      return character
    }

    // Create Casual Character
    function createCasualCharacter(x, z) {
      const character = new THREE.Group()

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15)
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf4a261 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.7, 0)
      character.add(head)

      // Hair
      const hairGeometry = new THREE.SphereGeometry(0.17)
      const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x2a9d8f })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.set(0, 1.8, 0)
      character.add(hair)

      // Body (hoodie)
      const bodyGeometry = new THREE.BoxGeometry(0.45, 0.6, 0.25)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe76f51 })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 1.2, 0)
      character.add(body)

      // Hood
      const hoodGeometry = new THREE.SphereGeometry(0.2)
      const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0xe76f51 })
      const hood = new THREE.Mesh(hoodGeometry, hoodMaterial)
      hood.position.set(0, 1.6, -0.1)
      character.add(hood)

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.12, 0.4, 0.12)
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xe76f51 })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.3, 1.1, 0)
      character.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.3, 1.1, 0)
      character.add(rightArm)

      // Legs (jeans)
      const legGeometry = new THREE.BoxGeometry(0.12, 0.6, 0.12)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x264653 })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.1, 0.6, 0)
      character.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.1, 0.6, 0)
      character.add(rightLeg)

      // Sneakers
      const shoeGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.2)
      const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

      const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial)
      leftShoe.position.set(-0.1, 0.25, 0.05)
      character.add(leftShoe)

      const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial)
      rightShoe.position.set(0.1, 0.25, 0.05)
      character.add(rightShoe)

      character.position.set(x, 0, z)
      return character
    }

    // Create Gamer Character
    function createGamerCharacter(x, z) {
      const character = new THREE.Group()

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15)
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xfef3c7 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.7, 0)
      character.add(head)

      // Hair (messy)
      const hairGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.25)
      const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x451a03 })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.set(0, 1.85, 0)
      character.add(hair)

      // Glasses
      const glassesGeometry = new THREE.BoxGeometry(0.25, 0.08, 0.02)
      const glassesMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
      const glasses = new THREE.Mesh(glassesGeometry, glassesMaterial)
      glasses.position.set(0, 1.72, 0.14)
      character.add(glasses)

      // Body (gaming shirt)
      const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x7c3aed })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 1.2, 0)
      character.add(body)

      // Gaming logo on shirt
      const logoGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.01)
      const logoMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
      const logo = new THREE.Mesh(logoGeometry, logoMaterial)
      logo.position.set(0, 1.3, 0.11)
      character.add(logo)

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1)
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xfef3c7 })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.25, 1.1, 0)
      character.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.25, 1.1, 0)
      character.add(rightArm)

      // Legs
      const legGeometry = new THREE.BoxGeometry(0.12, 0.6, 0.12)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937 })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.1, 0.6, 0)
      character.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.1, 0.6, 0)
      character.add(rightLeg)

      // Gaming controller
      const controllerGeometry = new THREE.BoxGeometry(0.2, 0.08, 0.12)
      const controllerMaterial = new THREE.MeshStandardMaterial({ color: 0x374151 })
      const controller = new THREE.Mesh(controllerGeometry, controllerMaterial)
      controller.position.set(0, 0.9, 0.2)
      character.add(controller)

      character.position.set(x, 0, z)
      return character
    }

    // Create Artist Character
    function createArtistCharacter(x, z) {
      const character = new THREE.Group()

      // Head
      const headGeometry = new THREE.SphereGeometry(0.15)
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.7, 0)
      character.add(head)

      // Hair (colorful)
      const hairGeometry = new THREE.SphereGeometry(0.18)
      const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xec4899 })
      const hair = new THREE.Mesh(hairGeometry, hairMaterial)
      hair.position.set(0, 1.8, 0)
      character.add(hair)

      // Body (paint-splattered apron)
      const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf3f4f6 })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 1.2, 0)
      character.add(body)

      // Paint splatters
      const splatterGeometry = new THREE.SphereGeometry(0.03)
      const splatter1Material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
      const splatter1 = new THREE.Mesh(splatterGeometry, splatter1Material)
      splatter1.position.set(-0.1, 1.3, 0.11)
      character.add(splatter1)

      const splatter2Geometry = new THREE.SphereGeometry(0.025)
      const splatter2Material = new THREE.MeshStandardMaterial({ color: 0xef4444 })
      const splatter2 = new THREE.Mesh(splatter2Geometry, splatter2Material)
      splatter2.position.set(0.15, 1.1, 0.11)
      character.add(splatter2)

      const splatter3Geometry = new THREE.SphereGeometry(0.02)
      const splatter3Material = new THREE.MeshStandardMaterial({ color: 0x10b981 })
      const splatter3 = new THREE.Mesh(splatter3Geometry, splatter3Material)
      splatter3.position.set(0, 1.0, 0.11)
      character.add(splatter3)

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1)
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574 })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.25, 1.1, 0)
      character.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.25, 1.1, 0)
      character.add(rightArm)

      // Legs
      const legGeometry = new THREE.BoxGeometry(0.12, 0.6, 0.12)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x7c2d12 })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.1, 0.6, 0)
      character.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.1, 0.6, 0)
      character.add(rightLeg)

      // Paintbrush
      const brushGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3)
      const brushMaterial = new THREE.MeshStandardMaterial({ color: 0x92400e })
      const brush = new THREE.Mesh(brushGeometry, brushMaterial)
      brush.position.set(0.35, 1.0, 0)
      character.add(brush)

      const brushTipGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.05)
      const brushTipMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937 })
      const brushTip = new THREE.Mesh(brushTipGeometry, brushTipMaterial)
      brushTip.position.set(0.35, 1.15, 0)
      character.add(brushTip)

      character.position.set(x, 0, z)
      return character
    }

    // Create characters
    const businessChar = createBusinessCharacter(-2, 0)
    const casualChar = createCasualCharacter(2, -1)
    const gamerChar = createGamerCharacter(0, 1)
    const artistChar = createArtistCharacter(-1, -2)

    scene.add(businessChar)
    scene.add(casualChar)
    scene.add(gamerChar)
    scene.add(artistChar)

    charactersRef.current = [businessChar, casualChar, gamerChar, artistChar]

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(12, 12)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      transparent: true,
      opacity: 0.6,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.1
    scene.add(ground)

    // Create floating particles
    const particles = []
    const colors = [0x3b82f6, 0x8b5cf6, 0x06b6d4, 0xf59e0b, 0xef4444]

    for (let i = 0; i < 25; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.02)
      const color = colors[Math.floor(Math.random() * colors.length)]
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
      })
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)

      particle.position.set((Math.random() - 0.5) * 10, Math.random() * 4, (Math.random() - 0.5) * 10)

      particle.userData = {
        originalY: particle.position.y,
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: Math.random() * 0.5 + 0.2,
      }

      particles.push(particle)
      scene.add(particle)
    }

    particlesRef.current = particles

    // Camera position
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 1, 0)

    // Store references
    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera

    // Animation loop
    let animationId
    const clock = new THREE.Clock()

    function animate() {
      animationId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Rotate camera around the scene
      const radius = 5
      cameraRef.current.position.x = Math.sin(elapsedTime * 0.1) * radius
      cameraRef.current.position.z = Math.cos(elapsedTime * 0.1) * radius
      cameraRef.current.lookAt(0, 1, 0)

      // Animate characters (floating)
      charactersRef.current.forEach((character, index) => {
        const speed = 0.5 + index * 0.2
        const range = 0.1 + index * 0.05
        character.position.y = Math.sin(elapsedTime * speed) * range
        character.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1
      })

      // Animate particles
      particlesRef.current.forEach((particle) => {
        const { originalY, floatSpeed, floatRange } = particle.userData
        particle.position.y = originalY + Math.sin(elapsedTime * floatSpeed * 10) * floatRange
        particle.rotation.x += 0.01
        particle.rotation.y += 0.01
      })

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" />
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
}

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Multiplayer Universe",
      description: "Create your character and join thousands of players in a living, breathing world.",
    },
    {
      icon: Map,
      title: "Expansive World Map",
      description: "Explore a vast 2.5D world filled with neighborhoods, districts, and hidden secrets.",
    },
    {
      icon: Home,
      title: "Housing System",
      description: "Own, buy, or rent your dream home. Customize and make it uniquely yours.",
    },
    {
      icon: Banknote,
      title: "Banking & Economy",
      description: "Manage your finances with a realistic banking system and growing economy.",
    },
    {
      icon: Briefcase,
      title: "Career Simulation",
      description: "Choose from dozens of jobs and build your career to earn in-game currency.",
    },
    {
      icon: Package,
      title: "Asset Management",
      description: "Collect, trade, and manage your inventory, profile, and valuable assets.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Play Instantly in Your Browser</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Live Your
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Digital Life
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Create your unique avatar and dive into an immersive web-based multiplayer world. Work, socialize, build
              relationships, and shape your destiny—all from your browser, no downloads required.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-xl font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
              >
                Start Playing Now
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-10 py-5 text-xl font-semibold rounded-full backdrop-blur-sm group bg-transparent"
              >
                <Play className="mr-2 w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Gameplay
              </Button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-sm text-gray-400 mt-6"
            >
              No downloads • No installations • Play instantly
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-8">
              Endless Possibilities Await
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience life simulation like never before with features designed to create your perfect virtual
              existence. All powered by cutting-edge web technology.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">Your World, Your Rules</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Real-time multiplayer interactions, dynamic economy, and endless customization options make every moment
              unique. Join a thriving community of digital life enthusiasts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
              <div className="grid md:grid-cols-2 gap-12 text-center">
                <div>
                  <div className="text-5xl font-bold text-white mb-4">15K+</div>
                  <div className="text-xl text-gray-300">Active Players Online</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-4">24/7</div>
                  <div className="text-xl text-gray-300">Living World Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of players already building their digital lives. Your adventure begins with a single click.
              No downloads, no waiting—just pure fun.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-6 text-2xl font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
              >
                Enter OpenWorld
                <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-16 py-6 text-2xl font-semibold rounded-full backdrop-blur-sm bg-transparent"
              >
                Create Avatar
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-white mb-6">OpenWorld</h3>
              <p className="text-gray-300 mb-6 max-w-md text-lg leading-relaxed">
                The ultimate web-based open-world life simulation experience. Build, explore, and live your digital
                dreams—all from your browser.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-3">
                  <Discord className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-3">
                  <Twitter className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-3">
                  <Github className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Game</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Play Now
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Browser Requirements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-lg">
            <p>&copy; 2025 OpenWorld. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
