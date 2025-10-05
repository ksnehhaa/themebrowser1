// controllers/requestResetController.js
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import sendEmail from '../utils/sendEmail.js';

export const requestResetController = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (replacing any previous one)
    await Otp.findOneAndDelete({ email });
    await new Otp({ email, otp: otpCode }).save();

    // Send email
    await sendEmail(
      email,
      'Theme Browser - Password Reset OTP',
      `Your OTP to reset your password is: ${otpCode}. It will expire in 5 minutes.`
    );

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('❌ OTP Request Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};
