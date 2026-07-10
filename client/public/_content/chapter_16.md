## Chapter 16: Exceptions and Tracebacks (Custom exceptions, EAFP vs LBYL)

Robust software must gracefully handle unexpected situations and errors. Python provides a powerful and flexible mechanism for error handling through **exceptions**. This chapter will delve into how exceptions work, how to handle them using `try`, `except`, `else`, and `finally` blocks, how to create custom exception types, and the philosophical debate between "Easier to Ask for Forgiveness than Permission" (EAFP) and "Look Before You Leap" (LBYL) programming styles.

### What are Exceptions?

An **exception** is an event that occurs during the execution of a program that disrupts the normal flow of instructions. When a Python script encounters a situation that it cannot cope with, it raises an exception. If this exception is not handled, the program will terminate and print a **traceback**.

Common built-in exceptions include `TypeError`, `ValueError`, `FileNotFoundError`, `ZeroDivisionError`, `IndexError`, and `KeyError`.

```python
# Example of an unhandled exception
def divide(a, b):
    return a / b

# print(divide(10, 0)) # This will raise a ZeroDivisionError and terminate the program

# Example of a traceback
# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
#   File "<stdin>", line 2, in divide
# ZeroDivisionError: division by zero
```

### Handling Exceptions: `try`, `except`, `else`, `finally`

Python uses `try...except` blocks to catch and handle exceptions. This allows your program to recover from errors or at least exit gracefully.

#### `try` and `except`

The `try` block contains the code that might raise an exception. The `except` block contains the code that will be executed if a specific exception (or any exception, if not specified) occurs in the `try` block.

```python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError:
        print("Error: Invalid input types. Both arguments must be numbers.")
        return None
    except Exception as e: # Catch any other unexpected exception
        print(f"An unexpected error occurred: {e}")
        return None
    else:
        return result

print(safe_divide(10, 2)) # Output: 5.0
print(safe_divide(10, 0)) # Output: Error: Cannot divide by zero!
print(safe_divide(10, "a")) # Output: Error: Invalid input types. Both arguments must be numbers.
```

Key points:

*   You can have multiple `except` blocks to handle different types of exceptions.
*   The `except` blocks are checked in order. The first matching `except` block is executed.
*   `except Exception as e:` is a general catch-all. It's good practice to catch specific exceptions first and then a general `Exception` as a fallback.
*   You can catch multiple exceptions in a single `except` block by providing a tuple of exception types: `except (ZeroDivisionError, TypeError):`.

#### `else` Block

The `else` block is executed only if the `try` block completes without raising an exception.

```python
try:
    num1 = int(input("Enter a number: "))
    num2 = int(input("Enter another number: "))
    result = num1 / num2
except ValueError:
    print("Invalid input. Please enter integers only.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
else:
    print(f"Division successful. Result: {result}")
```

#### `finally` Block

The `finally` block is always executed, regardless of whether an exception occurred or not. It's typically used for cleanup operations that must happen, such as closing files or releasing resources.

```python
file = None
try:
    file = open("my_data.txt", "r")
    content = file.read()
    print(content)
except FileNotFoundError:
    print("File not found.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if file:
        file.close()
        print("File closed.")
```

As seen in Chapter 14, context managers (`with` statement) are a more Pythonic way to handle resource cleanup, often making `finally` blocks unnecessary for such tasks.

### Raising Exceptions

You can explicitly raise exceptions using the `raise` statement. This is useful when your code detects an error condition that it cannot handle.

```python
def validate_age(age):
    if not isinstance(age, (int, float)):
        raise TypeError("Age must be a number.")
    if age < 0:
        raise ValueError("Age cannot be negative.")
    if age > 120:
        raise ValueError("Age seems unrealistic.")
    return age

try:
    my_age = validate_age(-5)
    print(f"Valid age: {my_age}")
except (TypeError, ValueError) as e:
    print(f"Validation error: {e}")
```

### Custom Exceptions

For more specific error conditions in your application, you can define your own custom exception classes. Custom exceptions should inherit from the built-in `Exception` class (or a more specific exception like `ValueError` or `IOError`).

```python
class InvalidCredentialsError(Exception):
    """Custom exception raised for invalid login credentials."""
    def __init__(self, message="Invalid username or password.", username=None):
        self.message = message
        self.username = username
        super().__init__(self.message)

def login(username, password):
    if username != "admin" or password != "password123":
        raise InvalidCredentialsError(username=username)
    print(f"Welcome, {username}!")

try:
    login("user", "wrong_pass")
except InvalidCredentialsError as e:
    print(f"Login failed for user '{e.username}': {e.message}")
```

Custom exceptions make your code more readable and allow callers to catch and handle specific error scenarios more precisely.

### EAFP vs. LBYL

There are two main philosophies for handling potential errors in Python:

#### 1. Look Before You Leap (LBYL)

LBYL involves explicitly checking for conditions before attempting an operation that might fail. This often uses `if/else` statements.

```python
# LBYL example
my_dict = {"a": 1, "b": 2}
key = "c"

if key in my_dict:
    value = my_dict[key]
    print(f"Value for {key}: {value}")
else:
    print(f"Key {key} not found.")
```

**Pros:** Code can be very explicit about what it's checking.
**Cons:** Can lead to more verbose code, especially if multiple checks are needed. In concurrent environments, the state might change between the check and the action, leading to race conditions.

#### 2. Easier to Ask for Forgiveness than Permission (EAFP)

EAFP involves attempting an operation and then catching any exceptions that might arise. This is generally considered more Pythonic, especially for operations that are expected to succeed most of the time.

```python
# EAFP example
my_dict = {"a": 1, "b": 2}
key = "c"

try:
    value = my_dict[key]
    print(f"Value for {key}: {value}")
except KeyError:
    print(f"Key {key} not found.")
```

**Pros:** Often leads to cleaner, more concise code. Avoids race conditions by attempting the operation directly. Exceptions are designed for handling unexpected events, making this a natural fit.
**Cons:** Can be less efficient if exceptions are raised very frequently, as exception handling has some overhead. Can sometimes obscure the normal flow of logic if overused or poorly structured.

**When to use which:**

*   **EAFP is generally preferred in Python** for situations where the "failure" is not truly exceptional but an expected alternative outcome (e.g., a key not being in a dictionary). It's often more idiomatic and can be more efficient if the success path is common.
*   **LBYL might be appropriate** when the cost of an exception is very high (e.g., a very complex setup/teardown) or when the check is very cheap and the failure is truly rare and indicates a serious problem.

### Conclusion

Exceptions are a cornerstone of robust Python programming, providing a structured way to handle errors and unexpected events. By mastering `try...except...else...finally` blocks, creating custom exceptions, and understanding the EAFP philosophy, you can write more resilient, maintainable, and Pythonic code that gracefully navigates the complexities of real-world applications.
