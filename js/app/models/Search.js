/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var api = require('util/api');
  var ModelBase = require('models/ModelBase');

  var Search = ModelBase.extend({
    constructor: function() {
      ModelBase.call(this);
    },

    url: function() {
      return api.url('search');
    },

    doQuery: function(type, query, max, index) {
      if (type && query) {
        var data = {'type': type, 'q': query};
        if (max) {
          data.max = max;
        }

        if (index) {
          data.index = index;
        }

        var options = {'data': data};
        this.fetch(options);
      }
    }
  });

  return Search;
});