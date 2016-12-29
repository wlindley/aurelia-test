import {PlutoAPI} from '../pluto-api';

export class SettingsMain {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
        this.speakerName = "";
        this.microphoneName = "";
    }

    activate(params, routeConfig) {
        return this.api.getAudioConfig().then(config => {
            this.speakerName = config.speaker;
            this.microphoneName = config.microphone;
        });
    }
}