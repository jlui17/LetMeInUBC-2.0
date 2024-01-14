#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiStack } from "../lib/stages/stacks/ApiStack";
import { AuthStack } from "../lib/stages/stacks/AuthStack";
import { FrontendStack } from "../lib/stages/stacks/FrontendStack";

const app = new cdk.App();

const authStack = new AuthStack(app, "AuthStack");
const apiStack = new ApiStack(app, "ApiStack", {
  userPool: authStack.userPool,
});
const frontendStack = new FrontendStack(app, "FrontendStack");

app.synth();
