import * as vscode from 'vscode';
import { apiBaseUrl } from './constants';

export const authenticate =()=>{
    console.log("yay")
    vscode.commands.executeCommand("vscode.open", 
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`
    ));
};