import 'dart:core';
import 'package:accountability_mobile_app/api/forgot_password.dart';
import 'package:accountability_mobile_app/utility/helpers.dart';
import 'package:flutter/material.dart';

class ForgotPasswordDialog extends StatefulWidget {
  @override
  State<ForgotPasswordDialog> createState() => _ForgotPasswordDialogState();
}

class _ForgotPasswordDialogState extends State<ForgotPasswordDialog> {
  final TextEditingController recoveryEmail = TextEditingController();
  String? recoveryEmailError;
  OverlayEntry? _overlayEntry;

  @override
  void initState() {
    super.initState();

    recoveryEmail.addListener(validateRecoveryEmail);
  }

  @override
  void dispose() {
    recoveryEmail.dispose();
    super.dispose();
  }

  // Validate the recovery email entered
  void validateRecoveryEmail() {
    setState(() {
      recoveryEmailError = validateText("email", recoveryEmail.text);
    });
  }

  // Show a given pop up overlay
  void _showOverlay(String message) {
    _overlayEntry = createOverlayEntry(message);
    Overlay.of(context)!.insert(_overlayEntry!);
    Future.delayed(const Duration(seconds: 2), () {
      _overlayEntry?.remove();
    });
  }

  // Call the API endpoint to log the user in
  Future<int?> forgotPassword(String email) async {
    return await ForgotPassword.forgotPassword(email);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Reset Your Password"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextField(
            controller: recoveryEmail,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Your Email',
              errorText: recoveryEmailError,
            ),
          ),
        ],
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed: disableButton([recoveryEmailError], [recoveryEmail.text])
              ? null
              : () {
                  // Call the API
                  forgotPassword(recoveryEmail.text).then((response) async {
                    if (response != 200) {
                      // Display an error
                      setState(() {
                        recoveryEmailError =
                            "There Was an Error, Please Try Again";
                      });
                      return;
                    }
                    // Success! Show success overlay
                    _showOverlay(
                        "Success! Recovery Code Sent to ${recoveryEmail.text}");
                  });
                },
          child: const Text('Send Recovery Email'),
        ),
      ],
    );
  }
}
