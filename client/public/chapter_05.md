## Chapter 5: Lists, Tuples, and Sets

Python offers a rich set of built-in data structures that are fundamental for organizing and manipulating data. This chapter dives deep into three essential collection types: lists, tuples, and sets. We will explore their characteristics, common operations, memory allocation, and analyze their performance using Big-O notation.

### Lists (`list`): Mutable Sequences

Lists are ordered, mutable sequences that can store items of different data types. They are one of the most versatile and frequently used data structures in Python.

#### Creation and Basic Operations

Lists are created using square brackets `[]` or the `list()` constructor.

```python
# Creating lists
my_list = [1, "hello", 3.14, True]
another_list = list(range(5))
print(my_list)       # Output: [1, 'hello', 3.14, True]
print(another_list)  # Output: [0, 1, 2, 3, 4]

# Accessing elements (zero-indexed)
print(my_list[0])    # Output: 1
print(my_list[-1])   # Output: True (last element)

# Slicing
print(my_list[1:3])  # Output: ['hello', 3.14]

# Modifying elements (mutability)
my_list[1] = "world"
print(my_list)       # Output: [1, 'world', 3.14, True]

# Adding elements
my_list.append("new_item") # Adds to the end
my_list.insert(1, "inserted") # Inserts at a specific index
print(my_list)

# Removing elements
my_list.remove("inserted") # Removes first occurrence of value
del my_list[0]             # Removes by index
popped_item = my_list.pop() # Removes and returns last item
print(my_list)
print(popped_item)
```

#### List Methods

Python lists come with a variety of useful methods:

| Method        | Description                                                                 | Example                                     |
| :------------ | :-------------------------------------------------------------------------- | :------------------------------------------ |
| `append(item)`| Adds an item to the end of the list.                                        | `[1, 2].append(3)` -> `[1, 2, 3]`           |
| `extend(iter)`| Extends the list by appending all the items from the iterable.              | `[1, 2].extend([3, 4])` -> `[1, 2, 3, 4]`   |
| `insert(idx, item)`| Inserts an item at a specified position.                                    | `[1, 2].insert(1, 99)` -> `[1, 99, 2]`      |
| `remove(item)`| Removes the first occurrence of a specified value. Raises `ValueError` if not found. | `[1, 2, 1].remove(1)` -> `[2, 1]`           |
| `pop([idx])`  | Removes and returns the item at the given index (default last).             | `[1, 2].pop()` -> `2`, list becomes `[1]`   |
| `clear()`     | Removes all items from the list.                                            | `[1, 2].clear()` -> `[]`                    |
| `index(item)` | Returns the index of the first occurrence of a value.                       | `[1, 2, 3].index(2)` -> `1`                 |
| `count(item)` | Returns the number of times a value appears in the list.                    | `[1, 2, 1].count(1)` -> `2`                 |
| `sort()`      | Sorts the list in ascending order in-place.                                 | `[3, 1, 2].sort()` -> `[1, 2, 3]`           |
| `reverse()`   | Reverses the order of elements in-place.                                    | `[1, 2, 3].reverse()` -> `[3, 2, 1]`        |
| `copy()`      | Returns a shallow copy of the list.                                         | `list1 = [1, 2]; list2 = list1.copy()`      |

#### Memory Allocation and Big-O Performance

Lists are implemented as dynamic arrays. When a list runs out of space, it typically allocates a larger block of memory (often by doubling its size) and copies existing elements to the new location. This strategy allows `append()` operations to have an amortized time complexity of O(1).

| Operation          | Average Time Complexity | Worst-Case Time Complexity |
| :----------------- | :---------------------- | :------------------------- |
| Indexing           | O(1)                    | O(1)                       |
| Appending          | O(1) (amortized)        | O(N) (when resizing)       |
| Inserting (arbitrary)| O(N)                    | O(N)                       |
| Deleting (arbitrary)| O(N)                    | O(N)                       |
| Iterating          | O(N)                    | O(N)                       |
| Searching (value)  | O(N)                    | O(N)                       |
| Slicing            | O(k) (where k is slice length)| O(k)                       |

**Explanation:**

*   **O(1) (Constant Time):** Operations like accessing an element by index or appending to the end (most of the time) take a constant amount of time, regardless of the list's size.
*   **O(N) (Linear Time):** Operations like inserting/deleting in the middle, searching for a value, or iterating through the entire list take time proportional to the number of elements (N) in the list, because elements might need to be shifted.

### Tuples (`tuple`): Immutable Sequences

Tuples are ordered, immutable sequences. Once a tuple is created, its elements cannot be changed, added, or removed. This immutability makes them suitable for representing fixed collections of items, such as coordinates or database records.

#### Creation and Basic Operations

Tuples are created using parentheses `()` or the `tuple()` constructor. A single-element tuple requires a trailing comma.

