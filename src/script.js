class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.buttonFunction = this.buttonFunction.bind(this);
    this.numberKeyFunction = this.numberKeyFunction.bind(this);
    this.workWithNewNumber = this.workWithNewNumber.bind(this);
    this.operationKeyFunction = this.operationKeyFunction.bind(this);
    this.setPreviousKeys = this.setPreviousKeys.bind(this);
    this.handleFirstOperation = this.handleFirstOperation.bind(this);
    this.addAfterMultiplication = this.addAfterMultiplication.bind(this);
    this.twoOperationKeys = this.twoOperationKeys.bind(this);
    this.equalKeyFunction = this.equalKeyFunction.bind(this);
    this.handleFirstEqual = this.handleFirstEqual.bind(this);
  }

  buttonFunction(e) {
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

  numberKeyFunction(num) {
    let indexOfDecimalPoint = this.state.numberArray.indexOf(".");
    if (
      !(num === "." && indexOfDecimalPoint !== -1) &&
      this.state.numberArray.length < 11
    ) {
      // Disable pressing dot for a second time & disable entering more than 11 characters (incl. .)
      this.workWithNewNumber(num);
      this.setPreviousKeys(false, false);
    }
  }

  workWithNewNumber(num) {
    let arr = [];
    if (num == "." && this.state.numberArray.length === 0) {
      arr = ["0", "."]; // Keep leading 0 of 0.XX
    } else {
      if (
        this.state.previousKeyWasOperation === true ||
        this.state.previousKeyWasEqual === true
      ) {
        arr = [num];
      } else {
        if (this.state.numberToDisplay === "0" && num === "0") {
          arr = [num];
        } else {
          arr = this.state.numberArray.concat(num);
        }
      }
    }
    let slicedNumber = arr.join("").slice(0, 11); // Use max. 11 characters (incl. .)
    this.setState({
      numberToDisplay: slicedNumber,
      numberArray: slicedNumber.split(""),
      nextOperand: Number(slicedNumber.split("").join(""))
    });
  }

  setPreviousKeys(equal, operation) {
    this.setState({
      previousKeyWasEqual: equal,
      previousKeyWasOperation: operation
    });
  }

  operationKeyFunction(nextOperation) {
    if (this.state.operation === "") {
      this.handleFirstOperation(nextOperation); // Special treatment for first operation and if operation is called immediately after pressing the equal key
    } else if (
      (this.state.operation === "add" || this.state.operation === "subtract") &&
      (nextOperation === "multiply" || nextOperation === "divide") &&
      this.state.previousKeyWasOperation === false
    ) {
      this.addAfterMultiplication(nextOperation); //store values that need to be added later
    } else {
      if (this.state.previousKeyWasOperation === true) {
        this.twoOperationKeys(nextOperation); //special treatment if operation is called immediately after pressing another operation key
      } else {
        if (
          nextOperation === "add" ||
          nextOperation === "subtract" ||
          nextOperation === ""
        ) {
          this.setState(
            {
              result:
                operate(
                  this.state.result,
                  this.state.nextOperand,
                  this.state.operation
                ) + this.state.adder,
              numberArray: [],
              previousOperation: this.state.operation,
              operation: nextOperation,
              adder: 0
            },
            () => {
              this.workWithNewNumber(this.state.result);
              this.setPreviousKeys(false, true);
            }
          );
        } else {
          this.setState(
            {
              result: operate(
                this.state.result,
                this.state.nextOperand,
                this.state.operation
              ),
              numberArray: [],
              previousOperation: this.state.operation,
              operation: nextOperation
            },
            () => {
              this.workWithNewNumber(this.state.result);
              this.setPreviousKeys(false, true);
            }
          );
        }
      }
    }
  }

  handleFirstOperation(nextOperation) {
    if (this.state.previousKeyWasEqual == false) {
      this.setState(
        {
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          result: this.state.nextOperand
        },
        () => {
          this.workWithNewNumber(this.state.result);
          this.setPreviousKeys(false, true);
        }
      );
    } else {
      //If operation is called immediately after pressing equal key: Result on the display remains unchanged.
      this.setState(
        {
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation
        },
        () => {
          this.workWithNewNumber(this.state.result);
          this.setPreviousKeys(false, true);
        }
      );
    }
  }

  addAfterMultiplication(nextOperation) {
    if (this.state.operation === "add") {
      this.setState(
        {
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          adder: this.state.result,
          result: this.state.nextOperand
        },
        () => {
          this.workWithNewNumber(Math.abs(this.state.result));
          this.setPreviousKeys(false, true);
        }
      );
    } else {
      this.setState(
        {
          numberArray: [],
          previousOperation: this.state.operation,
          operation: nextOperation,
          adder: this.state.result,
          result: -this.state.nextOperand
        },
        () => {
          this.workWithNewNumber(Math.abs(this.state.result));
          this.setPreviousKeys(false, true);
        }
      );
    }
  }

  twoOperationKeys(nextOperation) {
    this.setState(
      {
        numberArray: [],
        previousOperation: this.state.operation,
        operation: nextOperation,
        result: this.state.nextOperand
      },
      () => {
        this.workWithNewNumber(this.state.result);
        this.setPreviousKeys(false, true);
      }
    );
  }

  equalKeyFunction() {
    if (this.state.operation === "") {
      this.handleFirstEqual(); // Special treatment if equal key is pressed directly after entering a number or directly after pressing an operator or if it pressed immediately after pressing the equal key
    } else {
      this.setState(
        {
          result:
            operate(
              this.state.result,
              this.state.nextOperand,
              this.state.operation
            ) + this.state.adder,
          numberArray: [],
          previousOperation: this.state.operation,
          operation: "",
          adder: 0
        },
        () => {
          this.workWithNewNumber(this.state.result);
          this.setPreviousKeys(true, false);
        }
      );
    }
  }

  handleFirstEqual() {
    if (this.state.previousKeyWasEqual == false) {
      this.setState(
        {
          numberArray: [],
          previousOperation: this.state.operation,
          operation: "",
          result: this.state.nextOperand
        },
        () => {
          this.workWithNewNumber(this.state.result);
          this.setPreviousKeys(true, false);
        }
      );
    }
  }

  render() {
    return (
      <div>
        <Display numberToDisplay={this.state.numberToDisplay} />
        <Buttons onClick={this.buttonFunction} />
      </div>
    );
  }
}

