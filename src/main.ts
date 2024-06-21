import startGame from "kaplay"
import { config } from "./config"
import { makeScenePalhaco } from "./games/palhaco"
import { makeSceneBurro } from "./games/burro"
import { makeSceneOvo } from "./games/ovo"
import { makeScenePesca } from "./games/pesca"
import { makeSceneSwitcher } from "./switcher"

const k = startGame({
	width: config.GAME_WIDTH,
	height: config.GAME_HEIGHT,
	letterbox: true,
	background: [0, 0, 0]
})

// k.loadFont("kitchensink", "fonts/Kitchen Sink.ttf")
k.loadBitmapFont("kitchensink", "fonts/kitchen-sink.png", 6, 8, {
	chars: (
		"█☺☻♥♦♣♠●○▪□■◘♪♫≡" +
		"►◄⌂ÞÀß×¥↑↓→←◌●▼▲" +
		" !\"#$%&'()*+,-./" +
		"0123456789:;<=>?" +
		"@ABCDEFGHIJKLMNO" +
		"PQRSTUVWXYZ[\\]^_" +
		"`abcdefghijklmno" +
		"pqrstuvwxyz{|}~Χ" +
		"░▒▓ḀḁḂ│┬┤┌┐ḃḄ┼ḅḆ" +
		"ḇḈḉḊḋḌ─├┴└┘ḍḎ⁞ḏḐ" +
		"ḑḒḓḔḕḖḗḘ▄ḙḚḛḜ…ḝḞ" +
		"ḟḠḡḢḣḤḥḦ▌▐ḧḨḩḪḫḬ" +
		"ḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼ" +
		"ḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌ" +
		"ṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜ" +
		"ṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬ" +
		"ṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼ"
	)
})

k.loadSprite("circle", "sprites/kaboom/circle.png")
k.loadSprite("egg", "sprites/kaboom/egg.png")
k.loadSprite("ball", "sprites/ball.png")
k.loadSprite("clown-bg", "sprites/clown-bg.png")
k.loadSprite("clown", "sprites/clown-Sheet.png", {
	sliceX: 3,
	sliceY: 1,
})
k.loadSprite("fish-box", "sprites/fish-box.png")
k.loadSprite("fish-hook", "sprites/fish-hook.png")
k.loadSprite("fish-cursor", "sprites/fish-cursor.png")
k.loadSprite("fish", "sprites/fish-Sheet.png", {
	sliceX: 5,
	sliceY: 1
})


k.scene("palhaco", makeScenePalhaco(k))
k.scene("burro", makeSceneBurro(k))
k.scene("ovo", makeSceneOvo(k))
k.scene("pesca", makeScenePesca(k))
k.scene("main", makeSceneSwitcher(k, [
	"palhaco",
	"pesca",
	"ovo"
]))

k.go("pesca")
