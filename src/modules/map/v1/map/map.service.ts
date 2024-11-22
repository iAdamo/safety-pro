import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnsafeZone, UnsafeZoneDocument } from '@schemas/unsafezone.schema';
import { CreateUnsafeZoneDto } from '@dto/createunsafe.dto';
import { UpdateUnsafeZoneDto } from '@dto/updateunsafe.dto';
import { UserServiceV1 } from '@services/user.service';
import { NotFoundException } from '@nestjs/common';
import { isWithProximity } from 'src/utils/iswithproximity';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(UnsafeZone.name)
    private unsafeZoneModel: Model<UnsafeZoneDocument>,
    private userServiceV1: UserServiceV1,
  ) {}

  /**
   * Create a new unsafe zone
   * @param createUnsafeZoneDto The data to create a new unsafe zone
   * @returns The created unsafe zone
   */
  async create(createUnsafeZoneDto: CreateUnsafeZoneDto): Promise<UnsafeZone> {
    // check if the user is valid
    const user = await this.userServiceV1.findOne({
      id: createUnsafeZoneDto.markedBy,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdUnsafeZone = new this.unsafeZoneModel(createUnsafeZoneDto);
    return createdUnsafeZone.save();
  }

  /**
   * Update an unsafe zone
   * @param id The ID of the unsafe zone to update
   * @param updateUnsafeZoneDto The data to update the unsafe zone
   * @returns The updated unsafe zone
   */
  async update(
    id: string,
    updateUnsafeZoneDto: UpdateUnsafeZoneDto,
  ): Promise<UnsafeZone> {
    const unsafeZone = await this.unsafeZoneModel.findById(id);
    if (!unsafeZone) {
      throw new NotFoundException('Unsafe zone not found');
    }

    return this.unsafeZoneModel
      .findByIdAndUpdate(id, updateUnsafeZoneDto, {
        new: true,
      })
      .exec();
  }

  async findUnsafeZones(
    id: string,
    userLat: number,
    userLong: number,
    proximityRange: number,
  ) {
    if (!id || !userLat || !userLong) {
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
    const unsafeZones = await this.unsafeZoneModel
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [[userLong, userLat], maxRadius / 6371],
          },
        },
      })
      .exec();

    return unsafeZones.filter((unsafeZone) =>
      isWithProximity(
        userLat,
        userLong,
        unsafeZone.location.coordinates[1],
        unsafeZone.location.coordinates[0],
        userRange,
        unsafeZone.radius,
      ),
    );
  }
}
