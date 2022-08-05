class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xff0000
		})

		document.querySelector(selector).appendChild(this.app.view)

		this.loadResources()
	}

	loadResources () {
		this.loader = new PIXI.Loader()

		this.loader.add("btn.png", "images/btn.png")
		this.loader.add("btn_circle.png", "images/btn_circle.png")
		// this.loader.add("btn.png", "images/btn.png")

		this.loader.load()

		this.loader.onComplete.add(() => {
			console.log('加载成功')
			this.renderResource()
		})
	}

	renderResource () {
		let btn = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
		let btn_circle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
		this.app.stage.addChild(btn)
		this.app.stage.addChild(btn_circle)
	}
}