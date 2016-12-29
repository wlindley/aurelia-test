import {PlutoAPI} from './pluto-api';

export class AvatarBuilder {
    static inject() { return [PlutoAPI]; }

    constructor(api) {
        this.api = api;
    }

    configureRouter(config, router) {
        config.title = 'Avatar Builder';
        config.map([
            {route: '', moduleId: 'no-selection', name: 'noSelection', nav: false},
            {route: 'category/:id', moduleId: 'avatar-builder-category', name: 'avatarBuilderCategory', nav: false}
        ]);
        this.router = router;
    }

    created() {
        this.router.navigateToRoute('avatarBuilderCategory', {id: this.api.avatarBuilderCategories[0]});
    }
}