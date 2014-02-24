(function() {
  'use strict';
  var Servo;

  Servo = source("servo");

  describe("Cylon.Drivers.GPIO.Servo", function() {
    var driver;
    driver = new Servo({
      name: 'serv',
      device: {
        connection: 'connect',
        pin: 13
      }
    });
    describe("constructor", function() {
      it("sets @pin to the passed device's pin", function() {
        return expect(driver.pin).to.be.eql(13);
      });
      it("sets @angleValue to 0 by default", function() {
        return expect(driver.angleValue).to.be.eql(0);
      });
      context("if a servo range is supplied", function() {
        return it("@angleRange is set to provided range", function() {
          var new_driver;
          new_driver = new Servo({
            name: 'serv',
            device: {
              connection: 'connect',
              pin: 13
            },
            extraParams: {
              range: {
                min: 0,
                max: 180
              }
            }
          });
          expect(new_driver.angleRange.min).to.be.eql(0);
          return expect(new_driver.angleRange.max).to.be.eql(180);
        });
      });
      return context("if no servo range is supplied", function() {
        return it("@angleRange defaults to 30-150", function() {
          expect(driver.angleRange.min).to.be.eql(30);
          return expect(driver.angleRange.max).to.be.eql(150);
        });
      });
    });
    it("contains an array of servo commands", function() {
      return expect(driver.commands()).to.be.eql(['angle', 'currentAngle']);
    });
    describe('#currentAngle', function() {
      return it("returns the current value of the servo's angle", function() {
        expect(driver.currentAngle()).to.be.eql(0);
        driver.angleValue = 10;
        return expect(driver.currentAngle()).to.be.eql(10);
      });
    });
    describe("#angle", function() {
      var connection, safeAngle;
      connection = null;
      safeAngle = null;
      before(function() {
        safeAngle = sinon.stub(driver, 'safeAngle').returns(120);
        connection = {
          servoWrite: sinon.spy()
        };
        driver.connection = connection;
        return driver.angle(120);
      });
      after(function() {
        return driver.safeAngle.restore();
      });
      it("ensures the value is safe", function() {
        assert(safeAngle.calledOnce);
        return assert(safeAngle.calledWith(120));
      });
      it("writes the value to the servo", function() {
        assert(connection.servoWrite.calledOnce);
        return assert(connection.servoWrite.calledWith(13, 120));
      });
      return it("sets @angleValue to the new servo value", function() {
        return expect(driver.angleValue).to.be.eql(120);
      });
    });
    return describe("#safeAngle", function() {
      before(function() {
        return driver.angleRange = {
          min: 30,
          max: 130
        };
      });
      context("when passed a value below the servo's range min", function() {
        return it("returns the range's min value", function() {
          return expect(driver.safeAngle(10)).to.be.eql(30);
        });
      });
      context("when passed a value above the servo's range max", function() {
        return it("returns the range's max value", function() {
          return expect(driver.safeAngle(180)).to.be.eql(130);
        });
      });
      return context("when passed a value within the servo's range", function() {
        return it("returns the value", function() {
          return expect(driver.safeAngle(50)).to.be.eql(50);
        });
      });
    });
  });

}).call(this);
