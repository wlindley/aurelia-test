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

        _createClass(App, [{
            key: 'currentRoute',
            get: function get() {
                if (null === this.router.currentInstruction) return 'friendList';
                return this.router.currentInstruction.config.name;
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
            var defaultCategory = this.api.avatarBuilderCategories[0];
            config.title = 'Avatar Builder';
            config.map([{ route: '', redirect: 'category/' + defaultCategory }, { route: 'category/:id', moduleId: 'avatar-builder-category', name: 'avatarBuilderCategory' }]);
            this.router = router;
        };

        return AvatarBuilder;
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
                this.avatarBuilderCategorySizes.push(Math.floor(Math.random() * 10 + 15));
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

        PlutoAPI.prototype.getAudioConfig = function getAudioConfig() {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var result = {
                        speaker: "Bluetooth audio device 4",
                        microphone: "Default recording device"
                    };
                    resolve(result);
                }, 50);
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
define('settings',['exports'], function (exports) {
    'use strict';

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

        Settings.prototype.configureRouter = function configureRouter(config, router) {
            config.map([{ route: '', moduleId: 'settings/main', name: 'main' }, { route: 'speakerSetup', moduleId: 'settings/speaker-setup', name: 'speakerSetup' }, { route: 'microphoneSetup', moduleId: 'settings/microphone-setup', name: 'microphoneSetup' }]);
            this.router = router;
        };

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
define('settings/main',["exports", "../pluto-api"], function (exports, _plutoApi) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SettingsMain = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SettingsMain = exports.SettingsMain = function () {
        SettingsMain.inject = function inject() {
            return [_plutoApi.PlutoAPI];
        };

        function SettingsMain(api) {
            _classCallCheck(this, SettingsMain);

            this.api = api;
            this.speakerName = "";
            this.microphoneName = "";
        }

        SettingsMain.prototype.activate = function activate(params, routeConfig) {
            var _this = this;

            return this.api.getAudioConfig().then(function (config) {
                _this.speakerName = config.speaker;
                _this.microphoneName = config.microphone;
            });
        };

        return SettingsMain;
    }();
});
define('settings/speaker-setup',["exports", "../pluto-api"], function (exports, _plutoApi) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SpeakerSetup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SpeakerSetup = exports.SpeakerSetup = function () {
        SpeakerSetup.inject = function inject() {
            return [_plutoApi.PlutoAPI];
        };

        function SpeakerSetup(api) {
            _classCallCheck(this, SpeakerSetup);

            this.api = api;
            this.speakerName = "";
            this.playPercent = 0;
        }

        SpeakerSetup.prototype.activate = function activate(params, routeConfig) {
            var _this = this;

            return this.api.getAudioConfig().then(function (config) {
                _this.speakerName = config.speaker;
                _this.updateHandle = setInterval(function () {
                    return _this.update();
                }, 50);
            });
        };

        SpeakerSetup.prototype.update = function update() {
            this.playPercent = Math.min(this.playPercent + 1, 100);
            if (100 <= this.playPercent) clearInterval(this.updateHandle);
        };

        return SpeakerSetup;
    }();
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
        }, {
            key: 'areButtonsVisible',
            get: function get() {
                return 'offline' !== this.status;
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
define('settings/microphone-setup',["exports", "../pluto-api"], function (exports, _plutoApi) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MicrophoneSetup = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MicrophoneSetup = exports.MicrophoneSetup = function () {
        MicrophoneSetup.inject = function inject() {
            return [_plutoApi.PlutoAPI];
        };

        function MicrophoneSetup(api) {
            _classCallCheck(this, MicrophoneSetup);

            this.api = api;
            this.microphoneName = "";
            this.volumePercent = 0;
        }

        MicrophoneSetup.prototype.activate = function activate(params, routeConfig) {
            var _this = this;

            return this.api.getAudioConfig().then(function (config) {
                _this.microphoneName = config.microphone;
                _this.updateHandle = setInterval(function () {
                    return _this.update();
                }, 100);
            });
        };

        MicrophoneSetup.prototype.detached = function detached() {
            clearInterval(this.updateHandle);
        };

        MicrophoneSetup.prototype.update = function update() {
            this.volumePercent = Math.floor(Math.random() * 10) * 5 + 30;
        };

        return MicrophoneSetup;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n        <div class=\"navbar-brand\">\n          <span>Pluto</span>\n        </div>\n      </div>\n\n      <ul class=\"nav navbar-nav\">\n        <li class.bind=\"currentRoute === 'avatarBuilder' ? 'active' : ''\"><a route-href=\"route: avatarBuilder\">Avatar Builder</a></li>\n        <li class.bind=\"currentRoute === 'settings' ? 'active' : ''\"><a route-href=\"route: settings\">Settings</a></li>\n        <li class.bind=\"currentRoute === 'friendList' ? 'active' : ''\"><a route-href=\"route: friendList\">Friends</a></li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li><span class=\"navbar-text\">${username}</span></li>\n        <li><a class=\"btn btn-default\">Logout</a></li>\n        <li><a class=\"btn btn-danger\">\n          <span class=\"glyphicon glyphicon-off\"></span>\n        </a></li>\n      </ul>\n  </div></nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view class=\"col-xs-12\"></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n\n.settings-panel-btn {\n  margin: 5px;\n  margin-left: 15px;\n}\n\n.avatar-piece {\n  margin-bottom: 5%;\n}\n\n.friend-card {\n  margin-bottom: 5%;\n}\n\n.friend-name {\n  font-weight: bold;\n}\n\n.friend-status {\n  font-style: italic;\n}\n\n.call-buttons {\n  margin-top: 5px;\n}\n\n.option-title {\n  font-weight: bold;\n}\n\n.vertical-spacer {\n  padding-bottom: 10px;\n}\n\n.avatar-builder-category {\n  height: 500px;\n  overflow-y: scroll;\n}\n\n.avatar-preview {\n  margin-top: 55px;\n}\n"; });
define('text!avatar-builder-category.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\"><h3 class=\"text-center\">${title}</h3></div>\n    <div class=\"row\">\n        <div class=\"col-xs-1 text-center\">\n            <a class=\"btn btn-default\" route-href=\"route: avatarBuilderCategory; params.bind: {id: prevCategory}\">\n                <span class=\"glyphicon glyphicon-chevron-left\"></span>\n            </a>\n        </div>\n\n        <div class=\"col-xs-10\">\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"avatar-builder-category\">\n                        <div repeat.for=\"item of items\" class=\"col-xs-3 avatar-piece\">\n                            <a><img class=\"img\" src=\"${item.imageUrl}\"></a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"col-xs-1 text-center\">\n            <a class=\"btn btn-default\" route-href=\"route: avatarBuilderCategory; params.bind: {id: nextCategory}\">\n                <span class=\"glyphicon glyphicon-chevron-right\"></span>\n            </a>\n        </div>\n    </div>\n</template>"; });
define('text!avatar-builder.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"row\">\n        <div class=\"col-xs-12\">\n            <div class=\"page-header\"><h1>Avatar Builder</h1></div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-4\">\n            <div class=\"row avatar-preview\">\n                <img class=\"img-responsive\" src=\"http://lorempixel.com/400/400/people/\">\n            </div>\n        </div>\n\n        <div class=\"col-md-8\">\n            <router-view></router-view>\n        </div>\n    </div>\n    <div class=\"row text-center\">\n        <button class=\"btn btn-danger\">Revert Changes</button>\n    </div>\n</template>"; });
define('text!friend-list.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"page-header\"><h2>Friends</h2></div>\n    <div class=\"panel panel-primary\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">\n                <a data-toggle=\"collapse\" href=\"#available-friends-panel\">Available</a>\n            </h3>\n        </div>\n        <div class=\"panel-collapse collapse in\" id=\"available-friends-panel\">\n            <div class=\"panel-body\">\n                <div class=\"row friend-list container-fluid\">\n                    <div repeat.for=\"friend of friends\">\n                        <friend-card user-id.bind=\"friend.id\" display-name.bind=\"friend.name\" status.bind=\"friend.status\" profile-image.bind=\"friend.profileImage\" show-friends=\"available\"></friend-card>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">\n                <a data-toggle=\"collapse\" href=\"#unavailable-friends-panel\">Offline</a>\n            </h3>\n        </div>\n        <div class=\"panel-collapse collapse\" id=\"unavailable-friends-panel\">\n            <div class=\"panel-body\">\n                <div class=\"row friend-list container-fluid\">\n                    <div repeat.for=\"friend of friends\">\n                        <friend-card user-id.bind=\"friend.id\" display-name.bind=\"friend.name\" status.bind=\"friend.status\" profile-image.bind=\"friend.profileImage\" show-friends=\"unavailable\"></friend-card>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"no-selection text-center\">\n        <h2>${message}</h2>\n    </div>\n</template>"; });
define('text!settings.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"page-header\"><h1>Settings</h1></div>\n\n    <router-view></router-view>\n</template>"; });
define('text!settings/main.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h2 class=\"panel-title\">Audio</h2>\n        </div>\n        <div class=\"panel-body\">\n            <div class=\"row\">\n                <div class=\"col-xs-12\">\n                    <div class=\"input-group\">\n                        <span class=\"form-control\"><span class=\"option-title\">Speaker:</span> ${speakerName}</span>\n                        <span class=\"input-group-btn\">\n                            <a route-href=\"route:speakerSetup\" class=\"btn btn-default\">Setup...</a>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row vertical-spacer\"></div>\n            <div class=\"row\">\n                <div class=\"col-xs-12\">\n                    <div class=\"input-group\">\n                        <span class=\"form-control\"><span class=\"option-title\">Microphone:</span> ${microphoneName}</span>\n                        <span class=\"input-group-btn\">\n                            <a route-href=\"route:microphoneSetup\" class=\"btn btn-default\">Setup...</a>\n                        </span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h2 class=\"panel-title\">General</h2>\n        </div>\n        <div class=\"panel-body\">\n            <div class=\"input-group\">\n                <span class=\"input-group-addon\">\n                    <input type=\"checkbox\" id=\"share-app-status\">\n                </span>\n                <label class=\"form-control\" for=\"share-app-status\">Share what I'm doing with others</label>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!settings/speaker-setup.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h2 class=\"panel-title\">Speaker Setup</h2>\n        </div>\n        <div class=\"panel-body\">\n            <div class=\"row\"><div class=\"col-xs-12\">\n                Please listen to the headphones you intend to use and ensure you can hear audio coming from the left and right ears.\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <h4>${speakerName}</h4>\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" style=\"width: ${playPercent}%\"></div>\n                </div>\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <a class=\"btn btn-primary\" route-href=\"route: main\">Use this audio device</a>\n                <a class=\"btn btn-default\" route-href=\"route: main\">Try next audio device</a>\n            </div></div>\n        </div>\n    </div>\n</template>"; });
define('text!resources/elements/friend-card.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"friend-card col-sm-3 ${isVisible ? '' : 'hidden'}\"><div class=\"thumbnail\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 text-center\"><span class=\"friend-name\">${displayName}</span></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-12 text-center\"><span class=\"friend-status text-muted\">${status}</span></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-xs-12\"><img class=\"img center-block\" width=\"64\" src=\"${profileImage}\"></div>\n        </div>\n        <div class=\"text-center ${areButtonsVisible ? '' : 'hidden'}\">\n            <div class=\"btn-group call-buttons\">\n                <button class=\"btn btn-primary\">\n                    <span class=\"glyphicon glyphicon-earphone\"></span>\n                </button>\n                <button class=\"btn btn-primary\">\n                    <span class=\"glyphicon glyphicon-facetime-video\"></span>\n                </button>\n            </div>\n        </div>\n    </div></div>\n</template>"; });
define('text!settings/microphone-setup.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h2 class=\"panel-title\">Microphone Setup</h2>\n        </div>\n        <div class=\"panel-body\">\n            <div class=\"row\"><div class=\"col-xs-12\">\n                Please speak at a normal volume into the microphone you intend to use. The green bar should move noticeably.\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <h4>${microphoneName}</h4>\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" style=\"width: ${volumePercent}%\"></div>\n                </div>\n            </div></div>\n            <div class=\"row\"><div class=\"col-xs-12\">\n                <a class=\"btn btn-primary\" route-href=\"route: main\">Use this audio device</a>\n                <a class=\"btn btn-default\" route-href=\"route: main\">Try next audio device</a>\n            </div></div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map