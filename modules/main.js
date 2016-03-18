import 'hammerjs';
const {debounce} = require('lodash');

let Hammer = window.Hammer;

export default {};

class Remux {

	constructor() {

		let that = this;
		this.events = [];

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

		this.HammerManager
			.on('pan press pinch swipe rotate', (e) => {
				this.saveEvent(e);
		});

		window.onscroll = (e) => {
			debounce( this.saveScrollEvent(e), 100 );
		};

	}

	saveScrollEvent(e) {
		console.log(e);

		this.saveEvent({e});
	}

	saveEvent(e) {
		this.events.push(e);
		console.log('Event saved to..', this.events.length);
		console.log(this.events);
	}


}

new Remux();