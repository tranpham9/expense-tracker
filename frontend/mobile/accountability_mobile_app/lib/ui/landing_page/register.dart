import 'dart:core';
import 'package:flutter/material.dart';
import '../../api/register_user.dart';
import '../../utility/helpers.dart';

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
  // Give the user a detailed description of what went wrong
  String? passwordError;
  String? emailError;
  String? nameError;
  // Show a pop up overlay after a successful registration
  OverlayEntry? _overlayEntry;

  @override
  void initState() {
    super.initState();

    name.addListener(() {
      setState(() {
        nameError = validateText("name", name.text);
      });
    });
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
    name.dispose();
    email.dispose();
    password.dispose();
    super.dispose();
  }

  // // Call the API endpoint
  // Future<int?> registerUser(String name, String email, String password) async {
  //   return await RegisterUser.register(name, email, password);
  // }

  // // Show a given pop up overlay
  // void _showOverlay(String message) {
  //   _overlayEntry = createOverlayEntry(message);
  //   Overlay.of(context)!.insert(_overlayEntry!);
  //   Future.delayed(const Duration(seconds: 5), () {
  //     _overlayEntry?.remove();
  //   });
  // }

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
                name: name,
                email: email,
                password: password,
                nameError: nameError,
                emailError: emailError,
                passwordError: passwordError,
              ),
              // Confirm Register
              Container(
                height: 50,
                padding: const EdgeInsets.all(10),
                child: SizedBox(
                  height: 50,
                  width: 400,
                  child: ElevatedButton(
                    // You can press the button if the input requirements are meet
                    onPressed: disableButton(
                            [nameError, emailError, passwordError],
                            [name.text, email.text, password.text])
                        ? null
                        : () async {
                            //Call the register API
                            await RegisterUser.register(
                                    name.text, email.text, hash(password.text))
                                .then((res) {
                              // Failed to register
                              if (res == 400) {
                                // Let the user know what went wrong
                                setState(() {
                                  passwordError =
                                      "Error Registering Your Account";
                                  emailError = "Error Registering Your Account";
                                });
                                return;
                              } else if (res == 401) {
                                // Let the user know what went wrong
                                setState(() {
                                  emailError =
                                      "That Email is Already Being Used";
                                });
                                return;
                              } else {
                                // Let the user know that the verification email was sent
                                showOverlay(
                                    "Registration Was Successful! Check Your Email to Verify Your Account.",
                                    context);
                              }
                            });
                          },
                    child: const Text(
                      'Register',
                      style: TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
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
  final TextEditingController password;
  // Give the user a detailed description of what went wrong
  final String? emailError;
  final String? nameError;
  final String? passwordError;

  const RegisterCredentials(
      {super.key,
      required this.name,
      required this.email,
      required this.password,
      required this.nameError,
      required this.emailError,
      required this.passwordError});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Enter Name
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            controller: name,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Name*',
              errorText: nameError,
            ),
          ),
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
        // Enter Password
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            obscureText: true,
            controller: password,
            decoration: InputDecoration(
              border: const OutlineInputBorder(),
              labelText: 'Password*',
              errorText: passwordError,
            ),
          ),
        ),
      ],
    );
  }
}
