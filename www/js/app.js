(function () { "use strict";
var App = function() { }
App.__name__ = true;
App.main = function() {
	var kwds = ["abstract","break","case","cast","class","continue","default","do","dynamic","else","enum","extends","extern","for","function","if","implements","import","in","inline","interface","macro","new","override","package","private","public","return","static","switch","throw","try","typedef","untyped","using","var","while"];
	var kwds1 = new EReg("\\b(" + kwds.join("|") + ")\\b","g");
	var vals = ["null","true","false","this"];
	var vals1 = new EReg("\\b(" + vals.join("|") + ")\\b","g");
	var $it0 = (function($this) {
		var $r;
		var _this = new js.JQuery("pre");
		$r = (_this.iterator)();
		return $r;
	}(this));
	while( $it0.hasNext() ) {
		var s = $it0.next();
		var html = s.html();
		var tabs = null;
		var _g = 0;
		var _g1 = html.split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			if(StringTools.trim(line) != "") {
				var r = new EReg("^\t*","");
				r.match(line);
				var t = r.matched(0);
				if(tabs == null || t.length < tabs.length) tabs = t;
			}
		}
		html = new EReg("^" + Std.string(tabs),"gm").replace(html,"");
		html = StringTools.trim(html);
		html = new EReg("('[^']*')","g").replace(html,"<span __xlass='str'>$1</span>");
		html = kwds1.replace(html,"<span class='kwd'>$1</span>");
		html = vals1.replace(html,"<span class='val'>$1</span>");
		html = html.split("__xlass").join("class");
		html = new EReg("(\"[^\"]*\")","g").replace(html,"<span class='str'>$1</span>");
		html = new EReg("(//[^\n]*)","g").replace(html,"<span class='cmt'>$1</span>");
		html = new EReg("(/\\*[^*]*\\*/)","g").replace(html,"<span class='cmt'>$1</span>");
		html = html.split("\t").join("    ");
		s.html(html);
	}
	var clickThrough = window.localStorage.getItem("click") != "false";
	var $it1 = (function($this) {
		var $r;
		var _this = new js.JQuery("pre.byLine");
		$r = (_this.iterator)();
		return $r;
	}(this));
	while( $it1.hasNext() ) {
		var pre = $it1.next();
		var div = new js.JQuery("<div>").addClass("pre");
		var _g = 0;
		var _g1 = pre.html().split("\n");
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			var i = 0;
			while(HxOverrides.cca(line,i) == 32) i++;
			line = HxOverrides.substr(line,i,null);
			while(i-- > 0) line = "&nbsp;" + line;
			new js.JQuery("<div>").addClass("line").html(line).appendTo(div);
		}
		div.insertAfter(pre);
		pre.remove();
		if(clickThrough) div.hide();
	}
	var slides = [];
	var curHash = window.location.hash;
	var cur = Std.parseInt(HxOverrides.substr(window.location.hash,1,null));
	var sub = Std.parseInt(window.location.hash.split("-")[1]);
	var update = function() {
		window.location.hash = curHash = "#" + cur + "-" + sub;
	};
	if(cur == null) cur = 0;
	if(sub == null) sub = 0;
	var $it2 = (function($this) {
		var $r;
		var _this = new js.JQuery(".slide");
		$r = (_this.iterator)();
		return $r;
	}(this));
	while( $it2.hasNext() ) {
		var s = $it2.next();
		var p = [s.wrap("<div class='slide-container'>").parent()];
		s.prepend(new js.JQuery("<div>").addClass("slide-bg"));
		var id = [slides.length];
		var parts = [s.find("li,pre,h2,p,div.pre .line,.click").filter(clickThrough?"*":"empty")];
		parts[0] = parts[0].not(".visible");
		parts[0].hide();
		if(id[0] == cur) {
			var _g = 0;
			while(_g < sub) {
				var i = _g++;
				new js.JQuery(parts[0][i]).show().parent().show();
			}
		}
		slides.push(p[0]);
		p[0].hide();
		s.click((function(parts,id,p) {
			return function(e) {
				if(sub < parts[0].length) {
					new js.JQuery(parts[0][sub]).show().parent().show();
					sub++;
				} else {
					var tid = id[0] + 1;
					var n = slides[tid];
					if(n == null) return;
					cur = tid;
					p[0].hide();
					n.show();
					sub = 0;
				}
				update();
			};
		})(parts,id,p));
	}
	var menu = new js.JQuery("<div>").addClass("menu");
	var ol = new js.JQuery("<ol>");
	var _g1 = 0;
	var _g = slides.length;
	while(_g1 < _g) {
		var i = _g1++;
		var title = slides[i].find("h1").eq(0).text();
		ol.append(new js.JQuery("<li>").append(new js.JQuery("<a>").attr("href","#" + i).text(title)));
	}
	menu.append(ol);
	menu.append(new js.JQuery("<a>").text("Present mode : " + Std.string(clickThrough)).click(function() {
		clickThrough = !clickThrough;
		window.localStorage.setItem("click","" + Std.string(clickThrough));
		window.location.reload();
	}));
	new js.JQuery("body").append(menu);
	slides[cur].show();
	var t1 = new haxe.Timer(100);
	t1.run = function() {
		if(window.location.hash != curHash) {
			window.location.reload();
			t1.stop();
		}
	};
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
var haxe = {}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
String.__name__ = true;
Array.__name__ = true;
var q = window.jQuery;
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
};
App.main();
})();
