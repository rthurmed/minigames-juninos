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

k.loadSprite("circle", "sprites/circle.png")
k.loadSprite("egg", "sprites/egg.png")

k.scene("palhaco", makeScenePalhaco(k))
k.scene("burro", makeSceneBurro(k))
k.scene("ovo", makeSceneOvo(k))

k.go("ovo")
