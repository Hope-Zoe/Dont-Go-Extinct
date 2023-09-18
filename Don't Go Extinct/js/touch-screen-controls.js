let HideButton;
let isHideButtonPressed;
let CollectButton;
let NewButton;
let PauseButton;
let SoundButton;
let isMuted;

document.addEventListener('contextmenu', event => event.preventDefault()); // disable context menu that would appear on long taps

function setupTouchScreenControls()
{
	console.log("Execution of: setupTouchScreenControls()");

	HideButton = createImg("./game-assets/hide.png");
	CollectButton = createImg("./game-assets/collect.png");
	NewButton = createImg("./game-assets/restart.png");
	PauseButton = createImg("./game-assets/pause.png");
	SoundButton = createImg("./game-assets/sound.png");
	
	HideButton.touchStarted(touchHidePressed);
	HideButton.touchEnded(touchHideReleased);

	HideButton.mousePressed(touchHidePressed);		
	HideButton.mouseReleased(touchHideReleased);
	
	CollectButton.mousePressed(touchCollectPressed);
	
	NewButton.mousePressed(newGameTouchPressed);
	PauseButton.mousePressed(pauseGameTouchPressed);
	SoundButton.mousePressed(handleSoundVolume);
}

function drawTouchScreenControls()
{
	NewButton.position(1100, 0);
	PauseButton.position(1190, 0);
	HideButton.position(0, 80);
	CollectButton.position(640, 80);
	SoundButton.position(1010, 0);

}

function touchHidePressed()
{
	isHideButtonPressed = true;
	panda.hide();
}

function touchHideReleased()
{
	isHideButtonPressed = false;
	panda.idle();
}

function touchCollectPressed()
{
	panda.collect();
}

function newGameTouchPressed()
{
	startGame = true;
	startOnce = true;
	gameOver = false;

	if (!gameSound.isPlaying())
		gameSound.play();
}

function pauseGameTouchPressed()
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

function handleSoundVolume()
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
