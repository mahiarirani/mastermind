let Game = () => {
    return {
        active: null,
        slots: 4,
        colorKeys: ['red', 'green', 'blue', 'yellow', 'sky', 'orange', 'cloud', 'purple'],
        colors: {},
        code: [],
        answers: [], // start the game
        init() {
            this.colorKeys.forEach(color => this.colors[color] = new Color(color));
            this.restartGame();
        }, // generate new code and reset answers
        restartGame() {
            this.generateCode(this.slots);
            this.answers = [];
            this.addAnswer();
        }, // create a new answer
        addAnswer() {
            this.answers.push(new Answer());
            this.currentAnswer = this.answers[this.answers.length - 1];
        }, // create a list of colors as code without duplicates
        generateCode(slots) {
            let code = [];
            for (let i = 0; i < slots; i++) {
                let color = this.colors[this.colorKeys[Math.floor(Math.random() * this.colorKeys.length)]];
                code.includes(color) ? i-- : code.push(color);
            }
            // log code for debugging
            // this.code.forEach(color => console.log(color.name));
            this.code = code;
        },
        submitAnswer() {
            // validate: check for empty slots
            if (this.currentAnswer.validate()) {
                // alert the slots that are empty
                this.currentAnswer.slots.forEach(slot => slot.color === null && slot.alert());
                return;
            }
            // check: compare to code
            this.currentAnswer.check(this.code);
            if (!this.currentAnswer.complete) this.addAnswer();
        }, // selector for slot color
        openSelector(slot) {
            // release pointer
            if (this.$event.target.hasPointerCapture(this.$event.pointerId)) this.$event.target.releasePointerCapture(this.$event.pointerId)
            // only activate on last answer row
            if (!this.currentAnswer.slots.includes(slot) || this.currentAnswer.status === STATUS.COMPLETE) return;
            // open selector
            slot.active = true;
            // toggle active to know if it was activated already when deactivating
            this.active = !this.active;
        },
        closeSelector(slot = null) {
            // when pointerup is fired form the empty color and selector is already active then clear the answer
            if (this.$event.target.id === 'slot') {
                if (!this.active) this.currentAnswer.slots.forEach(slot => slot.active && this.clearSelector(slot));
            } else {
                if (slot) slot.active = false; else this.currentAnswer.slots.forEach(slot => slot.active = false);
                this.active = false;
            }
        },
        updateSelector(slot, color) {
            this.active = false;
            slot.active = false;
            // check selected color in the answer
            slot.color = this.currentAnswer.slots.some(slot => slot.color === color && slot.alert()) ? null : color;
        },
        clearSelector(slot) {
            slot.active = false;
            slot.color = null;
        }
    }
}

class Color {
    constructor(name) {
        this.name = name;
        this.class = {
            light: 'bg-light-' + name, dark: 'bg-dark-' + name
        };
        this.tag = this.class.light + ' hover:' + this.class.dark;
        this.active = false;
    }
}

class Answer {
    constructor() {
        this.slots = [new Slot(), new Slot(), new Slot(), new Slot()];
        this.complete = false;
        this.status = STATUS.ACTIVE;
        this.stats = {
            exact: 0, have: 0, rest: 0,
        };
    }

    validate() {
        return this.slots.map(slot => slot.color === null).includes(true)
    }

    check(code) {
        this.status = STATUS.ACTIVE;
        this.complete = false;
        this.slots.forEach((slot, index) => slot.check(code, index));
        this.complete = this.slots.every(slot => slot.match.exact);
        this.update();
    }

    update() {
        this.status = this.complete ? STATUS.COMPLETE : STATUS.INCOMPLETE;
        this.stats.exact = this.slots.reduce((count, slot) => slot.match.exact ? count + 1 : count, 0);
        this.stats.have = this.slots.reduce((count, slot) => slot.match.exact ? count : slot.match.have ? count + 1 : count, 0);
        this.stats.rest = this.slots.length - this.stats.exact - this.stats.have;
    }
}

const STATUS = {
    ACTIVE: 'ACTIVE', INCOMPLETE: 'INCOMPLETE', COMPLETE: 'COMPLETE'
}

class Slot {
    constructor() {
        this.color = null;
        this.active = false;
        this.match = {
            exact: false, have: false
        }
    }

    check(code, index) {
        this.match.exact = this.color.name === code[index].name;
        this.match.have = code.filter((c, i) => i !== index).some(c => c.name === this.color.name);
    }

    alert() {
        // display alert for 1s
        this.alertFlag = true;
        setTimeout(() => this.alertFlag = false, 1000);
        return true;
    }
}
