import * as vscode from "vscode";
import { workspace, commands, ExtensionContext, window } from "vscode";
import * as fs from "fs";
export function activate(context: ExtensionContext) {
  let db = Array();

  fs.readFile(workspace.rootPath + "/.tabkeeper.json", "utf8", (err, json) => {
    db=JSON.parse(json);
  });

  context.subscriptions.push(
    commands.registerCommand("extension.saveTabs", () => {
      let tabs = Object();
      window.showInputBox({ prompt: "name?" }).then(name => {
        if(name===''){
          name='default';
        }
        tabs = {
          name: name,
          paths: []
        };
        workspace.textDocuments.forEach(doc => {
          tabs["paths"].push(doc.uri.fsPath);
        });
        
        // remove duplicates
        db.forEach((obj,i)=>{
          if(tabs.name === obj.name){
            db.splice(i,1);
          }
        });

        db.push(tabs);
        fs.writeFile(
          workspace.rootPath + "/.tabkeeper.json",
          JSON.stringify(db, null , "\t"),
          err => { }
        );
      });
    }),
    vscode.commands.registerCommand("extension.popTabs", () => {
      window.showQuickPick(db.map(obj => obj.name),{  }).then(name => {
        db.forEach((obj)=>{
          if(name === obj.name){
            obj.paths.forEach((path:string)=>{
              workspace
              .openTextDocument(path)
              .then(doc => window.showTextDocument(doc, { preview: false }));
            });
          }
        });
      });
    })
  );
}

export function deactivate() {}
