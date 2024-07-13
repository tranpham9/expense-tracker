import 'dart:core';
import 'package:flutter/material.dart';
import './ui/landing_page/login.dart';

void main() => runApp(const ConsistentApp());

class ConsistentApp extends StatelessWidget {
  const ConsistentApp({super.key});
  static const String _title = "Accountability";

  static ColorScheme colorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Colors.blue[700]!,
    onPrimary: Colors.white,
    secondary: Colors.orange.withOpacity(0.6),
    onSecondary: Colors.white,
    error: Colors.red[500]!,
    onError: Colors.white,
    background: Colors.grey[900]!,
    onBackground: Colors.white,
    surface: Colors.grey[800]!,
    onSurface: Colors.grey[400]!,
  );

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colorScheme,
        scaffoldBackgroundColor: colorScheme.background,
        dividerTheme: DividerThemeData(
          color: colorScheme.secondary.withOpacity(0.6),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: colorScheme.primary,
          titleTextStyle: TextStyle(color: colorScheme.onPrimary),
        ),
        textTheme: TextTheme(
          bodyLarge: TextStyle(color: colorScheme.onBackground),
          bodyMedium: TextStyle(color: colorScheme.onBackground),
          titleMedium: TextStyle(color: colorScheme.onBackground),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: colorScheme.surface,
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colorScheme.onSurface),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colorScheme.primary),
          ),
          errorBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colorScheme.error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colorScheme.error),
          ),
          labelStyle: TextStyle(color: colorScheme.onSurface),
          hintStyle: TextStyle(color: colorScheme.onSurface),
        ),
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
