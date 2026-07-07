## Chapter 20: Multithreading and Multiprocessing (concurrent.futures, IPC, shared memory)

Concurrency and parallelism are crucial for building responsive and high-performance applications. Python offers several mechanisms to achieve these, primarily through **multithreading** and **multiprocessing**. While Chapter 19 explained the Global Interpreter Lock (GIL) and its implications for CPython multithreading, this chapter will delve into the practical aspects of using threads and processes, including the `concurrent.futures` module for simplified concurrency, inter-process communication (IPC), and shared memory techniques.

### Multithreading: Concurrency within a Single Process

**Multithreading** involves running multiple threads of execution within a single process. Threads share the same memory space, making data sharing easy but also introducing challenges like race conditions and deadlocks. In CPython, due to the GIL, multithreading is best suited for I/O-bound tasks.

#### The `threading` Module

Python's `threading` module provides a high-level interface for working with threads.

```python
import threading
import time

def task(name):
    print(f"Thread {name}: Starting")
    time.sleep(2) # Simulate I/O operation
    print(f"Thread {name}: Finishing")

threads = []
for i in range(3):
    thread = threading.Thread(target=task, args=(f"T{i}",))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join() # Wait for all threads to complete

print("All threads finished.")
```

**Synchronization Primitives:**

When threads share data, synchronization mechanisms are essential to prevent race conditions.

*   **`Lock`:** A basic mutual exclusion lock. Only one thread can acquire the lock at a time.
    ```python
    import threading

    shared_data = 0
    lock = threading.Lock()

    def increment():
        global shared_data
        for _ in range(100000):
            lock.acquire()
            try:
                shared_data += 1
            finally:
                lock.release()

    threads = [threading.Thread(target=increment) for _ in range(5)]
    for t in threads: t.start()
    for t in threads: t.join()
    print(f"Final shared_data: {shared_data}") # Should be 500000
    ```
*   **`RLock` (Reentrant Lock):** Can be acquired multiple times by the same thread.
*   **`Semaphore`:** A counter that limits the number of threads that can access a resource concurrently.
*   **`Event`:** A simple way to communicate between threads. One thread signals an event, and other threads wait for it.
*   **`Condition`:** Allows threads to wait for a specific condition to be met and be notified when it changes.

### Multiprocessing: True Parallelism

**Multiprocessing** involves running multiple independent processes. Each process has its own Python interpreter and memory space, bypassing the GIL and enabling true parallelism for CPU-bound tasks. However, inter-process communication (IPC) is more complex than inter-thread communication.

#### The `multiprocessing` Module

Python's `multiprocessing` module mirrors the `threading` API but uses processes instead of threads.

```python
import multiprocessing
import time

def cpu_intensive_task(name):
    print(f"Process {name}: Starting CPU-intensive task")
    count = 0
    for _ in range(10**7):
        count += 1
    print(f"Process {name}: Finishing CPU-intensive task")

processes = []
for i in range(3):
    process = multiprocessing.Process(target=cpu_intensive_task, args=(f"P{i}",))
    processes.append(process)
    process.start()

for process in processes:
    process.join()

print("All processes finished.")
```

#### Inter-Process Communication (IPC)

Since processes have separate memory spaces, direct sharing of variables is not possible. IPC mechanisms are needed:

*   **`Queue`:** A FIFO (First-In, First-Out) queue for passing messages between processes.
    ```python
    import multiprocessing

    def producer(queue):
        for i in range(5):
            msg = f"Message {i}"
            queue.put(msg)
            print(f"Produced: {msg}")
        queue.put(None) # Sentinel to signal end

    def consumer(queue):
        while True:
            msg = queue.get()
            if msg is None:
                break
            print(f"Consumed: {msg}")

    q = multiprocessing.Queue()
    p1 = multiprocessing.Process(target=producer, args=(q,))
    p2 = multiprocessing.Process(target=consumer, args=(q,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
    ```
*   **`Pipe`:** A two-way communication channel between two processes.
*   **`Value` and `Array`:** For sharing simple data types (integers, floats) or arrays of data in shared memory. These are protected by locks.

### The `concurrent.futures` Module: Simplified Concurrency

The `concurrent.futures` module provides a high-level interface for asynchronously executing callables. It abstracts away the complexities of managing threads and processes directly, offering `ThreadPoolExecutor` and `ProcessPoolExecutor`.

#### `ThreadPoolExecutor`

