import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { AppDeploymentStage } from "./stages/deploy";

export class LetMeInUbc20PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const source = CodePipelineSource.gitHub("jlui17/LetMeInUBC-2.0", "main", {
      authentication: SecretValue.secretsManager("GITHUB_ACCESS_TOKEN_SECRET"),
    });

    const pipeline = new CodePipeline(this, "LetMeInUBC-Pipeline", {
      pipelineName: "LetMeInUBC-Deployment-Pipeline",
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "npm ci && npm run build",
          "cd letmeinubc-react && npm ci && npm run build",
          "cd .. && npx cdk synth",
        ],
      }),
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
