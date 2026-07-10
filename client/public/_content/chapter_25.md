## Chapter 25: Database Integration (SQLite, SQLAlchemy ORM, PostgreSQL)

Data persistence is a fundamental requirement for most applications. Databases provide a structured and reliable way to store, retrieve, and manage data. Python offers excellent tools for interacting with various types of databases, from lightweight embedded solutions to powerful client-server systems. This chapter will explore database integration in Python, focusing on SQLite for simple applications, the powerful SQLAlchemy ORM (Object-Relational Mapper) for abstracting database interactions, and connecting to a more robust database like PostgreSQL.

### SQLite: Embedded Relational Database

SQLite is a C library that provides a lightweight, file-based relational database. It is serverless, self-contained, and requires no separate server process, making it ideal for local storage, mobile applications, and small-to-medium sized projects. Python has built-in support for SQLite via the `sqlite3` module.

#### Connecting to SQLite and Basic Operations

```python
import sqlite3

# Connect to a database (creates it if it doesn't exist)
conn = sqlite3.connect("mydatabase.db")
cursor = conn.cursor() # A cursor object allows you to execute SQL commands

# Create a table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
""")
conn.commit() # Commit changes to the database

# Insert data
try:
    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", ("Alice", "alice@example.com"))
    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", ("Bob", "bob@example.com"))
    conn.commit()
except sqlite3.IntegrityError as e:
    print(f"Error inserting data: {e}")
    conn.rollback() # Rollback changes if an error occurs

# Query data
cursor.execute("SELECT * FROM users;")
users = cursor.fetchall() # Fetch all results
print("All users:", users)

cursor.execute("SELECT name, email FROM users WHERE id = ?;", (1,))
user = cursor.fetchone() # Fetch a single result
print("User with ID 1:", user)

# Update data
cursor.execute("UPDATE users SET email = ? WHERE name = ?;", ("alice.smith@example.com", "Alice"))
conn.commit()

# Delete data
cursor.execute("DELETE FROM users WHERE name = ?;", ("Bob",))
conn.commit()

# Verify update and delete
cursor.execute("SELECT * FROM users;")
print("Users after update/delete:", cursor.fetchall())

conn.close() # Close the connection
```

**Key Concepts:**

*   **Connection Object (`conn`):** Represents the connection to the database. It manages transactions.
*   **Cursor Object (`cursor`):** Allows you to execute SQL queries and fetch results.
*   **`execute()`:** Executes a single SQL statement.
*   **`commit()`:** Saves the current transaction to the database. Without `commit()`, changes are not permanent.
*   **`rollback()`:** Undoes changes made in the current transaction.
*   **`fetchone()`, `fetchall()`, `fetchmany()`:** Methods to retrieve query results.
*   **Parameter Substitution (`?`):** Always use parameter substitution (e.g., `VALUES (?, ?)`) to prevent SQL injection vulnerabilities.

### SQLAlchemy ORM: Object-Relational Mapping

Directly writing SQL queries can be tedious and error-prone, especially for complex applications. **SQLAlchemy** is a powerful and flexible SQL toolkit and Object-Relational Mapper (ORM) for Python. An ORM allows you to interact with your database using Python objects instead of raw SQL, mapping Python classes to database tables and object attributes to table columns.

SQLAlchemy has two main components:

1.  **SQLAlchemy Core:** Provides a SQL expression language that allows you to construct SQL queries programmatically.
2.  **SQLAlchemy ORM:** Builds on Core to provide an object-relational mapping layer.

#### Installation

```bash
pip install sqlalchemy
```

#### Defining Models (Declarative Base)

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Define the database engine
# For SQLite, use 'sqlite:///your_database.db'
# For PostgreSQL, use 'postgresql://user:password@host:port/database_name'
engine = create_engine("sqlite:///sqlalchemy_example.db")

# 2. Declare a base class for declarative models
Base = declarative_base()

# 3. Define your models (Python classes mapped to database tables)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, name=\'{self.name}\', email=\'{self.email}\')>"

