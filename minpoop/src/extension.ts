// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { authenticate } from './authenticate';
import * as vscode from 'vscode';
import { HelloWorldPanel } from "./HelloworldPanel";
import { SidebarProvider } from './SideBarProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export async function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right
	);
	item.text = "$(beaker) Add Todo";
	item.command = 'minpoop.addTodo';
	item.show();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
		"minpoop-sidebar",
		sidebarProvider
		)
	);

	context.subscriptions.push(vscode.commands.registerCommand('minpoop.addTodo', () => {
		const {activeTextEditor} = vscode.window;
		
		if(!activeTextEditor){
			vscode.window.showInformationMessage("No active text");
			return;
		}
		
		const text = activeTextEditor.document.getText(activeTextEditor.selection);

		vscode.window.showInformationMessage(`${text}`);

		sidebarProvider._view?.webview.postMessage({
			type : 'add-todo',
			value : text,
		});
	}));


	context.subscriptions.push(vscode.commands.registerCommand('minpoop.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
		vscode.window.showInformationMessage('Hello World from vstodo!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('minpoop.authenticate', () => {
		authenticate();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('minpoop.refresh', async () => {
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.minpoop-sidebar-view");
		/* setTimeout(()=>{
			vscode.commands.executeCommand(
				"workbench.action.webview.openDeveloperTools"
			);
		},500); */

	}));

	context.subscriptions.push(vscode.commands.registerCommand("minpoop.askQuestion",async ()=>{
		const answer= await vscode.window.showInformationMessage(
			"How was yourday",
			"good",
			"bad"
		);

		if (answer === 'bad'){
			vscode.window.showInformationMessage('fuck off');
		} else {
			console.log(answer);
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
