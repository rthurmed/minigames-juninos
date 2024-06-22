import { KaboomCtx } from "kaplay";

export const randPitch = (k: KaboomCtx) => ({
    detune: k.randi(0, 12) * 100,
});
