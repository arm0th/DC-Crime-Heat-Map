
window.App = window.App || {};

//define backbone objects
App.CrimeTotalsModel = Backbone.Model.extend({
    offense: "",
    total: 0
});

App.CrimeTotalsCollection = Backbone.Collection.extend({
    model: App.CrimeTotalsModel
});

App.MapLegendModel = Backbone.Model.extend({
    crimeTotals: []
});

App.MapLegendView = Backbone.View.extend({
    el: "#crimeTotals",
    initialize: function () {
        this.template = Handlebars.compile($(this.templateEl).html());
        this.listenTo(this.model, "change", function (e) {
            //this.model.set(this.crimeTotals);
            this.render();
        });
    },
    model: App.MapLegendModel,
    crimeTotals: _.extend({}, Backbone.Events),
    template: {},
    templateEl: "#crimeTotalsTemplate",
    render: function() {
        this.$el.html(this.template(this.model));
    }
});


