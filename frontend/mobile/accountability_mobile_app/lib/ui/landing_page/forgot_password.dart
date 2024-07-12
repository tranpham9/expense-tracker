import 'dart:core';
import 'package:accountability_mobile_app/utility/helpers.dart';
import 'package:flutter/material.dart';

class ForgotPasswordDialog extends StatefulWidget {
  @override
  State<ForgotPasswordDialog> createState() => _ForgotPasswordDialogState();
}

class _ForgotPasswordDialogState extends State<ForgotPasswordDialog> {
  final TextEditingController recoveryEmail = TextEditingController();
  String? emailError;
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
      emailError = validateText("email", recoveryEmail.text);
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
              errorText: emailError,
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
          child: const Text('Send Recovery Email'),
          onPressed: () {
            // TODO: Call the API to send recovery code to the email
            print("Sending Recovery Email");
          },
        ),
      ],
    );
  }
}
