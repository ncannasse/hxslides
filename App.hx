import js.JQuery.JQueryHelper.*;
import js.JQuery;

typedef Slide = {
	slide: JQuery,
	parts: JQuery,
	sub: Int
}

class App {

	public static function main() {
		var kwds = ["abstract", "break", "case", "cast", "class", "continue", "default", "do", "dynamic", "else", "enum", "extends", "extern", "for", "function", "if", "implements", "import", "in", "inline", "interface", "macro", "new", "override", "package", "private", "public", "return", "static", "switch", "throw", "try", "typedef", "untyped", "using", "var", "while" ];
		var kwds = new EReg("\\b(" + kwds.join("|") + ")\\b", "g");

		var vals = ["null", "true", "false", "this"];
		var vals = new EReg("\\b(" + vals.join("|") + ")\\b", "g");

		for( s in J("pre") ) {
			var html = s.html();

			// detect and remove identation
			var tabs = null;
			for( line in html.split("\n") )
				if( StringTools.trim(line) != "" ) {
					var r = ~/^\t*/;
					r.match(line);
					var t = r.matched(0);
					if( tabs == null || t.length < tabs.length ) tabs = t;
				}
			html = new EReg("^" + tabs, "gm").replace(html, "");
			html = StringTools.trim(html);

			html = ~/('[^']*')/g.replace(html, "<span __xlass='str'>$1</span>");
			html = ~/((#if [a-zA-Z0-9_]+)|(#end)|(#elseif [a-zA-Z0-9_]+))/g.replace(html, "<span __xlass='cond'>$1</span>");
			html = ~/(#else)/g.replace(html, "<span __xlass='cond'>$1</span>");
			html = kwds.replace(html, "<span class='kwd'>$1</span>");
			html = vals.replace(html, "<span class='val'>$1</span>");

			html = html.split('__xlass').join("class");

			html = ~/("[^"]*")/g.replace(html, "<span class='str'>$1</span>");
			html = ~/(\/\/[^\n]*)/g.replace(html, "<span class='cmt'>$1</span>");
			html = ~/(\/\*[^*]*\*\/)/g.replace(html, "<span class='cmt'>$1</span>");
			html = html.split("\t").join("    ");
			s.html(html);
		}

		var clickThrough = js.Browser.window.localStorage.getItem("click") != "false";

		for( pre in J("pre.byLine") ) {
			var div = J("<div>").addClass("pre");
			for( line in pre.html().split("\n") ) {
				var i = 0;
				while( line.charCodeAt(i) == " ".code )
					i++;
				line = line.substr(i);
				while( i-- > 0 )
					line = "&nbsp;" + line;
				J("<div>").addClass("line").html(line).appendTo(div);
			}
			div.insertAfter(pre);
			pre.remove();
			if( clickThrough ) div.hide();
		}

		var slides:Array<Slide> = [];
		var curHash = js.Browser.location.hash;
		var cur = Std.parseInt(js.Browser.location.hash.substr(1));
		var sub = Std.parseInt(js.Browser.location.hash.split("-")[1]);
		function update() {
			js.Browser.location.hash = curHash = "#" + cur + "-" + sub;
		}
		if( cur == null ) cur = 0;
		if( sub == null ) sub = 0;
		function changeSlide(tid) {
			var p = slides[cur];
			var n = slides[tid];
			if( n == null ) return;
			cur = tid;
			if (p != null) {
				p.slide.hide();
			}
			n.slide.show();
			p.sub = sub;
			sub = n.sub;
			update();
		}
		function changeSub() {
			var parts = slides[cur].parts;
			var p = J(parts[sub]);
			p.show().parent().show();
			if( p.hasClass("hidePrev") ) J(parts[sub - 1]).hide();
			if( p.hasClass("highlight") ) for( p2 in parts ) p2.toggleClass("light", p[0] == p2[0]).toggleClass("unlight", p[0] != p2[0]);
			sub++;
			update();
		}
		for( s in J(".slide") ) {
			var p = s.wrap("<div class='slide-container'>").parent();
			s.prepend(J("<div>").addClass("slide-bg"));
			var id = slides.length;
			var parts = s.find("li,pre,h2,p,div.pre .line,.click").not("li > pre:first-child").filter(clickThrough ? "*" : "empty");
			parts = parts.not(".visible");
			parts.hide();
			if( id == cur ) {
				for( i in 0...sub )
					J(parts[i]).show().parent().show();
			}
			slides.push({ slide: p, parts: parts, sub: 0 });
			p.hide();
			function forward() {
				if( sub < parts.length ) {
					changeSub();
				} else {
					changeSlide(id + 1);
				}
			}
			s.click(function(e) {
				forward();
			});
		}

		var menu = J("<div>").addClass("menu");
		var ol = J("<ol>");
		for( i in 0...slides.length ) {
			var title = slides[i].slide.find("h1").eq(0).text();
			ol.append(J("<li>").append(J("<a>").attr("href", "#" + i).text(title)));
		}
		menu.append(ol);
		menu.append(J("<a>").text("Present mode : "+clickThrough).click(function() {
			clickThrough = !clickThrough;
			js.Browser.window.localStorage.setItem("click", "" + clickThrough);
			js.Browser.location.reload();
		}));
		menu.append("<br>");

		var body = J("body");

		function onResize() {
			J(".slide").css( { "-webkit-transform" : "scale(1)", "-webkit-transform-origin" : "center top" } );
			var j = J(cast js.Browser.document);
			var s = Math.min(j.width() / 800, j.height() / 600);
			J("body.fullScreen .slide").css( { "-webkit-transform" : "scale("+s+")" } );
		}

		menu.append(J("<a>").text("Full Screen").click(function() {
			body.toggleClass("fullScreen");
			onResize();
		}));
		body.append(menu).keydown(function(e) {
			switch (e.keyCode) {
				case 27:
					body.removeClass("fullScreen");
					onResize();
				case 37:
					changeSlide(cur - 1);
				case 39:
					changeSlide(cur + 1);
				case 40:
					changeSub();
			}
		});
		js.Browser.window.onresize = function(_) onResize();

		for( h in J("h1") ) {
			var count = 0;
			if( h.text().indexOf(" ") < 0 ) continue;
			h.html(~/(@|[^ ]+)/g.map(h.text(), function(r) return "<div class='word w"+(count++)+"'>"+r.matched(0)+"</div>"));
		}

		slides[cur].slide.show();
		var t = new haxe.Timer(100);
		t.run = function() {
			if( js.Browser.location.hash != curHash ) {
				js.Browser.location.reload();
				t.stop();
			}
		};
	}

}