## Chapter 9: Inheritance, Polymorphism, and Composition

Object-Oriented Programming (OOP) is not just about creating classes and objects; it's also about how these classes relate to each other. Inheritance, polymorphism, and composition are three fundamental principles that enable code reuse, flexibility, and better organization in OOP. This chapter will explore these concepts in detail, including Method Resolution Order (MRO), the `super()` function, and the use of Mixins.

### Inheritance: Building on Existing Classes

**Inheritance** is a mechanism that allows a new class (the **child class** or **subclass**) to inherit attributes and methods from an existing class (the **parent class** or **superclass**). This promotes code reuse and establishes an "is-a" relationship between classes (e.g., a `Dog` *is a* `Animal`).

#### Defining Subclasses

To define a subclass, you include the parent class name in parentheses after the child class name.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement abstract method")

    def eat(self):
        return f"{self.name} is eating."

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name) # Call the parent class's __init__ method
        self.breed = breed

    def speak(self):
        return f"{self.name} barks."

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)
        self.color = color

    def speak(self):
        return f"{self.name} meows."

dog = Dog("Buddy", "Golden Retriever")
cat = Cat("Whiskers", "Tabby")

print(dog.eat())   # Output: Buddy is eating.
print(dog.speak()) # Output: Buddy barks.
print(cat.speak()) # Output: Whiskers meows.
```

#### The `super()` Function

The `super()` function provides a way to call methods from a parent class. In the example above, `super().__init__(name)` calls the `__init__` method of the `Animal` class, ensuring that the `name` attribute is properly initialized by the parent.

`super()` is particularly useful in multiple inheritance scenarios to ensure that methods are called in the correct order according to the Method Resolution Order (MRO).

#### Method Resolution Order (MRO)

When a method is called on an object, Python searches for that method in a specific order through the class hierarchy. This order is known as the **Method Resolution Order (MRO)**. For single inheritance, the MRO is straightforward: Python looks in the current class, then its parent, then its grandparent, and so on.

For multiple inheritance (when a class inherits from multiple parent classes), the MRO becomes more complex. Python uses the C3 linearization algorithm to determine the MRO, which ensures that the order is consistent and deterministic. You can inspect the MRO of any class using its `__mro__` attribute or the `help()` function.

```python
class A:
    def method(self): print("Method A")

class B(A):
    def method(self): print("Method B")

class C(A):
    def method(self): print("Method C")

class D(B, C):
    pass

d = D()
d.method() # Output: Method B (because B comes before C in D's MRO)

print(D.__mro__)
# Output: (<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)
```

### Polymorphism: Many Forms

**Polymorphism** (from Greek, meaning "many forms") allows objects of different classes to be treated as objects of a common type. In Python, this is often achieved through **duck typing**: "If it walks like a duck and quacks like a duck, then it must be a duck." This means that as long as an object has the required methods or attributes, its specific type doesn't matter.

Consider our `Animal` example. Both `Dog` and `Cat` objects have a `speak()` method, even though their implementations differ. We can write a function that interacts with any object that has a `speak()` method, without needing to know its exact class.

```python
def make_animal_speak(animal):
    print(animal.speak())

make_animal_speak(dog) # Output: Buddy barks.
make_animal_speak(cat) # Output: Whiskers meows.

class Duck:
    def speak(self):
        return "Quack!"

duck = Duck()
make_animal_speak(duck) # Output: Quack!
```

Polymorphism is a powerful concept that leads to more flexible and extensible code, as you can write generic functions that operate on a variety of objects.

### Composition: Building with Parts

While inheritance represents an "is-a" relationship, **composition** represents a "has-a" relationship. It involves building complex objects by combining simpler objects. Instead of inheriting behavior, a class can contain instances of other classes as attributes, delegating responsibilities to them.

Composition is often preferred over inheritance when there isn't a clear "is-a" relationship, or when you want to avoid the complexities of deep inheritance hierarchies. It promotes loose coupling and greater flexibility.

```python
class Engine:
    def start(self):
        return "Engine started."

    def stop(self):
        return "Engine stopped."

class Wheels:
    def rotate(self):
        return "Wheels rotating."

class Car:
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.engine = Engine() # Car has an Engine
        self.wheels = Wheels() # Car has Wheels

    def drive(self):
        return f"{self.make} {self.model} is driving: {self.engine.start()} and {self.wheels.rotate()}"

my_car = Car("Tesla", "Model S")
print(my_car.drive())
# Output: Tesla Model S is driving: Engine started. and Wheels rotating.
```

Here, `Car` doesn't inherit from `Engine` or `Wheels`; instead, it *has* an `Engine` and *has* `Wheels`. This allows for more flexible designs, as you can easily swap out different types of engines or wheels without affecting the `Car` class's core logic.

### Mixins: Reusable Behavior

**Mixins** are a special type of class designed to provide a set of methods to other classes. They are not meant to be instantiated on their own and typically do not define their own `__init__` method (or if they do, they call `super().__init__()`). Mixins are a way to achieve multiple inheritance in a controlled manner, adding specific functionalities to classes without implying a strong "is-a" relationship.

```python
class LoggerMixin:
    def log(self, message):
        print(f"[LOG] {self.__class__.__name__}: {message}")

class NotifierMixin:
    def notify(self, message):
        print(f"[NOTIFICATION] {self.__class__.__name__}: {message}")

class User(LoggerMixin, NotifierMixin):
    def __init__(self, name):
        self.name = name

    def register(self):
        self.log(f"{self.name} registered.")
        self.notify(f"Welcome, {self.name}!")

user = User("Alice")
user.register()
# Output:
# [LOG] User: Alice registered.
# [NOTIFICATION] User: Welcome, Alice!
```

In this example, `User` inherits logging and notification capabilities from `LoggerMixin` and `NotifierMixin`. This allows for flexible composition of behaviors without creating complex inheritance hierarchies.

### Conclusion

Inheritance, polymorphism, and composition are powerful tools in the OOP paradigm. Inheritance allows for code reuse and establishes hierarchical relationships, while polymorphism enables flexible interaction with objects of different types. Composition, often favored for its flexibility, allows building complex objects from simpler ones. Mixins provide a way to inject specific behaviors into classes. Mastering these concepts is essential for designing robust, maintainable, and scalable Python applications.
