import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CourseService } from './services/CourseService';

export class LetMeInUbc20Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const coursesTable = new dynamodb.Table(this, 'Courses', {
      partitionKey: { name: 'courseName', type: dynamodb.AttributeType.STRING },
    });

    const courseService = new CourseService(this, 'CourseService', {
      COURSES_TABLE_NAME: coursesTable.tableName
    });

    coursesTable.grantWriteData(courseService.createHandler);
    coursesTable.grantReadData(courseService.getHandler);
  }
}
