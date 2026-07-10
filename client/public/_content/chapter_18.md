## Chapter 18: Unit Testing and TDD (pytest, mocking, fixtures, coverage)

Writing robust and reliable software requires more than just writing code; it demands rigorous testing. **Unit testing** is a software testing method where individual units or components of a software are tested. Python provides excellent tools and frameworks to facilitate unit testing, making it an integral part of the development process. This chapter will delve into the principles of unit testing, introduce the popular `pytest` framework, explain concepts like mocking and fixtures, and discuss code coverage.

### The Importance of Unit Testing

Unit tests are small, isolated tests that verify the correctness of individual functions, methods, or classes. They offer several benefits:

*   **Early Bug Detection:** Catch bugs early in the development cycle, where they are cheaper and easier to fix.
*   **Improved Code Quality:** Forces developers to write modular, testable code, leading to better design.
*   **Refactoring Confidence:** Provides a safety net, allowing you to refactor code with confidence that existing functionality remains intact.
*   **Documentation:** Unit tests serve as living documentation, demonstrating how individual components are expected to behave.
*   **Reduced Debugging Time:** When a test fails, it points directly to the faulty unit, significantly reducing debugging effort.

### Test-Driven Development (TDD)

**Test-Driven Development (TDD)** is a software development process that relies on the repetition of a very short development cycle: first, the developer writes an automated test case that defines a desired improvement or new function, then produces the minimum amount of code required to pass that test, and finally refactors the new code to acceptable standards.

The TDD cycle is often summarized as "Red, Green, Refactor":

1.  **Red:** Write a failing test. This ensures the test actually works and that the feature doesn't already exist.
2.  **Green:** Write just enough code to make the test pass. Focus solely on passing the test, not on perfect design.
3.  **Refactor:** Improve the code's design, remove duplication, and enhance readability, all while ensuring the tests continue to pass.

### Introduction to `pytest`

While Python's standard library includes the `unittest` module, `pytest` has become the de facto standard for testing in the Python community due to its simplicity, powerful features, and extensibility.

#### Installation

```bash
pip install pytest
```

#### Basic Usage

`pytest` automatically discovers tests. By default, it looks for files named `test_*.py` or `*_test.py` and functions named `test_*` within those files.

Let's create a simple module `calculator.py`:

```python
# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero!")
    return a / b
```

Now, create a test file `test_calculator.py` in the same directory:

```python
# test_calculator.py
import pytest
from calculator import add, subtract, multiply, divide

def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(3, 5) == -2

def test_multiply():
    assert multiply(2, 3) == 6
    assert multiply(-1, 5) == -5

def test_divide():
    assert divide(6, 3) == 2
    assert divide(5, 2) == 2.5

def test_divide_by_zero_raises_error():
    with pytest.raises(ValueError, match="Cannot divide by zero!"):
        divide(10, 0)
```

To run the tests, simply navigate to the directory containing these files in your terminal and run `pytest`:

```bash
pytest
```

`pytest` will discover and run all tests, providing a clear summary of passed and failed tests.

### `pytest` Features

#### Fixtures

**Fixtures** are functions that `pytest` runs before (and sometimes after) your tests. They are used to set up a baseline environment for tests, such as creating temporary files, setting up database connections, or providing test data. Fixtures promote reusability and make tests cleaner.

Fixtures are defined using the `@pytest.fixture` decorator.

```python
# test_calculator.py (continued)

@pytest.fixture
def sample_numbers():
    return (10, 5) # Returns a tuple of numbers

def test_add_with_fixture(sample_numbers):
    a, b = sample_numbers
    assert add(a, b) == 15

def test_subtract_with_fixture(sample_numbers):
    a, b = sample_numbers
    assert subtract(a, b) == 5
```

`pytest` automatically injects the return value of a fixture into any test function that declares the fixture's name as an argument.

#### Parameterization

`pytest.mark.parametrize` allows you to run the same test function multiple times with different sets of arguments. This is excellent for testing various inputs and edge cases without writing repetitive test code.

```python
# test_calculator.py (continued)

@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300)
])
def test_add_parameterized(a, b, expected):
    assert add(a, b) == expected

@pytest.mark.parametrize("num, denom, expected", [
    (6, 3, 2),
    (5, 2, 2.5),
    (-10, 2, -5)
])
def test_divide_parameterized(num, denom, expected):
    assert divide(num, denom) == expected

@pytest.mark.parametrize("num, denom, exception_type, match_regex", [
    (10, 0, ValueError, "Cannot divide by zero!"),
    (10, "a", TypeError, "unsupported operand type") # This will fail if type hints are not enforced
])
def test_divide_exceptions_parameterized(num, denom, exception_type, match_regex):
    with pytest.raises(exception_type, match=match_regex):
        divide(num, denom)
```

#### Mocking

**Mocking** is the act of replacing parts of your system under test with mock objects that simulate the behavior of real objects. This is crucial for isolating the unit being tested from its dependencies (e.g., databases, external APIs, complex objects).

`pytest` integrates well with Python's built-in `unittest.mock` module.

```python
# my_service.py
import requests

def get_external_data(url):
    response = requests.get(url)
    response.raise_for_status() # Raise an exception for bad status codes
    return response.json()

# test_my_service.py
from unittest.mock import patch
import pytest
from my_service import get_external_data

# Mock the requests.get function
@patch("my_service.requests.get")
def test_get_external_data_success(mock_get):
    # Configure the mock object
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {"data": "mocked data"}

    data = get_external_data("http://example.com/api/data")
    assert data == {"data": "mocked data"}
    mock_get.assert_called_once_with("http://example.com/api/data")

@patch("my_service.requests.get")
def test_get_external_data_failure(mock_get):
    # Simulate an HTTP error
    mock_get.return_value.raise_for_status.side_effect = requests.exceptions.HTTPError

    with pytest.raises(requests.exceptions.HTTPError):
        get_external_data("http://example.com/api/data")
```

`@patch` replaces the `requests.get` function within the `my_service` module with a mock object during the test. This allows you to control its behavior and verify that it was called correctly.

### Code Coverage

**Code coverage** is a metric that measures the percentage of your source code that is executed when your tests run. High code coverage indicates that a large portion of your codebase is being tested, reducing the likelihood of undetected bugs.

The `coverage.py` tool, often used with `pytest` via `pytest-cov`, is excellent for this.

#### Installation

```bash
pip install pytest-cov
```

#### Usage

Run `pytest` with the `--cov` option:

```bash
pytest --cov=.
```

This will run your tests and generate a coverage report, showing which lines of code were executed and which were missed. You can also generate an HTML report for a more detailed view:

```bash
pytest --cov=. --cov-report=html
```

This will create an `htmlcov` directory with an interactive report.

While high coverage is desirable, it's important to remember that 100% coverage does not guarantee 100% bug-free code. It only tells you *what* code was run, not *how well* it was tested. Focus on meaningful tests that cover critical paths and edge cases.

### Conclusion

Unit testing is an indispensable practice for building high-quality software. `pytest` provides a powerful, flexible, and easy-to-use framework for writing and running tests, complemented by features like fixtures for setup, parameterization for varied inputs, and mocking for isolating dependencies. Embracing TDD and monitoring code coverage further enhances the development process, leading to more reliable, maintainable, and robust Python applications. By integrating these practices into your workflow, you'll build software with greater confidence and efficiency.
