;(function($){

    function table(opts){
        var $ele = $(opts.selector);

        if(!opts.selector||!($ele.length==1&&$ele[0].tagName==="TABLE")){
            throw new Error("expected opts has an attribute called selector , $(opts.selector).length==1 and $(opts.selector)[0].tagName===\"TABLE\"");
        }
        
        this.options = opts;
        this.$ele = $ele;

        this.init();
    };

    table.prototype.init = function() {
        this.renderHeaderRow();

        return this;
    };
    
    table.prototype.renderHeaderRow = function() {
        var $ele = this.$ele;
        var $headerRow = $('<tr></tr>');
        if(this.options.dealWithHeaderRow && $.type(this.options.dealWithHeaderRow)==="function"){
            this.options.dealWithHeaderRow($headerRow);
        }

        $ele.append("<thead></thead>").find("thead").append($headerRow);
        if(!this.options.columnDefs || $.type(this.options.columnDefs)!=="array"){
            throw new Error("expected table columnDefs attribute was given and columnDefs is an array");
        }
        $.map(this.options.columnDefs,$.proxy(function(column){
            this.renderHeaderCell($headerRow,column);
        },this));
        return this;
    };

    table.prototype.renderHeaderCell = function($headerRow,column) {
        if(column.headerCellTemplateFn && $.type(column.headerCellTemplateFn)==="function"){
            var headerCellTempate = column.headerCellTemplateFn(column);
            if(!headerCellTempate){
                throw new Error("expected headerCellTemplateFn function return html view or jquery object");
            }
            $headerRow.append($("<td></td>").append(headerCellTempate))
        }else if(column.headerCellTemplate){
           $headerRow.append($("<td></td>").append(column.headerCellTemplate));
        }else if(column.headerTitle){
            $headerRow.append($("<td></td>").append(column.headerTitle));
        }else{
            throw new Error("expected your define column have an attribute called headerTitle|headerCellTempate|headerCellTemplateFn");
        }
        return this;
    };

    table.prototype.renderBody = function() {
        return this;
    };

    $.table = table;
})(jQuery);