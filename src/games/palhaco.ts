import { KaboomCtx } from "kaplay"
import { config } from "../config"
import { addBackButton } from "../gui/backButton"

const { PADDING, HUD_Z } = config

const BALL_SIZE = 48
const BALL_SCALE_INITIAL = 4
const BALL_SCALE_FINAL = 1
const BALL_RADIUS = 18 * config.SPRITE_SCALE / 2
const BALL_SPEED = 2
const BALL_FLY_TIME = .5
const BALL_H_PADDING = 4
const BALL_V_PADDING = 2
const BALL_Y = config.GAME_HEIGHT - BALL_V_PADDING
const BALL_MIN_X = BALL_H_PADDING
const BALL_MAX_X = config.GAME_WIDTH - BALL_H_PADDING
const BALL_STRENGTH_CHANGE_SPEED = 1
const HOLE_RADIUS = BALL_RADIUS * 2.5
const GRAVITY = 9
const UI_BAR_HEIGHT = config.GAME_HEIGHT / 2
const UI_BAR_WIDTH = 24
const CLOWN_SPRITE_HEIGHT = 144 * config.SPRITE_SCALE
const CLOWN_SPRITE_WIDTH = 160 * config.SPRITE_SCALE

export const makeScenePalhaco = (k: KaboomCtx) => () => {
    const game = k.add([
        k.timer(),
    ])

	k.setCursor("auto")
    k.setBackground(k.Color.fromHex("#ffbf36"))

    // HUD
    const backButton = addBackButton(k)
    const pointsDisplay = game.add([
        k.pos(k.width() - PADDING, PADDING),
        k.anchor("topright"),
        k.text("Pontos: 0", {
            font: "kitchensink"
        }),
        k.z(HUD_Z)
    ])
    
    const hole = game.add([
        k.pos(k.center()),
        k.anchor("center"),
        k.circle(HOLE_RADIUS),
        k.color(k.BLACK),
        k.area(),
        k.opacity(0)
        // k.z(100),
    ])

    const clown = game.add([
        k.pos(k.center()),
        k.sprite("clown", {
            height: CLOWN_SPRITE_HEIGHT,
            width: CLOWN_SPRITE_WIDTH
        }),
        k.anchor("center"),
        k.z(2)
    ])

    game.add([
        k.pos(k.center()),
        k.sprite("clown-bg", {
            height: CLOWN_SPRITE_HEIGHT,
            width: CLOWN_SPRITE_WIDTH
        }),
        k.anchor("center"),
        k.z(1)
    ])
    
    const strengthBar = game.add([
        k.pos(16, k.center().y),
        k.anchor("left"),
        k.rect(UI_BAR_WIDTH, UI_BAR_HEIGHT),
        k.color(k.BLUE)
    ])
    
    const strength = strengthBar.add([
        k.pos(0, 0),
        k.anchor("left"),
        k.rect(UI_BAR_WIDTH, UI_BAR_HEIGHT),
        k.color(k.CYAN),
        k.scale(1, 0),
        {
            getValue() {
                return this.scale.y
            },
            setValue(value: number) {
                this.scale.y = value
            }
        }
    ])
    
    const addBall = () => {
        return game.add([
            k.sprite("ball", {
                width: 18 * config.SPRITE_SCALE,
                height: 18 * config.SPRITE_SCALE
            }),
            k.scale(BALL_SCALE_INITIAL),
            k.pos(BALL_MIN_X, BALL_Y),
            k.anchor("center"),
            k.area(),
            k.z(3),
            {
                reset() {
                    this.scale = k.vec2(BALL_SCALE_INITIAL)
                    this.pos = k.vec2(BALL_MIN_X, BALL_Y)
                    this.z = 3
                }
            }
        ])
    }
        
    const player = game.add([
        k.state("move", ["move", "pull", "fly", "fall", "success"]),
        {
            ball: addBall(),
            points: 0
        }
    ])
    
    player.onStateEnter("move", () => {
        let direction = 1
        
        // initialize
        player.ball.reset()
        strength.setValue(0)
    
        const movement = game.onUpdate(() => {
            player.ball.moveBy(BALL_SPEED * direction, 0)
            if (player.ball.pos.x >= BALL_MAX_X || player.ball.pos.x <= BALL_MIN_X) {
                direction = direction * -1
            }
        })
        const input = game.onKeyRelease("space", () => {
            player.enterState("pull")
            movement.cancel()
            input.cancel()
        })
    })
    
    player.onStateEnter("pull", () => {
        let direction = 1
        const update = game.onUpdate(() => {
            strength.setValue(strength.getValue() + BALL_STRENGTH_CHANGE_SPEED * direction * k.dt())
            if (strength.getValue() >= 1 || strength.getValue() <= 0) {
                direction = direction * -1
            }
        })
        const input = game.onKeyDown("space", () => {
            player.enterState("fly")
            input.cancel()
            update.cancel()
        })
    })
    
    player.onStateEnter("fly", () => {
        const target = k.height() * (1 - strength.getValue())
        const moveTween = game.tween(
            player.ball.pos.y,
            target,
            BALL_FLY_TIME,
            (value) => {
                player.ball.pos.y = value
            },
            k.easings.easeOutBack
        )
        const scaleTween = game.tween(
            BALL_SCALE_INITIAL,
            BALL_SCALE_FINAL,
            BALL_FLY_TIME,
            (value) => {
                player.ball.scaleTo(value)
            }
        )
        scaleTween.onEnd(() => {
            const distance = hole.pos.dist(player.ball.pos)
            if (distance < HOLE_RADIUS - BALL_RADIUS) { // totally contained
                player.enterState("success")
            } else {
                player.enterState("fall")
            }
        })
    })
    
    player.onStateEnter("fall", () => {
        k.shake(10)
        const update = game.onUpdate(() => {
            player.ball.moveBy(0, GRAVITY)
            if (player.ball.pos.y > k.height() + (BALL_RADIUS * 2)) {
                update.cancel()
                player.enterState("move")
            }
        })
    })
    
    player.onStateEnter("success", () => {
        player.ball.z = 1
        const update = game.onUpdate(() => {
            player.ball.moveBy(0, GRAVITY)
            if (player.ball.pos.y > k.height() + (BALL_RADIUS * 2)) {
                update.cancel()
                player.points = player.points + 1
                pointsDisplay.text = "Pontos: " + player.points
                player.enterState("move")
            }
        })
    })    
}
