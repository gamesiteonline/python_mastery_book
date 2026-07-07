## Chapter 6: Dictionaries and Hash Maps

Dictionaries (`dict`) are Python's most powerful and flexible built-in mapping type. They store data in key-value pairs, where each unique key maps to a specific value. This chapter will explore the internals of dictionaries, how they are implemented as hash maps, collision resolution strategies, and specialized dictionary types like `OrderedDict` and `defaultdict`.

### Understanding Dictionaries

A dictionary is an unordered collection of data values, used to store data values like a map, which, unlike other Data Types that hold only a single value as an element, holds `key:value` pair. Each key must be unique and immutable (e.g., strings, numbers, tuples). Values can be of any data type and can be mutable or immutable.

#### Creation and Basic Operations

Dictionaries are created using curly braces `{}` with key-value pairs, or by using the `dict()` constructor.

```python
# Creating dictionaries
my_dict = {"name": "Alice", "age": 30, "city": "New York"}
another_dict = dict(name="Bob", age=25)

print(my_dict)
print(another_dict)

# Accessing values
print(my_dict["name"]) # Output: Alice

# Adding and modifying elements
my_dict["email"] = "alice@example.com"
my_dict["age"] = 31
print(my_dict)

# Removing elements
del my_dict["city"]
popped_value = my_dict.pop("age")
print(my_dict)
print(popped_value)

# Iterating over dictionaries
for key in my_dict: # Iterates over keys by default
    print(key)

for value in my_dict.values(): # Iterates over values
    print(value)

for key, value in my_dict.items(): # Iterates over key-value pairs
    print(f"{key}: {value}")
```

#### Dictionary Methods

| Method           | Description                                                                 | Example                                     |
| :--------------- | :-------------------------------------------------------------------------- | :------------------------------------------ |
| `clear()`        | Removes all items from the dictionary.                                      | `d.clear()`                                 |
| `copy()`         | Returns a shallow copy of the dictionary.                                   | `d2 = d.copy()`                             |
| `fromkeys(seq, val)`| Creates a new dictionary with keys from `seq` and values set to `val` (default `None`). | `dict.fromkeys(['a', 'b'], 0)` -> `{'a': 0, 'b': 0}` |
| `get(key, default)`| Returns the value for `key` if `key` is in the dictionary, else `default`.  | `d.get('name', 'N/A')`                      |
| `items()`        | Returns a new view of the dictionary's items (key, value pairs).            | `d.items()`                                 |
| `keys()`         | Returns a new view of the dictionary's keys.                                | `d.keys()`                                  |
| `pop(key, default)`| Removes `key` and returns its value, or `default` if `key` not found.       | `d.pop('age')`                              |
| `popitem()`      | Removes and returns a (key, value) pair. (Python 3.7+ insertion order)      | `d.popitem()`                               |
| `setdefault(key, default)`| If `key` is in dict, return its value. Else, insert `key` with `default` and return `default`. | `d.setdefault('email', 'unknown')`          |
| `update([other])`| Updates the dictionary with the key-value pairs from `other`, overwriting existing keys. | `d.update({'age': 32})`                     |
| `values()`       | Returns a new view of the dictionary's values.                              | `d.values()`                                |

### Internals: Hash Maps

Python dictionaries are implemented as **hash tables** (also known as hash maps). A hash table is a data structure that maps keys to values using a hash function. When you add a key-value pair to a dictionary:

1.  The key is passed to a **hash function**, which computes an integer hash value.
2.  This hash value is then used to calculate an index into an internal array (the hash table).
3.  The key-value pair is stored at that index.

When you try to retrieve a value using a key, the same process occurs: the key is hashed, and the resulting index is used to find the corresponding value.

#### Hash Function and Hashable Objects

A good hash function should produce a uniform distribution of hash values to minimize collisions. In Python, the `hash()` built-in function is used to get the hash value of an object.

Only **hashable** objects can be used as dictionary keys. An object is hashable if it has a hash value that never changes during its lifetime (it needs an `__hash__()` method) and can be compared to other objects (it needs an `__eq__()` method). Immutable types like numbers, strings, and tuples are hashable. Mutable types like lists, dictionaries, and sets are not hashable because their content can change, which would alter their hash value.

