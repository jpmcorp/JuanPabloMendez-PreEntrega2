import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  last_name: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  age: {
    type: Number,
    required: [true, 'La edad es requerida'],
    min: [13, 'Debes tener al menos 13 años'],
    max: [120, 'Edad inválida']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'admin'],
      message: 'El rol debe ser user o admin'
    }
  }
}, {
  timestamps: true
});

// Índices para mejor rendimiento (email ya tiene unique: true)
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);
