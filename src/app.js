import {EventAggregator} from 'aurelia-event-aggregator';
import {UserLoggedIn} from './messages';
import {PlutoAPI} from './pluto-api';

export class App {
    static inject() { return [EventAggregator, PlutoAPI]; }

    constructor(ea, plutoApi) {
        this._currentState = '';
        this.plutoApi = plutoApi;
        this.username = "";
        ea.subscribe(UserLoggedIn, msg => this.username = msg.username);
        this.plutoApi.ea = ea;
        this.plutoApi.init();
    }

    configureRouter(config, router) {
        config.title = 'Pluto';
        config.map([
            {route: 'avatarBuilder', moduleId: 'avatar-builder', name: 'avatarBuilder'},
            {route: 'settings', moduleId: 'settings', name: 'settings'},
            {route: ['', 'friendList'], moduleId: 'friend-list', name: 'friendList'}
        ]);
        this.router = router;
    }

    get currentState() {
        return this._currentState;
    }

    set currentState(value) {
        this._currentState = value;
    }

    changeState(nextState) {
        this.currentState = nextState;
        return true;
    }
}
