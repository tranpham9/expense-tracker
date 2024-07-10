import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ForgotPasswordDialog extends StatefulWidget {
  @override
  State<ForgotPasswordDialog> createState() => _ForgotPasswordDialogState();
}

class _ForgotPasswordDialogState extends State<ForgotPasswordDialog> {
  final TextEditingController recoveryEmail = TextEditingController();
  String? emailError;
  OverlayEntry? _overlayEntry;

  OverlayEntry _createOverlayEntry(String message) {
    return OverlayEntry(
      builder: (context) => Positioned(
        top: MediaQuery.of(context).size.height * 0.4,
        left: MediaQuery.of(context).size.width * 0.1,
        width: MediaQuery.of(context).size.width * 0.8,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.8),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              message,
              style: const TextStyle(color: Colors.white, fontSize: 16),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    );
  }

  void _showOverlay(String message) {
    _overlayEntry = _createOverlayEntry(message);
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
              // TODO: Call the API to send recovery email to the user
              // Show overlay
              _showOverlay("A recovery email has been sent!");
              Navigator.of(context).pop();
            }
          },
        ),
      ],
    );
  }
}
