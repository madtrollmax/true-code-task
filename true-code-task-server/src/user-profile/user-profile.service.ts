import { Injectable, NotFoundException } from '@nestjs/common';

import { UserProfile } from './user-profile.entity';
import { TransactionService } from 'src/common';
import { UserProfileDto } from './user-profile.schemas';

@Injectable()
export class UserProfileService {
  constructor(private readonly transactionService: TransactionService) {}

  async getUserProfile(uid: string): Promise<UserProfileDto> {
    const profile = await UserProfile.findOneBy({ login: uid });
    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    return { ...profile };
  }

  async updateUserProfile(login: string, profile: UserProfileDto): Promise<UserProfileDto> {
    return this.transactionService.runInTransaction(async (queryRunner) => {
      const userProfile: UserProfile = await queryRunner.manager.findOne(UserProfile, {
        where: { login },
      });

      if (!userProfile) {
        throw new NotFoundException('Профиль не найден');
      }

      userProfile.firstname = profile.firstname;
      userProfile.lastname = profile.lastname;
      userProfile.email = profile.email;
      userProfile.phone = profile.phone;
      userProfile.info = profile.info;
      userProfile.fileId = profile.fileId;

      await queryRunner.manager.save(userProfile);

      return { ...userProfile };
    });
  }
}
