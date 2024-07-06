import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:password_strength_checker/password_strength_checker.dart';

class RegisterCredentials extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController name;
  final TextEditingController email;
  final TextEditingController password;
  final TextEditingController confirmPassword;
  final bool obscureText;
  final String? passwordError;
  final String? emailError;

  const RegisterCredentials({
    super.key,
    required this.name,
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.obscureText,
    required this.passwordError,
    required this.emailError,
  });

  @override
  Widget build(BuildContext context) {
    bool _obscureText = obscureText;
    // Grab the password being entered
    final passNotifier = ValueNotifier<PasswordStrength?>(null);

    return Container(
        child: Column(
      children: [
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
              errorText: emailError,
              border: OutlineInputBorder(),
              labelText: 'Email*',
            ),
          ),
        ),
        // Strong password description
        Container(
          padding: const EdgeInsets.all(10),
          child: Text(
              "A Strong Password Contains:\n.At least 8 letters\n.1 lower case\n.1 upper case\n.At least 1 digit\n.At least 1 special character"),
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
              errorText: passwordError,
              suffixIcon: IconButton(
                onPressed: () {
                  print("Changing obscuretext");
                  _obscureText = !_obscureText;
                },
                icon: Icon(
                    _obscureText ? Icons.visibility : Icons.visibility_off),
              ),
            ),
            // Check the strength of the password being entered
            onChanged: (value) {
              passNotifier.value = PasswordStrength.calculate(text: value);
            },
          ),
        ),
        // Confirm Password
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            obscureText: obscureText,
            controller: confirmPassword,
            decoration: InputDecoration(
              border: const OutlineInputBorder(),
              labelText: 'Confirm Password*',
              errorText: passwordError,
            ),
          ),
        ),
        // Check the password strength
        PasswordStrengthChecker(strength: passNotifier),
      ],
    ));
  }
}
