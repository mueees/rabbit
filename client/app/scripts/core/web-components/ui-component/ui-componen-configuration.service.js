(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('rssUiComponentConfiguration', function (RSS_COMPONENT_STATE, RSS_COMPONENT_MODE, RSS_COMPONENT_ACCESS) {
            return {
                getState: function () {
                    return [
                        {
                            name: RSS_COMPONENT_STATE.mode.default,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxMode = RSS_COMPONENT_MODE.default;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.mode.new,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxMode = RSS_COMPONENT_MODE.new;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.mode.search,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxMode = RSS_COMPONENT_MODE.search;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.mode.edit,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxMode = RSS_COMPONENT_MODE.edit;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.mode.design,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxMode = RSS_COMPONENT_MODE.design;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.access.none,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxAccess = RSS_COMPONENT_ACCESS.none;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.access.read,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxAccess = RSS_COMPONENT_ACCESS.read;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.access.write,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxAccess = RSS_COMPONENT_ACCESS.write;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.visibility.visible,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxHidden = false;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.visibility.hidden,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rxHidden = true;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.work.busy,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rssBusy = true;
                                }
                            }
                        },
                        {
                            name: RSS_COMPONENT_STATE.work.idle,
                            abstract: false,
                            handler: function (fullyQualifiedName, activate, scope, data) {
                                if (activate) {
                                    scope.rssBusy = false;
                                }
                            }
                        }
                    ];
                }
            };
        });
})();
