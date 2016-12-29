import {UserLoggedIn, FriendAdded, FriendRemoved, FriendUpdated} from './messages';

const users = [
    {
        id: 1,
        name: "Walker Lindley",
        username: "walker",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    },
    {
        id: 2,
        name: "Scott Rankin",
        username: "scott",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    },
    {
        id: 3,
        name: "John Vechey",
        username: "john",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "away"
    },
    {
        id: 4,
        name: "Forest Gibson",
        username: "trees",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "away"
    },
    {
        id: 5,
        name: "Heather Henrichs",
        username: "hhenrichs",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "offline"
    },
    {
        id: 6,
        name: "Andy Piro",
        username: "johnvechey",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    }
];

export class PlutoAPI {
    constructor() {
        this.ea = null;
        this.avatarBuilderCategorySizes = [];
        for (let i = 0; i < this.avatarBuilderCategories.length; i++) {
            this.avatarBuilderCategorySizes.push(Math.floor((Math.random() * 10) + 15));
        }
    }

    init() {
        setTimeout(() => {
            this.ea.publish(new UserLoggedIn("Walker Lindley"));
        }, 200);

        setInterval(() => this.updateRandomUser(), 5000);
    }

    updateRandomUser() {
        let index = Math.floor(Math.random() * users.length);
        let statuses = ["online", "away", "offline"];
        let statusIndex = Math.floor(Math.random() * statuses.length);
        users[index].status = statuses[statusIndex];
    }

    getUsers() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(users);
            }, 200);
        });
    }

    get avatarBuilderCategories() {
        return ['skin-tone', 'face-shape', 'eyes', 'mouth', 'nose', 'ears', 'glasses', 'facial hair', 'hair'];
    }

    getAvatarBuilderCategory(categoryName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let title = categoryName[0].toUpperCase() + categoryName.slice(1).toLowerCase().replace('-', ' ');
                let result = {
                    title: title,
                    items: []
                };
                let index = this.avatarBuilderCategories.indexOf(categoryName);
                let numItems = this.avatarBuilderCategorySizes[index];
                for (let i = 0; i < numItems; i++) {
                    result.items.push({
                        imageUrl: "http://lorempixel.com/100/100/people"
                    });
                }
                resolve(result);
            }, 250);
        });
    }

    getAudioConfig() {
        return new Promise(resolve => {
            setTimeout(() => {
                let result = {
                    speaker: "Bluetooth audio device 4",
                    microphone: "Default recording device"
                };
                resolve(result);
            }, 50);
        });
    }
}