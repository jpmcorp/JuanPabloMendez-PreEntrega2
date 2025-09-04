import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { User } from "../models/users.model.js";
import { createHash, isValidPassword } from "../middleware/auth.middleware.js";
import cartsModel from "../models/carts.model.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email, age, role } = req.body;
    
    try {
      // Validaciones básicas
      if (!first_name || !last_name || !email || !age || !password) {
        return done(null, false, { message: 'Todos los campos son requeridos' });
      }
      
      if (age < 13 || age > 120) {
        return done(null, false, { message: 'La edad debe estar entre 13 y 120 años' });
      }
      
      if (password.length < 6) {
        return done(null, false, { message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      
      let user = await User.findOne({ email: username });
      if (user) {
        return done(null, false, { message: 'El email ya está registrado' });
      }
      
      // Crear carrito para el nuevo usuario
      const newCart = await cartsModel.create({ products: [] });
      
      const newUser = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.toLowerCase().trim(),
        age: parseInt(age),
        password: createHash(password),
        cart: newCart._id,
        role: role && ['user', 'admin'].includes(role) ? role : 'user' // Permitir especificar rol
      };
      
      let result = await User.create(newUser);
      return done(null, result);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return done(null, false, { message: messages.join(', ') });
      }
      return done(error);
    }
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub).populate('cart');
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

export default initializePassport;
