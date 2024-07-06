import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

// Grab the email and password as part of the login process
class LoginCredentials extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController email;
  final TextEditingController password;
  // Define how the TextFields will be decorated
  final InputDecoration emailDecoration;
  final InputDecoration passwordDecoration;

  // loginState will determine how to draw the TextFields for email and password
  const LoginCredentials(
      {super.key,
      required this.emailDecoration,
      required this.passwordDecoration,
      required this.email,
      required this.password});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // Enter Email
      Container(
        padding: const EdgeInsets.all(10),
        child: TextField(
          controller: email,
          decoration: emailDecoration,
        ),
      ),
      // Enter Password
      Container(
        padding: const EdgeInsets.all(10),
        child: TextField(
          obscureText: true,
          controller: password,
          decoration: passwordDecoration,
        ),
      ),
    ]);
  }
}
