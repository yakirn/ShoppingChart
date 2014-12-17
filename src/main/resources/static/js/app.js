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
    //events: {
      // "click .btn-add" : "addItemToChart"
      // "click .btn-remove" : "removeItemFromChart"
  //  }

   // addItemToChart: function(){

   // }
  });

  var productListView = new ProductListView();

  var AppView = Backbone.View.extend({
    el: $("#app"),

    statsTemplate: _.template($('#stats-template').html()),

    initialize: function() {
      this.stats = this.$('.stats');
      this.listenTo(Items, 'all', this.render);
    },

    render: function() {
       this.stats.html(this.statsTemplate({count: Items.count(), subtotal: items.subtotal()}));
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
