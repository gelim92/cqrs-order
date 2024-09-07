export default () => ({
  port: 3000,
  productServiceApi: 'http://localhost:4000',
  cqrsQueueUrl: 'amqp://localhost',
  cqrsOrderQueueName: 'cqrsOrder',
});
