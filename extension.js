"use strict";

var __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => new (P || (P = Promise))((resolve, reject) =>
{
    (function step(result)
    {
        result.done ? resolve(result.value) : new P(resolve => void resolve(result.value)).then(
            value => { try { step(generator.next(value)); } catch (e) { reject(e); } },
            value => { try { step(generator["throw"](value)); } catch (e) { reject(e); } });
    })((generator = generator.apply(thisArg, _arguments || [])).next());
}));

Object.defineProperty(exports, "__esModule", { value: true });

const vscode = require("vscode");
const fs = require("fs");

const TEMPLATES = "templates";
const PROJECTS = "projects";
const DATA_JSON = "data.json";
const MAIN_CPP = "src/main.cpp";
const SETTINGS_NS = "cpp_projects";
let extensionPath;

exports.activate = context =>
{
    extensionPath = context.extensionPath;

    let newProjectCommand = vscode.commands.registerCommand("cpp_projects.newProject", newProject);
    context.subscriptions.push(newProjectCommand);

    // let buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    // buildButton.command = 'workbench.action.tasks.build';
    // buildButton.text = '⚙ Build';
    // buildButton.tooltip = 'Build C++ Project';
    // buildButton.show();
    // context.subscriptions.push(buildAndRunButton);

    // let buildAndRunButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    // buildAndRunButton.command = 'workbench.action.tasks.test';
    // buildAndRunButton.text = '▶ Build & Run';
    // buildAndRunButton.tooltip = 'Build & Run C++ Project';
    // buildAndRunButton.show();
    // context.subscriptions.push(buildButton);
};

exports.deactivate = () => { };

const newProject = () => __awaiter(this, void 0, void 0, function* ()
{
    try
    {
        let folder;
        if (!vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders.length)
        {
            vscode.window.showErrorMessage("Open a folder or workspace before creating a new project.");
            return;
        }
        else if (vscode.workspace.workspaceFolders.length > 1)
        {
            folder = yield vscode.window.showWorkspaceFolderPick();
            if (!folder)
            {
                return;
            }
            folder = folder.uri.fsPath;
        }
        else
        {
            folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        }

        let data = JSON.parse(fs.readFileSync(`${extensionPath}/${TEMPLATES}/${PROJECTS}/${DATA_JSON}`, "utf8"));

        let template = yield vscode.window.showQuickPick(Object.keys(data));
        if (!template)
        {
            return;
        }
        template = data[template];

        let args = [];
        for (const key in template.arguments)
        {
            const value = template.arguments[key];
            let arg = { key: new RegExp(`\<${key}(\:(.+)\,(.+))?\>`, "g"), value: null };
            switch (value.type)
            {
                case "setting":
                    arg.value = vscode.workspace.getConfiguration(SETTINGS_NS).get(value.key);
                    break;
                case "inputBox":
                    arg.value = (yield vscode.window.showInputBox(value.options)) || value.default;
                    break;
                case "quickPick":
                    arg.value = (yield vscode.window.showQuickPick(value.items, value.options)) || value.default;
                    break;
            }
            args.push(arg);
        }
        const applyArgs = str =>
        {
            for (const { key, value } of args)
            {
                str = str.replace(key, (...group) => group[1] ? value.replace(new RegExp(group[2], "g"), group[3]) : value);
            }
            return str;
        }

        for (const directory of template.directories)
        {
            if (!fs.existsSync(`${folder}/${directory}`))
            {
                fs.mkdirSync(`${folder}/${directory}`);
            }
        }

        for (const templateFile in template.files)
        {
            const targetFile = applyArgs(template.files[templateFile]);
            if (fs.existsSync(`${folder}/${targetFile}`))
            {
                let response = yield vscode.window.showQuickPick(["Yes", "No"],
                    {
                        ignoreFocusOut: true,
                        placeHolder: `The file "${targetFile}" already exists. Overwrite?`
                    });
                if (!response || response === "No")
                {
                    continue;
                }
            }

            let fileText = applyArgs(fs.readFileSync(`${extensionPath}/${TEMPLATES}/${PROJECTS}/${templateFile}`, "utf8"));
            fs.writeFileSync(`${folder}/${targetFile}`, fileText);

            if (templateFile === MAIN_CPP)
            {
                vscode.window.showTextDocument(vscode.Uri.file(`${folder}/${targetFile}`)).then(editor =>
                {
                    const entryPoint = "// entry point";
                    let doc = editor.document;
                    let offset = doc.getText().indexOf(entryPoint);
                    editor.selection = new vscode.Selection(doc.positionAt(offset), doc.positionAt(offset + entryPoint.length));
                });
            }
        }
    }
    catch (error)
    {
        vscode.window.showErrorMessage(`C++ Projects Error: Failed to create a new project.    ${error}`);
    }
});

