import React from 'react';
import LoginPage from './LoginPage';
import AppLayout from './AppLayout';

// const Login = () => <SignIn variant="standard" wrapperVariant="bgColor" />;
const Login = () => <AppLayout><LoginPage wrapperVariant="bgColor" /></AppLayout>;

export default Login;
