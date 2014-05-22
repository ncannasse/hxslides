(function () { "use strict";
var App = function() { };
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
		var _this1 = new js.JQuery("pre.byLine");
		$r = (_this1.iterator)();
		return $r;
	}(this));
	while( $it1.hasNext() ) {
		var pre = $it1.next();
		var div = new js.JQuery("<div>").addClass("pre");
		var _g2 = 0;
		var _g11 = pre.html().split("\n");
		while(_g2 < _g11.length) {
			var line1 = _g11[_g2];
			++_g2;
			var i = 0;
			while(HxOverrides.cca(line1,i) == 32) i++;
			line1 = HxOverrides.substr(line1,i,null);
			while(i-- > 0) line1 = "&nbsp;" + line1;
			new js.JQuery("<div>").addClass("line").html(line1).appendTo(div);
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
		var _this2 = new js.JQuery(".slide");
		$r = (_this2.iterator)();
		return $r;
	}(this));
	while( $it2.hasNext() ) {
		var s1 = $it2.next();
		var p = [s1.wrap("<div class='slide-container'>").parent()];
		s1.prepend(new js.JQuery("<div>").addClass("slide-bg"));
		var id = [slides.length];
		var parts = [s1.find("li,pre,h2,p,div.pre .line,.click").filter(clickThrough?"*":"empty")];
		parts[0] = parts[0].not(".visible");
		parts[0].hide();
		if(id[0] == cur) {
			var _g3 = 0;
			while(_g3 < sub) {
				var i1 = _g3++;
				new js.JQuery(parts[0][i1]).show().parent().show();
			}
		}
		slides.push(p[0]);
		p[0].hide();
		s1.click((function(parts,id,p) {
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
	var _g12 = 0;
	var _g4 = slides.length;
	while(_g12 < _g4) {
		var i2 = _g12++;
		var title = slides[i2].find("h1").eq(0).text();
		ol.append(new js.JQuery("<li>").append(new js.JQuery("<a>").attr("href","#" + i2).text(title)));
	}
	menu.append(ol);
	menu.append(new js.JQuery("<a>").text("Present mode : " + (clickThrough == null?"null":"" + clickThrough)).click(function() {
		clickThrough = !clickThrough;
		window.localStorage.setItem("click","" + (clickThrough == null?"null":"" + clickThrough));
		window.location.reload();
	}));
	menu.append("<br>");
	var body = new js.JQuery("body");
	var onResize = function() {
		new js.JQuery(".slide").css({ '-webkit-transform' : "scale(1)", '-webkit-transform-origin' : "center top"});
		var j;
		var html1 = window.document;
		j = new js.JQuery(html1);
		var s2 = Math.min(j.width() / 800,j.height() / 600);
		new js.JQuery("body.fullScreen .slide").css({ '-webkit-transform' : "scale(" + s2 + ")"});
	};
	menu.append(new js.JQuery("<a>").text("Full Screen").click(function() {
		body.toggleClass("fullScreen");
		onResize();
	}));
	body.append(menu).keydown(function(e1) {
		if(e1.keyCode == 27) {
			body.removeClass("fullScreen");
			onResize();
		}
	});
	window.onresize = function(_) {
		onResize();
	};
	var $it3 = (function($this) {
		var $r;
		var _this3 = new js.JQuery("h1");
		$r = (_this3.iterator)();
		return $r;
	}(this));
	while( $it3.hasNext() ) {
		var h = $it3.next();
		var count = [0];
		if(h.text().indexOf(" ") < 0) continue;
		h.html(new EReg("(@|[^ ]+)","g").map(h.text(),(function(count) {
			return function(r1) {
				return "<div class='word w" + count[0]++ + "'>" + r1.matched(0) + "</div>";
			};
		})(count)));
	}
	slides[cur].show();
	var t1 = new haxe.Timer(100);
	t1.run = function() {
		if(window.location.hash != curHash) {
			window.location.reload();
			t1.stop();
		}
	};
};
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
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var haxe = {};
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
};
var js = {};
js.Boot = function() { };
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
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
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
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
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
