## Chapter 24: Network Programming and APIs (Requests, sockets, RESTful principles)

Modern applications are rarely isolated; they constantly interact with other systems over networks. **Network programming** in Python allows your applications to communicate with servers, clients, and web services. This chapter will explore the fundamentals of network communication using **sockets**, delve into making HTTP requests with the popular `requests` library, and introduce the core principles of **RESTful APIs** for building web services.

### Sockets: The Foundation of Network Communication

**Sockets** are the endpoints of a two-way communication link between two programs running on the network. They provide a low-level interface for network communication, allowing you to send and receive data over TCP/IP or UDP.

Python's built-in `socket` module provides access to the BSD socket interface.

#### TCP Client Example

```python
import socket

HOST = 'www.google.com'  # The server's hostname or IP address
PORT = 80               # The port used by the server (HTTP)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    # Send an HTTP GET request
    request = b"GET / HTTP/1.1\r\nHost: www.google.com\r\nConnection: close\r\n\r\n"
    s.sendall(request)

    response = b''
    while True:
        data = s.recv(1024) # Receive up to 1024 bytes
        if not data:
            break
        response += data

    print(response.decode('utf-8'))
```

**Explanation:**

*   `socket.socket(socket.AF_INET, socket.SOCK_STREAM)`: Creates a socket object.
    *   `AF_INET`: Specifies the address family (IPv4).
    *   `SOCK_STREAM`: Specifies the socket type (TCP, connection-oriented).
*   `s.connect((HOST, PORT))`: Establishes a connection to the server.
*   `s.sendall(request)`: Sends the entire HTTP request. `b` prefix denotes a bytes literal.
*   `s.recv(1024)`: Receives data from the socket. It's important to loop until all data is received, as `recv` might not return all data at once.
*   `response.decode('utf-8')`: Decodes the received bytes into a string.

#### TCP Server Example

```python
import socket

HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65432        # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT)) # Associate the socket with a specific network interface and port
    s.listen()           # Enable a server to accept connections
    conn, addr = s.accept() # Block and wait for an incoming connection
    with conn:
        print(f"Connected by {addr}")
        while True:
            data = conn.recv(1024)
            if not data:
                break
            print(f"Received: {data.decode('utf-8')}")
            conn.sendall(b"Echo: " + data) # Echo back the received data
```

**Explanation:**

*   `s.bind((HOST, PORT))`: Binds the socket to a specific IP address and port.
*   `s.listen()`: Puts the server socket into listening mode, waiting for client connections.
*   `s.accept()`: Blocks execution and waits for an incoming connection. When a client connects, it returns a new socket object (`conn`) representing the connection to the client, and the client's address (`addr`).
*   The inner `with conn:` block handles communication with the connected client.

While sockets provide fine-grained control, they are low-level. For most web-related tasks, higher-level libraries are preferred.

### `requests`: HTTP for Humans

The `requests` library is the de facto standard for making HTTP requests in Python. It simplifies interaction with web services, handling complexities like connection pooling, SSL verification, and cookie persistence.

#### Installation

```bash
pip install requests
```

#### Making GET Requests

```python
import requests

# Simple GET request
response = requests.get('https://api.github.com/users/octocat')
print(response.status_code) # HTTP status code (e.g., 200 OK)
print(response.headers['Content-Type']) # Content-Type header
print(response.json()) # Parse JSON response into a Python dictionary

# GET request with parameters
params = {'q': 'python requests', 'page': 1}
response = requests.get('https://api.github.com/search/repositories', params=params)
print(response.url) # The actual URL that was fetched
print(response.json()['items'][0]['full_name']) # Accessing data from the JSON response
```

#### Making POST Requests

```python
import requests

# POST request with JSON data
url = 'https://httpbin.org/post'
data = {'name': 'Alice', 'job': 'Software Engineer'}
headers = {'Content-Type': 'application/json'}

response = requests.post(url, json=data, headers=headers)
print(response.status_code)
print(response.json()['json']) # The JSON data sent in the request body

# POST request with form data
form_data = {'username': 'testuser', 'password': 'testpassword'}
response = requests.post(url, data=form_data)
print(response.json()['form']) # The form data sent in the request body
```

#### Other Request Types and Features

