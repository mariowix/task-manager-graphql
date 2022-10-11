import * as yup from 'yup';

// Input validation schema for signUp
export const SignUpSchema = yup.object().shape({
  newUser: yup.object().shape({
    name: yup.string().required().min(3).max(255),
    email: yup.string().email().min(3).max(255),
    password: yup.string().required().min(3).max(255)
  })
});

// Input validation schema for login
export const LoginSchema = yup.object().shape({
  email: yup.string().email().min(3).max(255),
  password: yup.string().required().min(3).max(255)
});