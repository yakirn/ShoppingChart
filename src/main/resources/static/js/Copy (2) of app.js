  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

   var ChartItem = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {
        id: 0,
        quantity: 0,
        price: 0
      };
    },

    // Toggle the `done` state of this todo item.
    add: function() {
      if(this.get("id")){
        this.save({quantity: this.get("quantity")+1});
      }
    },

    subtract: function() {
      var q = this.get("quantity");
      if(this.get("id") &&  q > 0){
        this.save({quantity: this.get("quantity")-1});
      }
    }

  });

  var ChartList = Backbone.Collection.extend({
    model: ChartItem,

    subtotal : function(){
      return _.reduce(this, function(memo, item){
        return memo + (item.get("price") * item.get("quantity"));
      }, 0);
    },

    count : function(){
      return this.filter(function(item){
          return item.get("quantity") > 0;
      });
    }
  });

  var Items = new ChartList;

  var Products = Backbone.Collection.extend({
    url: '/products'
  });

  ProductView = Backbone.View.extend({
    tagName: "tr",

    template: _.template($('#product-template').html()),

    events: {
      "click .btn-add"   : "addToChart",
      "click .btn-remove"  : "removeFromChart"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var ProductListView = Backbone.View.extend({
    el: '.list',
    render: function () {
      var that = this;
      var products = new Products();
      products.fetch({
        success: function (products) {
          var data = {"products" : products.toJSON()};
          var template = _.template($('#product-list-template').html(), data);
          that.$el.html(template);
        }
      });
    }
  });

  var productListView = new ProductListView();

  var AppView = Backbone.View.extend({
    el: $("#app"),

    statsTemplate: _.template($('#stats-template').html()),

    initialize: function() {
      this.stats = this.$('.stats');
    },

    render: function() {
        var that = this;
        var products = new Products();
        products.fetch({
        success: function (products) {
          var data = {"products" : products.toJSON()};
          var template = _.template($('#product-list-template').html(), data);
          that.$el.html(template);
        }

       this.stats.html(this.statsTemplate({count: 0, subtotal: 0}));
    },

    addOne: function(product) {
      var view = new TodoView({model: product});
      this.$("#product-list").append(view.render().el);
    },

    addAll: function() {
      Todos.each(this.addOne, this);
    },

  });

  var Router = Backbone.Router.extend({
      routes: {
        "": "home"
      }
  });



  var router = new Router;
  var App = new AppView;

  router.on('route:home', function() {
    productListView.render();
    App.render();
  })
  Backbone.history.start();