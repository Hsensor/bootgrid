;(function($){

    function getParams(context){
        var opts = context.options;
        return opts.getParams(opts);
    }

    function table(opts){
        var $ele = $(opts.selector);

        if(!opts.selector||!($ele.length==1&&$ele[0].tagName.toUpperCase()==="TABLE")){
            throw new Error("expected opts has an attribute called selector , $(opts.selector).length==1 and $(opts.selector)[0].tagName===\"TABLE\"");
        }
        
        this.options = opts;
        this.$ele = $ele;

        this.init();
    };

    table.prototype.init = function() {
        this.renderHeaderRow();
        this.renderBody();
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
            $headerRow.append($('<th class="sort-header"></th>').append(headerCellTempate))
        }else if(column.headerCellTemplate){
           $headerRow.append($('<th class="sort-header"></th>').append(column.headerCellTemplate));
        }else if(column.headerTitle){
            $headerRow.append($('<th class="sort-header"></th>').append(column.headerTitle));
        }else{
            throw new Error("expected your define column have an attribute called headerTitle|headerCellTempate|headerCellTemplateFn");
        }
        return this;
    };


    table.prototype.renderBody = function() {
        var self = this;
        var opts = self.options;
        var $ele = self.$ele;
        var $tbody = $("<tbody></tbody>");
        var $tr = $("<tr></tr>");
        var dataRowsKey = opts.dataRowsKey||"";

        $ele.append($tbody);
        self.loading();

        if(opts.dataRowsKey){
            if(opts.data){
                self.loading();
                if(dataRowsKey){
                    if(opts.data[dataRowsKey]&&(opts.data[dataRowsKey] instanceof Array)){
                        if(opts.data[dataRowsKey].length){

                        }else{
                            //no rows
                            self.noRows();
                        }
                    }else{
                        throw new Error("expected data["+dataRowsKey+"] should be an Array,but not");
                    }
                }else{
                    if(opts.data.rows&&opts.data.rows instanceof Array){
                        if(opts.data.rows.length){

                        }else{
                            //no data
                            self.noRows();
                        }
                    }else{
                        throw new Error("expected data.rows should be an Array,but not");
                    }
                }
            }else if(opts.url){
                opts.method = opts.method?opts.method:"get";
                
                opts.dealWithRes($.ajax({
                    url:opts.url,
                    type:opts.method,
                    dataType:"json",
                    data:getParams(self)||{}
                })).then(function(res){
                    console.log(res);
                },function(e){
                    throw new Error(e);
                }).fail(function(e){
                    console.log(e);
                })  
                
            }
        }
        return self;
    };


    table.prototype.loading = function(){
        var $ele = this.$ele;
        var opts = this.options;
        var $tbody = $ele.find("tbody");
        if(!opts.loading){
            var $tr = $("<tr><td></td></tr>");
            var $td = $tr.find("td");

            $td.attr("colspan",opts.columnDefs.length);
            $tbody.append($tr);
            
            if(opts.loadingTpls){
                $td.append(opts.loadingTpls);
            }else{
                $td.append('<div class="cc">...... loading ......</div>');
            }
            opts.loading = true;    
        }else{
            $tbody.html("");
            opts.loading = false;
        }
        return this;
    }

    table.prototype.noRows = function(){
        var $ele = this.$ele;
        var opts = this.options;
        var $tbody = $ele.find("tbody");
        var $tr = $("<tr><td></td></tr>");
        var $td = $tr.find("td");

        $td.attr("colspan",opts.columnDefs.length);
        $tbody.append($tr);
        
        if(opts.noRowsTpls){
            $td.append(opts.noRowsTpls);
        }else{
            $td.append('<div class="cc">...... noData ......</div>');
        }
    };

    
    $.table = table;

})(jQuery);