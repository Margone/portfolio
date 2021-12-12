<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="icon" href="./icons/logo.svg">
	<link rel="stylesheet" href="css/controls-icons.css" type="text/css">
	<link rel="stylesheet" href="css/index.css" type="text/css">
	<link rel="stylesheet" href="css/wrapperAbout.css" type="text/css">
	<link rel="stylesheet" href="css/wrapperSkills.css" type="text/css">
	<link rel="stylesheet" href="css/gameReward.css" type="text/css">
	<link rel="stylesheet" href="css/gamePopUp.css" type="text/css">
	<link rel="stylesheet" href="css/aboutTransition.css" type="text/css">
	<link rel="preload" href="../fonts/AmaticSC-Regular.woff2" as="font" crossorigin="anonymous" />
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
	<meta name="formt-detection" content="telephone=no">
	<meta name="description" content="Web developer and 3D modeler from Russia">
	<meta name="keywords" content="3D modeler, web developer, Dmitry Oryol, dmitry-oryol, Дмитрий Орел, Дмитрий Орёл, дмитрий-орел, веб разработчик, 3D моделлер">
	<meta property="og:locale" content="ru_RU">
	<meta property="og:type" content="website">
	<meta property="og:title" content="Dmitry Oryol">
	<meta property="og:description" content="Web developer and 3D modeler from Russia">
	<meta property="og:image" content="./pictures/meEdit.jpg">
	<meta property="og:url" content="https://orel.tmweb.ru">
	<meta property="twitter:card" content="summary">
	<meta property="twitter:site" content="Dima">
	<meta property="twitter:title" content="Dmitry Oryol">
	<meta property="twitter:description" content="Web developer and 3D modeler from Russia">
	<meta name='robots' content="none">
	<meta property="twitter:image" content="./pictures/meEdit.jpg">
	<title>Dmitry Oryol</title>
