"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const withEditor = (f) => () => {
    const editor = vscode.window.activeTextEditor;
    if (editor)
        f(editor);
};
const move = (editor, num) => {
    const newPos = editor.selection.active.translate(0, num);
    editor.selection = new vscode.Selection(newPos, newPos);
};
const getWordAtPosition = (editor) => {
    const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
    if (!wordRange)
        return;
    return editor.document.getText(wordRange);
};
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vanjsHelper" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('vanjsHelper.insertSymbol', withEditor(editor => {
        editor.insertSnippet(new vscode.SnippetString('Symbol("")'));
        move(editor, 8);
    })), vscode.commands.registerCommand('vanjsHelper.insertLink', withEditor(async (editor) => {
        editor.insertSnippet(new vscode.SnippetString('Link("", "")'));
        move(editor, 6);
    })), vscode.commands.registerCommand('vanjsHelper.insertChild', withEditor(async (editor) => {
        editor.insertSnippet(new vscode.SnippetString('", , " '));
        move(editor, 3);
    })), vscode.commands.registerCommand('vanjsHelper.importComponent', withEditor(async (editor) => {
        const word = getWordAtPosition(editor);
        if (!word) {
            vscode.window.showErrorMessage("No symbol at the current point");
            return;
        }
        const doc = editor.document;
        const regex = /{([\w\s,]*)}\s=\scommon\(doc\)/;
        let matches = null;
        const tmpl = "{$COMPONENTS} = common(doc)";
        for (let i = 0; !matches && i < doc.lineCount; ++i) {
            const { text } = doc.lineAt(i);
            matches = text.match(regex);
            if (!matches)
                continue;
            const start = matches.index, end = matches.index + matches[0].length;
            const components = matches[1] ? matches[1].split(/\s*,\s*/) : [];
            editor.edit(editorBuilder => editorBuilder.replace(new vscode.Range(new vscode.Position(i, start), new vscode.Position(i, end)), tmpl.replace("$COMPONENTS", [...new Set([...components, word])].sort().join(", "))));
        }
        if (!matches)
            vscode.window.showErrorMessage("No component import line found.");
    })));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map