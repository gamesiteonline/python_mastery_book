## Chapter 8: Classes and Objects (Self, init, class vs instance attributes)

Object-Oriented Programming (OOP) is a programming paradigm that uses "objects" – data structures consisting of data fields and methods – to design applications and computer programs. Python is a multi-paradigm language that fully supports OOP, allowing developers to model real-world entities and their interactions in a clear and intuitive way. This chapter introduces the core concepts of classes and objects in Python, focusing on the `self` parameter, the `__init__` method, and the distinction between class and instance attributes.

### What are Classes and Objects?

In OOP:

*   A **class** is a blueprint or a template for creating objects. It defines a set of attributes (data) and methods (functions) that the objects created from the class will have.
*   An **object** (or instance) is a concrete realization of a class. It is a specific entity created based on the class blueprint, possessing its own unique set of data while sharing the methods defined by the class.

Think of a class as the design for a car, and an object as an actual car manufactured from that design. Each car (object) will have its own color, mileage, and owner, but all cars share the same fundamental design (class) with attributes like `make`, `model`, and methods like `start_engine()` or `brake()`.

### Defining a Class

Classes are defined using the `class` keyword, followed by the class name (conventionally capitalized using CamelCase) and a colon. The class body is indented.

```python
class Dog:
    # Class attribute
    species = "Canis familiaris"

    def __init__(self, name, age):
        # Instance attributes
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

    def description(self):
        return f"{self.name} is {self.age} years old."
```

### The `self` Parameter

You might have noticed the `self` parameter in the method definitions (`__init__`, `bark`, `description`). `self` is a convention (not a keyword) that refers to the instance of the class itself. When you call a method on an object, Python automatically passes the object instance as the first argument to the method. This allows the method to access and manipulate the object's attributes.

Consider this:

```python
my_dog = Dog("Buddy", 3)
# When you call my_dog.bark(), it's implicitly translated to Dog.bark(my_dog)
print(my_dog.bark()) # Output: Buddy says Woof!
```

Inside the `bark` method, `self` refers to `my_dog`, allowing `self.name` to correctly access `my_dog`'s name.

### The `__init__` Method: The Constructor

The `__init__` method is a special method in Python classes, often referred to as the **constructor**. It is automatically called when a new object (instance) of the class is created. Its primary purpose is to initialize the instance's attributes.

*   `self`: The first parameter, as discussed, refers to the newly created instance.
*   `name`, `age`: These are additional parameters that you pass when creating an object, used to set the initial state of the instance.

```python
# Creating an object (instance) of the Dog class
my_dog = Dog("Buddy", 3)
your_dog = Dog("Lucy", 5)

print(my_dog.name) # Output: Buddy
print(your_dog.name) # Output: Lucy
```

Without an `__init__` method, you would have to manually set each attribute after creating the object, which is less convenient and more error-prone.

### Class Attributes vs. Instance Attributes

Understanding the difference between class attributes and instance attributes is fundamental to writing correct and efficient OOP code in Python.

#### Class Attributes

*   **Definition:** Attributes that are defined directly within the class body, outside of any method.
*   **Scope:** They are shared by all instances of the class. If you change a class attribute, the change will be reflected in all instances (unless an instance has its own attribute with the same name).
*   **Use Cases:** Suitable for storing data that is common to all instances, such as constants, default values, or properties that describe the class itself rather than a specific instance.

In our `Dog` example, `species = "Canis familiaris"` is a class attribute. All dogs are of the same species.

```python
print(Dog.species)       # Access via class: Canis familiaris
print(my_dog.species)    # Access via instance: Canis familiaris
print(your_dog.species)  # Access via instance: Canis familiaris

# Changing a class attribute affects all instances
Dog.species = "Domestic Dog"
print(my_dog.species)    # Output: Domestic Dog
```

#### Instance Attributes

*   **Definition:** Attributes that are defined within a method (typically `__init__`) using the `self` keyword.
*   **Scope:** They are unique to each instance of the class. Each object has its own copy of instance attributes.
*   **Use Cases:** Suitable for storing data that describes the unique state of an individual object.

In our `Dog` example, `self.name` and `self.age` are instance attributes. Each dog object has its own name and age.

```python
print(my_dog.name) # Output: Buddy
print(my_dog.age)  # Output: 3

print(your_dog.name) # Output: Lucy
print(your_dog.age)  # Output: 5

# Changing an instance attribute only affects that instance
my_dog.age = 4
print(my_dog.age)    # Output: 4
print(your_dog.age)  # Output: 5 (unchanged)
```

#### Name Resolution Order

When you access an attribute using an instance (e.g., `my_dog.species`), Python first checks if the attribute exists as an instance attribute. If not, it then checks if it exists as a class attribute. This means an instance attribute can "shadow" a class attribute with the same name.

```python
class Example:
    class_attr = "I am a class attribute"

    def __init__(self, instance_attr):
        self.instance_attr = instance_attr

obj1 = Example("Instance 1")
obj2 = Example("Instance 2")

print(obj1.class_attr) # I am a class attribute

obj1.class_attr = "I am an instance attribute for obj1"
print(obj1.class_attr) # I am an instance attribute for obj1 (instance attribute created)
print(Example.class_attr) # I am a class attribute (class attribute unchanged)
print(obj2.class_attr) # I am a class attribute (obj2 still refers to class attribute)
```

### Methods: Instance, Class, and Static

Beyond instance methods (like `bark` and `description` that take `self` as the first argument), Python also supports class methods and static methods.

#### Instance Methods

*   Take `self` as the first argument.
*   Can access and modify both instance and class attributes.
*   Operate on a specific instance of the class.

#### Class Methods

*   Decorated with `@classmethod`.
*   Take `cls` (conventionally) as the first argument, which refers to the class itself, not an instance.
*   Can access and modify class attributes.
*   Cannot access instance attributes directly.
*   Often used as alternative constructors or for methods that operate on the class as a whole.

```python
class Car:
    total_cars = 0

    def __init__(self, make, model):
        self.make = make
        self.model = model
        Car.total_cars += 1

    @classmethod
    def get_total_cars(cls):
        return f"Total cars created: {cls.total_cars}"

    @classmethod
    def from_string(cls, car_string):
        make, model = car_string.split("-")
        return cls(make, model) # Calls the __init__ of the class

c1 = Car("Toyota", "Corolla")
c2 = Car.from_string("Honda-Civic") # Using class method as alternative constructor

print(Car.get_total_cars()) # Output: Total cars created: 2
print(c1.get_total_cars())  # Can also be called from an instance
```

#### Static Methods

*   Decorated with `@staticmethod`.
*   Do not take `self` or `cls` as their first argument.
*   Cannot access instance or class attributes directly.
*   Behave like regular functions but are logically associated with the class.
*   Often used for utility functions that don't need to interact with the class or instance state.

```python
class MathOperations:
    @staticmethod
    def add(x, y):
        return x + y

    @staticmethod
    def multiply(x, y):
        return x * y

print(MathOperations.add(5, 3)) # Output: 8
```

This chapter has laid the essential groundwork for understanding classes and objects in Python. Mastering these concepts is crucial for building scalable, maintainable, and robust applications using the object-oriented paradigm.
