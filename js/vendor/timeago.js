/*
 *  Generated by CoffeeScript 1.3.3
 *
 *  Original code from:
 *  https://github.com/pragmaticly/smart-time-ago
 * 
 *  This version adapted for requirejs / l10n.js
 *  
 *  Changes copyright to:
 *  Andrew Baxter <andy@highfellow.org> December 2012.
 * 
 *  Original license text:
 * 
 *  Copyright (c) 2012 Terry Tai, Pragmatic.ly (terry@pragmatic.ly, https://pragmatic.ly/)
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
 */

// allows use with nodejs, using the amdefine module.
if (typeof define !== 'function') {
      var define = require('amdefine')(module);
}

define(['l10n'],
    function(l10n) {
      function TimeAgo(element, options) {
        this.startInterval = 30000;
        this.init(element, options);
      }
  
      TimeAgo.prototype.init = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.timeago.defaults, options);
        this.updateTime();
        return this.startTimer();
      };
  
      TimeAgo.prototype.startTimer = function() {
        var self;
        self = this;
        return this.interval = setInterval((function() {
          return self.refresh();
        }), this.startInterval);
      };
  
      TimeAgo.prototype.stopTimer = function() {
        return clearInterval(this.interval);
      };
  
      TimeAgo.prototype.restartTimer = function() {
        this.stopTimer();
        return this.startTimer();
      };
  
      TimeAgo.prototype.refresh = function() {
        this.updateTime();
        return this.updateInterval();
      };
  
      TimeAgo.prototype.updateTime = function() {
        var self;
        self = this;
        return this.$element.findAndSelf(this.options.selector).each(function() {
          var timeAgoInWords;
          timeAgoInWords = self.timeAgoInWords($(this).attr(self.options.attr));
          return $(this).html(timeAgoInWords);
        });
      };
  
      TimeAgo.prototype.updateInterval = function() {
        var filter, newestTime, newestTimeInMinutes, newestTimeSrc;
        if (this.$element.findAndSelf(this.options.selector).length > 0) {
          if (this.options.dir === "up") {
            filter = ":first";
          } else if (this.options.dir === "down") {
            filter = ":last";
          }
          newestTimeSrc = this.$element.findAndSelf(this.options.selector).filter(filter).attr(this.options.attr);
          newestTime = this.parse(newestTimeSrc);
          newestTimeInMinutes = this.getTimeDistanceInMinutes(newestTime);
          var unit = 0;
          while (true) {
            if (l10nUnits[unit].updateStop || newestTimeInMinutes < l10nUnits[unit + 1].minutes) {
              if (this.startInterval !== l10nUnits[unit].minutes * 30000) {
                this.startInterval = l10nUnits[unit].minutes * 30000;
                return this.restartTimer();
              } else {
                return null;
              }
            }
            unit++;
          }
        }
      };
  
      TimeAgo.prototype.timeAgoInWords = function(timeString) {
        var absolutTime;
        absolutTime = this.parse(timeString);
        return this.distanceOfTimeInWords(absolutTime);
      };
  
      TimeAgo.prototype.parse = function(iso8601) {
        var timeStr;
        timeStr = $.trim(iso8601);
        timeStr = timeStr.replace(/\.\d\d\d+/, "");
        timeStr = timeStr.replace(/-/, "/").replace(/-/, "/");
        timeStr = timeStr.replace(/T/, " ").replace(/Z/, " UTC");
        timeStr = timeStr.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
        return new Date(timeStr);
      };
  
      TimeAgo.prototype.getTimeDistanceInMinutes = function(absolutTime) {
        var timeDistance;
        timeDistance = new Date().getTime() - absolutTime.getTime();
        return Math.round((Math.abs(timeDistance) / 1000) / 60);
      };
  
      TimeAgo.prototype.distanceOfTimeInWords = function(absolutTime) {
        var dim;
        dim = this.getTimeDistanceInMinutes(absolutTime);
        console.log(dim);
        if (isNaN(dim)) return "";
        var defaults = $.fn.timeago.defaults;
        if (dim < 1) {
          return l10n.get(defaults.l10nBase + defaults.l10nNow, {}, "now");
        } else {
          var unit = 0;
          var l10nUnits = defaults.l10nUnits;
          var n = 0;
          while (true) {
            if (unit === l10nUnits.length - 1) {
              n = Math.round(dim / l10nUnits[unit].minutes);
              break;
            }
            n = Math.round(dim / l10nUnits[unit].baseMinutes);
            if (n < l10nUnits[unit].base[0]) {
              break;
            }
            unit++;
          }
          return l10n.get(defaults.l10nBase +
            l10nUnits[unit].l10nUnit, {n : n}, 
            "" + n + " minutes ago");
        }
      };

      $.fn.timeago = function(options) {
        if (options == null) {
          options = {};
        }
        return this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data("timeago");
          if (!data) {
            $this.data("timeago", new TimeAgo(this, options));
          }
          if (typeof options === 'string') {
            return data[options]();
          }
        });
      };
    
      $.fn.findAndSelf = function(selector) {
        return this.find(selector).add(this.filter(selector));
      };
    
      $.fn.timeago.Constructor = TimeAgo;
    
      $.fn.timeago.defaults = {
        selector: 'time.timeago',
        attr: 'datetime',
        dir: 'up',
        l10nBase: 'timeAgo', // base l10n token
        l10nNow: 'Now', // token suffix for short times
        l10nUnits:
          [
            { 
              l10nUnit: 'Minutes',
              base: [60], // minutes in an hour
              minutes: 1
            },
            { 
              l10nUnit: 'Hours',
              base: [24] // hours in a day
            },
            {
              l10nUnit: 'Days',
              base: [7], // days in a week.
              updateStop: true // stop incrementing update times here
            },
            {
              l10nUnit: 'Weeks',
              base: 
                [
                  4, // weeks in a 30 day month
                  2 // extra days
                ]
            },
            {
              l10nUnit: 'Months',
              base: 
                [
                  12, // 30 day months in a year
                  0, // extra weeks
                  5, // extra days
                  5, // extra hours
                  48 // extra minutes
                ]
            },
            {
              l10nUnit: 'Years',
              base: null // last one
            }
          ]
      };

      // precalculate length in minutes of each unit on module load.
      var unit = 0;
      var l10nUnits = $.fn.timeago.defaults.l10nUnits;
      while (l10nUnits[unit].base !== null) {
        var base = l10nUnits[unit].base;
        if (l10nUnits[unit + 1].minutes === undefined) {
          l10nUnits[unit + 1].minutes = 0;
        }
        for (var i = 0; i < base.length; i++) {
          l10nUnits[unit + 1].minutes += base[i] * l10nUnits[unit - i].minutes;
        }
        if (unit < l10nUnits.length - 1) {
          l10nUnits[unit].baseMinutes = l10nUnits[unit + 1].minutes / l10nUnits[unit].base[0];
        }
        unit++;
      }

      return TimeAgo;
 
    });

