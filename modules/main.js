import 'hammerjs';

export default {};

class Remux {

	constructor() {
		let that = this;
		window.onload = function (){
			that.domLoaded();
    	};
	}

	domLoaded() {
		this.HammerManager =  new Hammer.Manager(document.body,
    	{
		    recognizers: [
		    	[Hammer.Pan],
		    	[Hammer.Press],
		        [Hammer.Rotate],
		        [Hammer.Pinch, { enable: false }, ['rotate']],
		        [Hammer.Swipe],
		    ]
		});
		this.HammerManager.on('pan press pinch swipe rotate', function(){ console.log('SDA'); });
	}


}

new Remux();