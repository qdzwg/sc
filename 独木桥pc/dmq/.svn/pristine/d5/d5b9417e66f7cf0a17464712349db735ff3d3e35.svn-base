/*
 * 作者:庄俊安
 * 表格可合并
 * 需要合并的表格加入key属性
 * 属性相同的进行合并。 如果key值为HU表示自动像下合并，如果key值为HW右合并
 * 
 */
var utiltable = new function() {
	this.key = "key"; // 合并属性
	this.rowslen = 0;
	this.colslen = 0;
	this.rows;
	this.unionByProperty = function(div,table, key) {
		this.init(table);
		this.key=key;
		for (var i = 0; i <= this.rowslen - 1; i++) {
			for (var j = 0; j <= this.colslen - 1; j++) {
				this.unionGrid(i, j);
			}
		}
		this.refreshTable();
		$("#"+div).html($("#"+div).html());
		$("#"+div).css("display","block");
	}

	//标记合并信息
	this.unionGrid = function(x, y) {
		if ($($(this.rows[x]).children()[y]).attr("del") == "1")
			return;
		var value = $($(this.rows[x]).children()[y]).attr(this.key);
		if (value == undefined)
			return;
		var h = x;
		var w = y;
		var i = 0;
		for (var i = x + 1; i <= this.rowslen - 1; i++) {
			var obj = $($(this.rows[i]).children()[y]);
			if ((value != obj.attr(this.key)) && (obj.attr(this.key)!="HU")) {
				break;
			} else {
				obj.attr("del", "1");
			}
		}
		h = i - 1;

		for (i = y + 1; i <= this.colslen - 1; i++) {
			var obj = $($(this.rows[x]).children()[i]);
			if ((value != obj.attr(this.key))&& (obj.attr(this.key)!="WU")) {
				break;
			} else {
				obj.attr("del", "1");
			}
		}
		w = i - 1;
		$($(this.rows[x]).children()[y]).attr("rows", h - x + 1);
		$($(this.rows[x]).children()[y]).attr("cols", w - y + 1);
	}
	//合并表格
	this.refreshTable = function() {
		for (var i = this.rowslen -1; i >=0 ; i--) {
			for (var j = this.colslen-1; j >= 0 ; j--) {
				var value = $($(this.rows[i]).children()[j]).attr("del");
				if (value == "1")
					$($(this.rows[i]).children()[j]).remove();
				value = $($(this.rows[i]).children()[j]).attr("rows");
				if (value != null && value > 1)
					$($(this.rows[i]).children()[j]).attr("rowspan", value);
				value = $($(this.rows[i]).children()[j]).attr("cols");
				if (value != null && value > 1)
					$($(this.rows[i]).children()[j]).attr("colSpan", value);
			}
		}
	}
	//被 始化表格
	this.init = function(table) {
		this.rows = $("#" + table + " tr");
		this.rowslen = this.rows.length;
		this.colslen = $(this.rows[0]).children().length;
	}
	//合并指定行列
	this.union = function(row, col, rowl, coll) {
		// 标记 合并删除内容
		for (var i = row; i <= rowl; i++) {
			for (var j = col; j <= coll; j++) {
				if (i == row && j == col) {
					var h = rowl - row + 1;
					var w = coll - col + 1;
					$($(this.rows[row]).children()[col]).attr("rows", h);
					$($(this.rows[row]).children()[col]).attr("cols", w);
				} else {
					$($(this.rows[i]).children()[j]).attr("del", "1");
				}
			}
		}
	}
}