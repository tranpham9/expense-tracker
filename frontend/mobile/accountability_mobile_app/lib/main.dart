// Use "flutter run" in the shell when you need to debug
import 'dart:core';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
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
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: const Text('Login', style: TextStyle(color: Colors.white)),
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
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Register',
                  style: TextStyle(color: Colors.white),
                ),
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
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Send Recovery Email',
                  style: TextStyle(color: Colors.white),
                ),
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
            // Search Bar
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
            // List of Trips
            Expanded(
              // Useful for building lists of unknown length
              child: ListView.builder(
                itemCount: trips.length,
                // Callback to determine how to format each trip in the list
                itemBuilder: (context, index) {
                  // Grab the trip object from the list
                  Trip trip = trips[index];
                  return ListTile(
                    title: Text(trip.name),
                    subtitle: Text(trip.notes),
                    trailing: Text('${trip.membersIds.length}'),
                    onTap: () {
                      // Handle onTap event if needed
                      print('Tapped ${trip.name}');
                      // TODO: Open the ViewTripPage by passing the trip you click on
                      Navigator.push(
                        context,
                        // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                        MaterialPageRoute(
                            builder: (context) => ViewTripPage(trip)),
                      );
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

class ViewTripPage extends StatefulWidget {
  final Trip trip;
  // Pass the trip that you clicked on to the view page
  const ViewTripPage(this.trip);

  @override
  State<ViewTripPage> createState() => _ViewTripPage();
}

class _ViewTripPage extends State<ViewTripPage> {
  //For Testing Only
  List<Expense> expenses = [
    Expense(
        id: "1",
        name: "Mcdonalds",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Mcdonalds",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Mcdonalds",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Mcdonalds",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Mcdonalds",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
  ];

  List<User> members = [
    User(id: "123", name: "Bob", email: "bob@email.com", trips: ["123", "123"]),
    User(
        id: "123",
        name: "Alice",
        email: "alice@email.com",
        trips: ["123", "123"]),
    User(
        id: "123",
        name: "John",
        email: "john@email.com",
        trips: ["123", "123"]),
    User(
        id: "123",
        name: "Abigail",
        email: "abijail@email.com",
        trips: ["123", "123"]),
    User(
        id: "123",
        name: "Jack",
        email: "jack@email.com",
        trips: ["123", "123"]),
    User(
        id: "123",
        name: "Eddy",
        email: "jack@email.com",
        trips: ["123", "123"]),
    User(
        id: "123",
        name: "Tony",
        email: "jack@email.com",
        trips: ["123", "123"]),
  ];
  @override
  Widget build(BuildContext context) {
    Trip trip = widget.trip;
    return Scaffold(
      appBar: AppBar(
        title: Text('${trip.name}'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // List the notes of the trip
          ListTile(
            title: Text('${trip.notes}'),
            subtitle: Text('Notes'),
            // List the edit button
            // TODO: If we only have one button, maybe remove the row widget
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ElevatedButton(
                    onPressed: () {
                      // TODO: Bring up overlay to edit the name and description
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                    ),
                    child: Text(
                      "Edit",
                      style: TextStyle(color: Colors.white),
                    )),
              ],
            ),
          ),
          ListTile(
            title: Text(
              "Members",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          // Display the members of the trip
          Row(
            children: [
              // Plus button to add a member
              SizedBox(
                width: 75,
                height: 75,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    shape: CircleBorder(),
                    padding: EdgeInsets.all(10),
                  ),
                  child: Icon(Icons.add),
                ),
              ),
              Expanded(
                child: SizedBox(
                  width: 75,
                  height: 75,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: members.length,
                    itemBuilder: (context, index) {
                      User member = members[index];
                      return SizedBox(
                        width: 100,
                        height: 100,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            shape: CircleBorder(),
                            padding: EdgeInsets.all(10),
                          ),
                          child: Text('${member.name}'),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),

          ListTile(
            title: Text(
              "Expenses",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          // Display a ListView of the expenses associated with the trips
          Expanded(
            child: ListView.builder(
              // Callback to determine how to format each trip in the list
              itemBuilder: (context, index) {
                Expense expense = expenses[index];
                return ListTile(
                  title: Text(expense.name),
                  subtitle: Text(expense.description),
                  trailing: Text('\$${expense.cost}'),
                  onTap: () {
                    // Handle onTap event if needed
                    print('Tapped ${expense.name}');
                    // TODO: Open the ViewTripPage by passing the trip you click on
                  },
                );
              },
              itemCount: expenses.length,
            ),
          ),
        ],
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
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Add Trip',
                  style: TextStyle(color: Colors.white),
                ),
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
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                ListTile(
                  title: Text("Your Name"),
                  subtitle: Text("Username"),
                ),
                ListTile(
                  title: Text("Your Email"),
                  subtitle: Text("Email"),
                ),
              ],
            ),
          ),
          // TODO: No material widget found.
          Container(
            height: 55,
            width: 270,
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: const Text(
                'Logout',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () {
                // TODO: Log the user out
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
            ),
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
  List<String> trips;
  // Constructor for a User
  User(
      {required this.id,
      required this.name,
      required this.email,
      required this.trips});
}