For I/O-bound tasks, `ThreadPoolExecutor` manages a pool of threads.

```python
from concurrent.futures import ThreadPoolExecutor
import time
import requests

def fetch_url(url):
    try:
        response = requests.get(url, timeout=5)
        return f"Fetched {url}: {len(response.content)} bytes"
    except requests.exceptions.RequestException as e:
        return f"Error fetching {url}: {e}"

urls = [
    "https://www.google.com",
    "https://www.bing.com",
    "https://www.yahoo.com",
    "https://www.duckduckgo.com",
    "https://www.python.org"
]

with ThreadPoolExecutor(max_workers=5) as executor:
    # Map the function to the iterable of URLs
    results = executor.map(fetch_url, urls)

    for result in results:
        print(result)
```

#### `ProcessPoolExecutor`

For CPU-bound tasks, `ProcessPoolExecutor` manages a pool of processes.

```python
from concurrent.futures import ProcessPoolExecutor
import time

def expensive_computation(n):
    s = 0
    for i in range(n):
        s += i*i
    return s

numbers = [10**7, 10**7, 10**7, 10**7]

start_time = time.time()
with ProcessPoolExecutor(max_workers=4) as executor:
    results = executor.map(expensive_computation, numbers)

    for i, result in enumerate(results):
        print(f"Result for {numbers[i]}: {result}")

end_time = time.time()
print(f"Total time with ProcessPoolExecutor: {end_time - start_time:.2f} seconds")
```

`concurrent.futures` simplifies the management of worker pools and the collection of results, making it the preferred way to handle many concurrent tasks.

### Shared Memory

For `multiprocessing`, `Value` and `Array` from the `multiprocessing` module allow sharing simple data types and arrays of data between processes. These are stored in shared memory and are typically protected by locks to ensure data consistency.

```python
import multiprocessing

def modify_shared_value(num, arr):
    num.value += 1
    for i in range(len(arr)):
        arr[i] *= 2

if __name__ == '__main__':
    shared_num = multiprocessing.Value("i", 0) # "i" for signed int
    shared_array = multiprocessing.Array("i", [1, 2, 3, 4])

    print(f"Initial shared_num: {shared_num.value}")
    print(f"Initial shared_array: {list(shared_array)}")

    processes = []
    for _ in range(2):
        p = multiprocessing.Process(target=modify_shared_value, args=(shared_num, shared_array))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

    print(f"Final shared_num: {shared_num.value}") # Should be 2
    print(f"Final shared_array: {list(shared_array)}") # Should be [4, 8, 12, 16]
```

For more complex data structures, `multiprocessing.Manager` can create shared objects (lists, dictionaries, etc.) that can be accessed by multiple processes. These managed objects handle synchronization automatically.

### Choosing Between Multithreading and Multiprocessing

| Feature           | Multithreading (`threading`)                                | Multiprocessing (`multiprocessing`)                               |
| :---------------- | :---------------------------------------------------------- | :---------------------------------------------------------------- |
| **GIL Impact**    | Significant for CPU-bound tasks (only one thread executes Python bytecode at a time) | No GIL impact (each process has its own interpreter and GIL)      |
| **Use Case**      | Best for I/O-bound tasks (e.g., network requests, file I/O) | Best for CPU-bound tasks (e.g., heavy computations, data processing) |
| **Memory**        | Threads share the same memory space                         | Each process has its own separate memory space                    |
| **Data Sharing**  | Easy (shared variables), but requires explicit synchronization (locks) | More complex (IPC mechanisms like Queues, Pipes, shared memory)   |
| **Overhead**      | Low startup overhead, low memory footprint                  | Higher startup overhead, higher memory footprint                  |
| **Complexity**    | Can be complex to manage shared state and avoid race conditions | IPC adds complexity, but processes are more isolated              |

### Conclusion

Multithreading and multiprocessing are essential tools for building concurrent and parallel applications in Python. Understanding the nuances of the GIL is crucial for making informed decisions about which approach to use. Multithreading excels in I/O-bound scenarios where threads can release the GIL while waiting for external resources. Multiprocessing provides true parallelism for CPU-bound tasks by utilizing multiple CPU cores. The `concurrent.futures` module offers a simplified, high-level API for both, abstracting away much of the boilerplate. By mastering these concurrency primitives and choosing the right tool for the job, you can significantly improve the performance and responsiveness of your Python applications.
