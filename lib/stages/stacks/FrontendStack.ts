import { CfnOutput, Stack } from "aws-cdk-lib";
import { SPADeploy } from "cdk-spa-deploy";
import { Construct } from "constructs";

export class FrontendStack extends Stack {
  public readonly websiteUrl: CfnOutput;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    //Create SPA - Cloudfront-SPA for in-built https support, deploy first to get URL
    const spa_app = new SPADeploy(this, "spaDeploy").createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "letmeinubc-react/build",
      certificateARN:
        "arn:aws:acm:us-east-1:572648781471:certificate/95bd3abf-f81d-42b0-916f-f0398326dbbe",
      cfAliases: ["www.letmeinubc.com", "letmeinubc.com"],
    });

    this.websiteUrl = new CfnOutput(this, "WebsiteURL", {
      value: spa_app.distribution.distributionDomainName,
    });
  }
}
