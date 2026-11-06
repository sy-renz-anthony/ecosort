import axios from 'axios';

export const sendPasswordResetOTPEmail = async(receiverEmail, receiverName, otp) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'Ecosort App' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: 'Ecosort v_0.1 App Password Reset verification OTP',
        htmlContent: `Your Ecosort v_0.1 User App Password Reset OTP code is ${otp}. Please verify your account using this code to reset your password.`
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}

export const sendNewPasswordEmail = async(receiverEmail, receiverName, password) =>{
    try {
    const response = await axios.post(
      process.env.BREVO_EMAIL_API_ENDPOINT,
      {
        sender: { email: process.env.SENDER_EMAIL_ID , name: 'Ecosort App' },
        to: [{ email: receiverEmail, name: receiverName }],
        subject: "Welcome to Ecosort v_0.1 User App",
        htmlContent: `Welcome to Ecosort v_0.1 User App. You have successfully registered your account with email: `+receiverEmail+". \n\nA random password is generated for you: "+password+"\n\n Please update this when you login.\n\n Thank you."
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email: ', error.response?.data || error.message);
  }

}