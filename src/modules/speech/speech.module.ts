import { Module } from '@nestjs/common';
import { SpeechService } from './speech.service';

@Module({
  providers: [SpeechService]
})
export class SpeechModule {}
