async function checkNotFoundPage(error, request, response, next) {
  
  if(error) {
    return response.render('404')
  }

  next()
}

async function middlewareGlobal(request, response, next) {
  response.locals.errors = request.flash('errors')
  response.locals.success = request.flash('success')
  response.locals.user = request.session;

  next()
}

module.exports = {
  middlewareGlobal,
  checkNotFoundPage
};