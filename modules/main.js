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
		this.Hammer = new window.Hammer();
    	this.HammerManager =  this.Hammer.Manager(document.body,
    	{
		    recognizers: [
		    	[this.Hammer.Pan],
		    	[this.Hammer.Press],
		        [this.Hammer.Rotate],
		        [this.Hammer.Pinch, { enable: false }, ['rotate']],
		        [this.Hammer.Swipe,{ direction: this.Hammer.DIRECTION_HORIZONTAL }],
		    ]
		});
		this.HammerManager.on('pan press pinch swipe rotate', function(){ console.log('SDA'); });
	}


}

new Remux();