'use strict';

module.exports.handler = async event => {
  
  console.log(`refLambdaName: ${process.env.refLambdaName}`);
  console.log(`refLambdaArn: ${process.env.refLambdaArn}`);
  console.log(`ddbArn: ${process.env.ddbArn}`);
  console.log(`snsRef: ${process.env.snsRef}`);
  console.log(`snsTopicName: ${process.env.snsTopicName}`);
  console.log(`sqsQueueRef: ${process.env.sqsQueueRef}`);
  console.log(`sqsQueueName: ${process.env.sqsQueueName}`);
  console.log(`sqsQueueArn: ${process.env.sqsQueueArn}`);
  console.log(`secretArn: ${process.env.secretArn}`);
  console.log(`paramName: ${process.env.paramName}`);
  console.log(`paramType: ${process.env.paramType}`);
  console.log(`paramValue: ${process.env.paramValue}`);
  console.log(`stateMachineRef: ${process.env.stateMachineRef}`);
  console.log(`stateMachineName: ${process.env.stateMachineName}`);
  console.log(`imported: ${process.env.imported}`);
};
