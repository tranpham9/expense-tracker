import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
// Provide access to the data models from the other folder
import './models/models.dart';
import 'ui/homepage.dart';
// Needed to make API calls
import 'package:http/http.dart' as http;

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

// User Related Widgets
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPage();
}

class _LoginPage extends State<LoginPage> {
  // Grab text that will be entered by the user
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: ListView(
        // Have our list of containers that will take in text input
        children: <Widget>[
          Container(
            alignment: Alignment.center,
            child: const Text(
              'Login',
              style: TextStyle(fontSize: 20),
            ),
          ),
          // Enter Email
          Container(
            padding: const EdgeInsets.all(10),
            child: TextField(
              controller: email,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email*',
              ),
            ),
          ),
          // Enter Password
          Container(
            padding: const EdgeInsets.all(10),
            child: TextField(
              obscureText: true,
              controller: password,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Password*',
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
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ForgotPassswordPage()),
              );
            },
          ),
          // Confirm Login
          Container(
            height: 50,
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: const Text('Login', style: TextStyle(color: Colors.white)),
              onPressed: () {
                print(email.text);
                print(password.text);
                // TODO: Call the API to log the user in

                // If login was successful, route the user to their home page
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => HomePage()),
                );
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
    );
  }
}

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
        child: ListView(
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
            // Enter Email
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: email,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Email*',
                ),
              ),
            ),
            // Enter Password
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: password,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Password*',
                ),
              ),
            ),
            // Confirm Password
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: confirmPassword,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Confirm Password*',
                ),
              ),
            ),
            // Confirm Register
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Register',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Call the API to register the user
                  // Also alert the user that they need to confirm w/ their email
                  // Then, direct them to the login to login
                },
              ),
            ),
          ],
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Reset Your Password"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter Name
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: recoveryEmail,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Your Email',
                ),
              ),
            ),
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Send Recovery Email',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  print(recoveryEmail.text);
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
