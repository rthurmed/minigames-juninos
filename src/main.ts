import startGame from "kaplay"
import { config } from "./config"
import { makeScenePalhaco } from "./games/palhaco"
import { makeSceneBurro } from "./games/burro"
import { makeSceneOvo } from "./games/ovo"
import { makeSceneRabo } from "./games/rabo"
import { makeSceneSwitcher } from "./switcher"

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
k.scene("rabo", makeSceneRabo(k))
k.scene("switcher", makeSceneSwitcher(k))

k.go("switcher")
