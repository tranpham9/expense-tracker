// Contains all helper functions that would be need to complete common tasks throughout the application
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Input which type you want to validate, ie. password, email, name
// along with the text you want to validate.
String? validateText(String validateType, String validateText) {
  // Validate an email
  switch (validateType) {
    case "email":
      if (validateText.isEmpty) {
        return null;
      } else if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
          .hasMatch(validateText)) {
        return "Must be a valid email";
      } else {
        return null;
      }
    case "password":
      if (validateText.isEmpty) {
        return null;
      } else if (validateText.length < 8) {
        return "Must be at least 8 characters long";
      } else if (!validateText.contains(RegExp(r'[A-Z]+'))) {
        return "Must have an uppercase letter";
      } else if (!validateText.contains(RegExp(r'[a-z]+'))) {
        return "Must have a lowercase letter";
      } else if (!validateText.contains(RegExp(r'[0-9]+'))) {
        return "Must have a digit";
      } else if (!validateText.contains(RegExp(r'[[!@#\$%\^&\*.{}]+'))) {
        return "Must have a special character";
      } else {
        return null;
      }
    case "name":
      if (validateText.isEmpty) {
        return null;
      } else if (validateText.length < 4) {
        return "Must be at least 4 characters long";
      } else if (!validateText.contains(RegExp(r'^[a-zA-Z\s]+$'))) {
        return "Can only have letters and spaces";
      }
    default:
      return null;
  }
}

// Create an overlay with the text of 'message'
OverlayEntry createOverlayEntry(String message) {
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
