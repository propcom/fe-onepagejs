# One page JS

One page JS allows you to create the basic functioanlity of a one page site including navigation, pushstates and analytics tracking. It utilises Mika Tuupola's in-viewport selectors.

The below will initialise an instance of onepage JS. Reference your page class, nav class and offset.

<pre>
	var onepage = new onepage(
		$('.js-page'),
		$('.js-nav'),
		1
	);	
</pre>

A link with your specified class will scroll you to the correct section as specified by the href in the link and the ID of the referenced section. 

Link format (the one page JS class MUST come first before other classes): 

<pre>
	<a href="about" class="js-nav">About</a>
</pre>

Section format:

<pre>
	<div class="js-page" data-page="about" id="about"></div>	
</pre>

See the [one page site guide] (http://wiki.local/wiki/One_page_site) for how to set up your controllers in fuel.
