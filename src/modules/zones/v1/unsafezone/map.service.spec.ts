import { Test, TestingModule } from '@nestjs/testing';
import { UnsafeZoneService } from './unsafezone.service';

describe('MapService', () => {
  let service: UnsafeZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnsafeZoneService],
    }).compile();

    service = module.get<UnsafeZoneService>(UnsafeZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
