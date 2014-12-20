  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

   var ChartItem = Backbone.Model.extend({
    defaults: function() {
      return {
        id: 0,
        quantity: 1,
        price: 0
      };
    },
  });

  var ChartList = Backbone.Collection.extend({
    model: ChartItem,

    addItem : function(item){
        var existItem = _.findWhere(this.models, {id: item.id});
        if(existItem){
          existItem.set({
            "quantity": existItem.get("quantity")+1
          });
        }
        else {
          this.add(item);
        }
    },

    removeItem : function(item){
        var existItem = _.findWhere(this.models, {id: item.id});
        if(existItem && existItem.get("quantity") > 0){
          existItem.set({
            "quantity": existItem.get("quantity")-1
          });
        }
    },

    subtotal : function(){
      var res = _.reduce(this.models, function(memo, item){
        return memo + (item.get("price") * item.get("quantity"));
      }, 0);

      return res;
    },

    count : function(){
      var res = _.reduce(this.models, function(memo, item){
        return memo + (item.get("quantity"));
      }, 0);
      return res;
    }
  });

  var Items = new ChartList();

  var Products = Backbone.Collection.extend({
    url: '/products'
  });

  var ProductView = Backbone.View.extend({
      tagName:  "tr",

      template: _.template($('#product-template').html()),

      initialize: function() {
        this.model.bind('change', this.refresh, this);
      },

      refresh: function () {
        this.$el.find('.quantity-view').html(this.model.get('quantity'));
      },

      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },

      events: {
        "click .btn-add"   : "addOne",
        "click .btn-remove"   : "removeOne"
      },

      addOne: function(){
        this.model.set({
          "quantity": this.model.get("quantity")+1
        });
        Items.addItem({id: this.model.get("id"), price: this.model.get("price")});
      },

      removeOne: function(){
        if(this.model.get("quantity") > 0){
          this.model.set({
            "quantity": this.model.get("quantity")-1
          });
          Items.removeItem({id: this.model.get("id")});
        }
      }

  });

  var AppView = Backbone.View.extend({
    el: $("#app"),

    productList: $(".list"),

    statsTemplate: _.template($('#stats-template').html()),

    initialize: function() {
      this.stats = this.$('.stats');
      this.listenTo(Items, 'all', this.renderStats);
      this.products = new Products();
    },

    events: {
      "click #btn-checkout": "checkout"
    },

    render: function() {
      var that = this;
      this.products.fetch({
        success: function (products) {
          _.each(products.models, function(prod){
              prod.set({quantity: 0});
              var view = new ProductView({model: prod});
              that.productList.append(view.render().el);
              that.renderStats();
          });
        }
      });
    },

    renderStats: function(){
       this.stats.html(this.statsTemplate({count: Items.count(), subtotal: Items.subtotal()}));
    },

    checkout: function(){
      var str = "";
      _.chain(Items.models)
      .filter(function(item){
      		return item.get("quantity") > 0;
      })
      .each(function(item){
        str += "Item ID: " + item.id;
        str += " --> " + item.get("quantity");
        str += "\n";
      });

      alert(str);
    }

  });

  var Router = Backbone.Router.extend({
      routes: {
        "": "home"
      }
  });

  var router = new Router;
  var App = new AppView;

  router.on('route:home', function() {
    //productListView.render();
    App.render();
  })
  Backbone.history.start();
