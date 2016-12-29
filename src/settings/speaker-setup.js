import {PlutoAPI} from '../pluto-api';

export class SpeakerSetup {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
        this.speakerName = "";
        this.playPercent = 0;
    }

    activate(params, routeConfig) {
        return this.api.getAudioConfig().then(config => {
            this.speakerName = config.speaker;
            this.updateHandle = setInterval(() => this.update(), 50);
        });
    }

    update() {
        this.playPercent = Math.min(this.playPercent + 1, 100);
        if (100 <= this.playPercent)
            clearInterval(this.updateHandle);
    }
}