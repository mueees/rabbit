describe("rssSearchBar", function () {

    var $compile,
        element,
        scope;

    beforeEach(module('templates'));
    beforeEach(module('rss.core.components.search-bar'));

    beforeEach(inject(function ($rootScope, _$compile_) {
        $compile = _$compile_;
        scope = $rootScope;

        element = '<rss-search-bar rx-configuration="rssSearchBarConfig"></rss-search-bar>';
        scope.rssSearchBarConfig = {};
    }));

    it('should not have any result block', function () {
        var $el = $compile(element)(scope);
        scope.$digest();

        var resultBlock = $el.find('.result-block');
        expect(resultBlock.length).toEqual(0);
    });

});