import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './app.gateway';

describe('AppGateway', () => {
	let gateway: ChatGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ChatGateway],
		}).compile();

		gateway = module.get<ChatGateway>(ChatGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
