import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());


const JWT_SECRET = "200599";


mongoose.connect("mongodb://127.0.0.1:27017/techsupport", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  
});
const User = mongoose.model("User", UserSchema);
//------------------Se agrega un nuevo modelo ------------>
// Agregar después del model User
const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", ReviewSchema);

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "El usuario ya existe" 
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ success: true, message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email y contraseña son requeridos" 
      });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Credenciales inválidas" 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      success: true, 
      message: "Login exitoso",
      token: token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
});



app.get("/api/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token requerido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
});


const cors = require('cors');
app.use(cors());

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));