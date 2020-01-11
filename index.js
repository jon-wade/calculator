var emptyState = { displayValue: '0', firstOperand: null, waitingForSecondOperand: false, operator: null }
var state = JSON.parse(JSON.stringify(emptyState)) // take a deep clone of state object
var el = document.getElementById('error')

function decimal(dot) {
  hideError()
  if (state.waitingForSecondOperand) return
  (!state.displayValue.includes(dot)) ? state.displayValue += dot : null
}

function digit(digit) {
  hideError()
  if (state.waitingForSecondOperand) {
    state.displayValue = digit
    state.waitingForSecondOperand = false
  } else {
    state.displayValue = state.displayValue === '0' ? digit : state.displayValue + digit
  }
}

function hideError() { el.classList.add("hidden") }
function showError() { el.classList.remove("hidden") }

function handleOperator(nextOperator) {
  hideError()
  var inputValue = parseFloat(state.displayValue)

  if (state.operator && state.waitingForSecondOperand)  {
    state.operator = nextOperator
    state.waitingForSecondOperand = state.operator !== '√' // the square root function doesn't require a second operand
    return
  }

  if (state.firstOperand == null) {
    state.firstOperand = inputValue
  } else if (state.operator) {
    var currentValue = state.firstOperand || 0
    // check for illegal input
    if (
      (inputValue === 0 && (state.operator === '/' || state.operator === '%')) ||
      (currentValue < 0 && state.operator === '√') ||
      (currentValue === 0 && inputValue === 0 && state.operator === '^')
    ) {
      resetCalculator()
      showError()
      return
    }

    var result = performCalculation(currentValue, inputValue, state.operator)
    state.displayValue = String(result)
    state.firstOperand = result
  }

  state.operator = nextOperator
  state.waitingForSecondOperand = state.operator !== '√' // the square root function doesn't require a second operand
}

function performCalculation(first, second, operator) {
  switch (operator) {
    case '/': return first / second
    case '*': return first * second
    case '+': return first + second
    case '-': return first - second
    case '^': return Math.pow(first, second)
    case '√': return Math.sqrt(first)
    case '%': return first % second
    case '=': return second
  }
}

function resetCalculator() {
  hideError()
  state = JSON.parse(JSON.stringify(emptyState)) // take a deep clone of state object
}

function updateDisplay() {
  var display = document.querySelector('.calculator-screen')
  display.value = state.displayValue
}

updateDisplay()

var keys = document.querySelector('.calculator-keys')

keys.addEventListener('click', function (e) {
  if (!e.target.matches('button')) return

  if (e.target.classList.contains('operator')) {
    handleOperator(e.target.value)
  } else if (e.target.classList.contains('decimal')) {
    decimal(e.target.value)
  } else if (e.target.classList.contains('all-clear')) {
    resetCalculator()
  } else {
    digit(e.target.value)
  }

  updateDisplay()
})
