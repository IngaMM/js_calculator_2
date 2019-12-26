var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Calculator = function (_React$Component) {
  _inherits(Calculator, _React$Component);

  function Calculator(props) {
    _classCallCheck(this, Calculator);

    var _this = _possibleConstructorReturn(this, (Calculator.__proto__ || Object.getPrototypeOf(Calculator)).call(this, props));

    _this.state = {
      numberToDisplay: "0",
      numberArray: [],
      nextOperand: 0,
      result: 0,
      operation: "",
      previousOperation: "",
      adder: 0,
      previousKeyWasEqual: false,
      previousKeyWasOperation: false
    };
    _this.buttonFunction = _this.buttonFunction.bind(_this);
    _this.numberKeyFunction = _this.numberKeyFunction.bind(_this);
    _this.workWithNewNumber = _this.workWithNewNumber.bind(_this);
    _this.operationKeyFunction = _this.operationKeyFunction.bind(_this);
    _this.setPreviousKeys = _this.setPreviousKeys.bind(_this);
    _this.handleFirstOperation = _this.handleFirstOperation.bind(_this);
    _this.addAfterMultiplication = _this.addAfterMultiplication.bind(_this);
    _this.twoOperationKeys = _this.twoOperationKeys.bind(_this);
    _this.equalKeyFunction = _this.equalKeyFunction.bind(_this);
    _this.handleFirstEqual = _this.handleFirstEqual.bind(_this);
    return _this;
  }

  _createClass(Calculator, [{
    key: "buttonFunction",
    value: function buttonFunction(e) {
      if (e.target.id == "clear") {
        this.setState({
          numberToDisplay: "0",
          numberArray: [],
          nextOperand: 0,
          result: 0,
          operation: "",
          previousOperation: "",
          adder: 0,
          previousKeyWasEqual: false,
          previousKeyWasOperation: false
        });
      } else if (e.target.className === "numberButtons") {
        this.numberKeyFunction(e.target.innerText);
      } else if (e.target.className === "operationButtons") {
        this.operationKeyFunction(e.target.id);
      } else if (e.target.id === "equals") {
        this.equalKeyFunction();
      }
    }
  }, {
    key: "numberKeyFunction",
    value: function numberKeyFunction(num) {
      var indexOfDecimalPoint = this.state.numberArray.indexOf(".");
      if (!(num === "." && indexOfDecimalPoint !== -1) && this.state.numberArray.length < 11) {
        // Disable pressing dot for a second time & disable entering more than 11 characters (incl. .)
        this.workWithNewNumber(num);
        this.setPreviousKeys(false, false);
      }
    }
  }, {
    key: "workWithNewNumber",
    value: function workWithNewNumber(num) {
      var arr = [];
      if (num == "." && this.state.numberArray.length === 0) {
        arr = ["0", "."]; // Keep leading 0 of 0.XX
      } else {
        if (this.state.previousKeyWasOperation === true || this.state.previousKeyWasEqual === true) {
          arr = [num];
        } else {
          if (this.state.numberToDisplay === "0" && num === "0") {
            arr = [num];
          } else {
            arr = this.state.numberArray.concat(num);
          }
        }
      }
      var slicedNumber = arr.join("").slice(0, 11); // Use max. 11 characters (incl. .)
      this.setState({
        numberToDisplay: slicedNumber,
        numberArray: slicedNumber.split(""),
        nextOperand: Number(slicedNumber.split("").join(""))
      });
    }
  }, {
    key: "setPreviousKeys",
    value: function setPreviousKeys(equal, operation) {
      this.setState({
        previousKeyWasEqual: equal,
        previousKeyWasOperation: operation
      });
    }
  }, {
    key: "operationKeyFunction",
    value: function operationKeyFunction(nextOperation) {
      var _this2 = this;

      if (this.state.operation === "") {
        this.handleFirstOperation(nextOperation); // Special treatment for first operation and if operation is called immediately after pressing the equal key
      } else if ((this.state.operation === "add" || this.state.operation === "subtract") && (nextOperation === "multiply" || nextOperation === "divide") && this.state.previousKeyWasOperation === false) {
        this.addAfterMultiplication(nextOperation); //store values that need to be added later
      } else {
        if (this.state.previousKeyWasOperation === true) {
          this.twoOperationKeys(nextOperation); //special treatment if operation is called immediately after pressing another operation key
        } else {
          if (nextOperation === "add" || nextOperation === "subtract" || nextOperation === "") {
            this.setState({
              result: operate(this.state.result, this.state.nextOperand, this.state.operation) + this.state.adder,
              numberArray: [],
              previousOperation: this.state.operation,
              operation: nextOperation,
              adder: 0
            }, function () {
              _this2.workWithNewNumber(_this2.state.result);
              _this2.setPreviousKeys(false, true);
            });
          } else {
            this.setState({
              result: operate(this.state.result, this.state.nextOperand, this.state.operation),
              numberArray: [],
              previousOperation: this.state.operation,
              operation: nextOperation
            }, function () {
              _this2.workWithNewNumber(_this2.state.result);
              _this2.setPreviousKeys(false, true);
            });
          }
        }
      }
    }
  }, {
    key: "handleFirstOperation",
    value: function handleFirstOperation(nextOperation) {
      var _this3 = this;

      if (this.state.previousKeyWasEqual == false) {
        this.setState({
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          result: this.state.nextOperand
        }, function () {
          _this3.workWithNewNumber(_this3.state.result);
          _this3.setPreviousKeys(false, true);
        });
      } else {
        //If operation is called immediately after pressing equal key: Result on the display remains unchanged.
        this.setState({
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation
        }, function () {
          _this3.workWithNewNumber(_this3.state.result);
          _this3.setPreviousKeys(false, true);
        });
      }
    }
  }, {
    key: "addAfterMultiplication",
    value: function addAfterMultiplication(nextOperation) {
      var _this4 = this;

      if (this.state.operation === "add") {
        this.setState({
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          adder: this.state.result,
          result: this.state.nextOperand
        }, function () {
          _this4.workWithNewNumber(Math.abs(_this4.state.result));
          _this4.setPreviousKeys(false, true);
        });
      } else {
        this.setState({
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          adder: this.state.result,
          result: -this.state.nextOperand
        }, function () {
          _this4.workWithNewNumber(Math.abs(_this4.state.result));
          _this4.setPreviousKeys(false, true);
        });
      }
    }
  }, {
    key: "twoOperationKeys",
    value: function twoOperationKeys(nextOperation) {
      var _this5 = this;

      this.setState({
        numberArray: [],
        previousOperation: this.state.operation,
        operation: nextOperation,
        result: this.state.nextOperand
      }, function () {
        _this5.workWithNewNumber(_this5.state.result);
        _this5.setPreviousKeys(false, true);
      });
    }
  }, {
    key: "equalKeyFunction",
    value: function equalKeyFunction() {
      var _this6 = this;

      if (this.state.operation === "") {
        this.handleFirstEqual(); // Special treatment if equal key is pressed directly after entering a number or directly after pressing an operator or if it pressed immediately after pressing the equal key
      } else {
        this.setState({
          result: operate(this.state.result, this.state.nextOperand, this.state.operation) + this.state.adder,
          numberArray: [],
          previousOperation: this.state.operation,
          operation: "",
          adder: 0
        }, function () {
          _this6.workWithNewNumber(_this6.state.result);
          _this6.setPreviousKeys(true, false);
        });
      }
    }
  }, {
    key: "handleFirstEqual",
    value: function handleFirstEqual() {
      var _this7 = this;

      if (this.state.previousKeyWasEqual == false) {
        this.setState({
          numberArray: [],
          previousOperation: this.state.operation,
          operation: "",
          result: this.state.nextOperand
        }, function () {
          _this7.workWithNewNumber(_this7.state.result);
          _this7.setPreviousKeys(true, false);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Display, { numberToDisplay: this.state.numberToDisplay }),
        React.createElement(Buttons, { onClick: this.buttonFunction })
      );
    }
  }]);

  return Calculator;
}(React.Component);

var numberButtons = [{
  id: "seven",
  text: "7"
}, {
  id: "eight",
  text: "8"
}, {
  id: "nine",
  text: "9"
}, {
  id: "four",
  text: "4"
}, {
  id: "five",
  text: "5"
}, {
  id: "six",
  text: "6"
}, {
  id: "one",
  text: "1"
}, {
  id: "two",
  text: "2"
}, {
  id: "three",
  text: "3"
}, {
  id: "zero",
  text: "0"
}];

var operatorButtons = [{
  id: "divide",
  text: ":"
}, {
  id: "multiply",
  text: "*"
}, {
  id: "subtract",
  text: "-"
}, {
  id: "add",
  text: "+"
}];

function operate(a, b, str) {
  switch (str) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
    default:
      return "This operation is not defined!";
  }
}

var Buttons = function Buttons(props) {
  return React.createElement(
    "div",
    { id: "button_container" },
    operatorButtons.map(function (item, index) {
      return React.createElement(
        "div",
        { id: item.id, "class": "operationButtons", onClick: props.onClick },
        " ",
        item.text,
        " "
      );
    }),
    React.createElement(
      "div",
      { id: "clear", onClick: props.onClick },
      " ",
      "C",
      " "
    ),
    numberButtons.map(function (item, index) {
      return React.createElement(
        "div",
        { id: item.id, className: "numberButtons", onClick: props.onClick },
        " ",
        item.text,
        " "
      );
    }),
    React.createElement(
      "div",
      { id: "decimal", className: "numberButtons", onClick: props.onClick },
      " ",
      ".",
      " "
    ),
    React.createElement(
      "div",
      { id: "equals", onClick: props.onClick },
      " ",
      "=",
      " "
    )
  );
};

var Display = function Display(props) {
  return React.createElement(
    "div",
    { id: "display" },
    props.numberToDisplay
  );
};

ReactDOM.render(React.createElement(Calculator, null), document.getElementById("calculator"));