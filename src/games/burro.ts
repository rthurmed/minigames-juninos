import { KaboomCtx } from "kaplay"
import { config } from "../config"

const POINT_RADIUS = 4
const TAIL_RADIUS = 48
const TAIL_SPEED = 400
const SHAKINESS_STRENGTH = 48

export const makeSceneBurro = (k: KaboomCtx) => () => {
    k.setCursor("move")

    const game = k.add([
        k.timer()
    ])

    let time = 0
    let offset = k.vec2()
    
    const targetPoint = game.add([
        k.pos(k.center()),
        k.anchor("center"),
        k.circle(POINT_RADIUS),
        k.color(k.BLACK),
        k.z(0)
    ])

    const tail = game.add([
        k.pos(k.width() / 2, k.height()),
        k.anchor("center"),
        k.circle(TAIL_RADIUS),
        k.color(k.BLUE),
        k.z(1)
    ])

    const tailPoint = tail.add([
        k.pos(),
        k.anchor("center"),
        k.circle(POINT_RADIUS),
        k.color(k.RED),
        k.opacity(0),
        k.z(1)
    ])

    const movement = game.onUpdate(() => {
        time = time + k.dt()
        if (time >= 1) {
            time = 0
            offset = k.vec2(k.rand() - 0.5, k.rand() - 0.5).scale(SHAKINESS_STRENGTH)
        }
        const target = k.mousePos().add(offset)
        tail.pos = k.lerp(tail.pos, target, k.dt() * 8)
    })

    const input = game.onMousePress("left", () => {
        tailPoint.opacity = 1
        tailPoint.z = 2
        targetPoint.z = 2

        const distance = targetPoint.pos.dist(tail.pos)
        console.log({ distance });

        input.cancel()
        movement.cancel()
    })
}
