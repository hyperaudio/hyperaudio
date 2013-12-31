function applyTooltips(){$(document).foundation({tooltips:{selector:".has-tip",additional_inheritable_classes:[],tooltip_class:".tooltip",touch_close_text:"tap to close",disable_for_touch:!1,tip_template:function(a,b){return'<span data-selector="'+a+'" class="'+Foundation.libs.tooltips.settings.tooltipClass.substring(1)+'">'+b+'<span class="nub"></span></span>'}}})}Backbone.emulateJSON=!1,window.haDash={API:"10.0.54.74"==document.location.host?"http://10.0.54.74":"http://api.hyperaud.io/v1",Models:{},Collections:{},Views:{},Routers:{},init:function(){"use strict";this.router=new this.Routers.Router,Backbone.history.start({pushState:!0}),$("a.media").click(function(a){a.preventDefault(),haDash.router.navigate("media/",{trigger:!0})}),$("a.mixes").click(function(a){a.preventDefault(),haDash.router.navigate("mixes/",{trigger:!0})}),$("a.logout").click(function(a){a.preventDefault(),haDash.router.navigate("signout/",{trigger:!0})}),$("a.register").click(function(a){a.preventDefault(),haDash.router.navigate("secret-signup/",{trigger:!0})}),$("a.login").click(function(a){a.preventDefault(),haDash.router.navigate("secret-signin/",{trigger:!0})})},user:null,whoami:function(a){$.ajax({url:this.API+"/whoami",xhrFields:{withCredentials:!0},timeout:5e3,success:function(b){b.user?(window.haDash.user=b.user,$("body").removeClass("anonymous").addClass("user")):(window.haDash.user=null,$("body").removeClass("user").addClass("anonymous")),a&&a()}})}},$(document).ready(function(){"use strict";$.ajaxPrefilter(function(a){0==a.url.indexOf(haDash.API)&&(a.xhrFields={withCredentials:!0})}),TraceKit.report.subscribe(function(a){$.ajax({url:haDash.API+"/error/dashboard",contentType:"application/json; charset=utf-8",dataType:"json",xhrFields:{withCredentials:!0},method:"post",data:JSON.stringify({user:haDash.user,errorReport:a})})}),haDash.whoami(function(){haDash.init()}),$(document).foundation()}),this.JST=this.JST||{},this.JST["app/scripts/templates/addMedia.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<h2>Add YouTube Video</h2>\n\n<p class="lead">Please paste a link to a video below (YouTube preferably)</p>\n\n<input id="yt" type="text" class="large" placeholder="video link">\n\n<button class="button primary">Add Video</button>\n';return __p},this.JST["app/scripts/templates/media.ejs"]=function(obj){function print(){__p+=__j.call(arguments,"")}obj||(obj={});var __t,__p="",__e=_.escape,__j=Array.prototype.join;with(obj){__p+='<td class="span1"><img src="'+(null==(__t=source.youtube.thumbnail)?"":__t)+'" class=""></td>\n<td class="span2 label">'+__e(label)+'</td>\n<td class="span4">';var shortDesc=desc;desc.length>140&&(shortDesc=desc.substring(0,140)+"…");for(var lines=shortDesc.split("\n"),i=0;i<lines.length;i++){var line=lines[i];print(_.escape(line)),i<lines.length-1&&print("<br />")}__p+='</td>\n<td class="span2"><span class="timeago" title="'+__e(modified)+'">'+__e(modified)+"</span></td>\n<td>"+__e(owner)+"</td>\n"}return __p},this.JST["app/scripts/templates/mediaDetail.ejs"]=function(obj){function print(){__p+=__j.call(arguments,"")}obj||(obj={});var __t,__p="",__e=_.escape,__j=Array.prototype.join;with(obj){__p+='<h2 class="label" data-field="label">'+__e(label)+'</h2>\n\n<p class="lead desc" data-field="desc">';for(var lines=desc.split("\n"),i=0;i<lines.length;i++){var line=lines[i];print(_.escape(line)),i<lines.length-1&&print("<br />")}__p+='</p>\n\n<a class="button primary" target="_new" href="http://hyperaud.io/maker/?m='+(null==(__t=_id)?"":__t)+'">Create Transcript</a>\n<a class="button primary" target="_new" href="http://hyperaud.io/converter/?m='+(null==(__t=_id)?"":__t)+'">Convert Transcript</a>\n\n<p>&nbsp;</p>\n\n<div id="transcripts">§</div>\n\n'}return __p},this.JST["app/scripts/templates/mediaList.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="user">\n\n	<button id="addMedia" class="button primary">Add Media</button>\n\n	<p>&nbsp;</p>\n\n	<table>\n	  <caption>Your Media</caption>\n	  <thead>\n	    <tr>\n	      <th class="span1"></th>\n	      <th class="span2">Title</th>\n	      <th class="span4">Description</th>\n	      <th class="span2">Date</th>\n	      <th>Author</th>\n	    </tr>\n	  </thead>\n	  <tbody class="your"></tbody>\n	</table>\n\n	<p>&nbsp;</p>\n	<p>&nbsp;</p>\n</div>\n\n\n<table>\n  <caption>Recent Media</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span4">Description</th>\n      <th class="span2">Date</th>\n      <th>Author</th>\n    </tr>\n  </thead>\n  <tbody class="other"></tbody>\n</table>\n\n\n\n\n';return __p},this.JST["app/scripts/templates/mix.ejs"]=function(obj){function print(){__p+=__j.call(arguments,"")}obj||(obj={});var __p="",__e=_.escape,__j=Array.prototype.join;with(obj){__p+='<td class="span1"><img src="http://placekitten.com/g/100/100" class=""></td>\n<td class="span2 label"><a target="_new" href="http://hyperaud.io/pad/?mix='+__e(_id)+'">'+__e(label)+'</a></td>\n<td class="span4">';var shortDesc=desc;desc.length>140&&(shortDesc=desc.substring(0,140)+"…");for(var lines=shortDesc.split("\n"),i=0;i<lines.length;i++){var line=lines[i];print(_.escape(line)),i<lines.length-1&&print("<br />")}__p+='</td>\n<td class="span2"><span class="timeago" title="'+__e(modified)+'">'+__e(modified)+"</span></td>\n<td>"+__e(owner)+"</td>\n\n"}return __p},this.JST["app/scripts/templates/mixList.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="user">\n\n	<a class="button primary" href="http://hyperaud.io/pad/" target="_new">Create Mix</a>\n\n	<p>&nbsp;</p>\n\n	<table>\n	  <caption>Your Mixes</caption>\n	  <thead>\n	    <tr>\n	      <th class="span1"></th>\n	      <th class="span2">Title</th>\n	      <th class="span4">Description</th>\n	      <th class="span2">Date</th>\n	      <th>Author</th>\n	    </tr>\n	  </thead>\n	  <tbody class="your"></tbody>\n	</table>\n\n	<p>&nbsp;</p>\n	<p>&nbsp;</p>\n</div>\n\n<table>\n  <caption>Recent Mixes</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span4">Description</th>\n      <th class="span2">Date</th>\n      <th>Author</th>\n    </tr>\n  </thead>\n  <tbody class="other"></tbody>\n</table>\n';return __p},this.JST["app/scripts/templates/signIn.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign In\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 medium-offset-2 small-12 columns large-offset-2">\n    <form id="loginForm" class="form">\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label>\n        <input type="text" name="username" id="username" class="form-input text-input block large centered" placeholder="Username">\n				<!-- <p style="display:none" class="form-alert">Wrong username.</p> -->\n      </div>\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label>\n        <input type="password" name="password" id="password" class="form-input text-input block large centered" placeholder="Password">\n        <p id="loginFormError" style="display:none" class="form-alert">\n          Wrong username or password.\n        </p>\n      </div>\n      <div class="form-component actions">\n        <input id="signin" type="submit" class="button large primary" value="Sign In">\n      </div>\n    </form>\n  </div>\n</div>\n';return __p},this.JST["app/scripts/templates/signUp.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign up\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 small-12 columns large-offset-2 medium-offset-2">\n    <form id="registerForm" class="form">\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label> <input id="username" type="text" name="username" class="form-input text-input block large centered" placeholder="Username">\n        <p id="registerFormError" style="display:none" class="form-alert">\n          Wrong username.\n        </p>\n      </div>\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label> <input id="password" type="password" name="password" class="form-input text-input block large centered" placeholder="Password">\n      </div>\n      <div class="form-component actions">\n        <input id="signup" type="submit" class="button large primary" value="Sign up">\n      </div>\n    </form>\n  </div>\n</div>\n</div>\n';return __p},this.JST["app/scripts/templates/transcript.ejs"]=function(obj){obj||(obj={});{var __t,__p="",__e=_.escape;Array.prototype.join}with(obj)__p+='<td class="span1">'+__e(type)+'</td>\n<td class="span2 label"><span class="tLabel" data-field="label">'+__e(label)+'</span></td>\n<td class="span3"><span class="tDesc" data-field="desc">'+__e(desc)+'</span></td>\n<td class="span1"><span class="timeago" title="'+__e(modified)+'">'+__e(modified)+"</span></td>\n<td>"+__e(owner)+"</td>\n<td>\n	","text"==type?__p+='\n		<a class="button small" target="_new" href="http://hyperaud.io/maker/?t='+(null==(__t=_id)?"":__t)+'">Edit</a>\n		<button class="button align small primary">Align</button>\n	':"html"==type?__p+='\n		<a class="button small" target="_new" href="http://hyperaud.io/cleaner/?t='+(null==(__t=_id)?"":__t)+'">Clean</a>\n	':"srt"==type&&(__p+='\n		<a class="button small primary" target="_new" href="http://hyperaud.io/converter/?t='+(null==(__t=_id)?"":__t)+'">Convert</a>\n	'),__p+="\n</td>\n";return __p},this.JST["app/scripts/templates/transcriptList.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<table>\n  <caption>Available Transcripts</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span3">Description</th>\n      <th class="span1">Date</th>\n      <th>Author</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n';return __p},haDash.Models=haDash.Models||{},function(){"use strict";haDash.Models.MixModel=Backbone.Model.extend({idAttribute:"_id",defaults:function(){return{label:"Empty",desc:"",type:"html",created:(new Date).toISOString(),modified:(new Date).toISOString(),owner:null}}})}(),haDash.Collections=haDash.Collections||{},function(){"use strict";haDash.Collections.MixCollection=Backbone.Collection.extend({model:haDash.Models.MixModel,url:function(){return haDash.API+"/mixes"},comparator:function(a){return-new Date(a.get("modified")).getTime()}})}(),haDash.Routers=haDash.Routers||{},function(){"use strict";var a=$("#main");haDash.Routers.Router=Backbone.Router.extend({routes:{"":"dashboard","mixes/":"mixes","media/":"media","media/:id":"mediaDetail","secret-signin/":"signin","signout/":"signout","secret-signup/":"signup","add-media/":"addMedia"},addMedia:function(){console.log("ADD MEDIA"),a.empty().append(new haDash.Views.AddMediaView({model:new haDash.Models.MediaModel}).render().el)},dashboard:function(){console.log("Dashboard N/A"),document.location="/"},mixes:function(){haDash.mixListView=new haDash.Views.MixListView({collection:new haDash.Collections.MixCollection})},media:function(){console.log("MEDIA"),haDash.mediaCollection||(haDash.mediaCollection=new haDash.Collections.MediaCollection),haDash.mediaListView=new haDash.Views.MediaListView({collection:haDash.mediaCollection}),a.empty().append(haDash.mediaListView.render().el),haDash.mediaCollection.fetch()},mediaDetail:function(b){var c=new haDash.Models.MediaModel({_id:b});c.fetch({url:haDash.API+"/media/"+b}),a.empty().append(new haDash.Views.MediaDetailView({model:c}).render().el)},signin:function(){a.empty().append(new haDash.Views.SignInView({}).el)},signout:function(){$.ajax({url:haDash.API+"/logout",contentType:"application/json; charset=utf-8",dataType:"json",xhrFields:{withCredentials:!0},method:"post",data:JSON.stringify({_csfr:"TODO"}),success:function(){haDash.whoami(function(){haDash.router.navigate("mixes/",{trigger:!0})})}})},signup:function(){a.empty().append(new haDash.Views.SignUpView({}).el)}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.MixView=Backbone.View.extend({tagName:"tr",template:JST["app/scripts/templates/mix.ejs"],initialize:function(){this.listenTo(this.model,"change",this.render)},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.$el.find("span.timeago").timeago(),this.$el.data("view",this),this.$el.data("model",this.model),this}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.MixListView=Backbone.View.extend({el:"#main",template:JST["app/scripts/templates/mixList.ejs"],initialize:function(){this.render(),this.listenTo(this.collection,"add",this.addItem),this.listenTo(this.collection,"reset",this.addAllItems),this.collection.fetch()},render:function(){return this.$el.html(this.template()),this.$el.data("view",this),this.$el.data("collection",this.collection),this},addItem:function(a){var b=new haDash.Views.MixView({model:a});haDash.user==a.get("owner")?this.$("tbody.your").append(b.render().el):this.$("tbody.other").append(b.render().el)},addAllItems:function(){this.collection.each(this.addItem,this)}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.SignInView=Backbone.View.extend({id:"signInView",template:JST["app/scripts/templates/signIn.ejs"],initialize:function(){this.render()},render:function(){return this.$el.html(this.template()),this},events:{'click #loginForm input[type="submit"]':"signin"},signin:function(a){a.preventDefault(),$("#loginFormError").hide(),$.ajax({url:haDash.API+"/login",contentType:"application/json; charset=utf-8",dataType:"json",xhrFields:{withCredentials:!0},method:"post",data:JSON.stringify({username:$("#username").val(),password:$("#password").val()})}).done(function(a){console.log(a),a.user?(window.haDash.user=a.user,$("body").removeClass("anonymous").addClass("user"),haDash.router.navigate("mixes/",{trigger:!0})):(window.haDash.user=null,$("body").removeClass("user").addClass("anonymous"))}).fail(function(){$("#loginFormError").show()})}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.SignUpView=Backbone.View.extend({id:"signUpView",template:JST["app/scripts/templates/signUp.ejs"],initialize:function(){this.render()},render:function(){return this.$el.html(this.template()),this},events:{'click #registerForm input[type="submit"]':"signup"},signup:function(a){a.preventDefault(),$("#registerFormError").hide(),$.ajax({url:haDash.API+"/register",contentType:"application/json; charset=utf-8",dataType:"json",xhrFields:{withCredentials:!0},method:"post",data:JSON.stringify({username:$("#username").val(),password:$("#password").val()})}).done(function(a){console.log(a),haDash.router.navigate("secret-signin/",{trigger:!0}),alert("Marvelous, now please log in")}).fail(function(){$("#registerFormError").show()})}})}(),haDash.Models=haDash.Models||{},function(){"use strict";haDash.Models.MediaModel=Backbone.Model.extend({idAttribute:"_id",defaults:function(){return{label:"Empty",desc:"",type:"video",owner:null,created:(new Date).toISOString(),modified:(new Date).toISOString(),transcripts:[]}}})}(),haDash.Collections=haDash.Collections||{},function(){"use strict";haDash.Collections.MediaCollection=Backbone.Collection.extend({model:haDash.Models.MediaModel,url:function(){return haDash.API+"/media"},comparator:function(a){return-new Date(a.get("modified")).getTime()}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.MediaView=Backbone.View.extend({tagName:"tr",template:JST["app/scripts/templates/media.ejs"],initialize:function(){this.listenTo(this.model,"change",this.render)},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.$el.find("span.timeago").timeago(),this.$el.data("view",this),this.$el.data("model",this.model),this},events:{"click .label":"preview"},preview:function(){haDash.router.navigate("media/"+this.model.id,{trigger:!0})}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.MediaListView=Backbone.View.extend({id:"mediaListView",template:JST["app/scripts/templates/mediaList.ejs"],initialize:function(){this.listenTo(this.collection,"add",this.addItem),this.listenTo(this.collection,"reset",this.render),this.listenTo(this.collection,"sort",this.render)},render:function(){return this.$el.html(this.template()),this.addAllItems(),this.$el.data("view",this),this.$el.data("collection",this.collection),this},addItem:function(a){var b=new haDash.Views.MediaView({model:a});haDash.user==a.get("owner")?this.$el.find("tbody.your").append(b.render().el):this.$el.find("tbody.other").append(b.render().el)},addAllItems:function(){this.collection.each(this.addItem,this)},events:{"click #addMedia":"addMedia"},addMedia:function(){haDash.router.navigate("add-media/",{trigger:!0}),this.remove()}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.MediaDetailView=Backbone.View.extend({id:"mediaDetail",template:JST["app/scripts/templates/mediaDetail.ejs"],initialize:function(){this.listenTo(this.model,"change",this.render)},render:function(){this.$el.html(this.template(this.model.toJSON()));for(var a=this.model.get("transcripts"),b=new haDash.Collections.TranscriptCollection,c=0;c<a.length;c++){var d=a[c];console.log(d);var e=new haDash.Models.TranscriptModel({_id:d});e.fetch({url:haDash.API+"/transcripts/"+d}),b.add(e)}return console.log(b),this.$el.find("#transcripts").empty().append(new haDash.Views.TranscriptListView({collection:b}).render().el),this.$el.data("view",this),this.$el.data("model",this.model),this},events:{"click h2.label, p.desc":"edit","blur h2.label, p.desc":"save"},notEditable:function(){return this.model.get("owner")!=haDash.user},edit:function(a){this.notEditable()||$(a.target).attr("contenteditable",!0)},save:function(a){this.notEditable()||($(a.target).attr("contenteditable",!1),this.model.set($(a.target).data("field"),$(a.target).text().trim()),this.model.save(null,{url:haDash.API+"/media/"+this.model.id}))}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.AddMediaView=Backbone.View.extend({id:"addMediaView",template:JST["app/scripts/templates/addMedia.ejs"],initialize:function(){},render:function(){return this.$el.html(this.template(this.model.toJSON())),this},events:{"click button":"addVideo"},YouTubeGetID:function(a){var b="";return a=a.replace(/(>|<)/gi,"").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/),void 0!==a[2]?(b=a[2].split(/[^0-9a-z_]/i),b=b[0]):b=null,b},addVideo:function(){var a=this.$el.find("input").val(),b=this.YouTubeGetID(a),c=this.model,d=this;b?$.ajax({url:"http://gdata.youtube.com/feeds/api/videos/"+b+"?v=2&alt=json",success:function(a){function e(a,b){for(var c in b){var d=c.replace(/\$/g,"_");"object"==typeof b[c]&&null!==b[c]?(a[d]=a[d]||{},e(a[d],b[c])):a[d]=b[c]}return a}console.log(a);var f={};e(f,a),c.set("owner",haDash.user),c.set("label",a.entry.title.$t),c.set("desc",a.entry.media$group.media$description.$t),c.set("meta",{youtube:f}),c.set("source",{youtube:{type:"video/youtube",url:"http://www.youtube.com/watch?v="+b,thumbnail:a.entry.media$group.media$thumbnail[0].url}}),console.log(c),haDash.mediaListView.collection.add(c),c.save(null,{success:function(){haDash.router.navigate("media/",{trigger:!0}),d.remove()}})}}):(c.set("owner",haDash.user),c.set("label","n/a"),c.set("desc",a),c.set("meta",{}),c.set("source",{unknown:{url:a}}),console.log(c),haDash.mediaListView.collection.add(c),c.save(null,{success:function(){haDash.router.navigate("media/",{trigger:!0}),d.remove()}}))}})}(),haDash.Models=haDash.Models||{},function(){"use strict";haDash.Models.TranscriptModel=Backbone.Model.extend({idAttribute:"_id",defaults:function(){return{label:"Empty",desc:"",type:"text",owner:null,created:(new Date).toISOString(),modified:(new Date).toISOString(),transcripts:[]}}})}(),haDash.Collections=haDash.Collections||{},function(){"use strict";haDash.Collections.TranscriptCollection=Backbone.Collection.extend({model:haDash.Models.TranscriptModel,comparator:function(a){return-new Date(a.get("modified")).getTime()}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.TranscriptView=Backbone.View.extend({tagName:"tr",template:JST["app/scripts/templates/transcript.ejs"],initialize:function(){this.listenTo(this.model,"change",this.render)},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.$el.find("span.timeago").timeago(),this.$el.data("view",this),this.$el.data("model",this.model),this},events:{"click .tLabel, tDesc":"edit","blur .tLabel, .tDesc":"save","click .align":"align"},notEditable:function(){return this.model.get("owner")!=haDash.user},edit:function(a){this.notEditable()||$(a.target).attr("contenteditable",!0)},save:function(a){this.notEditable()||($(a.target).attr("contenteditable",!1),this.model.set($(a.target).data("field"),$(a.target).text().trim()),this.model.save(null,{url:haDash.API+"/transcript/"+this.model.id}))},align:function(){alert("1")}})}(),haDash.Views=haDash.Views||{},function(){"use strict";haDash.Views.TranscriptListView=Backbone.View.extend({id:"transcriptListView",template:JST["app/scripts/templates/transcriptList.ejs"],initialize:function(){console.log("transcriptListView init"),this.listenTo(this.collection,"add",this.addItem),this.listenTo(this.collection,"reset",this.render),this.listenTo(this.collection,"sort",this.render)},render:function(){return console.log("transcriptListView render"),this.$el.html(this.template()),this.addAllItems(),this.$el.data("view",this),this.$el.data("collection",this.collection),this},addItem:function(a){var b=new haDash.Views.TranscriptView({model:a});this.$el.find("tbody").append(b.render().el)},addAllItems:function(){this.collection.each(this.addItem,this)}})}();