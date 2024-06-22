import { KaboomCtx, Key } from "kaplay";
import { config } from "../config";
import { addBackButton } from "../gui/backButton";
import { randPitch } from "../util";

const MESSAGE_MAX_LENGTH = 200

export const makeCorreioScene = (k: KaboomCtx) => () => {
	const game = k.add([
        k.timer()
    ])

    k.setCursor("auto")
    k.setBackground(k.Color.fromHex("#39855a"))

    // HUD
    const backButton = addBackButton(k)

    const voices = speechSynthesis.getVoices().filter(e => {
        const name = e.name.toLowerCase()
        return name.includes("brazil") && !name.includes("whisper")
    })
    if (voices.length === 0) {
        return
    }

    const player = game.add([
        {
            text: ''
        }
    ])

    const textbox = game.add([
        k.pos(config.PADDING, config.PADDING * 5),
        k.text("", {
            width: k.width() - (config.PADDING * 2),
            font: "kitchensink"
        })
    ])

    const setText = (input: string) => {
        player.text = input
        textbox.text = player.text
    }

    game.onKeyPressRepeat((key) => {
        const ignored: Key[] = ['tab', 'shift', 'control', 'alt', 'meta', 'up', 'left', 'right', 'down', 'escape', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12']
        if (ignored.includes(key)) {
            return
        }
        if (key === 'enter') {
            const message = new SpeechSynthesisUtterance();
            message.voice = k.choose(voices)
            message.text = player.text
            message.lang = 'pt-br'
            speechSynthesis.speak(message)
            setText('')
            k.play("success", randPitch(k))
            return
        }
        k.shake(1)
        if (key === 'backspace') {
            setText(player.text.slice(0, player.text.length - 1))
            k.play("fail", randPitch(k))
            return
        }
        if (player.text.length >= MESSAGE_MAX_LENGTH) {
            k.play("fail", randPitch(k))
            return
        }
        if (key == 'space') {
            setText(player.text + ' ')
            k.play("blip", randPitch(k))
            return 
        }
        setText(player.text + key)
        k.play("blip", randPitch(k))
    })
}