## Chapter 11: Functional Programming

While Python is fundamentally an object-oriented language, it incorporates many features that support **functional programming (FP)**. Functional programming is a paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. This chapter explores key functional programming concepts in Python, including `map`, `filter`, `reduce`, and higher-order functions.

### Core Concepts of Functional Programming

Functional programming emphasizes several core principles:

1.  **Pure Functions:** Functions that always produce the same output for the same input and have no side effects (they don't modify external state or variables).
2.  **Immutability:** Data should not be changed after it's created. Instead of modifying existing data structures, new ones are created.
3.  **First-Class Functions:** Functions are treated as first-class citizens, meaning they can be assigned to variables, passed as arguments to other functions, and returned as values from other functions.
4.  **Higher-Order Functions:** Functions that take other functions as arguments or return them as results.

Python supports these concepts, although it doesn't enforce them strictly like pure functional languages (e.g., Haskell).

### Higher-Order Functions

A higher-order function is a function that does at least one of the following:

*   Takes one or more functions as arguments.
*   Returns a function as its result.

Python's built-in functions like `map()`, `filter()`, and `sorted()` are classic examples of higher-order functions.

```python
def apply_operation(func, x, y):
    """A higher-order function that applies a given function to two arguments."""
    return func(x, y)

def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

print(apply_operation(add, 5, 3))      # Output: 8
print(apply_operation(multiply, 5, 3)) # Output: 15
```

### `map()`: Applying a Function to an Iterable

The `map()` function applies a given function to each item of an iterable (like a list or tuple) and returns an iterator yielding the results.

```python
# Syntax: map(function, iterable, ...)

numbers = [1, 2, 3, 4, 5]

# Using a regular function
def square(x):
    return x ** 2

squared_numbers = map(square, numbers)
print(list(squared_numbers)) # Output: [1, 4, 9, 16, 25]

# Using a lambda function (more concise)
cubed_numbers = map(lambda x: x ** 3, numbers)
print(list(cubed_numbers)) # Output: [1, 8, 27, 64, 125]

# map with multiple iterables
list1 = [1, 2, 3]
list2 = [10, 20, 30]
sums = map(lambda x, y: x + y, list1, list2)
print(list(sums)) # Output: [11, 22, 33]
```

*Note: In Python 3, `map()` returns an iterator, not a list. You often need to convert it to a list using `list()` to see the results or iterate over it.*

### `filter()`: Selecting Elements from an Iterable

The `filter()` function constructs an iterator from elements of an iterable for which a given function returns true.

```python
# Syntax: filter(function, iterable)

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Using a regular function
def is_even(x):
    return x % 2 == 0

even_numbers = filter(is_even, numbers)
print(list(even_numbers)) # Output: [2, 4, 6, 8, 10]

# Using a lambda function
odd_numbers = filter(lambda x: x % 2 != 0, numbers)
print(list(odd_numbers)) # Output: [1, 3, 5, 7, 9]

# Filtering out empty strings or None values
mixed_list = [1, "", "hello", None, 0, True, False]
truthy_values = filter(None, mixed_list) # If function is None, it filters out falsy values
print(list(truthy_values)) # Output: [1, 'hello', True]
```

### `reduce()`: Accumulating Values

The `reduce()` function applies a function of two arguments cumulatively to the items of an iterable, from left to right, so as to reduce the iterable to a single value.

*Note: In Python 3, `reduce()` was moved from the built-in namespace to the `functools` module.*

```python
# Syntax: functools.reduce(function, iterable[, initializer])

from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Summing all numbers
# Step 1: add(1, 2) -> 3
# Step 2: add(3, 3) -> 6
# Step 3: add(6, 4) -> 10
# Step 4: add(10, 5) -> 15
total_sum = reduce(lambda x, y: x + y, numbers)
print(total_sum) # Output: 15

# Finding the maximum value
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value) # Output: 5

# Using an initializer
# The initializer is placed before the items of the iterable in the calculation
sum_with_initial = reduce(lambda x, y: x + y, numbers, 10)
print(sum_with_initial) # Output: 25 (10 + 1 + 2 + 3 + 4 + 5)
```

### Comprehensions vs. `map`/`filter`

Python's list, dictionary, and set comprehensions often provide a more readable and "Pythonic" alternative to `map()` and `filter()`.

```python
numbers = [1, 2, 3, 4, 5]

# map equivalent using list comprehension
squared_map = list(map(lambda x: x**2, numbers))
squared_comp = [x**2 for x in numbers]
print(squared_map == squared_comp) # True

# filter equivalent using list comprehension
even_filter = list(filter(lambda x: x % 2 == 0, numbers))
even_comp = [x for x in numbers if x % 2 == 0]
print(even_filter == even_comp) # True
```

While comprehensions are generally preferred for simple transformations and filtering due to their readability, `map()` and `filter()` can be useful when you already have a named function you want to apply, or when working with large datasets where returning an iterator (lazy evaluation) is more memory-efficient than creating a full list in memory.

### Conclusion

Functional programming techniques in Python, such as higher-order functions, `map`, `filter`, and `reduce`, offer powerful ways to process data concisely and declaratively. While Python is not a purely functional language, incorporating these concepts can lead to cleaner, more modular, and often more testable code. Understanding when to use these tools versus traditional loops or comprehensions is a key skill for a proficient Python developer.
