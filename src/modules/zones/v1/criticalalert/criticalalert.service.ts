import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CriticalAlert, CriticalAlertDocument } from "src/modules/zones/schemas/criticalalert.schema";
import { CreateCriticalAlertDto } from "src/modules/zones/dto/createcriticalalert.dto";
import { UpdateCriticalAlertDto } from "@modules/dto/updatecriticalalert.dto";
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

    /**
     * Update a critical alert
     * @param id The ID of the critical alert
     * @param updateCriticalAlertDto The data to update the critical alert
     * @returns The updated critical alert
     */
    async update(
        id: string,
        updateCriticalAlertDto: UpdateCriticalAlertDto,
    ): Promise<CriticalAlert> {
        const criticalalert = await this.criticalAlertModel.findById(id);
        if (!criticalalert) {
            throw new NotFoundException('Critical alert not found');
        };

        return this.criticalAlertModel.findByIdAndUpdate(id, updateCriticalAlertDto, {
            new:true,
        })
        .exec();
    }
    /**
     * Find a critical alert that was created
     * @param id The ID of the critical alert
     * @returns The updated critical alert
     */
    async findone(id: string
    ): Promise<CriticalAlert> {
        const criticalalert = await this.criticalAlertModel.findById(id).exec();
        if (!criticalalert) throw new NotFoundException('Critical alert can not be found')
            return criticalalert;
    }

    /**
   * Find all by a user
   * @param id The user ID
   * @returns The critical alerts created by the user
   */
  async findAllByUser(userId: string
  ): Promise<CriticalAlert[]> {
    const criticalalerts = await this.criticalAlertModel
    .find({ reportedBy: userId })
    .exec();
    if (!criticalalerts || criticalalerts.length === 0) {
        throw new NotFoundException('No critical alert found by this user')
    }
    return criticalalerts;
  }

  /**
   * Find critical alert near a user
   * @param id The user ID
   * @param userLat The user's latitude
   * @param userLong The user's longitude
   * @param proximityRange The user's proximity range
   * @returns The critical alerts near the user
   */
  async findCriticalAlert(
    id: string,
    userLat: number,
    userLong: number,
    proximityRange: number,
  ) {
    if (id || !userLat || !userLong) {
        throw new NotFoundException('Query is required');
    }

    let userRange = proximityRange;
    if (!proximityRange) {
        const user = await this.userServiceV1.findOne({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        userRange = user.proximityRange;
    }

    const maxRadius = userRange + 100;
    const criticalalerts = await this.criticalAlertModel
    .find({
        location: {
            $geoWithin: {
                $centerSphere: [[userLong, userLat], maxRadius / 6371],
            },
        },
        reportedBy: { $me: id }, //Excluding critical alerts created by the user 
    }).exec();

    return criticalalerts.filter((criticalalert) =>
        isWithProximity(
            userLat,
            userLong,
            criticalalert.location.coordinates[1],
            criticalalert.location.coordinates[0],
            userRange,
            criticalalert.radius,   
        ),
    );
  };
}