
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'White Board on Node.js' });
};