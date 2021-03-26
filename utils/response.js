let response = Object.create({
  status: null, 
  send: {}, 
})

response.status = function(code){
  this.status = code; 
  return this;
}

response.send = function(obj){
  this.send = obj;
  return this;
}

module.exports = response;
