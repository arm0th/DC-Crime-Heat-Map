/*jslint nomen: true */
/*global window, $, App, Backbone, Handlebars, TweenMax, _ */
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
    el: "#mapLegend",
    crimeTotalsEl: "#crimeTotals",
    events: {
        "click #legendToggleBtn": "legendBtnClickedHandler"
    },
    initialize: function () {
        "use strict";

        this.template = Handlebars.compile($(this.templateEl).html());
        this.listenTo(this.model, "change", function (e) {
            //this.model.set(this.crimeTotals);
            this.render();
        });
    },
    model: App.MapLegendModel,
    isShown: true,
    crimeTotals: _.extend({}, Backbone.Events),
    legendBtnClickedHandler: function (e) {
        "use strict";

        if (this.isShown) {
            this.hide();
        } else {
            this.show();
        }

        this.isShown = !this.isShown;
    },
    show: function () {
        "use strict";

        TweenMax.to("#mapLegend", 0.3, { bottom: 0});
    },
    hide: function () {
        "use strict";
        //Does not return proper height! var newPos =  $("#mapLegend").height() - $("#legendToggleBtn").height();
        var newPos =  $("#mapLegend").height() - 30; //TODO: don't hardcode height!
        TweenMax.to("#mapLegend", 0.3, { bottom: -newPos});
    },
    template: {},
    templateEl: "#crimeTotalsTemplate",
    render: function () {
        "use strict";

        if (!this.$crimeTotalsEl) {
            this.$crimeTotalsEl = $(this.crimeTotalsEl);
        }

        this.$crimeTotalsEl.html(this.template(this.model.toJSON()));
    }
});


