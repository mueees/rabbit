describe('', function () {
    var testEl,
        scope,
        $compile,
        $httpBackend,
        $closeBtn;

    function _init() {
        $compile(testEl)(scope);
        scope.$digest();
        $('body').append(testEl);

        $closeBtn = $(testEl).find('.action-palette-close');
    }

    beforeEach(module('templates', 'rss.core.components.action-panel'));

    beforeEach(inject(function ($rootScope, _$compile_, _$httpBackend_) {
        scope = $rootScope;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        testEl = angular.element('<rss-action-panel rss-configuration="actionPanelConfiguration"></rss-action-panel>');
        scope.actionPanelConfiguration = {};
    }));

    afterEach(function () {
        $(testEl).remove();
    });

    xit('should exist close btn', function () {
        _init();
        expect($(testEl).find('.action-palette-close').size()).toEqual(1);
    });

    xit('should remove panel when click by close btn', function () {
        _init();
        $closeBtn.click();

        var $el = $('body').find('rss-action-panel');

        expect($el.size()).toEqual(0);
    });
});