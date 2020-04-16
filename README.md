# C++ Projects for Visual Studio Code

This preview release of the extension enables an easier setup of C++ projects in Visual Studio Code.

## Features

* Guided creation of C++ projects: automatically creates `.vscode/tasks.json` and `.vscode/launch.json` files and other common folders.
  * Supports MSVC setup for Windows environment.
  * Supports GCC setup for Linux environment, or GCC with MinGW-w64 setup for Windows environment.

## Requirements

* _[Recommended]_ C/C++ for Visual Studio Code ([`ms-vscode.cpptools`](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools))

## Extension Settings

Name | Description
--- | ---
`cpp_projects.msvc_path` | Path to the MSVC build tools (vcvarsall.bat).
`cpp_projects.make_path` | Path to Make.
`cpp_projects.gcc32_path` | Path to the 32-bit GNU Compiler Collection directory (bin).
`cpp_projects.gcc64_path` | Path to the 64-bit GNU Compiler Collection directory (bin).
`cpp_projects.gdb32_path` | Path to the 32-bit GNU Project Debugger.
`cpp_projects.gdb32_path` | Path to the 64-bit GNU Project Debugger.

## External Links

* [Known Issues](https://github.com/wise0704/daniel-jeong.cpp-projects/issues)
* [Release History](https://github.com/wise0704/daniel-jeong.cpp-projects/blob/master/CHANGELOG.md)
