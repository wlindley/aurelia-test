import {PlutoAPI} from './pluto-api';

export class AvatarBuilderCategory {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
        this.title = '';
        this.items = [];
    }

    activate(params, routeConfig) {
        this.currentCategory = params.id;
        return this.api.getAvatarBuilderCategory(params.id).then(category => {
            this.title = category.title;
            this.items = category.items;
        });
    }

    get prevCategory() {
        let categories = this.api.avatarBuilderCategories;
        let index = categories.indexOf(this.currentCategory) - 1;
        while (0 > index)
            index += categories.length;
        return categories[index];
    }

    get nextCategory() {
        let categories = this.api.avatarBuilderCategories;
        let index = categories.indexOf(this.currentCategory);
        return categories[(index + 1) % categories.length];
    }
}