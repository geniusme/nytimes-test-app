// Define the model
Tweet = Backbone.Model.extend();

// Define the collection
Tweets = Backbone.Collection.extend(
    {
        model: Tweet,
        // Url to request when fetch() is called
        url: 'http://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=headline:("beer")&page=1&api-key=6d6f7bcd9b701c38e1ff40dc40ef5b8a:13:68866710',
        parse: function(response) {
            return response;
            //console.log(response);
        },
        // Overwrite the sync method to pass over the Same Origin Policy
        sync: function(method, model, options) {
            var that = this;
                var params = _.extend({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: that.url,
                    processData: false
                }, options);   
            return $.ajax(params);
        }
    });

// Define the View
TweetsView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      // create a collection
      this.collection = new Tweets;
      // Fetch the collection and call render() method
      var that = this;
      this.collection.fetch({
        success: function (res) {
            that.render();
            console.log(res);
        }
      });
    },
    // Use an extern template
    template: _.template($('#tweetsTemplate').html()),

    render: function() {
        // Fill the html with the template and the collection
        $(this.el).html(this.template({ tweets: this.collection.toJSON() }));
    }
});

var app = new TweetsView({
    // define the el where the view will render
    el: $('body')
});