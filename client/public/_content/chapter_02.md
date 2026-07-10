## Chapter 2: Variables, Memory, and Built-in Data Types

In Python, everything is an object. This fundamental concept is crucial to understanding how variables work, how memory is managed, and the behavior of Python's built-in data types. This chapter will delve into integers, floats, strings, and booleans, exploring their characteristics, mutability, and immutability.

### Variables: Names, Not Storage Locations

Unlike some other programming languages where variables are memory locations that store values, in Python, variables are best thought of as **names (or labels) that refer to objects** in memory. When you assign a value to a variable, you are essentially binding that name to an object.

Consider the following example:

```python
x = 10
y = x
```

Here, `x` is a name bound to the integer object `10`. When `y = x` is executed, `y` becomes another name bound to the *same* integer object `10`. Both `x` and `y` refer to the same object in memory. You can verify this using the `id()` function, which returns the identity (memory address) of an object:

```python
x = 10
y = x
print(id(x))  # Output: (a memory address, e.g., 140737351939856)
print(id(y))  # Output: (the same memory address as x)

z = 10
print(id(z))  # Output: (the same memory address as x and y, due to integer caching)
```

Python optimizes memory usage by caching certain immutable objects, like small integers (typically from -5 to 256) and some strings. This means that if you create multiple variables with the same value for these cached objects, they will often refer to the exact same object in memory.

### Memory Management in Python

Python uses a private heap to manage memory. All Python objects and data structures are located in a private heap. The programmer does not have direct access to this private heap. The Python memory manager handles the allocation and deallocation of memory.

The primary mechanism for memory deallocation in Python is **reference counting**. Each object in Python has a reference count, which tracks how many names (variables) are referring to it. When an object's reference count drops to zero, it means no variables are currently pointing to it, and the object becomes eligible for garbage collection. The memory occupied by that object is then reclaimed.

```python
import sys

a = []
print(sys.getrefcount(a)) # Output: 2 (a and the argument to getrefcount)

b = a
print(sys.getrefcount(a)) # Output: 3 (a, b, and the argument to getrefcount)

del b
print(sys.getrefcount(a)) # Output: 2 (a and the argument to getrefcount)
```

While reference counting is efficient, it cannot detect **reference cycles**. A reference cycle occurs when two or more objects refer to each other, but are no longer accessible from the rest of the program. To handle this, Python also employs a **cyclic garbage collector** that periodically identifies and reclaims objects involved in reference cycles.

### Built-in Data Types: Mutability vs. Immutability

Python's built-in data types can be broadly categorized into two groups based on their **mutability**:

*   **Mutable types:** Their state can be changed after they are created. Examples include lists, dictionaries, and sets.
*   **Immutable types:** Their state cannot be changed after they are created. Any operation that appears to modify an immutable object actually creates a new object. Examples include integers, floats, strings, booleans, and tuples.

Understanding this distinction is critical for predicting how your code will behave, especially when passing objects to functions or working with shared references.

#### Integers (`int`)

Python integers have arbitrary precision, meaning they can represent numbers of any size, limited only by available memory. This is a significant advantage over fixed-size integers in languages like C++ or Java.

```python
big_number = 10**100
print(big_number) # A very large integer
print(type(big_number))
```

Integers are **immutable**. When you perform an operation that seems to change an integer, a new integer object is created.

```python
x = 5
print(id(x))

x = x + 1 # This creates a new integer object 6 and rebinds x to it
print(id(x)) # Different ID
```

#### Floating-Point Numbers (`float`)

Floating-point numbers in Python are typically implemented using the IEEE 754 double-precision standard. This means they have a finite precision, which can lead to small inaccuracies in calculations involving decimals.

```python
0.1 + 0.2 == 0.3 # Output: False
print(0.1 + 0.2) # Output: 0.30000000000000004
```

This is not a Python-specific issue but a characteristic of how floating-point numbers are represented in computer hardware. For precise decimal arithmetic, especially in financial applications, Python's `decimal` module should be used.

Floats are also **immutable**.

#### Strings (`str`)

Strings in Python are sequences of Unicode characters. They are incredibly versatile and come with a rich set of methods for manipulation.

```python
message = "Hello, Python!"
print(message[0]) # Output: H
print(len(message)) # Output: 14
```

Strings are **immutable**. Any string operation that appears to modify a string, such as concatenation or slicing, actually returns a new string object.

```python
s1 = "hello"
print(id(s1))

s2 = s1 + " world"
print(id(s1)) # Same ID as before
print(id(s2)) # Different ID
```

#### Booleans (`bool`)

Booleans represent truth values: `True` or `False`. They are a subclass of integers, where `True` is `1` and `False` is `0`. This allows for some interesting, though often discouraged, arithmetic operations.

```python
print(True + True) # Output: 2
print(False * 10) # Output: 0
```

Booleans are **immutable**.

### Practical Implications of Mutability

The distinction between mutable and immutable types has significant practical implications, particularly when objects are passed as arguments to functions or when multiple variables refer to the same object.

*   **Immutable objects as function arguments:** When an immutable object is passed to a function, and the function attempts to 
