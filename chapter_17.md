## Chapter 17: Type Hinting and Static Analysis (mypy, Protocols, Generics, Pydantic)

Python is a dynamically typed language, meaning that variable types are determined at runtime, and you don't explicitly declare types in your code. While this offers flexibility, it can also lead to runtime errors that are difficult to catch in larger, more complex codebases. **Type hinting**, introduced in PEP 484, allows developers to optionally specify expected types for variables, function arguments, and return values. This chapter will explore type hinting, its benefits, how to use static analysis tools like `mypy`, and advanced concepts such as Protocols, Generics, and the `Pydantic` library for data validation.

### What is Type Hinting?

Type hinting is a way to indicate the expected types of variables, function parameters, and return values in your Python code. These hints are not enforced by the Python interpreter at runtime (Python remains dynamically typed), but they provide valuable metadata that can be used by:

*   **Static analysis tools (type checkers):** Tools like `mypy` can analyze your code *before* it runs to catch potential type-related errors.
*   **IDEs and editors:** They can use type hints to provide better autocompletion, refactoring, and error checking.
*   **Other developers:** Type hints serve as excellent documentation, making your code easier to understand and maintain.

### Basic Type Hints

#### Function Annotations

The most common use of type hints is in function signatures.

```python
def greet(name: str) -> str:
    """Greets a person by name."""
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    """Adds two integers."""
    return a + b

# These calls are valid according to type hints
print(greet("Alice"))
print(add(5, 3))

# These calls would be flagged by a type checker
# print(greet(123)) # Expected str, got int
# print(add("5", "3")) # Expected int, got str
```

#### Variable Annotations

Type hints can also be used for variables.

```python
name: str = "Bob"
age: int = 30
is_active: bool = True

# This would be flagged by a type checker
# age = "thirty" # Expected int, got str
```

### Common Type Hinting Types

The `typing` module provides a rich set of types for more complex scenarios.

*   **`List`, `Tuple`, `Dict`, `Set`:** For collections. Always specify the type of elements they contain.
    ```python
    from typing import List, Tuple, Dict, Set

    numbers: List[int] = [1, 2, 3]
    coordinates: Tuple[float, float] = (10.5, 20.1)
    user_data: Dict[str, str] = {"name": "Alice", "email": "alice@example.com"}
    unique_ids: Set[int] = {101, 102, 103}
    ```
*   **`Optional`:** Indicates that a variable can be of a certain type or `None`.
    ```python
    from typing import Optional

    def get_username(user_id: int) -> Optional[str]:
        if user_id == 1:
            return "admin"
        return None
    ```
    *Note: `Optional[X]` is equivalent to `Union[X, None]`.*

*   **`Union`:** Indicates that a variable can be one of several types.
    ```python
    from typing import Union

    def process_id(id: Union[int, str]) -> str:
        return str(id)
    ```
*   **`Any`:** Use when the type is not known or can be anything. Avoid overuse, as it defeats the purpose of type hinting.
    ```python
    from typing import Any

    data: Any = [1, "hello", True]
    ```
*   **`Callable`:** For functions. Specify argument types and return type.
    ```python
    from typing import Callable

    def apply_func(func: Callable[[int, int], int], a: int, b: int) -> int:
        return func(a, b)

    def multiply(x: int, y: int) -> int:
        return x * y

    print(apply_func(multiply, 2, 3)) # Output: 6
    ```

### Static Analysis with `mypy`

`mypy` is a popular static type checker for Python. It reads your Python code, analyzes the type hints, and reports any inconsistencies or potential type errors without actually running the code.

#### Installation

```bash
pip install mypy
```

#### Usage

Save your Python code (e.g., `my_module.py`):

```python
# my_module.py
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    return a + b

result = add("5", 3) # Type error here
print(result)
```

Run `mypy` from your terminal:

```bash
mypy my_module.py
```

Output:

