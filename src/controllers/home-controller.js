async function HomeController(request, response) {
  
  //inject data in index template
  response.render('index');
}

module.exports = HomeController;