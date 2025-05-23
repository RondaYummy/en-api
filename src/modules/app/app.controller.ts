import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import * as os from 'os';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private configService: ConfigService) { }

  formatUptime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  }

  formatMemoryUsage(memoryUsage: NodeJS.MemoryUsage) {
    return {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    };
  }

  @Get('app')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({
    summary: 'Get application status and system info',
    description: 'Returns current application status along with system information (e.g., uptime, memory usage, Node version, PID).'
  })
  @ApiResponse({
    status: 200,
    description: 'Application information in plain text format',
  })
  @ApiHeader({
    name: 'Content-Type',
    description: 'Response content type. Will be "text/plain".',
    example: 'text/plain',
  })
  app() {
    const port = this.configService.get<number>('PORT');
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();
    const formattedUptime = this.formatUptime(uptimeSeconds);
    const startTime = new Date(Date.now() - uptimeSeconds * 1000).toLocaleString();
    const osObj = {
      type: os.type(),
      platform: os.platform(),
      architecture: os.arch(),
      cpus: os.cpus().length,
      freeMemory: `${(os.freemem() / 1073741824).toFixed(1)} GB`,
      totalMemory: `${(os.totalmem() / 1073741824).toFixed(1)} GB`,
    };
    const formattedMemoryUsage = this.formatMemoryUsage(memoryUsage);

    console.group('Application Info');
    console.log(`APP WORKS ON PORT: ${port}`);
    console.group('Uptime & Start Time');
    console.log(`Started: ${startTime}`);
    console.log(`Uptime: ${formattedUptime}`);
    console.groupEnd();

    console.group('Memory');
    console.log(`Total Memory: ${osObj.totalMemory}`);
    console.log(`Free Memory: ${osObj.freeMemory}`);
    console.group('Memory Usage');
    console.log(`rss: ${formattedMemoryUsage.rss}`);
    console.log(`heapTotal: ${formattedMemoryUsage.heapTotal}`);
    console.log(`heapUsed: ${formattedMemoryUsage.heapUsed}`);
    console.log(`external: ${formattedMemoryUsage.external}`);
    console.groupEnd(); // Memory Usage group end
    console.groupEnd(); // Memory group end

    console.group('System Info');
    console.log(`CPUs: ${osObj.cpus}`);
    console.log(`Node Version: ${process.version}`);
    console.log(`PID: ${process.pid}`);
    console.groupEnd();

    console.groupEnd(); // Application Info group end

    return `APP WORKS ON PORT: ${port}
Started: ${startTime}
Uptime: ${formattedUptime}

T Memory: ${osObj.totalMemory}
F Memory: ${osObj.freeMemory}
U Memory: ${((os.totalmem() - os.freemem()) / 1073741824).toFixed(1) + ' GB'}

Memory Usage:
  rss: ${formattedMemoryUsage.rss}
  heapTotal: ${formattedMemoryUsage.heapTotal}
  heapUsed: ${formattedMemoryUsage.heapUsed}
  external: ${formattedMemoryUsage.external}

CPUs: ${osObj.cpus}
V. ${process.version}
PID: ${process.pid}`;
  }
}
