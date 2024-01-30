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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  client.start().catch((e) => {
    console.error(e);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  client.dispose();
}
