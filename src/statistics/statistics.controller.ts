import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from '@nestjs/passport';
import { OnlyAdminGuard } from '../auth/guards/admin.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard) // Защищаем (только админ)
  async getMainStatistics() {
    return this.statisticsService.getMainStatistics();
  }
}
