import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { CreateOrderAggregateDto } from './dto/createOrderAggregateDto';
import { UpdateOrderAggregateStatusDto } from './dto/UpdateOrderAggregateStatusDto';

interface OrderQueueMessage {
  operationType: 'CREATE' | 'UPDATE';
  payload: string;
}

@Injectable()
export class OrderProducerService {
  private channelWrapper: ChannelWrapper;
  private queueName: string;

  constructor(private readonly configService: ConfigService) {
    const queueUrl = configService.get<string>('cqrsQueueUrl');
    this.queueName = configService.get<string>('cqrsOrderQueueName');
    const connection = amqp.connect([queueUrl]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(this.queueName, { durable: true });
      },
    });
  }

  async addOrderToQueue(createOrderAggregateDto: CreateOrderAggregateDto) {
    Logger.log(`Sending Create Order Queue, Id: ${createOrderAggregateDto.id}`);
    const message: OrderQueueMessage = {
      operationType: 'CREATE',
      payload: JSON.stringify(createOrderAggregateDto),
    };
    return this.addToQueue(message);
  }

  async addOrderUpdateToQueue(
    updateOrderStatusDto: UpdateOrderAggregateStatusDto,
  ) {
    Logger.log(`Sending Update Order Queue, Id: ${updateOrderStatusDto}`);
    const message: OrderQueueMessage = {
      operationType: 'UPDATE',
      payload: JSON.stringify(updateOrderStatusDto),
    };
    return this.addToQueue(message);
  }

  async addToQueue(message: OrderQueueMessage) {
    try {
      await this.channelWrapper.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );
    } catch (error) {
      throw new HttpException(
        'Error adding Order to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
