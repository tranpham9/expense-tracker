// Use "flutter run" in the shell when you need to debug
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
          title: Text("Welcome to $_title!"),
          centerTitle: true,
        ),
        body: LoginPage(),
      ),
    );
  }
}

// Does storing what the user types in count as stateful?
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPage();
}

// Can log a user in, route them to forgot password or register
class _LoginPage extends State<LoginPage> {
  // Grab text that will be entered by the user
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: ListView(
        // Have our list of containers that will take in text input
        children: <Widget>[
          Container(
            alignment: Alignment.center,
            child: const Text(
              'Login',
              style: TextStyle(fontSize: 20),
            ),
          ),
          // Enter Email
          Container(
            padding: const EdgeInsets.all(10),
            child: TextField(
              controller: email,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email*',
              ),
            ),
          ),
          // Enter Password
          Container(
            padding: const EdgeInsets.all(10),
            child: TextField(
              obscureText: true,
              controller: password,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Password*',
              ),
            ),
          ),
          // Forgot Password
          TextButton(
            child: const Text(
              'Forgot Password?',
              style: TextStyle(
                fontSize: 16,
                decoration: TextDecoration.underline,
                decorationThickness: 1.5,
              ),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ForgotPassswordPage()),
              );
            },
          ),
          // Confirm Login
          Container(
            height: 50,
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 95, 170, 232),
              ),
              child: const Text('Login'),
              onPressed: () {
                print(email.text);
                print(password.text);
                // TODO: Call the API to log the user in

                // If login was successful, route the user to their home page
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => HomePage()),
                );
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text("Don't Have an Account? It's Free!"),
              TextButton(
                child: const Text(
                  'Register',
                  style: TextStyle(
                    fontSize: 16,
                    decoration: TextDecoration.underline,
                    decorationThickness: 1.5,
                  ),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => RegisterPage()),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class RegisterPage extends StatefulWidget {
  @override
  State<RegisterPage> createState() => _RegisterPage();
}

class _RegisterPage extends State<RegisterPage> {
  // Grab text that will be entered by the user
  final TextEditingController name = TextEditingController();
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController confirmPassword = TextEditingController();

  // Set the main layout of the login page
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter Name
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: name,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Name',
                ),
              ),
            ),
            // Enter Email
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: email,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Email*',
                ),
              ),
            ),
            // Enter Password
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: password,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Password*',
                ),
              ),
            ),
            // Confirm Password
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: confirmPassword,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Confirm Password*',
                ),
              ),
            ),
            // Confirm Register
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 95, 170, 232),
                ),
                child: const Text('Register'),
                onPressed: () {
                  print(name.text);
                  print(email.text);
                  print(password.text);
                  print(confirmPassword.text);
                  // TODO: Call the API to register the user
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ForgotPassswordPage extends StatefulWidget {
  @override
  State<ForgotPassswordPage> createState() => _ForgotPassswordPage();
}

class _ForgotPassswordPage extends State<ForgotPassswordPage> {
  // Grab the email of the user to send them an email to reset their password
  final TextEditingController recoveryEmail = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Reset Your Password"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter Name
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: recoveryEmail,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Your Email',
                ),
              ),
            ),
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 95, 170, 232),
                ),
                child: const Text('Send Recovery Email'),
                onPressed: () {
                  print(recoveryEmail.text);
                  // TODO: Call the API to send recorvery email to the user
                  // Perhaps a pop up saying an email has been sent.
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePage();
}

class _HomePage extends State<HomePage> {
  // Determine the page that we want to route to
  var selectedIndex = 0;
  // We need a list of the different pages we can go to from the home screen
  final List<Widget> _tabs = [TripsPage(), AddTripsPage(), ProfilePage()];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      // Once the user logs in, they can no longer use the default back button on their system
      onWillPop: () async => false,
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
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.map), label: "Trips"),
            BottomNavigationBarItem(icon: Icon(Icons.add), label: "Add"),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
          ],
        ),
      ),
    );
  }
}

