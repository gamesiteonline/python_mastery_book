## Chapter 4: Functions and Scope

Functions are the building blocks of modular and reusable code in Python. They allow you to encapsulate a block of code that performs a specific task, making your programs more organized, readable, and maintainable. This chapter will cover function definition, `lambda` expressions, argument passing mechanisms (`*args` and `**kwargs`), closures, and the LEGB rule for scope resolution.

### Defining Functions: The `def` Keyword

Functions are defined using the `def` keyword, followed by the function name, a pair of parentheses for parameters, and a colon. The function body is indented.

```python
def greet(name):
    """This function greets the person passed in as a parameter."""
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)

def add(a, b):
    """Adds two numbers and returns the sum."""
    return a + b

result = add(5, 3)
print(result)
```

Key aspects of function definition:

*   **Docstrings:** The string literal immediately after the `def` line is called a docstring. It provides documentation for the function and can be accessed via `function_name.__doc__` or `help(function_name)`. Docstrings are crucial for code readability and maintainability.
*   **Parameters and Arguments:** Parameters are the variables listed inside the parentheses in the function definition. Arguments are the actual values passed to the function when it is called.
*   **`return` Statement:** The `return` statement is used to exit a function and send a value back to the caller. If no `return` statement is present, or if `return` is used without an argument, the function implicitly returns `None`.

### `lambda` Expressions: Anonymous Functions

`lambda` expressions (also known as anonymous functions) are small, single-expression functions that are not bound to a name. They are defined using the `lambda` keyword.

```python
# A regular function to add two numbers
def add_regular(x, y):
    return x + y

# Equivalent lambda function
add_lambda = lambda x, y: x + y

print(add_regular(2, 3))
print(add_lambda(2, 3))

# Lambda used with higher-order functions (e.g., sorted, map, filter)
points = [(1, 2), (3, 1), (5, 0)]
# Sort by the second element of each tuple
sorted_points = sorted(points, key=lambda point: point[1])
print(sorted_points) # [(5, 0), (3, 1), (1, 2)]
```

`lambda` functions are syntactically restricted to a single expression. They are typically used for short, throwaway functions that are passed as arguments to higher-order functions.

### Argument Passing: `*args` and `**kwargs`

Python provides special syntax to handle a variable number of arguments in functions.

#### `*args` (Non-Keyword Arguments)

`*args` allows a function to accept an arbitrary number of non-keyword (positional) arguments. Inside the function, `args` will be a tuple containing all the positional arguments.

```python
def sum_all(*numbers):
    """Sums an arbitrary number of arguments."""
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3))         # Output: 6
print(sum_all(10, 20, 30, 40))  # Output: 100
```

#### `**kwargs` (Keyword Arguments)

`**kwargs` allows a function to accept an arbitrary number of keyword arguments. Inside the function, `kwargs` will be a dictionary where keys are the argument names and values are their corresponding values.

```python
def display_info(**details):
    """Displays user information from keyword arguments."""
    for key, value in details.items():
        print(f"{key}: {value}")

display_info(name="Alice", age=30, city="New York")
# Output:
# name: Alice
# age: 30
# city: New York
```

You can combine positional arguments, `*args`, and `**kwargs` in a function definition. The order must be: positional arguments, `*args`, keyword-only arguments, `**kwargs`.

```python
def configure(setting, *options, **metadata):
    print(f"Setting: {setting}")
    print(f"Options: {options}")
    print(f"Metadata: {metadata}")

configure("theme", "dark", "compact", author="John Doe", version="1.0")
```

### Closures

A closure is a function object that remembers values in its enclosing scope even if those variables are no longer in memory. In Python, this typically happens when a nested function refers to a variable in its outer (enclosing) function.

```python
def outer_function(msg):
    message = msg # 'message' is a free variable

    def inner_function():
        print(message)
    return inner_function

hello_func = outer_function("Hello")
bye_func = outer_function("Goodbye")

hello_func() # Output: Hello
bye_func()   # Output: Goodbye
```

Even after `outer_function` has finished executing, `hello_func` and `bye_func` still "remember" the `message` they were created with. Closures are powerful for creating factory functions, decorators, and maintaining state.

### The LEGB Rule: Scope Resolution

Python resolves names (variables, functions, classes) using the **LEGB rule**, which stands for:

1.  **Local (L):** Names assigned within a function (e.g., `def`, `lambda`).
2.  **Enclosing function locals (E):** Names in the local scope of any enclosing functions (for nested functions).
3.  **Global (G):** Names assigned at the top level of a module file, or declared global with the `global` keyword.
4.  **Built-in (B):** Names pre-assigned in the built-in module (`builtins`), such as `print`, `len`, `str`, `range`, etc.

When a name is referenced, Python searches for it in this order. The first match found is used.

```python
x = "global"

def outer():
    x = "enclosing"

    def inner():
        x = "local"
        print(x) # Refers to local x

    inner()
    print(x) # Refers to enclosing x

outer()
print(x) # Refers to global x

# Output:
# local
# enclosing
# global
```

Understanding the LEGB rule is crucial for avoiding common bugs related to variable shadowing and ensuring your functions access the correct data. The `nonlocal` keyword, introduced in Python 3, allows you to assign to variables in an enclosing scope that is not global.

```python
def counter():
    count = 0

    def increment():
        nonlocal count # Declare that 'count' is not local, but in an enclosing scope
        count += 1
        return count
    return increment

my_counter = counter()
print(my_counter()) # Output: 1
print(my_counter()) # Output: 2
```

This chapter has laid the groundwork for understanding how functions operate and how Python manages variable visibility. These concepts are fundamental for writing organized, efficient, and bug-free Python programs.
