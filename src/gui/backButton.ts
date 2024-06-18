import { KaboomCtx } from "kaplay";
import { config } from "../config";

export const addBackButton = (k: KaboomCtx) => {
    const backButton = k.add([
        k.pos(config.PADDING, config.PADDING),
        k.anchor("topleft"),
        k.text("< voltar", {
            font: "kitchensink"
        }),
        k.area(),
        k.z(config.HUD_Z)
    ])

    backButton.onClick(() => {
        k.go("main")
    })

    return backButton
}
