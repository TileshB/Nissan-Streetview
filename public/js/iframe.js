$(document).ready(function() {
    /**
	 * ----------------------------------------
	 * PACE JS
	 * ----------------------------------------
	 */
	var checkForHeightInterval;
	var domain =  'http://localhost',
        bodyH;
 
    if (window.location !== window.parent.location) {
        domain = getDomain(document.referrer);
    }
 
    function getDomain(link) {
        var iframeDomain,
            parser = document.createElement('a');
 
        parser.href = link;
        iframeDomain = parser.protocol + '//' + parser.hostname;
 
        return iframeDomain;
    }
 
    if (window.addEventListener) {
        addEventListener('message', listener, false);
    } else {
        attachEvent('onmessage', listener);
    }
 
    function listener(event) {
        if ((event && event.data === 'need_height') || !event) {
            var message = {
                type: 'resize',
                height: $('body').height() + 50
            };
            window.parent.postMessage(JSON.stringify(message), domain);
            /* Add the urls where the C69-10 component is used * /
            window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.qa.PACErenault.net/');
            window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.uat.PACErenault.net/');
            window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.prod.PACErenault.net/');
            window.parent.postMessage(JSON.stringify(message), 'https://www.renault.fr/');
            window.parent.postMessage(JSON.stringify(message), 'https://author.qa.PACEalliance.net/');
            window.parent.postMessage(JSON.stringify(message), 'https://author.uat.PACEalliance.net/');
			window.parent.postMessage(JSON.stringify(message), 'https://author.prod.PACEalliance.net/');
			/**/
			window.parent.postMessage(JSON.stringify(message), 'https://www.nissan.co.za/');
			window.parent.postMessage(JSON.stringify(message), 'https://nissan-media.co.za/');
            window.parent.postMessage(JSON.stringify(message), 'https://author-europe.prod.heliosnissan.net/');
        }
    }
 
    function scrollTopIframe(event) {
        var message = {
            type: 'scrolltopiframe'
        };
        window.parent.postMessage(JSON.stringify(message), domain);
		/* Add the urls where the C69-10 component is used */
		/* * /
        window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.qa.PACErenault.net/');
        window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.uat.PACErenault.net/');
        window.parent.postMessage(JSON.stringify(message), 'https://fr-fr.prod.PACErenault.net/');
        window.parent.postMessage(JSON.stringify(message), 'https://www.renault.fr/');
        window.parent.postMessage(JSON.stringify(message), 'https://author.qa.PACEalliance.net/');
        window.parent.postMessage(JSON.stringify(message), 'https://author.uat.PACEalliance.net/');
        window.parent.postMessage(JSON.stringify(message), 'https://author.prod.PACEalliance.net/');
		window.parent.postMessage(JSON.stringify(message), 'https://author.prod.PACEnissan.net/');
		/**/
		window.parent.postMessage(JSON.stringify(message), 'https://www.nissan.co.za/');
		window.parent.postMessage(JSON.stringify(message), 'https://nissan-media.co.za/');
		window.parent.postMessage(JSON.stringify(message), 'https://author-europe.prod.heliosnissan.net/');
    }
 
    function checkForNewHeight() {
		
        var newBodyH = $('body').height();
        if (bodyH !== newBodyH) {
            bodyH = newBodyH;
			listener();
			clearTimeout(checkForHeightInterval);
		}
		
		//console.log('checkForNewHeight', newBodyH, bodyH, getDomain(document.referrer) );
    }
 
    $('[data-scrolltop-iframe]').on('click', scrollTopIframe);
 
    checkForHeightInterval = setInterval(checkForNewHeight, 250);
    

});


// // ALSO ADD THIS 
// window.resizeIframe = function resizeIframe (obj) {
// 	obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
// }

// // OR THIS IN YOUR HTML FILE
