import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PrismaService } from "../prisma/prisma.service";

const GAME_WIDTH = 991;
const GAME_HEIGHT = 678;
const BALL_SIZE = (5 / 100) * GAME_WIDTH;
const COLLECTIBLE_SIZE = (10 / 100) * GAME_WIDTH;
const COLLECTIBLE_RADIUS = COLLECTIBLE_SIZE / 2;
const BALL_RADIUS = BALL_SIZE / 2;
const BASE_VELOCITY = .5;
const HEIGHT_OFFSET = 30;
const CHARACTER_WIDTH = (5 / 100) * GAME_WIDTH;
const CHARACTER_HEIGHT = (10 / 100) * GAME_HEIGHT;
const MAX_VELOCITY = 2;
const BOUNCE_ACCELERATION = 1.1;
const BONUS_PERCENTAGE = 20;
const BONUS_DURATION = 50 * 1000;
const POS_X_LEFT_PLAYER = (5 / 100) * GAME_WIDTH;
const POS_Y_LEFT_PLAYER = (20 / 100) * GAME_HEIGHT;
const POS_X_RIGHT_PLAYER = (95 / 100) * GAME_WIDTH;
const POS_Y_RIGHT_PLAYER = (20 / 100) * GAME_HEIGHT;

@Injectable()
export class BallService {
  private ballPos: {x :number, y: number} = {x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2};
  private velocity: {x: number, y: number} = {x: BASE_VELOCITY, y: BASE_VELOCITY};
  private leftPlayer: {x :number, y: number, width: number, height: number} = {x: POS_X_LEFT_PLAYER, y: POS_Y_LEFT_PLAYER, width: CHARACTER_WIDTH, height: CHARACTER_HEIGHT};
  private rightPlayer: {x :number, y: number, width: number, height: number} = {x: POS_X_RIGHT_PLAYER, y: POS_Y_RIGHT_PLAYER, width: CHARACTER_WIDTH, height: CHARACTER_HEIGHT};
  private collectibleRect: {x: number, y: number, width, height: number, activated: boolean} = {x: 0, y: 0, width: COLLECTIBLE_SIZE, height: COLLECTIBLE_SIZE, activated: false};
  private interval = null;
  private collectibleInterval = null;
  private isColliding: boolean = false;
  private scoreLeft = 0;
  private scoreRight = 0;
  private pOneSocket;
  private pTwoSocket;
  private pOneId: string;
  private pTwoId: string;
  private percentagePos: {x: number, y: number} = {x: 0, y: 0};
  private forfeited = false;
  private winnerId: string = "";
  public  gameEnded: boolean = false;

  constructor(
		private prisma: PrismaService,
	) {}

  public async setBallLoop(server, playerOne, playerTwo, room, ms, mode="Normal") {

// Countdown avant le début de la partie
    let timer = 3;
    
    this.pOneSocket = playerOne.socket;
    this.pTwoSocket = playerTwo.socket;
    this.pOneId = playerOne.id;
    this.pTwoId = playerTwo.id;
    playerOne.socket.on('player-moved', (data) => {
      this.leftPlayer.x = (data.pos.x / 100) * GAME_WIDTH;
      this.leftPlayer.y = (data.pos.y / 100) * GAME_HEIGHT;
      this.percentagePos.x = data.pos.x;
      this.percentagePos.y = data.pos.y;
      playerTwo.socket.emit("opponent-moved", this.percentagePos)
    })
    playerTwo.socket.on('player-moved', (data) => {
      this.rightPlayer.x = (data.pos.x / 100) * GAME_WIDTH;
      this.rightPlayer.y = (data.pos.y / 100) * GAME_HEIGHT;
      this.percentagePos.x = data.pos.x
      this.percentagePos.y = data.pos.y
      playerOne.socket.emit("opponent-moved", this.percentagePos)
    })
    const readyIntervale = setInterval(() => {
        timer--;
        server.to(room).emit("ready-timer", timer)
      }, 1000);
  
    if (this.interval === null)
    {
        setTimeout(() => {
// Clear the interval after emitting the delayed event
        clearInterval(readyIntervale);
        timer--;
        server.to(room).emit("ready-timer", timer)
        this.leftPlayer.x += this.leftPlayer.width - (this.leftPlayer.width / 4);
        this.leftPlayer.width /= 4;
        this.rightPlayer.width /= 4;
// Boucle pour update la position de la balle
        if (mode === "Special")
          this.spawnCollectible(server, room);
        this.interval = setInterval(() => {
          if (this.forfeited)
            this.unsetBallLoop();
    // Emit la position de la balle aux clients
          this.updatePos(server, room);
          this.percentagePos.x = (this.ballPos.x / GAME_WIDTH) * 100;
          this.percentagePos.y = (this.ballPos.y / GAME_HEIGHT) * 100;
          server.to(room).emit("ball-moved", this.percentagePos);
          if (this.scoreLeft >= 10 || this.scoreRight >= 10)
          {
            this.updateGameResult();
            this.unsetBallLoop();
          }
        }, ms);
      }, 3000);
    }

  }

  private async updateHistory(userid: string)
  {
    const user = await this.prisma.user.findUnique({
      where: {
        name: userid
      }
    })
    if (user){
      await this.prisma.game.create({
        data: {
          scorePlayerOne: this.scoreLeft.toString(),
          scorePlayerTwo: this.scoreRight.toString(),
          winnerId: this.winnerId,
          userIdLeft: this.pOneId,
          userIdRight: this.pTwoId,
          userId: user.id
        },
        include: {
          user: true
        }
      })
    }
  }

