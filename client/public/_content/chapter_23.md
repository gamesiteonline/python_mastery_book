## Chapter 23: File I/O and Serialization (Text, Binary, JSON, CSV, Pickle)

Interacting with files is a fundamental aspect of most applications, whether it's reading configuration, storing data, or processing logs. Python provides robust and flexible mechanisms for **File Input/Output (I/O)**. Beyond simple text files, understanding how to handle different data formats and **serialization** techniques is crucial for data persistence and exchange. This chapter will cover reading and writing text and binary files, and delve into common serialization formats like JSON, CSV, and Python's native `pickle` module.

### Basic File I/O: Opening, Reading, and Writing Files

The primary way to interact with files in Python is using the built-in `open()` function. It returns a file object, which has methods for reading and writing.

#### The `open()` Function

`open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)`

*   `file`: The path to the file.
*   `mode`: Specifies how the file is to be opened. Common modes:
    *   `'r'`: Read (default). File must exist.
    *   `'w'`: Write. Creates a new file or truncates (empties) an existing one.
    *   `'a'`: Append. Creates a new file or appends to an existing one.
    *   `'x'`: Exclusive creation. Creates a new file, raises `FileExistsError` if it already exists.
    *   `'b'`: Binary mode (e.g., `'rb'`, `'wb'`).
    *   `'t'`: Text mode (default, e.g., `'rt'`, `'wt'`).
    *   `'+'`: Open for updating (reading and writing, e.g., `'r+'`, `'w+'`).
*   `encoding`: The encoding to use for text files (e.g., `'utf-8'`, `'latin-1'`). Defaults to system default.

It is best practice to use the `with` statement (as discussed in Chapter 14) to ensure files are properly closed, even if errors occur.

#### Writing to Text Files

```python
# Writing to a new file (or overwriting existing)
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, Python world!\n")
    f.write("This is a new line.\n")

# Appending to a file
with open("example.txt", "a", encoding="utf-8") as f:
    f.write("Appending another line.\n")
```

#### Reading from Text Files

```python
# Reading the entire file content
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print("--- Entire Content ---")
    print(content)

# Reading line by line
with open("example.txt", "r", encoding="utf-8") as f:
    print("--- Line by Line ---")
    for line in f:
        print(line.strip()) # .strip() removes trailing newline characters

# Reading a specific number of characters
with open("example.txt", "r", encoding="utf-8") as f:
    print("--- First 10 characters ---")
    first_10 = f.read(10)
    print(first_10)
    remaining = f.read() # Reads the rest
    print("--- Remaining content ---")
    print(remaining)
```

### Binary Files

Binary files are used for non-textual data, such as images, audio, executables, or serialized Python objects. When working with binary files, you use the `'b'` mode (e.g., `'rb'`, `'wb'`) and read/write `bytes` objects instead of `str`.

```python
# Writing binary data
with open("binary_example.bin", "wb") as f:
    f.write(b"\x01\x02\x03\x04") # b prefix creates a bytes literal
    f.write(bytes([10, 20, 30])) # Convert list of ints to bytes

# Reading binary data
with open("binary_example.bin", "rb") as f:
    data = f.read()
    print(data) # Output: b'\x01\x02\x03\x04\x0a\x14\x1e'
    print(list(data)) # Output: [1, 2, 3, 4, 10, 20, 30]
```

### Serialization: Storing and Exchanging Data

**Serialization** (also known as marshalling or pickling) is the process of converting an object or data structure into a format that can be easily stored (e.g., in a file or database) or transmitted across a network. **Deserialization** (unmarshalling or unpickling) is the reverse process.

#### JSON (JavaScript Object Notation)

JSON is a lightweight, human-readable data interchange format. It is widely used for web APIs and configuration files. Python has excellent built-in support for JSON via the `json` module.

*   `json.dump()`: Serialize Python object to a JSON formatted stream (file-like object).
*   `json.dumps()`: Serialize Python object to a JSON formatted string.
*   `json.load()`: Deserialize JSON formatted stream (file-like object) to Python object.
*   `json.loads()`: Deserialize JSON formatted string to Python object.

