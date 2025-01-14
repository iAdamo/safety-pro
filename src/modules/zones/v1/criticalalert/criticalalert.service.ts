import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CriticalAlert, CriticalAlertDocument } from "src/modules/zones/schemas/criticalalert.schema";
import { CreateCriticalAlertDto } from "src/modules/zones/dto/createcriticalalert.dto";
import { UserServiceV1 } from "@services/user.service";
import { NotFoundException } from "@nestjs/common";
import { isWithProximity } from "src/utils/iswithproximity";

@Injectable()
export class CriticalAlertService {
    constructor(
        @InjectModel(CriticalAlert.name)
        private criticalAlertModel: Model<CriticalAlertDocument>,
        private userServiceV1: UserServiceV1,
    ) {}

     /**
   * Create a new critical alert
   * @param createCriticalAlertDto The data to create a new critical alert
   * @returns The created critical alert
   */
    async create(createCriticalAlertDto: CreateCriticalAlertDto): Promise<CriticalAlert> {
        // check if the user is valid
        const user = await this.userServiceV1.findOne({
        id: createCriticalAlertDto.reportedBy,
        });
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
        
            const createdCriticalAlert = new this.criticalAlertModel(createCriticalAlertDto);
            return createdCriticalAlert.save();
    }
}