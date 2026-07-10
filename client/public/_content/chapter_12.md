## Chapter 12: Decorators (Function decorators, class decorators, decorators with arguments)

Decorators are a powerful and elegant feature in Python that allow you to modify or enhance the behavior of functions or methods without permanently altering their code. They are a form of metaprogramming, enabling you to wrap functions with additional functionality. This chapter will delve into function decorators, class decorators, and how to create decorators that accept arguments, providing a deep understanding of this advanced Python concept.

### Understanding Decorators

At its core, a decorator is a function that takes another function as an argument, adds some functionality, and returns a new function. This is possible because functions in Python are first-class objects, meaning they can be passed around like any other variable.

Let's start with a simple example of manually wrapping a function:

```python
def greet(name):
    return f"Hello, {name}!"

def loud_greet(func):
    def wrapper(name):
        return func(name).upper() + "!!!"
    return wrapper

# Manually decorating the greet function
greet_loud = loud_greet(greet)
print(greet_loud("Alice")) # Output: HELLO, ALICE!!!!
```

The `@` syntax is just syntactic sugar for this manual assignment. The following is equivalent:

```python
def loud_greet(func):
    def wrapper(name):
        return func(name).upper() + "!!!"
    return wrapper

@loud_greet
def greet(name):
    return f"Hello, {name}!"

print(greet("Bob")) # Output: HELLO, BOB!!!!
```

When you write `@loud_greet` above `def greet(name):`, it's equivalent to `greet = loud_greet(greet)`. The `greet` function is replaced by the `wrapper` function returned by `loud_greet`.

### Function Decorators

Function decorators are the most common type of decorator. They are used to add features like logging, timing, access control, or memoization to functions.

#### Decorators for Logging

```python
def log_function_call(func):
    def wrapper(*args, **kwargs):
        print(f"Calling function {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"Function {func.__name__} returned: {result}")
        return result
    return wrapper

@log_function_call
def add(a, b):
    return a + b

@log_function_call
def subtract(a, b):
    return a - b

add(10, 5)
subtract(20, b=7)
```

**Explanation:**

*   The `log_function_call` decorator takes a function `func`.
*   It defines an inner `wrapper` function that accepts arbitrary positional (`*args`) and keyword (`**kwargs`) arguments. This is crucial for making the decorator generic and applicable to functions with any signature.
*   Inside `wrapper`, it prints a log message, calls the original `func` with its arguments, stores the result, prints another log message, and finally returns the result.
*   The `wrapper` function is returned by the decorator.

#### Preserving Function Metadata (`functools.wraps`)

When you use a decorator, the original function is replaced by the `wrapper` function. This means that metadata like the function's name (`__name__`), docstring (`__doc__`), and argument list are lost. The `functools.wraps` decorator helps preserve this metadata.

```python
import functools

def log_function_call(func):
    @functools.wraps(func) # Use functools.wraps
    def wrapper(*args, **kwargs):
        print(f"Calling function {func.__name__}...")
        result = func(*args, **kwargs)
        return result
    return wrapper

@log_function_call
def example_function(x, y):
    """This is an example function."""
    return x * y

print(example_function.__name__) # Without @functools.wraps, this would be 'wrapper'
print(example_function.__doc__)  # Without @functools.wraps, this would be None
```

### Decorators with Arguments

Sometimes you need to pass arguments to your decorator itself (e.g., a log level, a retry count). To do this, you need an extra layer of nesting: a function that takes the decorator arguments, and then returns the actual decorator.

```python
def repeat(num_times):
    def decorator_repeat(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Alice")
# Output:
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

**Explanation:**

1.  `repeat(num_times)` is called first with the argument `num_times=3`. It returns `decorator_repeat`.
2.  `@decorator_repeat` then decorates `say_hello`. This means `say_hello = decorator_repeat(say_hello)`.
3.  `decorator_repeat` takes `say_hello` as `func`, defines `wrapper`, and returns `wrapper`.
4.  So, `say_hello` now refers to the `wrapper` function, which executes the original `say_hello` `num_times` times.

### Class Decorators

Class decorators are functions that take a class as an argument and return a modified class or a new class. They are applied to classes in the same way function decorators are applied to functions, using the `@` syntax.

Class decorators are useful for tasks like:

*   Registering classes.
*   Adding methods to a class.
*   Modifying class attributes.
*   Implementing interfaces or abstract base classes.

#### Example: Adding a `to_dict` method to a class

```python
def add_to_dict_method(cls):
    def to_dict(self):
        return {attr: getattr(self, attr) for attr in self.__dict__}
    cls.to_dict = to_dict
    return cls

@add_to_dict_method
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("Bob", 30)
print(p.to_dict()) # Output: {"name": "Bob", "age": 30}
```

#### Example: Implementing a Singleton Pattern

A singleton is a design pattern that restricts the instantiation of a class to a single object. A class decorator can enforce this.

```python
def singleton(cls):
    instances = {}
    @functools.wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class DatabaseConnection:
    def __init__(self):
        print("Creating new database connection...")
        # Simulate connection setup
        self.connection_id = id(self)

conn1 = DatabaseConnection()
conn2 = DatabaseConnection()

print(conn1 is conn2) # Output: True
print(conn1.connection_id)
print(conn2.connection_id)
# Output will show 
