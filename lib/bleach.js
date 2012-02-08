var jsdom = require('jsdom')
  , _ = require('underscore');

var testHtml = "<div><div class=\"content\">			<p>While a lot of conversation has moved to twitter and G+, hugely useful information is still published regularly to blogs. I've shared collections of frontend development feeds <a href=\"http://paulirish.com/2008/front-end-development-rss-feeds/\" rel=\"nofollow\">twice</a> <a href=\"http://paulirish.com/2010/front-end-development-feeds-to-follow/\" rel=\"nofollow\">before</a>. Now I'm back, but with two choices:</p><p>It's easy to click through and subscribe in Google Reader. There is also OPML files if you want to take 'em elsewhere.</p><p><small>Also, a short commentary on blogging vs tweeting.. while a lot of people have changed to twitter+jsfiddle only, tweets are not available via search after 30 days, so if you expect anything you share to last, blog it for real. :)</small></p>			<p class=\"under\">				<span class=\"author\"><a href=\"http://paulirish.com/author/administrator/\" title=\"Posts by Paul Irish\" rel=\"nofollow\">Paul Irish</a></span>				<span class=\"categories\"><a href=\"http://paulirish.com/category/front-end-development/\" title=\"View all posts in front-end development\" rel=\"nofollow\">front-end development</a></span>							</p>					</div>	</div>"

module.exports = function (html, callback) {
  html = html || "";
  if (!html) return;
  jsdom.env({
    html: html,
    done: function (err, window) {
      var pTags = [];
      
      function traverseEl(parent, offset) {
        var spaces = "", o = offset;
        while (o--) spaces += " ";
        
        _.each(parent, function (child) {
          
          if (child.tagName === 'P') {
            pTags.push(child);
          }
          
          if (child.children && child.children.length) {
            // recurse!!!
            traverseEl(child.children, offset+2);
          }
        });
      }
      // 
      var stuff = "";
      function traverseNodes (parent) {
        if (parent.tagName === 'P') { stuff += "\n\n" }
        else if (!parent.tagName) { stuff += parent.nodeValue; };
        
        if (parent.childNodes && parent.childNodes.length){
          _.each(parent.childNodes, traverseNodes);
        }
      }
      
      traverseEl(window.document.children, 0);
      _.each(pTags, traverseNodes);
      
      callback( null, stuff );
    }
  });
}