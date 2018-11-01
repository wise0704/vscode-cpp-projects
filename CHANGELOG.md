# Change Log
All notable changes to the "C++ Projects" extension will be documented in this file.

## [0.1.0] - 2018/11/01 (Initial Preview Release)
> ### Added
> + Command: `cpp_projects.newProject` - automatically creates `.vscode/tasks.json` and `.vscode/launch.json` files and other common folders.
>   + Supports MSVC setup for Windows environment.
>   + Supports GCC setup for Linux environment, or GCC with MinGW-w64 setup for Windows 
> + Setting: `cpp_projects.msvc_path` - Path to the MSVC build tools (vcvarsall.bat).
> + Setting: `cpp_projects.make_path` - Path to Make.
> + Setting: `cpp_projects.gcc32_path` - Path to the 32-bit GNU Compiler Collection directory.
> + Setting: `cpp_projects.gcc64_path` - Path to the 64-bit GNU Compiler Collection directory.
> + Setting: `cpp_projects.gdb_path` - Path to the GNU Project Debugger.