import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import './ui/home_page/homepage.dart';
import './ui/landing_page/login.dart';
import './ui/landing_page/login.dart';
// Used for checking the strength of the passwords being entered
import 'package:password_strength_checker/password_strength_checker.dart';
// Needed to make API calls
import 'package:http/http.dart' as http;

// TODO: Implement errorText for all of the errors that can occur here

void main() => runApp(const MainApp());

class MainApp extends StatelessWidget {
  const MainApp({super.key});
  static const String _title = "Accountability";

  // Set some main information about our website
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text("Welcome to $_title!"),
          centerTitle: true,
        ),
        body: LoginPage(),
      ),
    );
  }
}

// TODO: REALLY needs to be broken up so it is more managable
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
  String? _error;
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
                    errorText: _emailError,
                    border: OutlineInputBorder(),
                    labelText: 'Email*',
                  ),
                ),
              ),
              // Strong password description
              Container(
                padding: const EdgeInsets.all(10),
                child: Text(
                    "Minimum Password Requirements:\n.At least 8 letters\n.1 lower case\n.1 upper case\n.At least 1 digit\n.At least 1 special character"),
              ),
              // Enter Password
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  obscureText: _obscureText,
                  controller: password,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    labelText: 'Password*',
                    errorText: _error,
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
              // Confirm Password
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  obscureText: _obscureText,
                  controller: confirmPassword,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    labelText: 'Confirm Password*',
                    errorText: _error,
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
                    // Passwords don't match
                    if (password.text != confirmPassword.text) {
                      print("password must match");
                      setState(() {
                        _error = "Passwords Must Match";
                      });
                      return;
                    }
                    // Password too weak
                    if (passNotifier.toString().contains('weak')) {
                      print("password not strong enough");
                      setState(() {
                        _error = "Password Not Secure Enough";
                      });
                      return;
                    } else {
                      setState(() {
                        _error = null;
                      });
                    }
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
                    print("email and password good");
                    // TODO: Call the API to register the user
                    // Also alert the user that they need to confirm w/ their email
                    // Then, direct them to the login to login
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

// TODO: Could possibly be an overlay??
class ForgotPassswordPage extends StatefulWidget {
  @override
  State<ForgotPassswordPage> createState() => _ForgotPassswordPage();
}

class _ForgotPassswordPage extends State<ForgotPassswordPage> {
  // Grab the email of the user to send them an email to reset their password
  final TextEditingController recoveryEmail = TextEditingController();
  String? emailError;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Reset Your Password"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter Name
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: recoveryEmail,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Your Email',
                  errorText: emailError,
                ),
              ),
            ),
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                  fixedSize: Size(400, 50),
                ),
                child: Text(
                  'Send Recovery Email',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  print(recoveryEmail.text);
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                          .hasMatch(recoveryEmail.text) ||
                      recoveryEmail.text.isEmpty) {
                    setState(() {
                      emailError = "The Email You've Entered Isn't Correct";
                    });
                  } else {
                    setState(() {
                      emailError = null;
                    });
                  }
                  // TODO: Call the API to send recorvery email to the user
                  // Perhaps a pop up saying an email has been sent.
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
