import User from '../models/User.js';
import Otp from '../models/Otp.js';
import bcrypt from 'bcryptjs';

export const resetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Step 1: Check if OTP exists for email
    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Step 2: Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 3: Update the user's password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Delete the OTP after use
    await Otp.deleteOne({ email });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('❌ Reset Password Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};