// const createClass = () => __awaiter(this, void 0, void 0, function* ()
// {
//     try
//     {
//         const data = yield node_fetch.default(`${baseUrl}/templates/classes/files.json`);
//         const templates = yield data.json();
//         const template_files = [];
//         for (let tname in templates)
//         {
//             template_files.push(tname);
//         }
//         const selected = yield window.showQuickPick(template_files);
//         if (!selected)
//         {
//             return;
//         }
//         const val = yield window.showInputBox({ prompt: `Enter class name` });
//         if (!val || !window.activeTextEditor)
//         {
//             return;
//         }
//         const currentFolderWorkspace = workspace.getWorkspaceFolder(window.activeTextEditor.document.uri);
//         if (!currentFolderWorkspace)
//         {
//             return;
//         }
//         const currentFolder = currentFolderWorkspace.uri.fsPath;
//         for (let file in templates[selected])
//         {
//             const value = yield fetch(`${baseUrl}/templates/classes/${selected}/${file}`);
//             let data = yield value.text();
//             data = data.replace(new RegExp('easyclass', 'g'), val);
//             writeFileSync(`${currentFolder}/${templates[selected][file].folder}/${val}.${templates[selected][file].extension}`, data);
//             workspace.openTextDocument(`${currentFolder}/${templates[selected][file].folder}/${val}.${templates[selected][file].extension}`)
//                 .then(doc => window.showTextDocument(doc, { preview: false }));
//         }
//     }
//     catch (err)
//     {
//         window.showErrorMessage(`Easy C++ error: ${err}`);
//     }
// });

// const createGetterSetter = (getter, setter) =>
// {
//     if (!getter && !setter)
//     {
//         getter = setter = true;
//     }
//     let editor = window.activeTextEditor;
//     if (!editor)
//     {
//         return;
//     }
//     const getterSnippet = (variableName, variableType) =>
//     {
//         return new SnippetString(`
//     ${variableType} get${variableName.charAt(0).toUpperCase() + variableName.substring(1)}() {
//         return ${variableName};
//     }
//     `);
//     };
//     const setterSnippet = (variableName, variableType) =>
//     {
//         return new SnippetString(`
//     void set${variableName.charAt(0).toUpperCase() + variableName.substring(1)}(${variableType} ${variableName}) {
//         this->${variableName} = ${variableName};
//     }
//     `);
//     };
//     let selection = editor.selection;
//     let selectedText = editor.document.getText(new Range(selection.start, selection.end)).trim();
//     let lines = selectedText.split('\n');
//     let createData = [];
//     for (let line of lines)
//     {
//         if (!/\s*\w+\s+[*]*\w+\s*(,\s*\w+\s*)*;+/.test(line))
//         {
//             window.showErrorMessage(`Syntax error, cannot create getter or setter: ${line}`);
//             return;
//         }
//         let type = line.search(/\w+\s+/);
//         let firstSpace = line.indexOf(' ', type);
//         let vType = line.substring(type, firstSpace).trim();
//         line = line.substring(firstSpace).trim();
//         let vNames = line.replace(' ', '').replace(';', '').split(',');
//         vNames.forEach(e =>
//         {
//             while (e.includes('*'))
//             {
//                 e = e.replace('*', '');
//                 vType += '*';
//             }
//             createData.push({ type: vType, name: e });
//         });
//     }
//     for (let e of createData)
//     {
//         if (getter)
//         {
//             editor.insertSnippet(getterSnippet(e.name, e.type), new Position(selection.end.line + 1, 0));
//         }
//         if (setter)
//         {
//             editor.insertSnippet(setterSnippet(e.name, e.type), new Position(selection.end.line + 1, 0));
//         }
//     }
// };

// const createGetter = () => createGetterSetter(true, false);
// const createSetter = () => createGetterSetter(false, true);