import {bindable, decorators, customElement} from 'aurelia-framework';

export let FriendCard = decorators(
    customElement('friend-card'),
    bindable('displayName'),
    bindable('userId'),
    bindable('status'),
    bindable('profileImage'),
    bindable('showFriends')
).on(class {
    get isVisible() {
        if ('unavailable' === this.showFriends)
            return 'offline' === this.status;
        else
            return 'offline' !== this.status;
    }
});