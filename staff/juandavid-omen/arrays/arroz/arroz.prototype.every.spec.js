"use strict";

describe("Arroz.prototype.every", function() {
    it("returns true if every element in the provided array satisfies the provided testing function", function () {
      var array = new Arroz(55, 12, 98, 130, 44);

      var result = array.every(function(element) {
        return element > 10;
      });

      expect(result).toBe(true);
    });

    it("returns false if any elements in the provided array do not satisfy the provided testing function", function () {
      var array = new Arroz(5, 12, 8, 130, 44);

      var result = array.every(function(element) {
        element > 6;
      });

      expect(result).toBe(false);
    });

    it("returns false if the length of the array is 0", function() {
      var array = new Arroz();
      
      var result = array.every(function(element) {
        element > 0;
      });

      expect(result).toBe(false);
    });
});
