import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../../main.dart';
import '../home_page/homepage.dart';

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
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                  fixedSize: Size(400, 50),
                ),
                child:
                    const Text('Login', style: TextStyle(color: Colors.white)),
                onPressed: () {
                  // Ensure a proper email is entered
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                          .hasMatch(email.text) ||
                      email.text == '') {
                    setState(() {
                      emailError = "You must enter a valid email";
                    });
                    return;
                  } else {
                    emailError = null;
                  }
                  if (password.text.isEmpty) {
                    setState(() {
                      passwordError = "Make Sure to Enter a Password";
                    });
                    return;
                  } else {
                    passwordError = null;
                  }
                  // TODO: Call the API to log the user in

                  // If login failed, add some text to let the user know what went wrong

                  // Reset widgets back to  normal and route to next page
                  email.text = '';
                  password.text = '';
                  // Reset Decorations back to normal
                  setState(() {
                    emailError = null;
                    passwordError = null;
                  });
                  // If login was successful, route the user to their home page
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => HomePage()),
                  );
                },
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
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => ForgotPassswordPage()),
                );
              },
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
              errorText: passwordError),
        ),
      ),
    ]);
  }
}
