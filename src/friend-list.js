import {PlutoAPI} from './pluto-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FriendAdded, FriendRemoved, FriendUpdated} from './messages';

export class FriendList {
    static inject() { return [EventAggregator, PlutoAPI]; }

    constructor(ea, api) {
        this.api = api;
        this.friends = [];
        ea.subscribe(FriendAdded, msg => this.add(msg.friend));
        ea.subscribe(FriendRemoved, msg => this.remove(msg.friend));
        ea.subscribe(FriendUpdated, msg => this.update(msg.friend));
    }

    activate(params, routeConfig) {
        return this.api.getUsers().then(users => {
            this.friends = users;
        });
    }

    add(friend) {
        if (-1 !== this.friends.indexOf(friend))
            this.friends.push(friend);
    }

    remove(friend) {
        let index = this.friends.indexof(friend);
        if (-1 !== index)
            this.friends.splice(index, 1);
    }

    update(friend) {
        let obj = this.friends.find(f => friend.id === f.id);
        Object.assign(obj, friend);
    }
}