import { AnchorComp, AreaComp, GameObj, KaboomCtx, PosComp, SpriteComp, Vec2, ZComp } from "kaplay"
import { config } from "../config"
import { addBackButton } from "../gui/backButton"

const POINT_RADIUS = 4
const CURSOR_RADIUS = 4
const CURSOR_SPEED = 4
const CURSOR_PADDING = 16
const CURSOR_MIN_Y = CURSOR_PADDING
const CURSOR_MAX_Y = config.GAME_HEIGHT / 2 + 32
const CURSOR_MIN_X = CURSOR_PADDING
const CURSOR_MAX_X = config.GAME_WIDTH - CURSOR_PADDING
const HOOK_MOVING_TIME = 3
const HOOK_MIN_DISTANCE = 6 * config.SPRITE_SCALE
const Z_FISH = 10
const Z_HOOK = 50
const Z_DEBUG = 100

type FishObj = GameObj<SpriteComp | PosComp | AnchorComp | ZComp | AreaComp | { hookPoint: Vec2; }>

export const makeScenePesca = (k: KaboomCtx) => () => {
    const game = k.add([
        k.timer()
    ])

    k.setBackground(k.Color.fromHex("#3898ff"))

    // HUD
    const backButton = addBackButton(k)

    const labelActiveColor = k.Color.fromHex("#ffbf36")
    const labelInactiveColor = k.Color.fromHex("#FFFFFF")

    const labelPointsP1 = k.add([
        k.pos(config.PADDING, k.height() - config.PADDING),
        k.anchor("botleft"),
        k.text("P1 0", {
            font: "kitchensink"
        }),
        k.color(labelInactiveColor)
    ])
    const labelPointsP2 = k.add([
        k.pos(k.width() - config.PADDING, k.height() - config.PADDING),
        k.anchor("botright"),
        k.text("0 P2", {
            font: "kitchensink"
        }),
        k.color(labelInactiveColor)

    ])

    const player = k.add([
        k.state("vertical", ["vertical", "horizontal", "moving", "pulling", "ended"]),
        {
            target: k.vec2(),
            hooked: undefined,
            playerOne: false,
            pointsP1: 0,
            pointsP2: 0,
        } as {
            target: Vec2,
            hooked?: FishObj
            playerOne: boolean,
            pointsP1: number,
            pointsP2: number,
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
        k.z(Z_DEBUG)
    ])

    const hookInitialPos = k.vec2(k.width()/2, -40 * config.SPRITE_SCALE)
    const hook = game.add([
        k.sprite("fish-hook", {
            width: 24 * config.SPRITE_SCALE,
            height: 112 * config.SPRITE_SCALE
        }),
        k.pos(hookInitialPos),
        k.anchor("bot"),
        k.z(Z_HOOK)
    ])

    const hookPoint = hook.add([
        k.pos(2 * config.SPRITE_SCALE, -5 * config.SPRITE_SCALE),
        k.z(Z_DEBUG)
    ])

    const oneTile = k.vec2(16, 16).scale(config.SPRITE_SCALE)
    const initialOffset = oneTile.add(0, 16 * 2 * config.SPRITE_SCALE)
    const fishHookOffset = k.vec2(8 * config.SPRITE_SCALE, -33 * config.SPRITE_SCALE)
    const columns = 6
    const rows = 3
    const fishes: FishObj[] = []

    const addFish = (tile: Vec2) => {
        const worldPosition = oneTile.scale(tile).add(initialOffset)
        const hookPoint = worldPosition.add(fishHookOffset)
        const fish = game.add([
            k.sprite("fish", {
                frame: k.randi(5),
                height: 40 * config.SPRITE_SCALE,
                width: 80 / 5 * config.SPRITE_SCALE
            }),
            k.anchor("botleft"),
            k.area(),
            k.pos(worldPosition),
            k.z(Z_FISH + tile.y),
            {
                hookPoint: hookPoint,
            }
        ])
        return fish
    }

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const fish = addFish(k.vec2(x, y))
            fishes.push(fish)
        }
    }

    const verticalCursor = game.add([
        k.sprite("fish-cursor", {
            height: 11 * config.SPRITE_SCALE,
            width: 16 * config.SPRITE_SCALE
        }),
        k.anchor("left"),
        k.pos(CURSOR_PADDING, CURSOR_MIN_Y),
    ])
    const horizontalCursor = game.add([
        k.sprite("fish-cursor", {
            height: 11 * config.SPRITE_SCALE,
            width: 16 * config.SPRITE_SCALE
        }),
        k.rotate(-90),
        k.anchor("left"),
        k.pos(CURSOR_MIN_X, k.height() - CURSOR_PADDING * 4)
    ])

    // initial
    player.onStateEnter("vertical", () => {
        player.playerOne = !player.playerOne

        labelPointsP1.color = player.playerOne ? labelActiveColor : labelInactiveColor
        labelPointsP2.color = !player.playerOne ? labelActiveColor : labelInactiveColor
        
        let direction = 1
        const movement = game.onUpdate(() => {
            verticalCursor.moveBy(k.DOWN.scale(CURSOR_SPEED * direction))
            if (verticalCursor.pos.y >= CURSOR_MAX_Y || verticalCursor.pos.y <= CURSOR_MIN_Y) {
                direction = direction * -1
            }
        })
        const input = game.onKeyRelease("space", () => {
            player.target.y = verticalCursor.pos.y
            player.enterState("horizontal")
            movement.cancel()
            input.cancel()
        })
    })

    player.onStateEnter("horizontal", () => {
        let direction = 1
        const movement = game.onUpdate(() => {
            horizontalCursor.moveBy(k.RIGHT.scale(CURSOR_SPEED * direction))
            if (horizontalCursor.pos.x >= CURSOR_MAX_X || horizontalCursor.pos.x <= CURSOR_MIN_X) {
                direction = direction * -1
            }
        })
        const input = game.onKeyDown("space", () => {
            player.target.x = horizontalCursor.pos.x
            player.enterState("moving")
            movement.cancel()
            input.cancel()
        })
    })

    player.onStateEnter("moving", () => {
        const tween = game.tween(
            hook.pos,
            player.target,
            HOOK_MOVING_TIME,
            (value) => {
                hook.pos = value
            },
            k.easings.easeInOutElastic
        )
        tween.onEnd(() => {
            for (let i = 0; i < fishes.length; i++) {
                const fish = fishes[i];
                const distance = fish.hookPoint.dist(hookPoint.worldPos())
                if (distance < HOOK_MIN_DISTANCE) {
                    player.hooked = fish
                    break
                }
            }
            if (player.hooked !== undefined) {
                player.enterState("pulling")
            } else {
                hook.pos = hookInitialPos
                k.shake(10)
                player.enterState("vertical")
            }
        })
    })

    player.onStateEnter("pulling", () => {
        let lastPos = hook.pos
        let moveDelta = k.vec2()
        const tween = game.tween(
            hook.pos,
            hookInitialPos,
            HOOK_MOVING_TIME,
            (value) => {
                moveDelta = value.sub(lastPos)
                lastPos = value

                hook.pos = value
                
                if (player.hooked !== undefined) {
                    // player.hooked.pos = value.add(fishHookOffset)
                    player.hooked.pos = player.hooked.pos.add(moveDelta)
                }
            },
            k.easings.easeOutElastic
        )
        tween.onEnd(() => {
            // update points
            if (player.playerOne) {
                player.pointsP1 += 1
                labelPointsP1.text = `P1 ${player.pointsP1}`
            } else {
                player.pointsP2 += 1
                labelPointsP2.text = `${player.pointsP2} P2`
            }

            player.enterState("vertical")
            
            player.hooked?.destroy()
            player.hooked = undefined
        })
    })
}
