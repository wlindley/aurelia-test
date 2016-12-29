export class ContactUpdated {
    constructor(contact) {
        this.contact = contact;
    }
}

export class ContactViewed {
    constructor(contact) {
        this.contact = contact;
    }
}

export class FriendAdded {
    constructor(friend) {
        this.friend = friend;
    }
}

export class FriendRemoved {
    constructor(friend) {
        this.friend = friend;
    }
}

export class FriendUpdated {
    constructor(friend) {
        this.friend = friend;
    }
}

export class UserLoggedIn {
    constructor(username) {
        this.username = username;
    }
}