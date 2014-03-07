//Under Development

var ArticleModel = Backbone.Model.extend({
	defaults: function() {
		return {
			term: '',
			page: 1			
		};
	},
	initialize: function(){
    	console.log('ArticleModel loaded successfully');
    }
});

var Articles = Backbone.Collection.extend({
	url: function(){
		return 'http://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=headline:('+ articleModel.get('term') +')&page='+ articleModel.get('page') +'&api-key=6d6f7bcd9b701c38e1ff40dc40ef5b8a:13:68866710'
	}
});

var ArticleList = Backbone.View.extend({
	el: 'body',
	render: function(){

		var articles = new Articles;
		console.log(articles);

		var self = this;
		articles.fetch({
			success: function(res){
				var docs = res.models[0].attributes.response.docs;
				var template = _.template($('#articleTemplate').html(), {articles: docs})
				self.$('#articles').append(template);
				
				console.log(res.models[0].attributes.response.docs);				
			},
			error: function(){
				console.log('error');
			}
		});

	},
	events: {
		'click a#more': 'loadMore',//more button in case infinite does not fire.
		'scroll': 'infiniteScroll',
		'keypress #search': 'searchSubmit',
		'mouseenter article.bs-callout': 'showCharms',
		'mouseleave article.bs-callout': 'hideCharms'
	},
	loadMore: function(e){
		e.preventDefault();

		currentPage = articleModel.get('page');
		nextPage = currentPage + 1;

		articleModel.set('page', nextPage);
		this.render();

	},
	infiniteScroll: function(e) {
		//on page load we have no event so check for that
		e ? e.preventDefault() : console.log('no event');
		console.log('scroll');

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
			var self = this;
	        if($(window).scrollTop() + $(window).height() == getDocHeight()) {
				console.log('trigger');
				currentPage = articleModel.get('page');//get current page
				nextPage = currentPage + 1;//add 1
				articleModel.set('page', nextPage);//set next page var          
				articleList.render();//render the view again to append the new page to the bottom
	       }
	    });
    },
    searchSubmit: function(e){
    	if(e.which === 13){// enter key
	    	val = $(e.target).val();
	    	articleModel.set('term', val);//set the search term
	    	this.$('#articles').empty()//clear the current article list
	    	articleList.render();

	    	console.log(val);    		
    	} 
    },
    showCharms: function(e){
    	charms = $(e.currentTarget.children);
    	charms.show();
    },
    hideCharms: function(e){
    	charms = $('span.article-charms');
    	charms.hide();
    }    

});

//Router for some later functionality
var Router = Backbone.Router.extend({
	routes: {
		'' : 'home'
	}
});

//Initiate view/collections
var articleList = new ArticleList();
var articleModel = new ArticleModel();

//Initiate Router
var router = new Router();
	router.on('route:home', function() {
		//articleList.render();
		articleList.infiniteScroll();
		console.log('home page');
});
//History
Backbone.history.start();
