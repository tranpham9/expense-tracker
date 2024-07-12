import 'dart:core';
import 'package:flutter/material.dart';
import './ui/landing_page/login.dart';

// TODO: Implement some Color and Theme objects here so changing style will be easy
// perhaps also set standard theme for TextField, Buttons, etc.
// Make the app look as similar to the web app as possible

void main() => runApp(const consistent());

class consistent extends StatelessWidget {
  const consistent({super.key});
  static const String _title = "Accountability";
  // Set a consistent theme for the whole app
  static ColorScheme colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: Colors.blue[700]!,
      onPrimary: Colors.white,
      secondary: Colors.orange[500]!,
      onSecondary: Colors.white,
      error: Colors.red[500]!,
      onError: Colors.red[500]!,
      surface: Colors.white,
      onSurface: Colors.white,
      background: Colors.grey[400]!);

  // Set some main information about our website
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colorScheme,
      ),
      themeMode: ThemeMode.dark,
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
