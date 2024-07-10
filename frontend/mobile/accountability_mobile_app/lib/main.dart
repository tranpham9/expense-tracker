import 'dart:core';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import './ui/landing_page/login.dart';

// TODO: Implement errorText for all of the errors that can occur here

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
