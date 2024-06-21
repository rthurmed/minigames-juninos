import { KaboomCtx } from "kaplay";
import { config } from "./config";

const SPACING = 48

interface SceneInfo {
	scene: string,
	title: string
}

export const makeSceneSwitcher = (k: KaboomCtx) => () => {
	const t = k.add([
		k.pos(k.center().add(0, -SPACING)),
		k.anchor("center"),
		k.text("MiniGames Juninos", {
			font: "kitchensink",
			size: 48
		})
	])

	const scenes: SceneInfo[] = [{
		scene: "palhaco",
		title: "Boca de palhaço"
	}, {
		scene: "pesca",
		title: "Pesca competitiva"
	}, {
		scene: "ovo",
		title: "Corrida do ovo"
	}]

	const start = k.vec2(config.PADDING, k.height() / 2 + SPACING * 2)
	
	for (let i = 0; i < scenes.length; i++) {
		const info = scenes[i];
		const button = k.add([
			k.pos(start.add(0, i * SPACING)),
			k.anchor("left"),
			k.text(info.title, {
				font: "kitchensink",
				align: "left"
			}),
			k.area(),
		])
		button.onClick(() => {
			k.go(info.scene)
		})
		button.onHover(() => {
			k.setCursor("pointer")
		})
		button.onHoverEnd(() => {
			k.setCursor("auto")
		})
	}
}