# 4. Create tables in the database
Base.metadata.create_all(engine)

# 5. Create a session factory
Session = sessionmaker(bind=engine)
```

#### Basic CRUD Operations with ORM

```python
# Create a session
session = Session()

# Create (Add) objects
user1 = User(name="Alice", email="alice@example.com")
user2 = User(name="Bob", email="bob@example.com")
session.add(user1)
session.add(user2)

try:
    session.commit()
except Exception as e:
    session.rollback()
    print(f"Error adding users: {e}")

# Read (Query) objects
all_users = session.query(User).all()
print("All users:", all_users)

alice = session.query(User).filter_by(name="Alice").first()
print("Alice:", alice)

# Filter with more complex conditions
alice_by_email = session.query(User).filter(User.email == "alice@example.com").one_or_none()
print("Alice by email:", alice_by_email)

# Update objects
if alice:
    alice.email = "alice.smith@example.com"
    session.commit()
    print("Alice updated:", session.query(User).filter_by(name="Alice").first())

# Delete objects
if user2:
    session.delete(user2)
    session.commit()
    print("Users after deleting Bob:", session.query(User).all())

session.close()
```

**Key Concepts:**

*   **Engine:** The entry point to the database, managing connections.
*   **Base:** A declarative base class that your models inherit from.
*   **Model:** A Python class that maps to a database table.
*   **Session:** The primary way to interact with the database. It represents a "staging zone" for all objects loaded or associated with it. Changes are committed to the database via the session.
*   **`query()`:** Used to construct queries against your models.
*   **`filter_by()` / `filter()`:** Methods to specify query conditions.

### Connecting to PostgreSQL

PostgreSQL is a powerful, open-source object-relational database system known for its reliability, feature robustness, and performance. To connect Python to PostgreSQL, you typically use a database adapter like `psycopg2`.

#### Installation

```bash
pip install psycopg2-binary
```

#### Basic PostgreSQL Connection and Query

First, ensure you have a PostgreSQL server running and a database created (e.g., `mydatabase`) with a user (e.g., `myuser`) and password (e.g., `mypassword`).

```python
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="mydatabase",
        user="myuser",
        password="mypassword"
    )
    cursor = conn.cursor()

    # Create a table (if not exists)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL
    );
    """)
    conn.commit()

    # Insert data
    cursor.execute("INSERT INTO products (name, price) VALUES (%s, %s);", ("Laptop", 1200.00))
    cursor.execute("INSERT INTO products (name, price) VALUES (%s, %s);", ("Mouse", 25.50))
    conn.commit()

    # Query data
    cursor.execute("SELECT * FROM products;")
    products = cursor.fetchall()
    print("All products:", products)

except psycopg2.Error as e:
    print(f"Database error: {e}")
finally:
    if conn:
        cursor.close()
        conn.close()
        print("PostgreSQL connection closed.")
```

**Note:** PostgreSQL uses `%s` for parameter substitution, unlike SQLite's `?`.

#### Using SQLAlchemy with PostgreSQL

To use SQLAlchemy with PostgreSQL, you simply change the `create_engine` string:

```python
# ... (imports and model definition remain the same)

engine = create_engine("postgresql://myuser:mypassword@localhost:5432/mydatabase")

Base.metadata.create_all(engine) # Creates tables if they don't exist

Session = sessionmaker(bind=engine)
session = Session()

# ... (CRUD operations are the same as with SQLite)

session.close()
```

SQLAlchemy abstracts away the underlying database driver, allowing you to switch databases with minimal code changes, which is a significant advantage for application portability.

### Conclusion

Database integration is a cornerstone of most data-driven applications. Python provides flexible options, from the simplicity of SQLite for embedded use cases to the power of PostgreSQL for enterprise-grade solutions. The `sqlite3` module offers direct SQL interaction, while SQLAlchemy provides a sophisticated ORM that significantly simplifies database operations by allowing you to work with Python objects. Mastering these tools enables you to build robust applications capable of efficiently storing, managing, and retrieving data, forming the persistent backbone of your Python projects.
