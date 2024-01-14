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
      websiteFolder: "web-frontend/build",
      certificateARN:
        "arn:aws:acm:us-east-1:572648781471:certificate/9ef5b6a6-9c1e-469e-9969-e6e080ba60df",
      cfAliases: ["www.letmeinubc.com", "letmeinubc.com"],
    });

    this.websiteUrl = new CfnOutput(this, "WebsiteURL", {
      value: spa_app.distribution.distributionDomainName,
    });
  }
}
