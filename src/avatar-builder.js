import {PlutoAPI} from './pluto-api';

export class AvatarBuilder {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
    }

    configureRouter(config, router) {
        let defaultCategory = this.api.avatarBuilderCategories[0];
        config.title = 'Avatar Builder';
        config.map([
            {route: '', redirect: 'category/' + defaultCategory},
            {route: 'category/:id', moduleId: 'avatar-builder-category', name: 'avatarBuilderCategory'}
        ]);
        this.router = router;
    }
}