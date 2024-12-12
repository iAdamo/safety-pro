import { Test, TestingModule } from '@nestjs/testing';
import { CloudstorageService } from './cloudstorage.service';

describe('CloudstorageService', () => {
  let service: CloudstorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudstorageService],
    }).compile();

    service = module.get<CloudstorageService>(CloudstorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
