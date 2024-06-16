import startGame from "kaplay"
import { config } from "./config"
import { makeScenePalhaco } from "./games/palhaco"
import { makeSceneBurro } from "./games/burro"
import { makeSceneOvo } from "./games/ovo"

const k = startGame({
	width: config.GAME_WIDTH,
	height: config.GAME_HEIGHT,
	letterbox: true
})

k.loadSprite("circle", "sprites/kaboom/circle.png")
k.loadSprite("egg", "sprites/kaboom/egg.png")
k.loadSprite("ball", "sprites/ball.png")
k.loadSprite("clown-bg", "sprites/clown-bg.png")
k.loadSprite("clown", "sprites/clown-Sheet.png", {
	sliceX: 3,
	sliceY: 1,
})

k.scene("palhaco", makeScenePalhaco(k))
k.scene("burro", makeSceneBurro(k))
k.scene("ovo", makeSceneOvo(k))

k.scene("main", () => {
	const scenes = [
		"palhaco",
		"burro",
		"ovo"
	]
	
	const sceneSwitcher = k.add([
		k.pos(16, k.height() - 16),
		k.anchor("botleft"),
		k.z(20)
	])
	
	for (let i = 0; i < scenes.length; i++) {
		const scene = scenes[i];
		const button = sceneSwitcher.add([
			k.pos(i * (16 + 4), -16),
			k.rect(16, 16),
			k.color(k.WHITE),
			k.area()
		])
		button.onClick(() => {
			k.go(scene)
		})
	}
})

// k.go("main")
k.go("palhaco")
