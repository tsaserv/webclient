/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var UserCredentials = require('models/UserCredentials');

  describe('UserCredentials', function() {
    var realSessionStorage = sessionStorage;
    var credentials;

    beforeEach(function() {
      credentials = new UserCredentials();
      Object.defineProperty(window, 'sessionStorage', {
        value: {},
        writable: true
      });
    });

    afterEach(function() {
      window.sessionStorage = realSessionStorage;
    });

    describe('set()', function() {
      it('should set "username" and "password" attributes', function() {
        credentials.set({username: 'bob@example.com', password: 'bob'});
        expect(credentials.username).toBe('bob@example.com');
        expect(credentials.password).toBe('bob');
      });
    });

    describe('fetch()', function() {
      it('should get credentials from sessionStorage', function() {
        sessionStorage.username = 'bob@example.com';
        sessionStorage.password = 'bob';
        credentials.fetch();
        expect(credentials.username).toBe('bob@example.com');
        expect(credentials.password).toBe('bob');
      });

      it('should call success callback if supplied', function() {
        var success = jasmine.createSpy('success');
        sessionStorage.username = 'alice@example.com';
        sessionStorage.password = 'alices_password';
        credentials.fetch({success: success});
        expect(success).toHaveBeenCalled();
      });
    });

    describe('save()', function() {
      it('should store credentials into sessionStorage', function() {
        credentials.save({username: 'bob@example.com', password: 'bob'});
        expect(sessionStorage.username).toBe('bob@example.com');
        expect(sessionStorage.password).toBe('bob');
      });

      it('should delete storage if credentials are cleared', function() {
        credentials.save({username: 'bob@example.com', password: 'bob'});
        credentials.save({username: null, password: null});
        expect(sessionStorage.username).toBeUndefined();
        expect(sessionStorage.password).toBeUndefined();
      });
    });

    describe('addAuthorizationToAjaxOptions()', function() {
      it('should add "withCredentials: true" to options', function() {
        var options = {};
        credentials.addAuthorizationToAjaxOptions(options);
        expect(options.xhrFields.withCredentials).toBe(true);
      });

      it('should add HTTP Basic Authorization header to options', function() {
        var auth = 'Basic ' + btoa('bob@example.com:bob');
        credentials.set({username: 'bob@example.com', password: 'bob'});
        var options = {};
        credentials.addAuthorizationToAjaxOptions(options);
        expect(options.headers['Authorization']).toBe(auth);
      });

    });
  });

});
