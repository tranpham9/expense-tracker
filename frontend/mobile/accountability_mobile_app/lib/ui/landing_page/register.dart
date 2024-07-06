import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:password_strength_checker/password_strength_checker.dart';

// Main register widget
class RegisterPage extends StatefulWidget {
  @override
  State<RegisterPage> createState() => _RegisterPage();
}

class _RegisterPage extends State<RegisterPage> {
  // Grab text that will be entered by the user
  final TextEditingController name = TextEditingController();
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController confirmPassword = TextEditingController();
  // Grab the password being entered
  final passNotifier = ValueNotifier<PasswordStrength?>(null);
  // Give user the ability to see or hide the text
  bool _obscureText = true;
  // Give the user a detailed description of what went wrong
  String? _passwordError;
  String? _emailError;

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: SingleChildScrollView(
          child: Column(
            // Have our list of containers that will take in text input
            children: <Widget>[
              // Name and email are independent of the state
              RegisterCredentials(
                  name: name, email: email, emailError: _emailError),
              // Enter Password
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  obscureText: _obscureText,
                  controller: password,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    labelText: 'Password*',
                    errorText: _passwordError,
                    suffixIcon: IconButton(
                      onPressed: () {
                        setState(() {
                          _obscureText = !_obscureText;
                        });
                      },
                      icon: Icon(_obscureText
                          ? Icons.visibility_off
                          : Icons.visibility),
                    ),
                  ),
                  // Check the strength of the password being entered
                  onChanged: (value) {
                    passNotifier.value =
                        PasswordStrength.calculate(text: value);
                  },
                ),
              ),
              // Enter Confirm Password
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  obscureText: _obscureText,
                  controller: confirmPassword,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    labelText: 'Confirm Password*',
                    errorText: _passwordError,
                  ),
                ),
              ),
              // Check the password strength
              PasswordStrengthChecker(strength: passNotifier),
              // Confirm Register
              Container(
                height: 50,
                padding: const EdgeInsets.all(10),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    fixedSize: Size(400, 50),
                  ),
                  child: const Text(
                    'Register',
                    style: TextStyle(
                      color: Colors.white,
                    ),
                  ),
                  onPressed: () {
                    // Incorrect email format
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                            .hasMatch(email.text) ||
                        email.text.isEmpty) {
                      setState(() {
                        _emailError = "The Email You've Entered Isn't Correct";
                      });
                      return;
                    } else {
                      setState(() {
                        _emailError = null;
                      });
                    }
                    // Passwords don't match
                    if (password.text != confirmPassword.text) {
                      print("password must match");
                      setState(() {
                        _passwordError = "Passwords Must Match";
                      });
                      return;
                    }
                    // TODO: This doesn't detect empty entries for some reason
                    if (password.text.isEmpty || confirmPassword.text.isEmpty) {
                      setState(() {
                        _passwordError = "Please Enter Your Password";
                      });
                      return;
                    }
                    // Password too weak
                    if (passNotifier.value == PasswordStrength.weak) {
                      print("password not strong enough");
                      setState(() {
                        _passwordError = "Password Not Secure Enough";
                      });
                      return;
                    } else {
                      setState(() {
                        _passwordError = null;
                      });
                    }
                    // TODO: Call the API to register the user

                    // Look for verification email
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Credentials that are independent of the state
class RegisterCredentials extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController name;
  final TextEditingController email;
  // Give the user a detailed description of what went wrong
  final String? emailError;

  const RegisterCredentials(
      {super.key,
      required this.name,
      required this.email,
      required this.emailError});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Enter Name
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            controller: name,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Name',
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(10),
          child: Text("A Proper Email Follows the Form 'name@email.com"),
        ),
        // Enter Email
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            controller: email,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Email*',
              errorText: emailError,
            ),
          ),
        ),
        // Strong password description
        Container(
          padding: const EdgeInsets.all(10),
          child: Text(
              "Minimum Password Requirements:\n.At least 8 letters\n.1 lower case\n.1 upper case\n.At least 1 digit\n.At least 1 special character"),
        ),
      ],
    );
  }
}
