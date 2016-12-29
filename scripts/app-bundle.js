define('app',['exports', 'aurelia-event-aggregator', './messages', './pluto-api'], function (exports, _aureliaEventAggregator, _messages, _plutoApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var App = exports.App = function () {
        App.inject = function inject() {
            return [_aureliaEventAggregator.EventAggregator, _plutoApi.PlutoAPI];
        };

        function App(ea, plutoApi) {
            var _this = this;

            _classCallCheck(this, App);

            this._currentState = '';
            this.plutoApi = plutoApi;
            this.username = "";
            ea.subscribe(_messages.UserLoggedIn, function (msg) {
                return _this.username = msg.username;
            });
            this.plutoApi.ea = ea;
            this.plutoApi.init();
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Pluto';
            config.map([{ route: 'avatarBuilder', moduleId: 'avatar-builder', name: 'avatarBuilder' }, { route: 'settings', moduleId: 'settings', name: 'settings' }, { route: ['', 'friendList'], moduleId: 'friend-list', name: 'friendList' }]);
            this.router = router;
        };

        App.prototype.changeState = function changeState(nextState) {
            this.currentState = nextState;
            return true;
        };

        _createClass(App, [{
            key: 'currentState',
            get: function get() {
                return this._currentState;
            },
            set: function set(value) {
                this._currentState = value;
            }
        }]);

        return App;
    }();
});
define('avatar-builder-category',['exports', './pluto-api'], function (exports, _plutoApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AvatarBuilderCategory = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var AvatarBuilderCategory = exports.AvatarBuilderCategory = function () {
        AvatarBuilderCategory.inject = function inject() {
            return [_plutoApi.PlutoAPI];
        };

        function AvatarBuilderCategory(api) {
            _classCallCheck(this, AvatarBuilderCategory);

            this.api = api;
            this.title = '';
            this.items = [];
        }

        AvatarBuilderCategory.prototype.activate = function activate(params, routeConfig) {
            var _this = this;

            this.currentCategory = params.id;
            return this.api.getAvatarBuilderCategory(params.id).then(function (category) {
                _this.title = category.title;
                _this.items = category.items;
            });
        };

        _createClass(AvatarBuilderCategory, [{
            key: 'prevCategory',
            get: function get() {
                var categories = this.api.avatarBuilderCategories;
                var index = categories.indexOf(this.currentCategory) - 1;
                while (0 > index) {
                    index += categories.length;
                }return categories[index];
            }
        }, {
            key: 'nextCategory',
            get: function get() {
                var categories = this.api.avatarBuilderCategories;
                var index = categories.indexOf(this.currentCategory);
                return categories[(index + 1) % categories.length];
            }
        }]);

        return AvatarBuilderCategory;
    }();
});
define('avatar-builder',['exports', './pluto-api'], function (exports, _plutoApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AvatarBuilder = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AvatarBuilder = exports.AvatarBuilder = function () {
        AvatarBuilder.inject = function inject() {
            return [_plutoApi.PlutoAPI];
        };

        function AvatarBuilder(api) {
            _classCallCheck(this, AvatarBuilder);

            this.api = api;
        }

        AvatarBuilder.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Avatar Builder';
            config.map([{ route: '', moduleId: 'no-selection', name: 'noSelection', nav: false }, { route: 'category/:id', moduleId: 'avatar-builder-category', name: 'avatarBuilderCategory', nav: false }]);
            this.router = router;
        };

        AvatarBuilder.prototype.created = function created() {
            this.router.navigateToRoute('avatarBuilderCategory', { id: this.api.avatarBuilderCategories[0] });
        };

        return AvatarBuilder;
    }();
});
define('contact-detail',['exports', 'aurelia-event-aggregator', './web-api', './utility', './messages'], function (exports, _aureliaEventAggregator, _webApi, _utility, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ContactDetail = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ContactDetail = exports.ContactDetail = function () {
        ContactDetail.inject = function inject() {
            return [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator];
        };

        function ContactDetail(api, ea) {
            _classCallCheck(this, ContactDetail);

            this.api = api;
            this.ea = ea;
        }

        ContactDetail.prototype.activate = function activate(params, routeConfig) {
            var _this = this;

            this.routeConfig = routeConfig;

            return this.api.getContactDetails(params.id).then(function (contact) {
                _this.contact = contact;
                _this.routeConfig.navModel.setTitle(contact.firstName);
                _this.originalContact = JSON.parse(JSON.stringify(contact));
                _this.ea.publish(new _messages.ContactViewed(_this.contact));
            });
        };

        ContactDetail.prototype.save = function save() {
            var _this2 = this;

            this.api.saveContact(this.contact).then(function (contact) {
                _this2.contact = contact;
                _this2.routeConfig.navModel.setTitle(contact.firstName);
                _this2.originalContact = JSON.parse(JSON.stringify(contact));
                _this2.ea.publish(new _messages.ContactUpdated(_this2.contact));
            });
        };

        ContactDetail.prototype.canDeactivate = function canDeactivate() {
            if (!(0, _utility.areEqual)(this.originalContact, this.contact)) {
                var result = confirm('You have unsaved changes. Are you sure you wish to leave?');
                if (!result) this.ea.publish(new _messages.ContactViewed(this.contact));
                return result;
            }
            return true;
        };

        _createClass(ContactDetail, [{
            key: 'canSave',
            get: function get() {
                return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
            }
        }]);

        return ContactDetail;
    }();
});
define('contact-list',['exports', './web-api', 'aurelia-event-aggregator', './messages'], function (exports, _webApi, _aureliaEventAggregator, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ContactList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ContactList = exports.ContactList = function () {
        ContactList.inject = function inject() {
            return [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator];
        };

        function ContactList(api, ea) {
            var _this = this;

            _classCallCheck(this, ContactList);

            this.api = api;
            this.contacts = [];
            ea.subscribe(_messages.ContactViewed, function (msg) {
                return _this.select(msg.contact);
            });
            ea.subscribe(_messages.ContactUpdated, function (msg) {
                var id = msg.contact.id;
                var found = _this.contacts.find(function (x) {
                    return x.id === id;
                });
                Object.assign(found, msg.contact);
            });
        }

        ContactList.prototype.created = function created() {
            var _this2 = this;

            this.api.getContactList().then(function (contacts) {
                return _this2.contacts = contacts;
            });
        };

        ContactList.prototype.select = function select(contact) {
            this.selectedId = contact.id;
            return true;
        };

        return ContactList;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('friend-list',['exports', './pluto-api', 'aurelia-event-aggregator', './messages'], function (exports, _plutoApi, _aureliaEventAggregator, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FriendList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FriendList = exports.FriendList = function () {
        FriendList.inject = function inject() {
            return [_aureliaEventAggregator.EventAggregator, _plutoApi.PlutoAPI];
        };

        function FriendList(ea, api) {
            var _this = this;

            _classCallCheck(this, FriendList);

            this.api = api;
            this.friends = [];
            ea.subscribe(_messages.FriendAdded, function (msg) {
                return _this.add(msg.friend);
            });
            ea.subscribe(_messages.FriendRemoved, function (msg) {
                return _this.remove(msg.friend);
            });
            ea.subscribe(_messages.FriendUpdated, function (msg) {
                return _this.update(msg.friend);
            });
        }

        FriendList.prototype.activate = function activate(params, routeConfig) {
            var _this2 = this;

            return this.api.getUsers().then(function (users) {
                _this2.friends = users;
            });
        };

        FriendList.prototype.add = function add(friend) {
            if (-1 !== this.friends.indexOf(friend)) this.friends.push(friend);
        };

        FriendList.prototype.remove = function remove(friend) {
            var index = this.friends.indexof(friend);
            if (-1 !== index) this.friends.splice(index, 1);
        };

        FriendList.prototype.update = function update(friend) {
            var obj = this.friends.find(function (f) {
                return friend.id === f.id;
            });
            Object.assign(obj, friend);
        };

        return FriendList;
    }();
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('messages',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ContactUpdated = exports.ContactUpdated = function ContactUpdated(contact) {
        _classCallCheck(this, ContactUpdated);

        this.contact = contact;
    };

    var ContactViewed = exports.ContactViewed = function ContactViewed(contact) {
        _classCallCheck(this, ContactViewed);

        this.contact = contact;
    };

    var FriendAdded = exports.FriendAdded = function FriendAdded(friend) {
        _classCallCheck(this, FriendAdded);

        this.friend = friend;
    };

    var FriendRemoved = exports.FriendRemoved = function FriendRemoved(friend) {
        _classCallCheck(this, FriendRemoved);

        this.friend = friend;
    };

    var FriendUpdated = exports.FriendUpdated = function FriendUpdated(friend) {
        _classCallCheck(this, FriendUpdated);

        this.friend = friend;
    };

    var UserLoggedIn = exports.UserLoggedIn = function UserLoggedIn(username) {
        _classCallCheck(this, UserLoggedIn);

        this.username = username;
    };
});
define('no-selection',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var NoSelection = exports.NoSelection = function NoSelection() {
        _classCallCheck(this, NoSelection);

        this.message = "";
    };
});
define('pluto-api',["exports", "./messages"], function (exports, _messages) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PlutoAPI = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var users = [{
        id: 1,
        name: "Walker Lindley",
        username: "walker",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    }, {
        id: 2,
        name: "Scott Rankin",
        username: "scott",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    }, {
        id: 3,
        name: "John Vechey",
        username: "john",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "away"
    }, {
        id: 4,
        name: "Forest Gibson",
        username: "trees",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "away"
    }, {
        id: 5,
        name: "Heather Henrichs",
        username: "hhenrichs",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "offline"
    }, {
        id: 6,
        name: "Andy Piro",
        username: "johnvechey",
        profileImage: "http://lorempixel.com/200/200/people/",
        status: "online"
    }];

    var PlutoAPI = exports.PlutoAPI = function () {
        function PlutoAPI() {
            _classCallCheck(this, PlutoAPI);

            this.ea = null;
            this.avatarBuilderCategorySizes = [];
            for (var i = 0; i < this.avatarBuilderCategories.length; i++) {
                this.avatarBuilderCategorySizes.push(Math.floor(Math.random() * 5 + 8));
            }
        }

        PlutoAPI.prototype.init = function init() {
            var _this = this;

            setTimeout(function () {
                _this.ea.publish(new _messages.UserLoggedIn("Walker Lindley"));
            }, 200);

            setInterval(function () {
                return _this.updateRandomUser();
            }, 5000);
        };

        PlutoAPI.prototype.updateRandomUser = function updateRandomUser() {
            var index = Math.floor(Math.random() * users.length);
            var statuses = ["online", "away", "offline"];
            var statusIndex = Math.floor(Math.random() * statuses.length);
            users[index].status = statuses[statusIndex];
        };

        PlutoAPI.prototype.getUsers = function getUsers() {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(users);
                }, 200);
            });
        };

        PlutoAPI.prototype.getAvatarBuilderCategory = function getAvatarBuilderCategory(categoryName) {
            var _this2 = this;

            return new Promise(function (resolve) {
                setTimeout(function () {
                    var title = categoryName[0].toUpperCase() + categoryName.slice(1).toLowerCase().replace('-', ' ');
                    var result = {
                        title: title,
                        items: []
                    };
                    var index = _this2.avatarBuilderCategories.indexOf(categoryName);
                    var numItems = _this2.avatarBuilderCategorySizes[index];
                    for (var i = 0; i < numItems; i++) {
                        result.items.push({
                            imageUrl: "http://lorempixel.com/100/100/people"
                        });
                    }
                    resolve(result);
                }, 250);
            });
        };

        _createClass(PlutoAPI, [{
            key: "avatarBuilderCategories",
            get: function get() {
                return ['skin-tone', 'face-shape', 'eyes', 'mouth', 'nose', 'ears', 'glasses', 'facial hair', 'hair'];
            }
        }]);

        return PlutoAPI;
    }();
});
define('settings',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Settings = exports.Settings = function () {
        Settings.inject = function inject() {
            return [];
        };

        function Settings() {
            _classCallCheck(this, Settings);
        }

        return Settings;
    }();
});
define('utility',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.areEqual = areEqual;
	function areEqual(obj1, obj2) {
		return Object.keys(obj1).every(function (key) {
			return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
		});
	};
});
define('web-api',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var latency = 200;
  var id = 0;

  function getId() {
    return ++id;
  }

  var contacts = [{
    id: getId(),
    firstName: 'John',
    lastName: 'Tolkien',
    email: 'tolkien@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Clive',
    lastName: 'Lewis',
    email: 'lewis@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Owen',
    lastName: 'Barfield',
    email: 'barfield@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Charles',
    lastName: 'Williams',
    email: 'williams@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Roger',
    lastName: 'Green',
    email: 'green@inklings.com',
    phoneNumber: '867-5309'
  }];

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.isRequesting = false;
    }

    WebAPI.prototype.getContactList = function getContactList() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var results = contacts.map(function (x) {
            return {
              id: x.id,
              firstName: x.firstName,
              lastName: x.lastName,
              email: x.email
            };
          });
          resolve(results);
          _this.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getContactDetails = function getContactDetails(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = contacts.filter(function (x) {
            return x.id == id;
          })[0];
          resolve(JSON.parse(JSON.stringify(found)));
          _this2.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.saveContact = function saveContact(contact) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(contact));
          var found = contacts.filter(function (x) {
            return x.id == contact.id;
          })[0];

          if (found) {
            var index = contacts.indexOf(found);
            contacts[index] = instance;
          } else {
            instance.id = getId();
            contacts.push(instance);
          }

          _this3.isRequesting = false;
          resolve(instance);
        }, latency);
      });
    };

    return WebAPI;
  }();
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator', './elements/friend-card']);
  }
});
define('resources/elements/friend-card',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FriendCard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var FriendCard = exports.FriendCard = (0, _aureliaFramework.decorators)((0, _aureliaFramework.customElement)('friend-card'), (0, _aureliaFramework.bindable)('displayName'), (0, _aureliaFramework.bindable)('userId'), (0, _aureliaFramework.bindable)('status'), (0, _aureliaFramework.bindable)('profileImage'), (0, _aureliaFramework.bindable)('showFriends')).on(function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _createClass(_class, [{
            key: 'isVisible',
            get: function get() {
                if ('unavailable' === this.showFriends) return 'offline' === this.status;else return 'offline' !== this.status;
            }
        }]);

        return _class;
    }());
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.LoadingIndicator = undefined;

    var nprogress = _interopRequireWildcard(_nprogress);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _class.prototype.loadingChanged = function loadingChanged(newValue) {
            if (newValue) {
                nprogress.start();
            } else {
                nprogress.done();
            }
        };

        return _class;
    }());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <div class=\"navbar-brand\">\n        <i class=\"fa fa-user\"></i>\n        <span>Pluto</span>\n        <span class=\"username\"> - ${username}</span>\n      </div>\n      <ul class=\"nav navbar-nav\">\n        <li class.bind=\"currentState === 'avatarBuilder' ? 'active' : ''\"><a route-href=\"route: avatarBuilder\" click.delegate=\"changeState('avatarBuilder')\">Avatar Builder</a></li>\n        <li class.bind=\"currentState === 'settings' ? 'active' : ''\"><a route-href=\"route: settings\" click.delegate=\"changeState('settings')\">Settings</a></li>\n        <li class.bind=\"currentState === 'friendList' ? 'active' : ''\"><a route-href=\"route: friendList\" click.delegate=\"changeState('friendList')\">Friends</a></li>\n      </ul>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view class=\"col-xs-12\"></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n\n.settings-panel {\n  background-color: #aaa\n}\n\n.settings-panel-btn {\n  margin: 5px;\n}\n\n.avatar-piece {\n  margin-bottom: 35px;\n}\n\n.centered {\n  text-align: center;\n}\n\n.friend-card {\n  margin-bottom: 60px;\n}\n\n.friend-name {\n  font-weight: bold;\n}\n\n.friend-status {\n  font-style: italic;\n  color: #aaa;\n}\n\n.call-button {\n  margin-top: 10px;\n  padding-left: 20px;\n  padding-right: 20px;\n  background-color: limegreen;\n}\n"; });
