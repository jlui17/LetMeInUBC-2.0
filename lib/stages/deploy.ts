import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";

export class AppDeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const authStack = new AuthStack(this, "AuthStack");
    const apiStack = new ApiStack(this, "ApiStack", {
      userPool: authStack.userPool,
    });
    const frontendStack = new FrontendStack(this, "FrontendStack");
  }
}
