// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

const executable = {
  command: "kestrel",
  args: ["lsp", "--", "--stdio"],
};

const serverOptions = {
  run: executable,
  debug: executable,
};

const clientOptions = {
  documentSelector: [
    {
      scheme: "file",
      language: "kestrel",
    },
  ],
};

const client = new LanguageClient(
  "kestrel-lang-language-server",
  "Kestrel language client",
  serverOptions,
  clientOptions
);

let configureLang: vscode.Disposable | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const onEnterRules = [...continueTypingCommentsOnNewline()];

  configureLang = vscode.languages.setLanguageConfiguration("kestrel", {
    onEnterRules,
  });

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  client.start().catch((e) => {
    console.error(e);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  configureLang?.dispose();
  client.dispose();
}

/**
 * Returns the `OnEnterRule`s needed to configure typing comments on a newline.
 *
 * This makes it so when you press `Enter` while in a comment it will continue
 * the comment onto the next line.
 *
 * Credits: https://github.com/gleam-lang/vscode-gleam/blob/main/src/extension.ts#L96
 */
function continueTypingCommentsOnNewline(): vscode.OnEnterRule[] {
  const indentAction = vscode.IndentAction.None;

  return [
    {
      // Module doc single-line comment
      // e.g. ////|
      beforeText: /^\s*\/{4}.*$/,
      action: { indentAction, appendText: "//// " },
    },
    {
      // Doc single-line comment
      // e.g. ///|
      beforeText: /^\s*\/{3}.*$/,
      action: { indentAction, appendText: "/// " },
    },
  ];
}