</head>
<body>
	<div class="wrapper">
	    <div class="tooltips">
	      <p>The world needs you</p>
	    </div>
		<div class="content-choice">
			<div class="about about-hover">
				<div class="about-p1">
					<p>About</p>
				</div>
				<div class="about-background">
					<div></div>
				</div>
				<div class="about-progress">
					<div class="about-progress_bar">
						<div></div>
					</div>
				</div>
				<img src="./pictures/loadingSpinner.png" alt="" class="about-loading-spinner loading-spinner">				
			</div>
			<div class="game game-hover">
				<div class="game-p1">
					<p>Game</p>
				</div>
				<div class="game-background">
					<div></div>
				</div>
				<div class="game-progress">
					<div class="game-progress_bar">
						<div></div>
					</div>
					<div class="game-progress_p">
						<p></p>
					</div>
				</div>
				<img src="./pictures/loadingSpinner.png" alt="" class="game-loading-spinner loading-spinner">
			</div>
		</div>
		<div class="examples-pop-up-wrapper">
			<div class="examples-pop-up">
				<div class="examples-pop-up__close"></div>
				<div class="examples-pop-up__image"></div>
				<p></p>
				<a href="" class="examples-pop-up__button" target="_blank">
					<div>Go to</div>
				</a>
			</div>
		</div>
		<div class="game-pop-up">
			<div class="game-pop-up__close"></div>
			<div class="game-pop-up__pc">
				<div class="game-target">
					<h2>TARGET</h2>
					<p>- Return the cubs to the spawn location</p>
					<p>(If the cubs hear a howl, they will respond)</p>
				</div>
				<div class="game-controls">
					<h2>CONTROLS</h2>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-pc-movement-and-rotate">
						<p>Movement & rotate</p>
					</div>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-pc-run">
						<p>Run</p>
					</div>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-pc-howl">
						<p>Howl</p>
					</div>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-pc-pause">
						<p>Pause</p>
					</div>
				</div>
				<h2 class="game-pop-up-exit-pc game-pop-up-exit">EXIT TO MENU</h2>
			</div>
			<div class="game-pop-up__mobile">
				<div class="game-target">
					<h2>TARGET</h2>
					<p>- Return the cubs to the spawn location</p>
					<p>(If the cubs hear a howl, they will respond)</p>
				</div>
				<div class="game-controls">
					<h2>CONTROLS</h2>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-mobile-movement">
						<p>Movement</p>
					</div>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-mobile-rotate">
						<p>Rotate</p>
					</div>
					<div class="game-controls__row">
						<img alt="" class="game-controls-icon-mobile-howl">
						<p>Howl</p>
					</div>
					<div class="game-controls__row control-row-touch-pause">
						<p>Touch and hold the screen to pause</p>
					</div>
				</div>
				<h2 class="game-pop-up-exit-mobile game-pop-up-exit">EXIT TO MENU</h2>
			</div>
		</div>
		<div class="about-transition-bar">
			<div class="transition-menu">
				<span></span>
			</div>
			<div class="list-chapters-about">
				<div class="list-chapters__chapter chapter-artist">
					<div class="chapter-background"></div>
					<p>ARTIST</p>
				</div>
				<div class="list-chapters__chapter chapter-skills">
					<div class="chapter-background"></div>
					<p>SKILLS & EXAMPLES</p>
				</div>
				<div class="list-chapters__chapter chapter-editor">
					<div class="chapter-background"></div>
					<p class="icon-lock">EDITOR<span class="icon-lock__clarification">Go to the section Game</span></p>
				</div>
				<div class="list-chapters__chapter exit">
					<div class="chapter-background"></div>
					<p>EXIT</p>
				</div>
			</div>
		</div>
		<div class="wrapper-editor">
			<div class="rotate-popup-row">
				<p>YOU CAN ROTATE MODEL</p>
				<img alt="pointer">
			</div>
			<div class="editor-row">
				<div class="content-editor">
					<div class="editor-row__color">
						<h2>MANE COLOR:</h2>
						<input type="color" value="#ffffff">
					</div>
					<div class="editor-row__wool">
						<h2>WOOL COLOR:</h2>
						<div class="textures-row">
							<div class="texture-block texture-dark icon-lock"></div>
							<div class="texture-block texture-regular"></div>
							<div class="texture-block texture-light icon-lock"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="wrapper-skills">
			<div class="skills-row">
				<div class="skills-row__header">
					<div class="skills-logo">
						<div></div>
						<div class="skills-logo__typingline"></div>
					</div>
					<h2>PROGRAMMING</h2>
					<p>Development and support of web applications, script writing, 3D and 2D animation.</p>
				</div>
				<div class="skills-row__list">
					<p>JS</p>
					<p>PHP</p>
					<p>HTML<span>\</span>CSS</p>
					<p>SASS</p>
					<p>THREE JS</p>
					<p>WebGL</p>
					<p>GSAP</p>
					<p>Git<span>\</span>GitHub</p>
				</div>
			</div>
			<div class="examples-row">
				<div class="content-examples">
					<div class="examples-row__six first-six">
						<div class="example-block _active first-six__blocks sketchfab">
							<img alt="">
						</div>
						<div class="example-block _active first-six__blocks fdn">
							<img alt="">
						</div>
						<div class="example-block first-six__blocks"><p>SOON</p></div>
						<div class="example-block first-six__blocks"><p>SOON</p></div>
					</div>
					<div class="examples-row__six second-six">
						<div class="example-block second-six__blocks"><p>SOON</p></div>
						<div class="example-block second-six__blocks"><p>SOON</p></div>
						<div class="example-block second-six__blocks"><p>SOON</p></div>
						<div class="example-block second-six__blocks"><p>SOON</p></div>
					</div>
					<div class="examples-row__six three-six">
						<div class="example-block three-six__blocks"><p>SOON</p></div>
						<div class="example-block three-six__blocks"><p>SOON</p></div>
						<div class="example-block three-six__blocks"><p>SOON</p></div>
						<div class="example-block three-six__blocks"><p>SOON</p></div>
					</div>					
				</div>
			</div>
			<div class="skills-slider">
				<span class="programming">PROGRAMMING</span><span class="modeling">MODELING</span><span class="graphic">GRAPHIC</span><span class="examples">EXAMPLES</span>
				<div class="skills-slider__underline"></div>
			</div>
		</div>
		<div class="wrapper-about">
			<div class="mail-success-popUP">
				<canvas id="mail-success" width="200" height="200"></canvas>
			</div>
			<div class="fix-rowOne">
				<div class="fix-rowOne__left-background"></div>
				<div class="fix-rowOne__pic fix-pic">
					<div class="fix-pic_framework">
						<p>
							<span class="pic-span__one"><span class="pic-span__blur">D</span><span class="pic-span__blur">M</span><span class="pic-span__blur">I</span><span class="pic-span__blur">T</span><span class="pic-span__blur">R</span><span class="pic-span__blur">Y</span> </span><span class="pic-span__two"><span class="pic-span__blur">O</span><span class="pic-span__blur">R</span><span class="pic-span__blur">Y</span><span class="pic-span__blur">O</span><span class="pic-span__blur">L</span></span>
						</p>					
						<img alt="">
					</div>
				</div>
				<div class="fix-rowOne__right-background"></div>
			</div>		
			<main class="main">
				<div class="main-one-triangle"></div>
				<div class="main-two-triangle"></div>
				<div class="main_content content-main content-about">
					<div class="content-main__row content-row">
						<div class="main-row__start">
							<div class="row-start__line">
								<p>
									DID YOU COME HERE FOR HELP
								</p>
							</div>
							<div class="row-start__line">
								<p>
									OR WENT TO 'JUST WATCH'
								</p>
							</div>
							<div class="row-start__line">
								<p>
									ANYWAY, WELCOME
								</p>
							</div>
							<div class="row-start__line">
								<p>
									YOU CAN JUST CALL ME DIMA
								</p>
							</div>
							<div class="row-start__line">
								<p>
									I COME FROM THE FAR NORTH OF RUSSIA
								</p>
							</div>
							<div class="row-start__line">
								<p>
									I'M A WEB DEVELOPER AND 3D MODELER
								</p>
							</div>
						</div>
						<div class="main-row__final">
							<p class="row-p__one">
								<span>B</span><span>Y</span> <span>T</span><span>H</span><span>E</span> <span>W</span><span>A</span><span>Y</span><span class="row-p__red">,</span>
							</p>
							<p class="row-p__two">
								<span>I</span> <span>D</span><span>O</span><span>N</span><span class="row-p__red">'</span><span>T</span> <span>R</span><span>I</span><span>D</span><span>E</span> <span>O</span><span>N</span> <span>A</span> <span>B</span><span>E</span><span>A</span><span>R</span><span class="row-p__red">,</span>
							</p>
							<p class="row-p__three">
								<span>I</span> <span>D</span><span>O</span><span>N</span><span class="row-p__red">'</span><span>T</span> <span>W</span><span>E</span><span>A</span><span>R</span> <span>E</span><span>A</span><span>R</span><span>F</span><span>L</span><span>A</span><span>P</span><span>S</span><span class="row-p__red">,</span>
							</p>
							<p class="row-p__four">
								<span>I</span> <span>D</span><span>O</span><span>N</span><span class="row-p__red">'</span><span>T</span> <span>P</span><span>L</span><span>A</span><span>Y</span> <span>A</span> <span>B</span><span>A</span><span>L</span><span>A</span><span>L</span><span>A</span><span>I</span><span>K</span><span>A</span><span class="row-p__red">.</span>
							</p>				
						</div>
					</div>
				</div>
			</main>
			<div class="fix-rowTwo">
				<div class="fix-rowTwo__pic"></div>
			</div>
			<footer class="footer">
				<div class="footer-triangle"></div>
				<div class="footer_content content-footer content-about">
					<div class="content-footer__row footer-row">
						<div class="footer-row__start">
							<p>
								
							</p>
						</div>
						<div class="footer-row__finall">
							<p>
								
							</p>
						</div>
					</div>
					<div class="contact-me">
						<h1>CONTACT ME</h1>
						<p>FEEL FREE TO WRITE ANYTIME</p>
						<p>WE WILL DISCUSS AND FIND A WAY OUT OF THE SITUATION</p>
					</div>
					<div class="ways-to-contact">
						<div class="ways-to-contact__mail way-contact">
							<div class="footer-form__popup">
								<div class="popup-triangle"></div>
								<p></p>
							</div>
							<h2>E-MAIL</h2>
							<form method="post" class="footer-form" name="footerForm">
								<div class="footer-form__Onerow">
									<input type="text" placeholder="First Name" class="footer-form__name form-field form-firstName" name="firstName">
									<input type="text" placeholder="Last Name" class="footer-form__name form-field form-lastName" name="secondName">
								</div>
								<input type="text" placeholder="E-mail" class="footer-form__email form-field" name="mailAdress">
								<textarea placeholder="Write something..." class="footer-form__message form-field" cols="30" rows="10" name="body"></textarea>
								<button class="footer-form__button form-field">SEND</button>
							</form>
						</div>
						<div class="ways-to-contact__messengers way-contact">
							<div class="contact-div__anim"></div>
							<div class="way-contact__wrapper">
								<h2>MESSENGERS</h2>
								<a href="https://t.me/Sargone" target="_blank">
									<img class="telegram-logo messenger-logo" alt="telegram">
								</a>
								<a href="https://www.instagram.com/sargone_margone/" target="_blank">
									<img class="instagram-logo messenger-logo" alt="instagram">
								</a>
								<a href="https://sketchfab.com/Sargone" target="_blank">
									<img class="sketchfab-logo messenger-logo" alt="instagram">
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>			
		</div>
	</div>
</body>
<script type="module" src="./js/index.js"></script>
</html>