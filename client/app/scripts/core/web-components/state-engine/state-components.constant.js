(function () {
    'use strict';
    angular.module('rss.core.web-components').constant('RSS_COMPONENT_STATE', {
        'mode': {
            'default': 'mode.default',
            'new': 'mode.new',
            'search': 'mode.search',
            'edit': 'mode.edit',
            'design': 'mode.design'
        },
        'access': {
            'none': 'access.none',
            'write': 'access.write',
            'read': 'access.read'
        },
        'model': {
            'pristine': 'model.pristine',
            'dirty': 'model.dirty'
        },
        'valid': {
            'ok': 'valid.ok',
            'warning': 'valid.warning',
            'error': 'valid.error',
            'severe': 'valid.severe'
        },
        'usability': {
            'enabled': 'usability.enabled',
            'disabled': 'usability.disabled'
        },
        'visibility': {
            'visible': 'visibility.visible',
            'hidden': 'visibility.hidden'
        },
        'work': {
            'busy': 'work.busy',
            'idle': 'work.idle'
        }
    });
})();
