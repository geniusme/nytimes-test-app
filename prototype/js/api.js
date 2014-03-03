$(document).ready(function(){	
	
	//api params
	var term = 'beer';//incase we want to add more search terms
	var getPage = 1;

	//load feed when on the first page load
	getFeed(term, getPage);

	//Main API feed function
	function getFeed(term, page){

		//GET the JSON
		//Searching for beer in just the headlines and bylines because searching the body was giving too many irrelevant results.
		$.getJSON('http://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=headline:('+ term +')&page='+ page +'&api-key=6d6f7bcd9b701c38e1ff40dc40ef5b8a:13:68866710', function(json) {
		
		//Handlerbars.js setup
	    var src = $('#articleTemplate').html(),
     	template = Handlebars.compile(src),
		data = template(json.response),
		html = $('#articles').append(data);
		
		//debugging
		console.log(json.response)
	  });

	};

	////Lets add some infinite scrolling
	//load more function
	function loadMore(){
		getPage = getPage + 1;
		getFeed(term, getPage);	
		
		//degugging
		console.log(term+', '+getPage);	
	}

	//Manual button to click if infinite scroll doesn't work or is too slow.
	$('a#more').click(function(e){
		e.preventDefault();
		getPage = getPage + 1;
		getFeed(term, getPage);

		//degugging
		console.log(term+', '+getPage);
	});
	//get the doc height
	function getDocHeight() {
    	var D = document;
    	return Math.max(
	        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
	        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
	        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    	);
	}
	//fire the loadMore fuction when we get to the bottom of the page
	$(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() == getDocHeight()) {
           loadMore();
       }
   });

});//end doc.ready
