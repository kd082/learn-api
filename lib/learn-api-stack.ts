import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class LearnApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiSpec = apigateway.AssetApiDefinition.fromAsset('./services/api/api.yaml');

    const api = new apigateway.SpecRestApi(this, 'cars-api-k-dutta', {
      apiDefinition: apiSpec,
  });

  const lambdaNames = [
    { name: 'cars-get', handler: 'handler.lambda_handler' },
    { name: 'cars-post', handler: 'handler.lambda_handler' }
  ];

  lambdaNames.forEach((lambdaConfig) => {
    const lambdaFn = new lambda.Function(this, lambdaConfig.name, {
      runtime: lambda.Runtime.PYTHON_3_9,
      functionName: lambdaConfig.name,
      handler: lambdaConfig.handler,
      code: lambda.Code.fromAsset(path.join(__dirname, `../services/lambda/${lambdaConfig.name}`))
    });

    // Grant API Gateway permissions to invoke the Lambda function
    lambdaFn.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
  });
}
}

const app = new cdk.App();
new LearnApiStack(app, 'ApiGatewayLambdaExample');