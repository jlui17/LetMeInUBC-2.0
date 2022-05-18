// import * as cdk from 'aws-cdk-lib';
// // import * as lambda from '@aws-cdk/aws-lambda-python-alpha';
// import { Construct } from 'constructs';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import { Runtime } from 'aws-cdk-lib/aws-lambda'

// import { WebService } from './WebService';
// import { NotifyService } from './NotifyService';

// import { Lambda } from 'aws-sdk';

// // import {
// //     aws_stepfunctions as sfn,
// //     aws_stepfunctions_tasks as tasks
// // } from 'aws-cdk-lib'

// export class RefreshAndNotify extends Construct {
//   // public readonly handler: lambda.PythonFunction;
//   public readonly handler: lambda.Function;

//   constructor(scope: Construct, id: string, props: any) {
//     super(scope, id);
//     const RESOURCE_FOLDER = lambda.Code.fromAsset('resources/RefreshAndNotify');

//     // const getCourses = new tasks.LambdaInvoke(this, 'InvokeOrderProcessor', {
//     //     lambdaFunction: props.GET_AVAILABLE_COURSES,
//     //     payload: sfn.TaskInput.fromObject({
//     //       section: [{
//     //             'is_winter': false,
//     //             'dept': 'CPSC',
//     //             'number': '103',
//     //             'section': '9W1'
//     //         }],
//     //     }),
//     //   }); 

//     this.handler = new lambda.Function(this, 'RefreshAndNotify', {
//       runtime: lambda.Runtime.NODEJS_14_X,
//       handler: 'RefreshAndNotify.handler',
//       code: RESOURCE_FOLDER,
//       environment: {
//         GET_AVAILABLE_COURSES: props.GET_AVAILABLE_COURSES
//       }
//     });

//     // this.handler = new lambda.PythonFunction(this, 'RefreshAndNotify', {
//     //   runtime: Runtime.PYTHON_3_7,
//     //   index: 'RefreshAndNotify.py',
//     //   handler: 'handler',
//     //   entry: RESOURCE_FOLDER,
//     //   environment: {
//     //     'GET_AVAILABLE_COURSES': props.GET_AVAILABLE_COURSES
//     //   },

//     // //   layers: [
//     // //     new lambda.PythonLayerVersion(this, 'NotifyContactsDependencyLayer', {
//     // //       entry: RESOURCE_FOLDER // point this to your library's directory
//     // //     }),
//     // //   ],
//     // });
//   }
// }
