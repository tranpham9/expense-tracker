import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:provider/provider.dart';

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
        appBar: AppBar(title: Text(_title)),
        body: LoginPage(),
      ),
    );
  }
}

// does storing what the user types in count as stateful??
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPage();
}

// Can log a user in, route them to forgot password or register
class _LoginPage extends State<LoginPage> {
  // Grab text that will be entered by the user
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            Container(
              alignment: Alignment.center,
              child: Text(
                'Login',
                style: TextStyle(fontSize: 20),
              ),
            ),
            // Enter Email
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  controller: email,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Email'),
                )),
            // Enter Password
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  controller: password,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Password'),
                )),
            // Forgot Password
            TextButton(
              onPressed: () =>
                  {AlertDialog(title: Text("I forgot my password"))},
              child: Text("Forgot Password"),
            ),
            // Confirm Login
            Container(
                height: 50,
                padding: EdgeInsets.all(10),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 95, 170, 232),
                  ),
                  child: Text('Login'),
                  onPressed: () {
                    print(email.text);
                    print(password.text);
                  },
                )),
            Row(
              children: <Widget>[
                Text("Don't Have an Account? It's Free!"),
                TextButton(
                  child: Text(
                    'Register',
                    style: TextStyle(
                        fontSize: 16,
                        decoration: TextDecoration.underline,
                        decorationThickness: 1.5),
                  ),
                  onPressed: () {
                    // Direct to Register Page
                  },
                )
              ],
            ),
          ],
        ));
  }
}