```python
print(hash("name"))
print(hash(123))
print(hash((1, 2, 3)))

# hash([1, 2, 3]) # This would raise a TypeError
```

#### Collision Resolution

It's possible for two different keys to produce the same hash value (a **hash collision**). Python's dictionary implementation handles collisions using a technique called **open addressing** with **linear probing**. When a collision occurs, the dictionary searches for the next available slot in the internal array. If the target slot is occupied, it probes adjacent slots until an empty one is found or the key is matched.

This probing strategy means that in the worst case, operations can degrade to O(N) if many collisions occur, but on average, with a good hash function and proper resizing, they remain O(1).

#### Resizing

To maintain efficient performance, Python dictionaries dynamically resize their internal hash table when it becomes too full. When the load factor (number of entries / table size) exceeds a certain threshold, a new, larger hash table is allocated, and all existing key-value pairs are rehashed and reinserted into the new table. This resizing operation is an O(N) operation, but it happens infrequently enough that the amortized time complexity for insertions remains O(1).

### Big-O Performance

| Operation          | Average Time Complexity | Worst-Case Time Complexity |
| :----------------- | :---------------------- | :------------------------- |
| Insertion          | O(1) (amortized)        | O(N) (during resizing/many collisions) |
| Deletion           | O(1)                    | O(N)                       |
| Key Lookup         | O(1)                    | O(N)                       |
| Iteration          | O(N)                    | O(N)                       |

**Explanation:**

*   The average O(1) performance for insertions, deletions, and lookups is the primary reason dictionaries are so widely used for fast data retrieval.
*   The worst-case O(N) occurs when there are many hash collisions or when the dictionary needs to resize and rehash all its elements. Python's hash function and resizing strategy are designed to make these worst-case scenarios rare.

### Specialized Dictionary Types

Python's `collections` module provides several specialized dictionary types that extend the functionality of the basic `dict`.

#### `OrderedDict` (Deprecated in Python 3.7+)

Prior to Python 3.7, standard dictionaries did not guarantee insertion order. `OrderedDict` from the `collections` module was used to maintain the order in which items were inserted. However, as of Python 3.7, regular `dict` objects *do* preserve insertion order, making `OrderedDict` largely redundant for most use cases.

```python
from collections import OrderedDict

d = OrderedDict()
d["apple"] = 1
d["banana"] = 2
d["cherry"] = 3
print(d) # OrderedDict([("apple", 1), ("banana", 2), ("cherry", 3)])

# In Python 3.7+ a regular dict behaves similarly
regular_dict = {}
regular_dict["apple"] = 1
regular_dict["banana"] = 2
regular_dict["cherry"] = 3
print(regular_dict) # {"apple": 1, "banana": 2, "cherry": 3}
```

#### `defaultdict`

`defaultdict` is a subclass of `dict` that calls a factory function to supply missing values. This is particularly useful when you want to append items to a list or set within a dictionary, and you don't want to explicitly check if the key already exists.

```python
from collections import defaultdict

# Using defaultdict with a list factory
word_counts = defaultdict(int) # int() returns 0
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
for word in words:
    word_counts[word] += 1
print(word_counts) # defaultdict(<class 'int'>, {"apple": 3, "banana": 2, "cherry": 1})

# Using defaultdict with a list factory
grouped_by_first_letter = defaultdict(list)
for word in words:
    grouped_by_first_letter[word[0]].append(word)
print(grouped_by_first_letter)
# defaultdict(<class 'list'>, {
#   'a': ['apple', 'apple', 'apple'],
#   'b': ['banana', 'banana'],
#   'c': ['cherry']
# })
```

`defaultdict` simplifies code by removing the need for `if key in dict:` checks, making it cleaner and often more efficient.

Dictionaries are indispensable tools in Python programming, offering fast and flexible ways to store and retrieve data. A solid understanding of their hash-based implementation and performance characteristics is key to writing efficient and robust Python applications.
