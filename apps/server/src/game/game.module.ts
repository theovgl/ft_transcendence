import { Module } from '@nestjs/common';
import { GameEvents } from './gameEvents';
import { MatchmakingService } from './matchmaking.service';
import { BallService } from './ball.service';

@Module({
	providers: [GameEvents, MatchmakingService, BallService]
})
export class GameModule {}