```python
import json

data = {
    "name": "Alice",
    "age": 30,
    "is_student": False,
    "courses": [{"title": "Python", "credits": 3}, {"title": "Data Science", "credits": 4}]
}

# Serialize to a JSON string
json_string = json.dumps(data, indent=4) # indent for pretty printing
print("--- JSON String ---")
print(json_string)

# Serialize to a JSON file
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

# Deserialize from a JSON string
loaded_data_from_string = json.loads(json_string)
print("--- Loaded from String ---")
print(loaded_data_from_string["name"])

# Deserialize from a JSON file
with open("data.json", "r", encoding="utf-8") as f:
    loaded_data_from_file = json.load(f)
print("--- Loaded from File ---")
print(loaded_data_from_file["courses"][0]["title"])
```

Python types are converted to JSON types as follows:

| Python        | JSON        |
| :------------ | :---------- |
| `dict`        | `object`    |
| `list`, `tuple`| `array`     |
| `str`         | `string`    |
| `int`, `float`| `number`    |
| `True`        | `true`      |
| `False`       | `false`     |
| `None`        | `null`      |

#### CSV (Comma Separated Values)

CSV is a simple text-based format for tabular data. Each line typically represents a row, and values within a row are separated by a delimiter (usually a comma). Python's `csv` module handles the complexities of quoting, escaping, and different delimiters.

```python
import csv

# Data to write
users = [
    {"name": "Alice", "age": 30, "city": "New York"},
    {"name": "Bob", "age": 24, "city": "London"},
    {"name": "Charlie", "age": 35, "city": "Paris"}
]

# Writing to a CSV file
with open("users.csv", "w", newline="") as csvfile:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader() # Writes the header row
    for user in users:
        writer.writerow(user)

print("users.csv created.")

# Reading from a CSV file
with open("users.csv", "r", newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    print("--- Reading CSV ---")
    for row in reader:
        print(row["name"], row["age"])
```

*   `newline=""`: Important when opening CSV files to prevent blank rows.
*   `csv.writer` and `csv.reader`: For working with lists of lists.
*   `csv.DictWriter` and `csv.DictReader`: For working with dictionaries, which is often more convenient.

#### Pickle: Python Object Serialization

`pickle` is Python's native module for serializing and deserializing Python object structures. It can handle almost any Python object, including custom classes, functions, and complex data structures. However, `pickle` is **Python-specific** and **not secure** against maliciously constructed data.

*   `pickle.dump()`: Serialize Python object to a file-like object.
*   `pickle.dumps()`: Serialize Python object to a bytes object.
*   `pickle.load()`: Deserialize from a file-like object.
*   `pickle.loads()`: Deserialize from a bytes object.

```python
import pickle

class MyCustomObject:
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return f"MyCustomObject with value: {self.value}"

obj = MyCustomObject(123)
my_list = [1, "hello", obj]

# Serialize to bytes
pickled_bytes = pickle.dumps(my_list)
print("--- Pickled Bytes ---")
print(pickled_bytes)

# Deserialize from bytes
unpickled_list = pickle.loads(pickled_bytes)
print("--- Unpickled List ---")
print(unpickled_list)
print(unpickled_list[2].value)

# Serialize to a file
with open("data.pickle", "wb") as f:
    pickle.dump(my_list, f)

# Deserialize from a file
with open("data.pickle", "rb") as f:
    unpickled_list_from_file = pickle.load(f)
print("--- Unpickled from File ---")
print(unpickled_list_from_file)
```

**Security Warning:** Never unpickle data from an untrusted source, as it can execute arbitrary code. For data exchange with external systems or untrusted sources, always prefer secure, language-agnostic formats like JSON or XML.

### Conclusion

Effective file I/O and data serialization are essential skills for any Python developer. Whether you're working with simple text files, complex binary data, or structured data formats like JSON and CSV, Python's standard library provides powerful and easy-to-use tools. While `pickle` offers a convenient way to serialize Python objects, its security implications mean it should be used with caution. By mastering these techniques, you can ensure your applications can reliably store, retrieve, and exchange data, forming the backbone of robust data management strategies.
