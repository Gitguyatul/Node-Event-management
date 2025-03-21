const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { signupSchema, loginSchema } = require("../validators/authValidators");


// ✅ Signup controller
exports.signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login controller
exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Forgot Password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">here</a> to reset your password</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reset Password controller
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
