import { RedmineServer } from "../redmine/redmine-server";
import * as vscode from "vscode";
import { IssueController } from "../controllers/issue-controller";
import { ActionProperties } from "./action-properties";

export default async ({ server }: ActionProperties) => {
  const issueId = await vscode.window.showInputBox({
    placeHolder: `Type in issue id`,
  });

  console.log(issueId);

  if (!issueId || !issueId.trim()) {
    return;
  }

  console.log(issueId);

  let promise = server.getIssueById(issueId);

  console.log(issueId);

  promise.then(
    (issue) => {
      console.log(issue);
      if (!issue) return;

      let controller = new IssueController(issue.issue, server);

      controller.listActions();
    },
    (error) => {
      console.log(error);
      vscode.window.showErrorMessage(error);
    }
  );

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
    },
    (progress) => {
      progress.report({
        message: `Waiting for response from ${server.options.url.host}...`,
      });
      return promise;
    }
  );
};