(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(t,a,e){t.exports=e(25)},18:function(t,a,e){},20:function(t,a,e){},25:function(t,a,e){"use strict";e.r(a);var s=e(1),r=e.n(s),c=e(9),n=e.n(c),i=(e(18),e(12)),o=e(3),u=e(4),l=e(6),m=e(5),p=e(7),d=(e(20),e(10)),f=function(t){function a(){var t,e;Object(o.a)(this,a);for(var s=arguments.length,r=new Array(s),c=0;c<s;c++)r[c]=arguments[c];return(e=Object(l.a)(this,(t=Object(m.a)(a)).call.apply(t,[this].concat(r)))).state={status:e.props.status},e.flipCard=function(t){if(e.props.flipCard(t),"front"===e.state.status){e.setState({status:"back"})}else{e.setState({status:"front"})}},e}return Object(p.a)(a,t),Object(u.a)(a,[{key:"getClass",value:function(){return"front"===this.props.status?"card":"back"===this.props.status?"card is-flipped":"matched"===this.props.status?"card matched":void 0}},{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"scene scene--card"},r.a.createElement("div",{onClick:function(){return t.flipCard(t.props.id)},className:this.getClass()},r.a.createElement("div",{className:"card__face card__face--front"},r.a.createElement(d.a,{icon:this.props.icon})),r.a.createElement("div",{className:"card__face card__face--back"})))}}]),a}(s.Component),h=e(2),k=e(11);h.b.add(k.a);var b=function(t){function a(t){var e;return Object(o.a)(this,a),(e=Object(l.a)(this,Object(m.a)(a).call(this,t))).flipCard=function(t){var a=Object(i.a)(e.state.memoryBlocks);if("front"===e.state.memoryBlocks[t-1].status?a[t-1].status="back":a[t-1].status="front",e.state.pair.length<2){var s=e.state.pair;if(s.push(t),e.setState({pair:s}),2===e.state.pair.length&&a[e.state.pair[0]-1]!=a[e.state.pair[1]-1]){var r=e.state.memoryBlocks;e.state.memoryBlocks[e.state.pair[0]-1].icon===e.state.memoryBlocks[e.state.pair[1]-1].icon&&setTimeout(function(){r[e.state.pair[0]-1].status="matched",r[e.state.pair[1]-1].status="matched";var t=e.state.pair;t.length=0,e.setState({pair:t}),r.every(function(t){return"matched"===t.status})&&setTimeout(function(){alert("Game Over")},100)},1e3)}}else{var c=e.state.memoryBlocks;c.map(function(t){"matched"!=t.status&&(t.status="back")}),c[t-1].status="front";var n=e.state.pair;n.shift(),n.shift(),n.push(t),e.setState({memoryBlocks:c,pair:n})}e.setState({memoryBlocks:a})},e.state={pair:[],memoryBlocks:[{id:1,status:"back",icon:"bicycle"},{id:2,status:"back",icon:"battery-quarter"},{id:3,status:"back",icon:"anchor"},{id:4,status:"back",icon:"anchor"},{id:5,status:"back",icon:"atom"},{id:6,status:"back",icon:"battery-quarter"},{id:7,status:"back",icon:"bicycle"},{id:8,status:"back",icon:"atom"}]},e}return Object(p.a)(a,t),Object(u.a)(a,[{key:"render",value:function(){var t=this,a=this.state,e=a.memoryBlocks,s=a.pair;return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"canvas"},e.map(function(a){return r.a.createElement(f,{memoryBlocks:e,id:a.id,status:a.status,key:a.id,pair:s,flipCard:t.flipCard,icon:a.icon})})))}}]),a}(s.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n.a.render(r.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[13,2,1]]]);
//# sourceMappingURL=main.ab795e6f.chunk.js.map