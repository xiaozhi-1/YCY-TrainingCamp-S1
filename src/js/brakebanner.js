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
			this.renderResource()
		})
	}
	renderResource () {
		this.actionButtonContainer = this.createActionButton()
		this.actionButtonContainer.x = this.actionButtonContainer.y = 400

		this.actionButtonContainer.interactive = true
		this.actionButtonContainer.cursor = 'pointer'

		this.brakeContainer = this.createBrake()

		let {particlesContainer,particles} = this.createParticles()
		this.particlesContainer = particlesContainer
		this.particles = particles

		this.addActions()

		this.app.stage.addChild(this.particlesContainer)
		this.app.stage.addChild(this.brakeContainer)
		this.app.stage.addChild(this.actionButtonContainer)

	}

	addActions () {
		let brake_lever = this.brakeContainer.getChildAt(0)
		let {start, parse} = this.particleActions()
		let {down:brakeDown, parse:brakeParse} = this.brakeActions()
		start()
		this.actionButtonContainer.on("mousedown", () => {
			// brake_lever.rotation = Math.PI/180*-30
			// let rotation = Math.PI/180*-30
			gsap.to(brake_lever, {duration:.6,rotation:Math.PI/180*-30})

			parse()
			brakeParse()
		})
		this.actionButtonContainer.on("mouseup", () => {
			gsap.to(brake_lever, {duration:.6,rotation:0})
			start()
			brakeDown()
		})
	}

	brakeActions () {
		let by = this.brakeContainer.y
		let parse = () => {
			// 按下的时候车下降
			// this.brakeContainer.y += 10
			by += 40
			gsap.to(this.brakeContainer, {duration:.3,y: by,ease: 'out'})
		}


		let down = () => {
			// this.brakeContainer.y -= 10
			by -= 40
			gsap.to(this.brakeContainer, {duration:.6,y: by,ease: 'in.out'})
		}

		return {parse, down}
	}

	particleActions () {
		let speed = 0
		let loop = () => {
			speed += 0.5
			speed = Math.min(speed,20)
			for(let i = 0; i < this.particles.length; i++) {
				let item = this.particles[i]

				item.pr.y += speed

				if(speed >= 20) {

					item.pr.scale.y = 40
					item.pr.scale.x = 0.03
				}

				if(item.pr.y >= window.innerHeight) {
					item.pr.y = 0
				}
			}
		}



		function start () {
			speed = 0
			gsap.ticker.add(loop)
		}
		let parse = () => {
			// 回弹效果

			for(let i = 0; i < this.particles.length; i++) {
				let item = this.particles[i]
				
				item.pr.scale.y = 1
				item.pr.scale.x = 1
				item.pr.y = item.sy + 80
				// console.log('item.sy', item.sy)
				gsap.to(item.pr, {duration: .2, y: item.sy,ease: "elastic.out"})
			}
			gsap.ticker.remove(loop)

		}
		return {start,parse}
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
			// console.log('pItem.sy', pItem.sy)
			particles.push(pItem)
			particlesContainer.addChild(pr)
		}
		
		return {particlesContainer,particles}
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

		brakeContainer.addChild(brake_lever)
		brakeContainer.addChild(brake_bike)
		brakeContainer.addChild(brake_handlerbar)
		
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