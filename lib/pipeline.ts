import { Stack, StackProps } from "aws-cdk-lib";
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

    const source = CodePipelineSource.connection(
      "jlui17/LetMeInUBC-2.0",
      "main",
      {
        connectionArn:
          "arn:aws:codestar-connections:us-west-2:572648781471:connection/62fa4e4b-fada-4f32-a7b9-67757163a5d9",
      }
    );

    const pipeline = new CodePipeline(this, "LetMeInUBC-Pipeline", {
      pipelineName: "LetMeInUBC-Deployment-Pipeline",
      dockerEnabledForSynth: true,
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "npm ci && npm run build",
          "cd letmeinubc-react && npm ci && npm run build",
          "cd .. && npm run test",
          "npx cdk synth",
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