class TripsPage extends StatelessWidget {
  // Grab the search field when we want to search
  final TextEditingController _searchQuery = TextEditingController();

  //FOR TESTING ONLY
  List<Trip> trips = [
    Trip(
        id: "t1id1",
        name: "Hawaii '24",
        notes: "A fun trip to Hawaii",
        membersIds: ["m1", "m2"],
        leaderId: "t1"),
    Trip(
        id: "t2id1",
        name: "Orlando '24",
        notes: "A fun trip to Orlando",
        membersIds: ["m3", "m4"],
        leaderId: "t3"),
    Trip(
        id: "t3id1",
        name: "Indianapolis '24",
        notes: "A fun trip to Indy",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "New York '24",
        notes: "A fun trip to NYC",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Los Angeles '24",
        notes: "A fun trip to LA",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle '24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle '24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
    Trip(
        id: "t3id1",
        name: "Seattle 24",
        notes: "A fun trip to Seattle",
        membersIds: ["m6", "m4"],
        leaderId: "t4"),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Username's Trips",
        ),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        // Store the search bar and ListView of the trips
        child: Column(
          children: [
            TextField(
              controller: _searchQuery,
              decoration: InputDecoration(
                hintText: 'Search...',
                // Clear the search field
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () => _searchQuery.clear(),
                ),
                prefixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    print(_searchQuery.text);
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
              ),
            ),
            Expanded(
              // Useful for building lists of unknown length
              child: ListView.builder(
                itemCount: trips.length,
                // Callback to determine how to format each trip in the list
                itemBuilder: (context, index) {
                  // Grab the trip from the list
                  Trip trip = trips[index];
                  return ListTile(
                    title: Text(trip.name),
                    subtitle: Text(trip.notes),
                    trailing: Text('Leader: ${trip.leaderId}'),
                    onTap: () {
                      // Handle onTap event if needed
                      print('Tapped ${trip.name}');
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AddTripsPage extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController name = TextEditingController();
  final TextEditingController notes = TextEditingController();
  final TextEditingController members = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: const Text("Add a Trip"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter Name
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: name,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Name',
                ),
              ),
            ),
            // Enter Notes
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: notes,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Notes',
                ),
              ),
            ),
            // Enter Members
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: members,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Members',
                ),
              ),
            ),
            // Confirm Add Trip
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 95, 170, 232),
                ),
                child: const Text('Add Trip'),
                onPressed: () {
                  print(name.text);
                  print(notes.text);
                  print(members.text);
                  // TODO: Call the API to add the trip
                },
              ),
            ),
          ],
        ),
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
        title: const Text("Username's Profile"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        children: [
          ListTile(
            title: Text("your name"),
            subtitle: Text("username"),
          ),
          ListTile(
            title: Text("your email"),
            subtitle: Text("email"),
          ),
        ],
      ),
    );
  }
}

// Data Models for Trips and Expenses
// TODO: Consider implementing toMap and fromMap to handel JSON
class Expense {
  // Instance variables for an expense
  String id;
  String name;
  String tripId;
  double cost;
  String description;
  List<String> membersIds;
  String payerId;
  // Constructor for an expense
  Expense(
      {required this.id,
      required this.name,
      required this.tripId,
      required this.cost,
      required this.description,
      required this.membersIds,
      required this.payerId});
}

class Trip {
  // Instance variables for a trip
  String id;
  String name;
  String notes;
  List<String> membersIds;
  String leaderId;
  // Constructor for a Trip
  Trip(
      {required this.id,
      required this.name,
      required this.notes,
      required this.membersIds,
      required this.leaderId});
}

class User {
  // Instance variables for a user
  String id;
  String name;
  String email;
  List<Trip> trips;
  // Constructor for a User
  User(
      {required this.id,
      required this.name,
      required this.email,
      required this.trips});
}
