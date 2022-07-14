import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import dotenv = require("dotenv");
import { AppDeploymentStage } from "./stages/deploy";

export class LetMeInUbc20PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    dotenv.config();

    const source = CodePipelineSource.gitHub("jlui17/LetMeInUBC-2.0", "main", {
      authentication: SecretValue.secretsManager("GITHUB_ACCESS_TOKEN_SECRET"),
    });

    const pipeline = new CodePipeline(this, "LetMeInUBC-Pipeline", {
      pipelineName: "LetMeInUBC-Deployment-Pipeline",
      dockerEnabledForSynth: true,
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "npm ci && npm run build",
          "cd letmeinubc-react && npm ci && npm run build",
          "cd .. && npx cdk synth",
        ],
      }),
      codeBuildDefaults: {},
      assetPublishingCodeBuildDefaults: {
        buildEnvironment: {
          environmentVariables: {
            EMAILER_USER: { value: process.env.EMAILER_USER || "" },
            EMAILER_PASS: { value: process.env.EMAILER_PASS || "" },
          },
        },
      },
    });

    pipeline.addStage(
      new AppDeploymentStage(this, "AppDeploymentStage", {
        env: {
          account: process.env.account,
          region: process.env.region,
        },
      })
    );
  }
}