```
my_module.py:7: error: Argument 1 to "add" has incompatible type "str"; expected "int"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
```

`mypy` helps catch errors early in the development cycle, improving code quality and reducing debugging time.

### Advanced Type Hinting Concepts

#### Protocols (PEP 544)

Protocols provide a way to define structural subtyping (duck typing) using type hints. Instead of inheriting from a base class, a class can be considered to implement a protocol if it provides the methods and attributes defined by that protocol.

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None:
        ...

class FileHandler:
    def close(self) -> None:
        print("FileHandler closed")

class SocketConnection:
    def close(self) -> None:
        print("SocketConnection closed")

def close_resource(resource: SupportsClose) -> None:
    resource.close()

close_resource(FileHandler())
close_resource(SocketConnection())

# This would be flagged by mypy if MyClass doesn't have a close method
# class MyClass:
#     pass
# close_resource(MyClass())
```

Protocols are powerful for defining interfaces without forcing explicit inheritance, aligning well with Python's duck-typing philosophy.

#### Generics (PEP 484, PEP 585)

Generics allow you to write code that works with types in a flexible way, without losing type safety. They are particularly useful for container types or functions that operate on various types while maintaining type relationships.

```python
from typing import TypeVar, List, Dict

T = TypeVar("T") # Declare a type variable
K = TypeVar("K") # Key type
V = TypeVar("V") # Value type

def first_element(items: List[T]) -> T:
    return items[0]

def merge_dicts(d1: Dict[K, V], d2: Dict[K, V]) -> Dict[K, V]:
    merged = d1.copy()
    merged.update(d2)
    return merged

int_list = [1, 2, 3]
str_list = ["a", "b", "c"]

print(first_element(int_list)) # mypy knows this returns int
print(first_element(str_list)) # mypy knows this returns str

dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
print(merge_dicts(dict1, dict2))
```

Python 3.9+ introduced built-in generic types, allowing `list[int]` instead of `List[int]`, simplifying syntax.

### Pydantic: Data Validation and Settings Management

`Pydantic` is a library that uses Python type hints to define data schemas and perform data validation. It's widely used in web frameworks (like FastAPI) and for configuration management because it provides runtime type checking and data parsing.

#### Installation

```bash
pip install pydantic
```

#### Basic Usage

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class User(BaseModel):
    id: int
    name: str = "John Doe"
    signup_ts: Optional[datetime] = None
    friends: List[int] = []

from datetime import datetime

# Valid data
user_data = {"id": 123, "signup_ts": "2023-01-01T12:00:00", "friends": [4, 5]}
user = User(**user_data)
print(user.id)        # 123
print(user.name)      # John Doe (default value)
print(user.signup_ts) # datetime.datetime(2023, 1, 1, 12, 0)
print(user.friends)   # [4, 5]

# Invalid data - Pydantic raises ValidationError
try:
    invalid_user = User(id="not_an_int", name="Jane")
except Exception as e:
    print(e)
# Output will show a validation error for 'id'

# Using Field for more validation options
class Product(BaseModel):
    name: str = Field(min_length=3, max_length=50)
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)

try:
    invalid_product = Product(name="ab", price=-10.0, quantity=5)
except Exception as e:
    print(e)
```

`Pydantic` automatically parses and validates data, converting types where possible (e.g., string to `datetime`). It raises clear `ValidationError` messages when data doesn't conform to the defined schema. This makes it invaluable for ensuring data integrity at the boundaries of your application.

### Conclusion

Type hinting and static analysis tools like `mypy` bring many benefits of statically typed languages to Python, improving code quality, maintainability, and developer productivity. While optional, adopting type hints is a best practice for modern Python development, especially in larger projects. Advanced concepts like Protocols and Generics, along with libraries like `Pydantic`, further extend Python's capabilities for robust and type-safe programming, yet flexible, programming. Embracing these tools will help you write more reliable and understandable Python code.
