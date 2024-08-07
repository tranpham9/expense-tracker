// TODO: Find a way to make the imports take less space
// Compress some code that can be factored out
import 'dart:core';
import 'package:flutter/material.dart';
import '../../api/login_user.dart';
import '../../utility/helpers.dart';
import '../home_page/homepage.dart';
import './register.dart';
import './forgot_password.dart';

// Main login widget
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPage();
}

// Main login widget state
class _LoginPage extends State<LoginPage> {
  // Grab text that will be entered by the user
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();
  String? emailError;
  String? passwordError;

  @override
  void initState() {
    super.initState();
    // Add listeners to properly validate the proper regex
    email.addListener(() {
      setState(() {
        emailError = validateText("email", email.text);
      });
    });
    password.addListener(() {
      setState(() {
        passwordError = validateText("password", password.text);
      });
    });
  }

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            Container(
              alignment: Alignment.center,
              child: const Text(
                'Login',
                style: TextStyle(fontSize: 20),
              ),
            ),
            // Grab the email and password of an existing user
            LoginCredentials(
              email: email,
              password: password,
              emailError: emailError,
              passwordError: passwordError,
            ),
            // Confirm the login
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: SizedBox(
                height: 50,
                width: 400,
                child: ElevatedButton(
                  // You can press the button if the input requirements are meet
                  onPressed: (disableButton([emailError, passwordError],
                          [email.text, password.text]))
                      ? null
                      : () async {
                          // Call the login endpoint
                          await LoginUser.login(email.text, hash(password.text))
                              .then((response) async {
                            // Let the user know the email/password was wrong
                            if (response == null) {
                              setState(() {
                                emailError =
                                    "Email/Password Combination Incorrect";
                                passwordError =
                                    "Email/Password Combination Incorrect";
                              });
                              return;
                            }
                            // Login was successful, route the user to their home page
                            email.text = '';
                            password.text = '';
                            // Reset Decorations back to normal
                            setState(() {
                              emailError = null;
                              passwordError = null;
                            });

                            // Route to the home page
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => HomePage()),
                            );
                          });
                        },
                  child: const Text('Login',
                      style: TextStyle(color: Colors.white)),
                ),
              ),
            ),
            // Forgot Password
            TextButton(
              child: const Text(
                'Forgot Password?',
                style: TextStyle(
                  fontSize: 16,
                  decoration: TextDecoration.underline,
                  decorationThickness: 1.5,
                ),
              ),
              onPressed: () => showDialog(
                context: context,
                builder: (BuildContext context) {
                  return ForgotPasswordDialog();
                },
              ),
            ),
            // Give a new user ability to register
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Text("Don't Have an Account? It's Free!"),
                TextButton(
                  child: const Text(
                    'Register',
                    style: TextStyle(
                      fontSize: 16,
                      decoration: TextDecoration.underline,
                      decorationThickness: 1.5,
                    ),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => RegisterPage()),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Grab the email and password as part of the login process
class LoginCredentials extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController email;
  final TextEditingController password;
  final String? emailError;
  final String? passwordError;

  // loginState will determine how to draw the TextFields for email and password
  const LoginCredentials(
      {super.key,
      required this.email,
      required this.password,
      required this.emailError,
      required this.passwordError});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // Enter Email
      Container(
        padding: const EdgeInsets.all(10),
        child: TextField(
            controller: email,
            decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email*',
                enabledBorder: OutlineInputBorder(borderSide: BorderSide()),
                hintText: 'Enter Your Email',
                errorText: emailError)),
      ),
      // Enter Password
      Container(
        padding: const EdgeInsets.all(10),
        child: TextField(
          obscureText: true,
          controller: password,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Password*',
            enabledBorder: OutlineInputBorder(borderSide: BorderSide()),
            hintText: 'Enter Your Password',
            errorText: passwordError,
          ),
        ),
      ),
    ]);
  }
}