*   **PUT, DELETE, HEAD, OPTIONS:** `requests` provides methods for all standard HTTP verbs (e.g., `requests.put()`, `requests.delete()`).
*   **Headers:** You can customize request headers using the `headers` parameter.
*   **Authentication:** Supports various authentication methods (Basic, Digest, OAuth) with the `auth` parameter.
*   **Timeouts:** Prevent requests from hanging indefinitely using the `timeout` parameter.
*   **Error Handling:** `response.raise_for_status()` raises an `HTTPError` for bad responses (4xx or 5xx client or server errors).
*   **Sessions:** `requests.Session()` allows you to persist certain parameters across requests, such as cookies, for more efficient interaction with APIs that require session management.

### RESTful Principles: Designing Web APIs

**REST (Representational State Transfer)** is an architectural style for designing networked applications. **RESTful APIs** (or REST APIs) are web services that adhere to the principles of REST. They are stateless, client-server, cacheable, and use a uniform interface.

#### Key Principles of REST

1.  **Client-Server Architecture:** Separation of concerns between the client (front-end) and the server (back-end). Clients handle the user interface and user experience, while servers manage data and business logic.
2.  **Statelessness:** Each request from client to server must contain all the information needed to understand the request. The server should not store any client context between requests. This improves scalability and reliability.
3.  **Cacheability:** Responses from the server should explicitly state whether they are cacheable or not, to improve performance and network efficiency.
4.  **Uniform Interface:** A standardized way of interacting with the service, simplifying client-server communication.
    *   **Resource-Based:** The API exposes resources (e.g., `/users`, `/products`) that are identified by URIs.
    *   **Standard HTTP Methods:** Uses standard HTTP methods (verbs) to perform actions on resources:
        *   `GET`: Retrieve a resource or a collection of resources.
        *   `POST`: Create a new resource.
        *   `PUT`: Update an existing resource (replace the entire resource).
        *   `PATCH`: Partially update an existing resource.
        *   `DELETE`: Remove a resource.
    *   **Self-descriptive Messages:** Each message includes enough information to describe how to process the message.
    *   **HATEOAS (Hypermedia as the Engine of Application State):** Resources should contain links to related resources, guiding the client through the application state.

#### Example of RESTful API Interaction

Consider an API for managing a collection of books:

| Action           | HTTP Method | URI                 | Request Body (Example)       | Response Body (Example)                               |
| :--------------- | :---------- | :------------------ | :--------------------------- | :---------------------------------------------------- |
| Get all books    | `GET`       | `/books`            | None                         | `[{"id": 1, "title": "Book A"}, {"id": 2, "title": "Book B"}]` |
| Get a single book| `GET`       | `/books/1`          | None                         | `{"id": 1, "title": "Book A", "author": "Author X"}` |
| Create a book    | `POST`      | `/books`            | `{"title": "New Book", "author": "Author Y"}` | `{"id": 3, "title": "New Book", "author": "Author Y"}` (with new ID) |
| Update a book    | `PUT`       | `/books/1`          | `{"title": "Updated Title", "author": "Author X"}` | `{"id": 1, "title": "Updated Title", "author": "Author X"}` |
| Delete a book    | `DELETE`    | `/books/1`          | None                         | `204 No Content` or success message                   |

#### Designing a RESTful API (Python Example with Flask/FastAPI)

While building a full REST API is beyond the scope of this chapter, here's a conceptual example using a micro-framework like Flask or FastAPI (which we will cover in web development chapters):

```python
# Conceptual Flask example for a book API endpoint
from flask import Flask, jsonify, request

app = Flask(__name__)

books = [
    {"id": 1, "title": "Python Mastery", "author": "Fahad Mohamed"},
    {"id": 2, "title": "Learning Python", "author": "Mark Lutz"}
]
next_id = 3

@app.route('/books', methods=['GET'])
def get_books():
    return jsonify(books)

@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in books if b['id'] == book_id), None)
    if book:
        return jsonify(book)
    return jsonify({"message": "Book not found"}), 404

@app.route('/books', methods=['POST'])
def create_book():
    global next_id
    new_book = request.get_json()
    new_book['id'] = next_id
    next_id += 1
    books.append(new_book)
    return jsonify(new_book), 201 # 201 Created status code

# ... other methods like PUT, DELETE

if __name__ == '__main__':
    app.run(debug=True)
```

This example demonstrates how different HTTP methods map to CRUD (Create, Read, Update, Delete) operations on a `/books` resource.

### Conclusion

Network programming is a cornerstone of modern software development. Understanding low-level sockets provides insight into how network communication works, while high-level libraries like `requests` simplify interaction with web services. Adhering to RESTful principles when designing and consuming APIs leads to scalable, maintainable, and interoperable web applications. Mastering these concepts is crucial for building Python applications that can effectively communicate and integrate within the vast network ecosystem of networked services.
