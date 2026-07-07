## Chapter 26: Packaging, Dependency Management, and CI/CD (Pip, Poetry, Dockerizing Python, PyPI publishing)

Developing Python applications involves more than just writing code; it also includes managing dependencies, packaging your project for distribution, and automating the build, test, and deployment process. This chapter will cover essential practices for **packaging** your Python projects, effective **dependency management** using tools like `pip` and `Poetry`, **Dockerizing** Python applications for consistent environments, and the basics of **Continuous Integration/Continuous Deployment (CI/CD)** for automated software delivery.

### Packaging Python Projects

Packaging refers to the process of bundling your Python code and its metadata into a distributable format, typically a wheel (`.whl`) or source distribution (`.tar.gz`). This allows others to easily install and use your project.

#### Project Structure

A typical Python project structure for packaging looks like this:

```
my_project/
├── my_project/
│   ├── __init__.py
│   ├── module1.py
│   └── module2.py
├── tests/
│   ├── test_module1.py
│   └── test_module2.py
├── README.md
├── LICENSE
├── pyproject.toml  # Modern project configuration
└── setup.py        # Traditional project configuration (still widely used)
```

#### `pyproject.toml` (Modern Packaging)

PEP 518 introduced `pyproject.toml` as a standardized way to specify build system requirements and project metadata. It is becoming the preferred way to configure Python projects.

```toml
# pyproject.toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "my-awesome-project"
version = "0.1.0"
authors = [
  { name="Fahad Mohamed", email="fahad.mohamed@example.com" },
]
description = "A short description of my awesome project."
readme = "README.md"
requires-python = ">=3.8"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]
dependencies = [
    "requests>=2.28.1",
    "numpy",
]

[project.urls]
"Homepage" = "https://github.com/gamesiteonline/my-awesome-project"
"Bug Tracker" = "https://github.com/gamesiteonline/my-awesome-project/issues"

[tool.setuptools.packages.find]
where = ["my_project"]
```

#### `setup.py` (Traditional Packaging)

Historically, `setup.py` (using `setuptools`) was the primary way to define project metadata and build instructions.

```python
# setup.py
from setuptools import setup, find_packages

setup(
    name=\
