import { Test, TestingModule } from '@nestjs/testing';
import { UnsafeZoneController } from './unsafezone.controller';

describe('MapController', () => {
  let controller: UnsafeZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnsafeZoneController],
    }).compile();

    controller = module.get<UnsafeZoneController>(UnsafeZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
