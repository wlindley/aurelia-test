define('app',['exports', './web-api'], function (exports, _webApi) {
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

    var App = exports.App = function () {
        App.inject = function inject() {
            return [_webApi.WebAPI];
        };

        function App(api) {
            _classCallCheck(this, App);

            this.api = api;
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            config.title = 'Contacts';
            config.map([{ route: '', moduleId: 'no-selection', title: 'Select' }, { route: 'contacts/:id', moduleId: 'contact-detail', name: 'contacts' }]);
            this.router = router;
        };

        return App;
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

        this.message = "Please Select a Contact.";
    };
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
    config.globalResources(['./elements/loading-indicator']);
  }
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./contact-list\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Contacts</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <contact-list class=\"col-md-4\"></contact-list>\n      <router-view class=\"col-md-8\"></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!contact-detail.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-primary\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Profile</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form role=\"form\" class=\"form-horizontal\">\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">First Name</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.firstName\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Last Name</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.lastName\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Email</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.email\">\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Phone Number</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n\n    <div class=\"button-bar\">\n        <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\n    </div>\n</template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"contact-list\">\n        <ul class=\"list-group\">\n            <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.id === $parent.selectedId ? 'active' : ''}\">\n                <a route-href=\"route: contacts; params.bind: {id:contact.id}\" click.delegate=\"$parent.select(contact)\">\n                    <h4 class=\"list-group-item-heading\">${contact.firstName} ${contact.lastName}</h4>\n                    <p class=\"list-group-item-text\">${contact.email}</p>\n                </a>\n            </li>\n        </ul>\n    </div>\n</template>"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"no-selection text-center\">\n        <h2>${message}</h2>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map