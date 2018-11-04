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
    context.subscriptions.push(vscode.commands.registerCommand("cpp_projects.newProject", newProject));
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
