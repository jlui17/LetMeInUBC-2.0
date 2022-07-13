import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LetMeInUbc20Stack } from "./stacks/let_me_in_ubc-2.0-stack";

export class AppDeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const appStack = new LetMeInUbc20Stack(this, "LetMeInUbc20-Stack", {
      env: {
        account: process.env.account,
        region: process.env.region,
      },
    });
  }
}
