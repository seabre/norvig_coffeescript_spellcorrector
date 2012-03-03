(function() {
  var alphabet, edits1, known, known_edits2, model;

  Array.prototype.unique = function() {
    var key, output, value, _ref, _results;
    output = {};
    for (key = 0, _ref = this.length; 0 <= _ref ? key < _ref : key > _ref; 0 <= _ref ? key++ : key--) {
      output[this[key]] = this[key];
    }
    _results = [];
    for (key in output) {
      value = output[key];
      _results.push(value);
    }
    return _results;
  };

  Array.prototype.flatten = function() {
    var _ref;
    return (_ref = []).concat.apply(_ref, this);
  };

  model = (function() {
    var json;
    json = null;
    $.ajax({
      async: false,
      global: false,
      url: "data/model.json",
      dataType: "json",
      success: function(data) {
        return json = data;
      }
    });
    return json;
  })();

  alphabet = "abcdefghijklmnopqrstuvwxyz";

  edits1 = function(word) {
    var a, c, deletes, i, inserts, replaces, splits, transposes;
    splits = (function() {
      var _ref, _results;
      _results = [];
      for (i = 0, _ref = word.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        _results.push([word.slice(0, i), word.slice(i)]);
      }
      return _results;
    })();
    deletes = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = splits.length; _i < _len; _i++) {
        a = splits[_i];
        if (a[1]) _results.push(a[0] + a[1].slice(1));
      }
      return _results;
    })();
    transposes = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = splits.length; _i < _len; _i++) {
        a = splits[_i];
        if (a[1].length > 1) {
          _results.push(a[0] + a[1][1] + a[1][0] + a[1].slice(2));
        }
      }
      return _results;
    })();
    replaces = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = alphabet.length; _i < _len; _i++) {
        c = alphabet[_i];
        _results.push((function() {
          var _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = splits.length; _j < _len2; _j++) {
            a = splits[_j];
            if (a[1].length > 0) _results2.push(a[0] + c + a[1].slice(1));
          }
          return _results2;
        })());
      }
      return _results;
    })()).flatten();
    inserts = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = alphabet.length; _i < _len; _i++) {
        c = alphabet[_i];
        _results.push((function() {
          var _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = splits.length; _j < _len2; _j++) {
            a = splits[_j];
            _results2.push(a[0] + c + a[1]);
          }
          return _results2;
        })());
      }
      return _results;
    })()).flatten();
    return [deletes, transposes, replaces, inserts].flatten().unique();
  };

  known_edits2 = function(word) {
    var e1, e2, result;
    result = ((function() {
      var _i, _len, _ref, _results;
      _ref = edits1(e1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e2 = _ref[_i];
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = edits1(word);
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            e1 = _ref2[_j];
            if (e2 in model) _results2.push(e2);
          }
          return _results2;
        })());
      }
      return _results;
    })()).flatten().unique();
    if (result.length < 1) {
      return null;
    } else {
      return result;
    }
  };

  known = function(words) {
    var result, w;
    result = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        w = words[_i];
        if (w in model) _results.push(w);
      }
      return _results;
    })()).unique();
    if (result.length < 1) {
      return null;
    } else {
      return result;
    }
  };

  this.correct = function(word) {
    var candidates, maxv, w, _i, _len;
    candidates = known([word]) || known(edits1(word)) || known_edits2(word) || [word];
    maxv = ["", 0];
    for (_i = 0, _len = candidates.length; _i < _len; _i++) {
      w = candidates[_i];
      if (model[w] > maxv[1]) {
        maxv[0] = w;
        maxv[1] = model[w];
      }
    }
    return maxv[0];
  };

}).call(this);
