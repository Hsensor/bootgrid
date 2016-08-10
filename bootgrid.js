
;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $fn.extend({
        bootgrid:bootgridWrap
    });

    function bootgridWrap(options){
        new bootgrid(this,options);
        return this;
    }
    function bootgrid(ele,options){
        this.$ele = ele;
    };

    bootgrid.prototype.renderHeader = function(){

    };
    bootgrid.prototype.renderBody = function(){

    };
    bootgrid.prototype.loadData = function(){

    }
}));