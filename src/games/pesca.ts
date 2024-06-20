import { KaboomCtx, Vec2 } from "kaplay"
import { config } from "../config"
import { addBackButton } from "../gui/backButton"

const POINT_RADIUS = 4
const CURSOR_RADIUS = 4
const CURSOR_SPEED = 4
const CURSOR_PADDING = 16
const CURSOR_MIN_Y = CURSOR_PADDING
const CURSOR_MAX_Y = config.GAME_HEIGHT - CURSOR_PADDING
const CURSOR_MIN_X = CURSOR_PADDING
const CURSOR_MAX_X = config.GAME_WIDTH - CURSOR_PADDING
const TAIL_MOVING_TIME = 3

export const makeScenePesca = (k: KaboomCtx) => () => {
    const game = k.add([
        k.timer()
    ])

    k.setBackground(k.Color.fromHex("#3898ff"))

    // HUD
    const backButton = addBackButton(k)

    const player = k.add([
        k.state("vertical", ["vertical", "horizontal", "moving", "ended"]),
        {
            target: k.vec2()
        }
    ])

    const background = k.add([
        k.sprite("fish-box", {
            width: config.GAME_WIDTH,
            height: config.GAME_HEIGHT
        }),
        k.pos(0, 0),
        k.z(-1)
    ])
    
    const point = game.add([
        k.pos(k.center()),
        k.anchor("center"),
        k.circle(POINT_RADIUS),
        k.color(k.BLACK),
        k.z(2)
    ])

    const hook = game.add([
        k.sprite("fish-hook", {
            width: 24 * config.SPRITE_SCALE,
            height: 112 * config.SPRITE_SCALE
        }),
        k.pos(k.width()/2, - 16),
        k.anchor("bot"),
        k.z(0)
    ])

    // const hookPoint = hook.add([
    //     k.pos(),
    //     k.anchor("center"),
    //     k.circle(POINT_RADIUS),
    //     k.color(k.BLACK),
    //     k.z(0)
    // ])

    player.onStateEnter("vertical", () => {
        let direction = 1
        const cursor = game.add([
            k.pos(CURSOR_PADDING, CURSOR_MIN_Y),
            k.anchor("center"),
            k.circle(CURSOR_RADIUS),
            k.color(k.RED)
        ])
        const movement = game.onUpdate(() => {
            cursor.moveBy(k.DOWN.scale(CURSOR_SPEED * direction))
            if (cursor.pos.y >= CURSOR_MAX_Y || cursor.pos.y <= CURSOR_MIN_Y) {
                direction = direction * -1
            }
        })
        const input = game.onKeyRelease("space", () => {
            player.target.y = cursor.pos.y
            player.enterState("horizontal")
            movement.cancel()
            input.cancel()
        })
    })

    player.onStateEnter("horizontal", () => {
        let direction = 1
        const cursor = game.add([
            k.pos(CURSOR_MIN_X, k.height() - CURSOR_PADDING),
            k.anchor("center"),
            k.circle(CURSOR_RADIUS),
            k.color(k.RED)
        ])
        const movement = game.onUpdate(() => {
            cursor.moveBy(k.RIGHT.scale(CURSOR_SPEED * direction))
            if (cursor.pos.x >= CURSOR_MAX_X || cursor.pos.x <= CURSOR_MIN_X) {
                direction = direction * -1
            }
        })
        const input = game.onKeyDown("space", () => {
            player.target.x = cursor.pos.x
            player.enterState("moving")
            movement.cancel()
            input.cancel()
        })
    })

    player.onStateEnter("moving", () => {
        game.tween(
            hook.pos,
            player.target,
            TAIL_MOVING_TIME,
            (value) => {
                hook.pos = value
            },
            k.easings.easeInOutElastic
        )
    }) 
}
