var persist = require("../../lib/persist");
var nodeunit = require("nodeunit");
var testUtils = require("../../test_helpers/test_utils");

exports['Delete'] = nodeunit.testCase({
  setUp: function(callback) {
    var self = this;

    testUtils.connect(persist, function(connection) {
      self.connection = connection;

      self.Person = persist.define("Person", {
        "name": "string"
      });

      self.person1 = new self.Person({ name: "bob" });
      self.person2 = new self.Person({ name: "john" });
      self.person1.save(self.connection, function(err, p1) {
        self.person2.save(self.connection, function(err, p2) {
          callback();
        });
      });
    });
  },

  "delete with no associations": function(test) {
    this.person1.delete(function(err, deletedPerson) {
      test.ifError(err);
      test.done();
    });
  },

  "delete all of a certain type": function(test) {
    var self = this;
    this.Person.using(this.connection).deleteAll(function(err, count) {
      test.equal(count, 2);
      self.Person.using(self.connection).all(function(err, rows) {
        test.ifError(err);
        test.equal(rows.length, 0);
        test.done();
      });
    })
  }
});