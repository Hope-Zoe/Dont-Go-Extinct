
		class Bamboo
		{
			constructor()
			{
				this.x;
				this.bambooSpeed;
				this.bambooPull;
				this.y;
					
				this.minSpeed = 6;
				this.maxSpeed = 12;

				this.collected = false;
				
				this.image = bambooImage;
				this.collectionImage = loadImage("game-assets/sparkles.png");
				this.load();
			}
			
			load()
			{
				this.x = 1200;
				this.bambooSpeed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1) + this.minSpeed);
				this.y = 220;
				this.bambooPull = 0;

				this.image = bambooImage;
				this.collected = false;
			}
			
			display() 
			{
				image(this.image, this.x-= this.bambooSpeed, this.y-=this.bambooPull); 

				if (this.x < -20 || this.y < 40)
				{
					this.load();
					return true;
				}
			}
			
			collect()
			{
				if (!this.collected)
				{
					this.collected = true;

					this.image = this.collectionImage;
					this.bambooSpeed = 0;
					this.bambooPull = 10;

					this.collectingSoundPD();
					
					return true;
				}
			}
			
			collectingSoundPD()
			{
				Pd.send('collection', []);
			}
		}

		class BambooSwarm
		{
			constructor()
			{
				this.increaseDifficulty = 0;
				this.bamboos = []; 
				this.bamboosPassed = 0;
			}
			
			reset()
			{
				this.bamboos.length = 0;
				this.bamboosPassed = 0;
				this.increaseDifficulty = 0;
			}
			
			addNewBamboos(howMany)
			{
				for (let i = 0; i < howMany; i++)
				{
					let bamboo = new Bamboo();
					this.bamboos.push(bamboo);
				}
			}
			
			handleBamboos()
			{
				for (let i = 0; i < this.bamboos.length; i++)
				{
					if (this.bamboos[i].display())
						this.bamboosPassed++;
				}

				this.handleDifficulty();
			}
			
			handleDifficulty()
			{
				if (this.bamboos.length < (this.bamboosPassed/20))
					this.addNewBamboos(1);
			}
			
			checkForCollision(panda)
			{
				for (let i = 0; i < this.bamboos.length; i++)
				{
					if (Math.abs(this.bamboos[i].x - panda.x) < 200)
					{
						panda.eat();
						return this.bamboos[i].collect();
					}
				}
			}
		}


		class Farmer
		{
			constructor()
			{
				this.x;
				this.farmerSpeed;
				this.y;

				this.caught = false;
				
				this.minSpeed = 5;
				this.maxSpeed = 10;
				
				this.image = farmerImage;
				this.load();
			}
			
			load()
			{
				this.x = 1200;
				this.farmerSpeed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed + 1) + this.minSpeed);
				this.y = 280;
				
				this.image = farmerImage;
				this.caught = false;
			}
			
			display() 
			{
				image(this.image, this.x-= this.farmerSpeed, this.y);

				if (this.x < -350)
				{
					this.load();
					return true;
				}
			}

			catch()
			{
				if (!this.caught)
				{
					this.caught = true;
					this.caughtSoundPD();
					return true;	
				}
			}

			caughtSoundPD()
			{
				Pd.send('caught', []);
			}

		}	

		class FarmerSwarm
		{
			constructor()
			{
				this.increaseDifficulty = 0; 
				this.farmers = [];
				this.farmersPassed = 0; 
			}
			
			reset()
			{
				this.farmers.length = 0;
				this.farmersPassed = 0;
				this.increaseDifficulty = 0;
			}
			
			addNewFarmers(howMany)
			{
				for (let i = 0; i < howMany; i++)
				{
					let farmer = new Farmer();
					this.farmers.push(farmer);
				}
			}
			
			handleFarmers()
			{
				for (let i = 0; i < this.farmers.length; i++)
				{
					if (this.farmers[i].display()) 
						this.farmersPassed++;
				}

				this.handleDifficulty();
			}
			
			handleDifficulty()
			{
				if (this.farmers.length < (this.farmersPassed/20))
					this.addNewFarmers(1);
			}
			
			checkForCollision(panda)
			{
				for (let i = 0; i < this.farmers.length; i++)
				{
					if (Math.abs(this.farmers[i].x - panda.x) < 100)
					{
						if (!this.farmers[i].caught)
						{
							panda.catch();
							return this.farmers[i].catch();
						}
					}
				}
			}
		}
		
		
		class Panda
		{
			x = 70;
			y = 187; 
			
			constructor()
			{
				this.state = "idle";
				this.caught = false;

				this.bamboos = 0;
				this.collectingFrames = 0;

				this.caughtFrames = 0;

				//preloads
				this.idleImage = loadImage("game-assets/panda.png");
				this.eatingImage = loadImage("game-assets/pandaEating.png");
				this.hidingImage = loadImage("game-assets/pandaHiding.png");
				this.caughtImage = loadImage("game-assets/pandaCaught.png");

				this.drawImage = this.idleImage;
			}
			
			display()
			{
				if (this.collectingFrames > 0) 
				{
					image(this.eatingImage, this.x, this.y);

					this.collectingFrames--;
					return;
				}

				if (this.caughtFrames > 0)
				{
					image(this.caughtImage, this.x, this.y);

					this.caughtFrames--;
					return;
				}

				image(this.drawImage, this.x, this.y);	
			}

			getState()
			{ return this.state; }

			idle()
			{
				if (this.state != "idle")
				{
					this.state = "idle";
					this.drawImage = this.idleImage;		
					this.y = 187;		
				}
			}

			hide()
			{	
				if (this.state != "hiding")
				{
					this.state = "hiding";
					this.drawImage = this.hidingImage;
					this.y = 314;
				}
			}

			collect()
			{
				if (this.state == "idle")
				{
					this.state = "collecting";
					this.collectingFrames = 5;
				}
			}

			eat()
			{ this.bamboos += 50; }

			getBambooScore()
			{ return this.bamboos; }

			reset()
			{ this.bamboos = 0; }
						
			catch()
			{ 
				this.caught = true; 
				this.caughtFrames = 8;
			}

			isCaught()
			{ return this.caught; }
		}
		
		class PandaLives
		{	
			constructor()
			{
				this.lives = [];
				this.livesLeft = 3;
				
				for (let i = 0; i < this.livesLeft; i++)
				{
					let live = loadImage("game-assets/heart.png");
					this.lives[i] = live;
				}
			}
			
			display()
			{ this.showLives(this.livesLeft); }
			
			showLives(livesLeft)
			{
				for (let i = 0; i < livesLeft; i++)
				{
					image(this.lives[i], (i*40+10), 20);
				}
			}
			
			reduceOneLive()
			{ this.livesLeft--; }
			
			reset()
			{ this.livesLeft = 3; }
		}
		
		
		// Globals

		let pandaLives; 
		let background;
		let panda;
		let bambooImage; 
		let bambooSwarm;
		let farmerImage;
		let farmerSwarm;

		let startGame = false;
		let startOnce = true;
		let gameOver = false;
		let paused = false;
		
		let gameSound;
		let gameSoundEffects;
		
		
		// P5 functions preload(), setup(), draw() and keyPressed()
	
		function preload() 
		{
			background = loadImage("game-assets/background.jpg");	
			bambooImage = loadImage("game-assets/bamboo.png"); 
			farmerImage = loadImage("game-assets/farmer.png");
			panda = new Panda();
			
			gameSound = loadSound("game-assets/wavs/music.wav");
			gameSound.setLoop(true);
			gameSound.setVolume(0.05);

			gameSoundEffects 
			$.get('game-assets/pure-data-patches/SoundEffects.pd', function(patchStr) {
				  gameSoundEffects = Pd.loadPatch(patchStr);
				})
		}
		
		function setup() 
		{
			createCanvas(1280, 720);
			
			pandaLives = new PandaLives();
			bambooSwarm = new BambooSwarm();
			farmerSwarm = new FarmerSwarm();
			
			setupTouchScreenControls();
		}
		
		function draw() 
		{
			image(background, 0, 0);
			panda.display();
			pandaLives.display();
						
			showMessages();
			
			drawTouchScreenControls();
			
			if (startGame && !gameOver && startOnce) // begin a new game
			{
				Pd.start();
				bambooSwarm.reset();
				bambooSwarm.addNewBamboos(2);

				farmerSwarm.reset();
				farmerSwarm.addNewFarmers(1);

				pandaLives.reset();
				panda.reset();

				startOnce = false;
			}
			
			if (gameOver) // game over
			{
				gameSound.stop();
			}
			
			
			if (!gameOver && startGame && !paused) // while the game is played
			{
				bambooSwarm.handleBamboos();
				farmerSwarm.handleFarmers();
				
				if (panda.getState()=="collecting")
					bambooSwarm.checkForCollision(panda);

				if (panda.getState()!="hiding")
					farmerSwarm.checkForCollision(panda);
							
				if (panda.isCaught())
				{
					pandaLives.reduceOneLive();
					panda.caught = false;
				}
				
				if (pandaLives.livesLeft == 0)
					gameOver = true;

				if (keyIsDown(88) || isHideButtonPressed) //  Key88 = X - Hide
					panda.hide();
				
				else 
					panda.idle();
			}
		}
				
		function keyPressed()
		{
			
			if (keyCode == 78) // Key78 = N - New game
			{
				startGame = true;
				startOnce = true;
				gameOver = false;

				if (!gameSound.isPlaying())
					gameSound.play();
			}
			
			if (keyCode == 80) // Key80 = P - Pause
			{
				if (startGame && !gameOver && !paused)
					paused = true;
				else if (startGame && !gameOver && paused)
					paused = false;
					
				if (paused)
					gameSound.pause();
			
				if (!paused)
				{
					if (gameSound.isPaused())
						gameSound.play();
				}
			}

			if (keyCode == 77) // Key77 = M - Mute
			{
				if (!isMuted)
				{
					isMuted = true;
					gameSound.setVolume(0);
				}

				else 
				{
					isMuted = false;
					gameSound.setVolume(0.05);
				}
			}

			if (keyCode == 67) // Key67 = C - Collect
				panda.collect();
		}

		function showMessages()
		{
			
			textSize(30);
			fill('white');
			text("Score: " + panda.getBambooScore(), 30, 135);
		
			if (!startGame)
				rect(280, 280, 680, 140); // rectangle (window) to show the message to start game
				
			if (gameOver)
				rect(280, 220, 680, 200); // rectangle (window) to show the message game over and start game
		
			textSize(50);
			fill('black');
			if (!startGame || gameOver) // provide instructions
			{
				text('Press N to start a new game.', 300, 300, 800, 200);
				textSize(25);
				text('Collect the Bamboo (C) and avoid the Farmers (X)', 340, 360, 800, 200);
			}
			
			if (gameOver)
			{
				textSize(50);
				text('Game over!', 500, 280);
			}
			
			if (paused)
			{
				textSize(50);
				fill('white');
				text('Game paused!', 500, 280);
			}
		}
	
