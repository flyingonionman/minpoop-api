import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./Tokenmanager";

export const authenticate = (fn: ()=> void) => {
  const app = polka();

    app.get(`/auth/:token`, async ( req, res) =>{
        const { token } =req.params;
        if(!token){
            res.end(`<h1>something went wrong </h1>`);
            return;
        }

        await TokenManager.setToken(token);
        fn();

        res.end(`<h1>Auth was successful, you can closet his now</h1>`);

        (app as any).server.close();
    });

  app.listen(54321, (err : any) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`),
      );
    }
  });
};
