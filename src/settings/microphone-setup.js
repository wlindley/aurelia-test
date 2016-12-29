import {PlutoAPI} from '../pluto-api';

export class MicrophoneSetup {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
        this.microphoneName = "";
        this.volumePercent = 0;
    }

    activate(params, routeConfig) {
        return this.api.getAudioConfig().then(config => {
            this.microphoneName = config.microphone;
            this.updateHandle = setInterval(() => this.update(), 100);
        });
    }

    detached() {
        clearInterval(this.updateHandle);
    }

    update() {
        this.volumePercent = Math.floor(Math.random() * 10) * 5 + 30;
    }
}