const numberButtons = [
  {
    id: "seven",
    text: "7"
  },
  {
    id: "eight",
    text: "8"
  },
  {
    id: "nine",
    text: "9"
  },
  {
    id: "four",
    text: "4"
  },
  {
    id: "five",
    text: "5"
  },
  {
    id: "six",
    text: "6"
  },
  {
    id: "one",
    text: "1"
  },
  {
    id: "two",
    text: "2"
  },
  {
    id: "three",
    text: "3"
  },
  {
    id: "zero",
    text: "0"
  }
];

const operatorButtons = [
  {
    id: "divide",
    text: ":"
  },
  {
    id: "multiply",
    text: "*"
  },
  {
    id: "subtract",
    text: "-"
  },
  {
    id: "add",
    text: "+"
  }
];

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

const Buttons = props => {
  return (
    <div id="button_container">
      {operatorButtons.map((item, index) => (
        <div id={item.id} class="operationButtons" onClick={props.onClick}>
          {" "}
          {item.text}{" "}
        </div>
      ))}

      <div id="clear" onClick={props.onClick}>
        {" "}
        C{" "}
      </div>

      {numberButtons.map((item, index) => (
        <div id={item.id} className="numberButtons" onClick={props.onClick}>
          {" "}
          {item.text}{" "}
        </div>
      ))}

      <div id="decimal" className="numberButtons" onClick={props.onClick}>
        {" "}
        .{" "}
      </div>

      <div id="equals" onClick={props.onClick}>
        {" "}
        ={" "}
      </div>
    </div>
  );
};

const Display = props => {
  return <div id="display">{props.numberToDisplay}</div>;
};

ReactDOM.render(<Calculator />, document.getElementById("calculator"));
