const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
});

const LoginModel = new mongoose.model('Login', LoginSchema);

class Login {
  constructor(email, password) {
    this.body = {
      email,
      password
    };

    this.errors = [];
    this.user = null;
  }

  async execute() {
    this.validate();

    await this.sameUserEmail()

    if(this.errors.length > 0){
      return;
    }
    
    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body)
  }

  async authentication() {
    this.validate();

    if(this.errors.length > 0){
      return;
    }

    const user = await LoginModel.findOne({ email: this.body.email })

    if(!user) {
      this.errors.push('Usuário não encontrado!.')
      return
    }

    const samePasswordUserAuthentication = bcrypt.compareSync(this.body.password, user.password)

    if(!samePasswordUserAuthentication) {
      this.errors.push('Senha ou email incorretos!.')
      return
    }

    this.user = user
  }

  async sameUserEmail() {
    const user = await LoginModel.findOne({ email: this.body.email })

    if(user) {
      this.errors.push('Usuários já existe.')
    } 

    return
  }

  validate() {
    this.cleanUp();

    if(!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido');
    }

    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }

      this.body = {
        email: this.body.email,
        password: this.body.password
      };
    }
  }
}

module.exports = Login;
