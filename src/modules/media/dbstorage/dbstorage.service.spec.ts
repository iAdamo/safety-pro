import { Test, TestingModule } from '@nestjs/testing';
import { DbstorageService } from './dbstorage.service';

describe('DbstorageService', () => {
  let service: DbstorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbstorageService],
    }).compile();

    service = module.get<DbstorageService>(DbstorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
