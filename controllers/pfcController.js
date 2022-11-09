module.exports.sendHTMLfile =
(req,res) =>  {
   let options = {
                  root: 'public',
                  headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                  }
                };
   res.sendFile('pfc.html', options);
}
