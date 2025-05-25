import { GrowthBook } from '@growthbook/growthbook';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GrowthbookService implements OnModuleInit {
  private gb: GrowthBook;
  private readonly logger = new Logger(GrowthbookService.name);
  private refreshInterval: NodeJS.Timeout;

  constructor() {
    this.gb = new GrowthBook({
      apiHost: 'http://localhost:3100',
      clientKey: 'sdk-nteDcDM89uCtgwD',
    });
  }

  async onModuleInit() {
    try {
      await this.gb.init();
      /*
      this.refreshInterval = setInterval(() => {
        // You can put any periodic refresh logic here, e.g., re-fetch features
        // For now, just logging for demonstration
        this.gb.refreshFeatures();
        this.logger.log('Refreshing GrowthBook features...');
      }, 1000);*/
    } catch (error) {
      console.error(`Error loading features: ${error}`);
    }
  }

  getGrowthBookInstance(): GrowthBook {
    return this.gb;
  }
}