```python
# Creating tuples
my_tuple = (1, "hello", 3.14)
another_tuple = tuple([1, 2, 3])
single_item_tuple = (5,)
empty_tuple = ()

print(my_tuple)
print(single_item_tuple)

# Accessing elements (zero-indexed)
print(my_tuple[0])    # Output: 1

# Slicing (returns a new tuple)
print(my_tuple[1:])   # Output: ('hello', 3.14)

# Attempting to modify (will raise TypeError)
# my_tuple[0] = 99 # TypeError: 'tuple' object does not support item assignment
```

#### Why use Tuples?

1.  **Data Integrity:** Immutability guarantees that the tuple's contents will not change, which can be useful for data that should remain constant.
2.  **Dictionary Keys:** Because they are immutable, tuples can be used as keys in dictionaries (unlike lists).
3.  **Function Return Values:** Functions often return multiple values as a tuple.
4.  **Performance:** Tuples are generally slightly faster than lists for iteration and access, and they consume less memory, especially for large numbers of small collections.

#### Memory Allocation and Big-O Performance

Tuples are also implemented as arrays, but their fixed size after creation simplifies memory management. Since they are immutable, operations that appear to modify a tuple actually create a new tuple.

| Operation          | Average Time Complexity | Worst-Case Time Complexity |
| :----------------- | :---------------------- | :------------------------- |
| Indexing           | O(1)                    | O(1)                       |
| Iterating          | O(N)                    | O(N)                       |
| Searching (value)  | O(N)                    | O(N)                       |
| Slicing            | O(k) (where k is slice length)| O(k)                       |

### Sets (`set`): Unordered Collections of Unique Elements

Sets are unordered collections of unique and immutable elements. They are highly optimized for checking membership and performing mathematical set operations like union, intersection, and difference.

#### Creation and Basic Operations

Sets are created using curly braces `{}` (for non-empty sets) or the `set()` constructor. An empty set must be created with `set()` because `{}` creates an empty dictionary.

```python
# Creating sets
my_set = {1, 2, 3, 2, 1} # Duplicate elements are automatically removed
another_set = set([3, 4, 5])
empty_set = set()

print(my_set)        # Output: {1, 2, 3} (order not guaranteed)
print(another_set)

# Adding and removing elements (mutability of the set itself)
my_set.add(4)
my_set.remove(1) # Raises KeyError if element not found
my_set.discard(5) # Removes element if present, no error if not found
print(my_set)

# Membership testing (very fast)
print(2 in my_set)   # Output: True
print(10 in my_set)  # Output: False
```

#### Set Operations

Sets support standard mathematical set operations:

```python
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

# Union (elements in either set)
print(set_a | set_b)       # Output: {1, 2, 3, 4, 5, 6}
print(set_a.union(set_b))

# Intersection (elements in both sets)
print(set_a & set_b)       # Output: {3, 4}
print(set_a.intersection(set_b))

# Difference (elements in set_a but not in set_b)
print(set_a - set_b)       # Output: {1, 2}
print(set_a.difference(set_b))

# Symmetric Difference (elements in either set, but not in both)
print(set_a ^ set_b)       # Output: {1, 2, 5, 6}
print(set_a.symmetric_difference(set_b))

# Subset and Superset
print({1, 2}.issubset(set_a))   # Output: True
print(set_a.issuperset({1, 2})) # Output: True
```

#### Memory Allocation and Big-O Performance

Sets are implemented using hash tables. This allows for very fast average-case performance for membership testing, addition, and removal. However, elements stored in a set must be hashable (immutable).

| Operation          | Average Time Complexity | Worst-Case Time Complexity |
| :----------------- | :---------------------- | :------------------------- |
| Adding an element  | O(1)                    | O(N) (due to hash collisions/resizing) |
| Removing an element| O(1)                    | O(N)                       |
| Membership testing | O(1)                    | O(N)                       |
| Iterating          | O(N)                    | O(N)                       |

**Explanation:**

*   The average O(1) performance for adding, removing, and checking membership is a key advantage of sets, making them ideal for tasks where these operations are frequent.
*   The worst-case O(N) occurs rarely, typically during hash collisions or when the hash table needs to be resized.

### Choosing the Right Data Structure

The choice between lists, tuples, and sets depends on your specific requirements:

*   **Lists:** Use when you need an ordered collection of items that can be modified (e.g., a collection of user inputs, a sequence of objects that will change).
*   **Tuples:** Use when you need an ordered, immutable collection of items (e.g., coordinates, RGB color values, fixed records).
*   **Sets:** Use when you need an unordered collection of unique items and require fast membership testing or set operations (e.g., tracking unique visitors, finding common elements between two collections).

Understanding the characteristics and performance implications of each data structure is crucial for writing efficient and Pythonic code. This knowledge forms the basis for more complex data manipulations and algorithm design.
