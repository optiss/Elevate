(function($) {

	window.Page = Backbone.Model.extend({
		url: 'pages'
		/*
		id: '_id',
		url: function() {
			var id = this.get('_id') ? this.get('_id') : null;
			return 'pages/' + id;
		}*/
	});
	
	// get a collection on fetch
	window.Pages = Backbone.Collection.extend({
		model: Page,
		url: '/pages'
	});
	
	window.library = new Pages();
	
	window.PageSingleView = Backbone.View.extend({
		tagName: 'li',
		className: 'page',
		
		initialize : function() {
			_.bindAll(this, 'render', 'unrender');
			this.model.bind('change', this.render);
			this.model.bind('remove', this.unrender);
			this.template = _.template($('#page-template').html());
		},
		
		render : function() {
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		},
		unrender: function() {
			$(this.el).remove();
		}
		
	});
	
	window.PageListView = Backbone.View.extend({
		tagName: 'section',
		className: 'list',
		
		events:{ 'click #add': 'appendPage' },
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#list-template').html());
			this.collection.bind('reset', this.render);
		},
		
		appendPage: function(page) {
			var page = new Page({});
			page.save({title: $('#title').val()}, {
				success: function(){
					var pageView = new PageSingleView({
						model: page
					});
					$pages = this.$('.list');
					$pages.append(pageView.render().el);			
				}
			});
		},
		
		render: function() {
			var $pages,
				collection = this.collection;

			$(this.el).html(this.template({}));
			$pages = this.$('.list');
			
			collection.each(function(page) { 
				var view = new PageSingleView({model: page});
				$pages.append(view.render().el);				
			});
			return this;
		}		
	});
	
	window.Elevate = Backbone.Router.extend({
		routes: {
			'': 'home'
		},
		initialize: function() {
			this.PageListView = new PageListView({
				collection: window.library
			});
		},
		home: function() {
			var $container = $('#container');
			$container.empty();
			$container.append(this.PageListView.render().el);
		}
	});
	
	$(function() {
		window.App = new Elevate();
		Backbone.history.start();	
	});
	

	
})(jQuery);  