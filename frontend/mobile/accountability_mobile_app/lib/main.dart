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
        appBar: AppBar(
          title: Text(_title),
          centerTitle: true,
        ),
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
                      border: OutlineInputBorder(), labelText: 'Email*'),
                )),
            // Enter Password
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  obscureText: true,
                  controller: password,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Password*'),
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
                    // TODO: Call the API to log the user in

                    // If login was successful, route the user to their home page
                    Navigator.push(context,
                        MaterialPageRoute(builder: (context) => HomePage()));
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
                  // TODO: This won't
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => RegisterPage()));
                  },
                ),
              ],
            ),
          ],
        ));
  }
}

class RegisterPage extends StatefulWidget {
  @override
  State<RegisterPage> createState() => _RegisterPage();
}

class _RegisterPage extends State<RegisterPage> {
  // Grab text that will be entered by the user
  TextEditingController name = TextEditingController();
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();
  TextEditingController confirmPassword = TextEditingController();

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
                'Register',
                style: TextStyle(fontSize: 20),
              ),
            ),
            // Enter Name
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  controller: name,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Name'),
                )),
            // Enter Email
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  controller: email,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Email*'),
                )),
            // Enter Password
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  obscureText: true,
                  controller: password,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: 'Password*'),
                )),
            // Confirm Password
            Container(
                padding: EdgeInsets.all(10),
                child: TextField(
                  obscureText: true,
                  controller: confirmPassword,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Confirm Password*'),
                )),
            // Confirm Register
            Container(
                height: 50,
                padding: EdgeInsets.all(10),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 95, 170, 232),
                  ),
                  child: Text('Register'),
                  onPressed: () {
                    print(name.text);
                    print(email.text);
                    print(password.text);
                    print(confirmPassword.text);
                  },
                )),
          ],
        ));
  }
}

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePage();
}

class _HomePage extends State<HomePage> {
  // Determine the page that we want to route to
  var selectedIndex = 0;
  // We need a list of the different page we can go to from the home screen
  final List<Widget> _tabs = [TripsPage(), AddTripsPage(), ProfilePage()];

  @override
  Widget build(BuildContext context) {
    return PopScope(
      // Ensure that once the user logs in, the have to use log out button
      canPop: false,
      child: Scaffold(
        // Determine which page to display
        body: _tabs[selectedIndex],
        // Place the search bar at the top of the screen
        bottomNavigationBar: BottomNavigationBar(
            // Keep track of the selected tab
            currentIndex: selectedIndex,
            onTap: (int index) {
              setState(() {
                selectedIndex = index;
              });
            },
            items: [
              BottomNavigationBarItem(icon: Icon(Icons.map), label: "Trips"),
              BottomNavigationBarItem(icon: Icon(Icons.add), label: "Add"),
              BottomNavigationBarItem(
                  icon: Icon(Icons.person), label: "Profile"),
            ]),
      ),
    );
  }
}

class TripsPage extends StatelessWidget {
  // Grab the search field when we want to search
  TextEditingController _searchQuery = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Username's Trips",
        ),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Padding(
          padding: EdgeInsets.all(10),
          child: Container(
            padding: EdgeInsets.all(10),
            child: TextField(
                controller: _searchQuery,
                decoration: InputDecoration(
                    hintText: 'Search...',
                    // Clear the search field
                    suffixIcon: IconButton(
                      icon: Icon(Icons.clear),
                      onPressed: () => {_searchQuery.clear()},
                    ),
                    prefixIcon: IconButton(
                      icon: Icon(Icons.search),
                      onPressed: () {
                        print(_searchQuery.text);
                      },
                    ),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20.0)))),
          )),
    );
  }
}

class AddTripsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: Text("Add a Trip"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
    );
  }
}

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: Text("Username's Profile"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
    );
  }
}
