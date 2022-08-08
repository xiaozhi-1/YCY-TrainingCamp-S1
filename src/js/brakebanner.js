class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		})

		document.querySelector(selector).appendChild(this.app.view)

		this.loadResources()
	}

	loadResources () {
		this.loader = new PIXI.Loader()

		this.loader.add("btn.png", "images/btn.png")
		this.loader.add("btn_circle.png", "images/btn_circle.png")
		this.loader.add("brake_bike.png", "images/brake_bike.png")
		this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png")
		this.loader.add("brake_lever.png", "images/brake_lever.png")

		this.loader.load()

		this.loader.onComplete.add(() => {
			console.log('加载成功')
			this.renderResource()
		})
	}
	renderResource () {
		this.actionButton = this.createActionButton()
		this.actionButton.x = this.actionButton.y = 400

		this.actionButton.interactive = true
		this.actionButton.cursor = 'pointer'

		let brake = this.createBrake()

		let particles = this.createParticles()

		this.app.stage.addChild(particles)
		this.app.stage.addChild(brake)
		this.app.stage.addChild(this.actionButton)

	}

	createParticles () {
		let particlesContainer = new PIXI.Container()
		let particles = []
		let colors = [0xf1cf54,0xb5cea8,0xf1cf54,0x222299,0x818181,0x000000]

		particlesContainer.pivot.x = window.innerWidth / 2
		particlesContainer.pivot.y = window.innerHeight / 2
		
		particlesContainer.x = window.innerWidth / 2
		particlesContainer.y = window.innerHeight / 2

		particlesContainer.rotation = 35 * Math.PI/180

		for(let i = 0; i < 10; i++) {
			let pr = new PIXI.Graphics()

			pr.beginFill(colors[Math.floor(Math.random() * colors.length)])
			pr.drawCircle(0,0,6)
			pr.endFill()

			let pItem = {
				sx: Math.random() * window.innerWidth,
				sy: Math.random() * window.innerHeight,
				pr: pr
			}
			pr.x = pItem.sx
			pr.y = pItem.sy
			particles.push(pItem)
			particlesContainer.addChild(pr)
		}
		let speed = 0
		function loop () {
			speed += 0.5
			speed = Math.min(speed,20)
			for(let i = 0; i < particles.length; i++) {
				let item = particles[i]

				item.pr.y += speed

				item.pr.scale.y = 10
				item.pr.scale.x = 0.1

				if(item.pr.y >= window.innerHeight) {
					item.pr.y = 0
				}
			}
		}



		function start () {
			speed = 0
			gsap.ticker.add(loop)
		}
		function parse () {
			gsap.ticker.remove(loop)
		}

		start()
		return particlesContainer
	}

	createBrake () {

		let brakeContainer = new PIXI.Container()
		let brake_bike = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
		let brake_handlerbar = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
		let brake_lever = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture)
		

		brakeContainer.scale.x = brakeContainer.scale.y = .3

		brake_lever.pivot.x = brake_lever.pivot.y = 455
		brake_lever.x = 722
		brake_lever.y = 900
		this.actionButton.on("mousedown", () => {
			// brake_lever.rotation = Math.PI/180*-30
			// let rotation = Math.PI/180*-30
			gsap.to(brake_lever, {duration:.6,rotation:Math.PI/180*-30})

			// gsap.to(brake_lever.scale, {duration:1,x:1.1,y:1.1,repeat: -1})
		})
		this.actionButton.on("mouseup", () => {
			gsap.to(brake_lever, {duration:.6,rotation:0})
			
		})

		brakeContainer.addChild(brake_bike)
		brakeContainer.addChild(brake_handlerbar)
		brakeContainer.addChild(brake_lever)
		
		let resize = () => {
			brakeContainer.x = window.innerWidth  - brakeContainer.width
			brakeContainer.y = window.innerHeight  - brakeContainer.height
		}
		window.addEventListener('resize', resize)

		resize()
		return brakeContainer
	}

	createActionButton () {
		let btnContainer = new PIXI.Container()

		let btn = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
		let btn_circle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
		let btn_circle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
		
		btn.pivot.x = btn.width/2
		btn.pivot.y = btn.height/2
		btn_circle.pivot.x = btn_circle.width/2
		btn_circle.pivot.y = btn_circle.height/2
		btn_circle2.pivot.x = btn_circle2.width/2
		btn_circle2.pivot.y = btn_circle2.height/2

		// 设置按钮外部圈圈动画
		btn_circle.scale.x = btn_circle.scale.y = .8

		gsap.to(btn_circle.scale, {duration:1,x:1.1,y:1.1,repeat: -1})
		gsap.to(btn_circle, {duration:1,alpha: 0,repeat: -1})
		
		
		btnContainer.addChild(btn)
		btnContainer.addChild(btn_circle)
		btnContainer.addChild(btn_circle2)
		

		
		return btnContainer
	}
}