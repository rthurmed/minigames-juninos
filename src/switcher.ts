import { KaboomCtx } from "kaplay";

export const makeSceneSwitcher = (k: KaboomCtx, scenes: string[]) => () => {
	const t = k.add([
		k.pos(k.center()),
		k.anchor("center"),
		k.text("MiniGames Juninos", {
			font: "kitchensink"
		})
	])
	
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
}