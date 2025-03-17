import { Body, Controller, Get, NotFoundException, Put, Request, Res, UseGuards } from '@nestjs/common';
import { WithTokenGuard } from 'src/common/withToken.guard';
import { UserProfileService } from './user-profile.service';
import { UserProfileDto, UserProfileSchema } from './user-profile.schemas';
import { withInputExceptionHandler } from 'src/common';
import { Response } from 'express';

@Controller('api/profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get()
  @UseGuards(WithTokenGuard)
  async getProfile(@Request() req): Promise<UserProfileDto> {
    const profile = await this.userProfileService.getUserProfile(req.user.uid);
    if (!profile) throw new NotFoundException();

    return profile;
  }

  @Put()
  @UseGuards(WithTokenGuard)
  async updateProfile(@Request() req, @Body() profile: UserProfileDto, @Res({ passthrough: true }) res: Response) {
    return withInputExceptionHandler(async () => {
      const validatedProfile = UserProfileSchema.parse(profile);
      return await this.userProfileService.updateUserProfile(req.user.uid, validatedProfile);
    }, res);
  }
}
