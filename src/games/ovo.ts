import { KaboomCtx } from "kaplay";
import { addBackButton } from "../gui/backButton";

const EGG_SPEED_INCLINE = 3
const EGG_SPEED_MOVEMENT = 2
const SPOON_SPEED = 5
const FALL_THRESHOLD = 80
const FALL_TIME = 1

export const makeSceneOvo = (k: KaboomCtx) => () => {
    const game = k.add([
        k.timer()
    ])

    k.setBackground(k.Color.fromHex("#e14141"))

    // HUD
    const backButton = addBackButton(k)

    const player = game.add([
        k.state("walk", ["walk", "fall"])
    ])

    const eggInitialPos = k.vec2(0, k.height()/2)
    const egg = game.add([
        k.sprite("egg"),
        k.anchor("bot"),
        k.pos(eggInitialPos),
        k.rotate(0)
    ])

    player.onStateEnter("walk", () => {
        egg.pos = eggInitialPos
        egg.angle = 0

        const movement = game.onUpdate(() => {
            if (Math.abs(egg.angle) > FALL_THRESHOLD) {
                player.enterState("fall")
                movement.cancel()
            }

            let incline = 0
            if (k.isKeyDown("d")) {
                incline = 1
            } else if (k.isKeyDown("a")) {
                incline = -1
            }

            let direction = 0
            if (k.isKeyDown("right")) {
                direction = 1
            } else if (k.isKeyDown("left")) {
                direction = -1
            }
            
            egg.angle = egg.angle * 1.01        
            egg.rotateBy(
                EGG_SPEED_MOVEMENT * direction * -1 +
                EGG_SPEED_INCLINE * incline
            )
            egg.moveBy(direction * SPOON_SPEED, 0)
        })
    })

    player.onStateEnter("fall", () => {
        const tween = game.tween(
            egg.pos.y,
            k.height() + 32,
            FALL_TIME,
            (value) => {
                egg.pos.y = value
            },
            k.easings.easeInCirc
        )
        tween.onEnd(() => {
            player.enterState("walk")
        })
    })
}
