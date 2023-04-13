#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { LetMeInUbc20PipelineStack } from "../lib/pipeline";

const app = new cdk.App();
new LetMeInUbc20PipelineStack(app, "LetMeInUbc20PipelineStack", {
  env: {
    account: "572648781471",
    region: "us-west-2",
  },
});

app.synth();
