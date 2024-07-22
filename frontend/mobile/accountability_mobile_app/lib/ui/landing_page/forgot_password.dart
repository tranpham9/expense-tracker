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

  @override
  void initState() {
    super.initState();

    recoveryEmail.addListener(() {
      setState(() {
        recoveryEmailError = validateText("email", recoveryEmail.text);
      });
    });
  }

  @override
  void dispose() {
    recoveryEmail.dispose();
    super.dispose();
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
              : () async {
                  // Call the API
                  await ForgotPassword.forgotPassword(recoveryEmail.text)
                      .then((response) async {
                    if (response != 200) {
                      // Display an error
                      setState(() {
                        recoveryEmailError =
                            "There Was an Error, Please Try Again";
                      });
                      return;
                    }
                    // Success! Show success overlay
                    showOverlay(
                        "Success! Recovery Code Sent to ${recoveryEmail.text}",
                        context);
                  });
                },
          child: const Text('Send Recovery Email'),
        ),
      ],
    );
  }
}