define('text!avatar-builder-category.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\"><h3 class=\"centered\">${title}</h3></div>\n    <div class=\"row\">\n        <div class=\"col-xs-2 text-center\">\n            <a route-href=\"route: avatarBuilderCategory; params.bind: {id: prevCategory}\">\n                <button class=\"btn centered\">&lt;</button>\n            </a>\n        </div>\n\n        <div class=\"col-xs-8\">\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div repeat.for=\"item of items\" class=\"col-xs-3 avatar-piece\">\n                        <a class=\"text-center\">\n                            <img class=\"img center-block\" src=\"${item.imageUrl}\">\n                        </a>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"col-xs-2 text-center\">\n            <a route-href=\"route: avatarBuilderCategory; params.bind: {id: nextCategory}\">\n                <button class=\"btn centered\">&gt;</button>\n            </a>\n        </div>\n    </div>\n</template>"; });
define('text!avatar-builder.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\">\n        <div class=\"col-xs-12\"><h1>Avatar Builder</h1></div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-3\">\n            <img class=\"img-responsive\" src=\"http://lorempixel.com/400/400/people/\">\n        </div>\n\n        <div class=\"col-md-9\">\n            <router-view></router-view>\n        </div>\n    </div>\n    <div class=\"row\">\n        <button class=\"btn settings-panel-btn\">Revert Changes</button>\n    </div>\n</template>"; });
define('text!contact-detail.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-primary\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Profile</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" class=\"form-horizontal\">\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">First Name</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.firstName\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Last Name</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.lastName\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Email</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.email\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Phone Number</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n\n    <div class=\"button-bar\">\n        <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\n    </div>\n</template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"contact-list\">\n        <ul class=\"list-group\">\n            <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.id === $parent.selectedId ? 'active' : ''}\">\n                <a route-href=\"route: contacts; params.bind: {id:contact.id}\" click.delegate=\"$parent.select(contact)\">\n                    <h4 class=\"list-group-item-heading\">${contact.firstName} ${contact.lastName}</h4>\n                    <p class=\"list-group-item-text\">${contact.email}</p>\n                </a>\n            </li>\n        </ul>\n    </div>\n</template>"; });
define('text!friend-list.html', ['module'], function(module) { module.exports = "<template>\n    <h2>Friends</h2>\n    <div class=\"panel\">\n        <div class=\"row\"><h3>Available</h3></div>\n        <div class=\"row\">\n            <div class=\"friend-list container-fluid\">\n                <div repeat.for=\"friend of friends\">\n                    <friend-card user-id.bind=\"friend.id\" display-name.bind=\"friend.name\" status.bind=\"friend.status\" profile-image.bind=\"friend.profileImage\" show-friends=\"available\"></friend-card>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"panel\">\n        <div class=\"row\"><h3>Offline</h3></div>\n        <div class=\"row\">\n            <div class=\"friend-list container-fluid\">\n                <div repeat.for=\"friend of friends\">\n                    <friend-card user-id.bind=\"friend.id\" display-name.bind=\"friend.name\" status.bind=\"friend.status\" profile-image.bind=\"friend.profileImage\" show-friends=\"unavailable\"></friend-card>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"no-selection text-center\">\n        <h2>${message}</h2>\n    </div>\n</template>"; });
define('text!settings.html', ['module'], function(module) { module.exports = "<template>\n    <h1>Settings</h1>\n    <div class=\"row\">\n        <div class=\"panel settings-panel col-sm-12\">\n            <h2>Audio</h2>\n            <div class=\"row\"><button class=\"btn settings-panel-btn\">Select Microphone</button></div>\n            <div class=\"row\"><button class=\"btn settings-panel-btn\">Select Speaker</button></div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"panel settings-panel col-sm-12\">\n            <h2>General</h2>\n            <div class=\"checkbox\">\n                <label><input type=\"checkbox\" value=\"\" id=\"share-app-context\">Share what I'm doing with others</label>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!resources/elements/friend-card.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"friend-card col-sm-3 ${isVisible ? '' : 'hidden'}\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 text-center\"><span class=\"friend-name\">${displayName}</span></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-12 text-center\"><span class=\"friend-status\">${status}</span></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-12\"><img class=\"img center-block\" src=\"${profileImage}\"></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-sm-2\"></div>\n            <div class=\"col-sm-4\">\n                <button class=\"btn center-block call-button\">\n                    <span class=\"glyphicon glyphicon-earphone\"></span>\n                </button>\n            </div>\n            <div class=\"col-sm-4\">\n                <button class=\"btn center-block call-button\">\n                    <span class=\"glyphicon glyphicon-facetime-video\"></span>\n                </button>\n            </div>\n            <div class=\"col-sm-2\"></div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map