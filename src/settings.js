export class Settings {
    static inject() { return []; }

    constructor() {
        
    }

    configureRouter(config, router) {
        config.map([
            {route: '', moduleId: 'settings/main', name: 'main'},
            {route: 'speakerSetup', moduleId: 'settings/speaker-setup', name: 'speakerSetup'},
            {route: 'microphoneSetup', moduleId: 'settings/microphone-setup', name: 'microphoneSetup'}
        ]);
        this.router = router;
    }
}