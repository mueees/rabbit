var config = require('config'),
    Api = require('services/auth.service/api'),
    chai = require('chai');
var api = new Api();

describe('Auth service', function () {

    it("should exist api", function () {
        assert.isDefined(api);
    });

    describe("Sign up method", function () {
        it("should exist signup method", function () {
            assert.isDefined(api.signup);
        });

        it("should exist signup method", function (done) {
            api.signup('', '', function (err, user) {
                assert.isDefined(err);
                done();
            })
        });
    });




});