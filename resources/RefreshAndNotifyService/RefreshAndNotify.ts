// import { Lambda } from 'aws-sdk';
// import {
//     aws_stepfunctions as sfn,
//     aws_stepfunctions_tasks as tasks
// } from 'aws-cdk-lib'

// const getCourses = new tasks.LambdaInvoke(this, 'InvokeOrderProcessor', {
//   lambdaFunction: props.GET_AVAILABLE_COURSES,
//   payload: sfn.TaskInput.fromObject({
//     section: [{
//           'is_winter': false,
//           'dept': 'CPSC',
//           'number': '103',
//           'section': '9W1'
//       }],
//   }),
// }); 

// exports.handler = async (event: any): Promise<any> => {
//   const lambda = new Lambda();

//   lambda.invoke

//   return {
//     statusCode: 200,
//     body: JSON.stringify(`Added ${courseName}!`)
//   }
// }
