## Chapter 3: Control Flow and Iteration

Controlling the flow of execution and iterating over sequences are fundamental aspects of any programming language. Python provides clear and concise constructs for conditional execution, looping, and powerful data transformations through comprehensions. This chapter will cover `if/else` statements, various loop types, the `match-case` statement, and list, dictionary, and set comprehensions.

### Conditional Execution: `if`, `elif`, and `else`

Conditional statements allow your program to make decisions and execute different blocks of code based on whether certain conditions are met. Python uses `if`, `elif` (short for "else if"), and `else` keywords for this purpose.

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")
```

Key points:

*   Conditions are evaluated in order. The first `True` condition's block is executed, and the rest are skipped.
*   Indentation is crucial in Python to define code blocks. All statements within a block must have the same level of indentation.
*   Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) and logical operators (`and`, `or`, `not`) are used to construct conditions.

### Iteration: `for` and `while` Loops

Loops allow you to execute a block of code repeatedly. Python offers `for` loops for iterating over sequences and `while` loops for repeating as long as a condition is true.

#### `for` Loops

`for` loops are used to iterate over the elements of a sequence (like a list, tuple, string, or range) or other iterable objects.

```python
# Iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Iterating using range()
# range(stop) generates numbers from 0 up to (but not including) stop
# range(start, stop) generates numbers from start up to (but not including) stop
# range(start, stop, step) generates numbers from start up to (but not including) stop, with a step
for i in range(5):
    print(i) # 0, 1, 2, 3, 4

# Iterating with index using enumerate()
for index, fruit in enumerate(fruits):
    print(f"Index {index}: {fruit}")
```

#### `while` Loops

`while` loops execute a block of code as long as a given condition is `True`.

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

Be careful with `while` loops to avoid infinite loops. Ensure that the condition eventually becomes `False`.

#### `break` and `continue` Statements

*   `break`: Terminates the loop entirely and transfers control to the statement immediately following the loop.
*   `continue`: Skips the rest of the current iteration and proceeds to the next iteration of the loop.

```python
for i in range(10):
    if i == 3:
        continue # Skip 3
    if i == 7:
        break    # Stop at 7
    print(i)
# Output: 0, 1, 2, 4, 5, 6
```

### The `match-case` Statement (Structural Pattern Matching)

Introduced in Python 3.10, the `match-case` statement provides a powerful way to perform structural pattern matching, offering a more readable alternative to long `if/elif/else` chains for certain scenarios.

```python
def handle_command(command):
    match command.split():
        case ["quit"]:
            print("Exiting the application.")
        case ["load", filename]:
            print(f"Loading file: {filename}")
        case ["save", filename] if filename.endswith(".txt"):
            print(f"Saving to text file: {filename}")
        case ["save", filename]:
            print(f"Saving to generic file: {filename}")
        case _: # The wildcard pattern, matches anything else
            print(f"Unknown command: {command}")

handle_command("quit")
handle_command("load data.csv")
handle_command("save report.txt")
handle_command("save image.png")
handle_command("help")
```

Key features of `match-case`:

*   **Literal Patterns:** Match exact values (e.g., `case "quit"`).
*   **Sequence Patterns:** Match lists or tuples (e.g., `case ["load", filename]`).
*   **Mapping Patterns:** Match dictionaries.
*   **Class Patterns:** Match instances of classes.
*   **Capture Patterns:** Assign parts of the matched value to variables (e.g., `filename`).
*   **Guard Clauses:** Add `if` conditions to patterns (e.g., `if filename.endswith(".txt")`).
*   **Wildcard Pattern (`_`):** Acts as a default case, matching anything that hasn't been matched by previous patterns.

`match-case` is particularly useful for parsing structured data, handling command-line arguments, or implementing state machines.

### Comprehensions: Concise Data Transformations

Comprehensions provide a concise way to create lists, dictionaries, and sets. They are often more readable and efficient than traditional `for` loops for these tasks.

#### List Comprehensions

List comprehensions create new lists based on existing iterables.

```python
# Basic list comprehension
squares = [x**2 for x in range(10)]
print(squares) # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# List comprehension with a condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares) # [0, 4, 16, 36, 64]

# Nested list comprehensions
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened) # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### Dictionary Comprehensions

Dictionary comprehensions create new dictionaries.

```python
# Basic dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}
print(squares_dict) # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Dictionary comprehension with conditional logic
words = ["apple", "banana", "cherry", "date"]
word_lengths = {word: len(word) for word in words if len(word) > 5}
print(word_lengths) # {"banana": 6, "cherry": 6}
```

#### Set Comprehensions

Set comprehensions create new sets, automatically handling uniqueness.

```python
# Basic set comprehension
numbers = [1, 2, 2, 3, 4, 4, 5]
unique_squares = {x**2 for x in numbers}
print(unique_squares) # {1, 4, 9, 16, 25}

# Set comprehension with condition
even_unique_squares = {x**2 for x in numbers if x % 2 == 0}
print(even_unique_squares) # {4, 16}
```

Comprehensions are a powerful and Pythonic way to create new collections. They improve readability and often offer better performance compared to traditional loops for the same task. However, for very complex logic, a traditional loop might be more appropriate for clarity.
