const Login = require('../models/login-model')

async function LoginController(request, response) {
  if(request.session.user) {
    return response.render('dashboard')
  }
  
  return response.render('login');
}

async function RegisterController(request, response) {
  const { email, password } = request.body;

  try {
    const login = new Login(email, password);

    await login.execute()
  
    if(login.errors.length > 0) {
      request.flash('errors', login.errors);
  
      request.session.save(() => {
        return response.redirect('/login')
      })
  
      return
    }
  
    request.flash('success', 'Seu usuário foi criado com sucesso!');
  
    request.session.save(() => {
      return response.redirect('/login')
    })
  } catch(err) {
    response.render(404)
  }
}

async function AuthenticationController(request, response) {
  const { email, password } = request.body;

  try {
    const login = new Login(email, password);

    await login.authentication()
  
    if(login.errors.length > 0) {
      request.flash('errors', login.errors);
  
      request.session.save(() => {
        return response.redirect('/login');
      })
  
      return
    }
  
    request.flash('success', 'Login executado com sucesso!');
    request.session.user = login.user;
  
    request.session.save(() => {
      return response.redirect('/login')
    })
  } catch(err) {
    response.render(404)
  }
}

async function LogoutController(request, response) {
  request.session.destroy();

  response.redirect('/');
} 

module.exports = {
  LoginController,
  RegisterController,
  AuthenticationController,
  LogoutController
};