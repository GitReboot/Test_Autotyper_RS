import { keyboard, Key, sleep } from '@nut-tree-fork/nut-js';

export default class AutoTyper {
    constructor() {
        this.active = false;
        this.typing = false;
        this.paused = false;
        this.letters = [];
        this.letterIndex = 0;
        this.typingLoop = null;
        keyboard.config.autoDelayMs = 0;
    }

    async start() {
        if (this.active) return;
        
        this.active = true;
        this.typing = false;
        this.paused = false;
        this.letters = [];
        this.letterIndex = 0;
        
        this.typingLoop = this.runTypingLoop();
    }
    
    togglePause() {
        this.paused = !this.paused;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    async runTypingLoop() {
        while (this.active) {
            if (this.typing && !this.paused && this.letters.length > 0) {
                const letter = this.letters[this.letterIndex];
                await keyboard.type(letter);
                await sleep(Math.floor(Math.random() * 38) + 11);

                this.letterIndex++;

                if (this.letterIndex >= this.letters.length) {
                    this.typing = false;
                    this.letterIndex = 0;
                    this.letters = [];
                }
            } else {
                await sleep(10);
            }
        }
    }

    typeText(text) {
        if (this.typing) return;

        this.typing = true;
        this.letters = text.split('');
        this.letters.unshift(Key.Enter);

        const mistakes = Math.floor(Math.random() * 5);
        for (let i = 0; i < mistakes; i++) {
            const position = Math.floor(Math.random() * (this.letters.length - 2)) + 2;
            this.letters.splice(position, 0, this.randomKey(), Key.Backspace);
        }

        this.letters.push(Key.Enter);
        this.letterIndex = 0;
    }

    randomKey() {
        const keys = [Key.A, Key.B, Key.C, Key.D, Key.E, Key.F, Key.G, Key.H, Key.I, Key.J, Key.K, Key.L, Key.M, Key.N, Key.O, Key.P, Key.Q, Key.R, Key.S, Key.T, Key.U, Key.V, Key.W, Key.X, Key.Y, Key.Z];
        return keys[Math.floor(Math.random() * keys.length)];
    }

    async stop() {
        this.active = false;
        this.typing = false;
        this.letters = [];
        this.letterIndex = 0;
        
        if (this.typingLoop) {
            await this.typingLoop;
            this.typingLoop = null;
        }
    }
}