import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthServerClient {
  private baseUrl = this.configService.get<string>('serviceUrl.authApi');

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getUserStatus(userId: string) {
    const response = await firstValueFrom(
      this.httpService.get<GetUserStatusResponse>(
        `${this.baseUrl}/user/${userId}/status`,
      ),
    );
    return response.data;
  }
}

export type GetUserStatusResponse = {
  status: {
    completedQuestIds?: string[];
    loginStreak?: number;
    referralCount?: number;
  };
};
