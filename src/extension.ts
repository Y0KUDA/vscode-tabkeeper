import * as vscode from "vscode";
import { workspace, commands, ExtensionContext, window } from "vscode";
import * as fs from "fs";
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("extension.saveTabs", () => {
      fs.writeFile(workspace.rootPath + "/.tabkeeper", "", err => {}); // delete list in file
      workspace.textDocuments.forEach(doc => {
        fs.writeFile(
          workspace.rootPath + "/.tabkeeper",
          doc.uri.fsPath + "\n",
          { flag: "a" },
          err => {}
        );
      });
    }),
    vscode.commands.registerCommand("extension.popTabs", () => {
      fs.readFile(workspace.rootPath + "/.tabkeeper", "utf8", (err, paths) => {
        paths.split("\n").forEach(path => {
          workspace
            .openTextDocument(path)
            .then(doc => window.showTextDocument(doc, { preview: false }));
        });
      });
    })
  );
}

export function deactivate() {}