  private updateGameResult()
  {
    if (this.winnerId === "" && this.scoreLeft > this.scoreRight)
      this.winnerId = this.pOneId;
    else if (this.winnerId === "")
      this.winnerId = this.pTwoId;
    this.updateHistory(this.pOneId);
    this.updateHistory(this.pTwoId);
  }
  //désactiver la boucle lorsque la partie est terminée
  public unsetBallLoop() {
    clearInterval(this.interval);
    clearInterval(this.collectibleInterval);
    this.gameEnded = true;
  }

  public  forfeit(player: Socket)
  {
    // if (this.winnerId !== "")
    //   return;
    if (player === this.pOneSocket)
    {
      console.log("winner right");
      this.winnerId = this.pTwoId;
    }
    else
    {
      console.log("winner left");
      this.winnerId = this.pOneId;
    }
    this.updateGameResult();
    this.unsetBallLoop();
    this.forfeited = true;
    this.pOneSocket.emit('forfeit');
    this.pTwoSocket.emit('forfeit');
  }

  public containSocket(socket: Socket) {
    return (socket === this.pOneSocket || socket === this.pTwoSocket)  
  }

  private checkCollision = (ballRect, characterRect) => {
        
    if (ballRect.x + BALL_SIZE > characterRect.x &&
      ballRect.x - BALL_RADIUS < characterRect.x + characterRect.width &&
      ballRect.y + BALL_SIZE > characterRect.y &&
      ballRect.y < characterRect.y + characterRect.height)
      return (true)
    return (false)
  }

  //update la position de la balle en fonction de sa trajectoire
  private updatePos(server, room): void {
    //déplacement selon sa trajectoire
    this.ballPos.x += this.velocity.x;
    this.ballPos.y += this.velocity.y;
    //Collision avec le but (envoyer l'event goal-scored-j1 ou j2)
    if (this.ballPos.x <= 0 + 10 || this.ballPos.x + BALL_SIZE >= GAME_WIDTH - 10) {
      if (this.ballPos.x <= 0 + 10)
      {
        server.to(room).emit('goal-scored-j2');
        this.velocity.x = -BASE_VELOCITY;
        this.scoreRight++;
      }
      if (this.ballPos.x + BALL_SIZE >= GAME_WIDTH - 10)
      {
        server.to(room).emit('goal-scored-j1');
        this.velocity.x = BASE_VELOCITY;
        this.scoreLeft++;
      }
      this.ballPos.x = GAME_WIDTH / 2;
      this.ballPos.y = GAME_HEIGHT / 2;
    }
    
    //Collision avec le mur
    if (this.ballPos.y <= 0 + HEIGHT_OFFSET || this.ballPos.y + BALL_SIZE >= GAME_HEIGHT - HEIGHT_OFFSET) {
      if (!this.isColliding)
      {
        this.velocity.y = -this.velocity.y;
        this.isColliding = true;
      }
    }

    //Collision avec le collectible
    if (this.collectibleRect.activated &&
    this.checkCollision(this.ballPos, this.collectibleRect))
      this.collisionCollectible(server, room); 
    //Collision avec le joueur
    else if ((this.checkCollision(this.ballPos, this.leftPlayer)) ||
        (this.checkCollision(this.ballPos, this.rightPlayer)))
    {
      if (!this.isColliding)
      {
        this.velocity.x = -(this.velocity.x < 0 ? (Math.max(this.velocity.x * BOUNCE_ACCELERATION, -MAX_VELOCITY)) :
                          Math.min(this.velocity.x * BOUNCE_ACCELERATION, MAX_VELOCITY));
        this.isColliding = true;
      }
    }
    else 
      this.isColliding = false;
    }

    private collisionCollectible(server, room)
    {
      let bonusHeight = (CHARACTER_HEIGHT * BONUS_PERCENTAGE) / 100;
      this.collectibleRect.activated = false;
      server.to(room).emit('collectible-touched');
      if (this.velocity.x > 0){
        this.leftPlayer.height = CHARACTER_HEIGHT + bonusHeight + 50;
        setTimeout(() => {
          this.leftPlayer.height = CHARACTER_HEIGHT;
          server.to(room).emit('bonus-ended');
        }, BONUS_DURATION);
        server.to(room).emit('collectible-touched-j1', BONUS_PERCENTAGE);
      }
      else{
        this.rightPlayer.height = CHARACTER_HEIGHT + bonusHeight + 50;
        setTimeout(() => {
          this.rightPlayer.height = CHARACTER_HEIGHT;
          server.to(room).emit('bonus-ended');
        }, BONUS_DURATION);
        server.to(room).emit('collectible-touched-j2', BONUS_PERCENTAGE);
      }
    }

    private spawnCollectible(server: Server, room)
    {
      this.collectibleInterval = setInterval(() => {
        let nextPos = {x: GAME_WIDTH / 2,
        y: 0};

        // Set Local pos for collision
        nextPos.x = (GAME_WIDTH / 2) + (100 * (Math.random() * 4 - 2));
        nextPos.y = Math.max(Math.min(Math.random() * GAME_HEIGHT, GAME_HEIGHT - 100), 100);
        this.collectibleRect.x = nextPos.x;
        this.collectibleRect.y = nextPos.y;
        //Set percentage pos for client
        nextPos.x = (nextPos.x / GAME_WIDTH) * 100;
        nextPos.y = (nextPos.y / GAME_HEIGHT) * 100;
        setTimeout(() => {
          this.collectibleRect.activated = true;          
        }, 300);
        server.to(room).emit("collectible-spawn", nextPos);
      }, 300);
    }

    public setBallPos(pos: {x:number, y:number}) : void {
      this.ballPos = pos;
    }

    public getBallPos(): {x: number, y: number} {
      return this.ballPos
    }

  //when game end clear th
}
