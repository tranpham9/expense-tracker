// TODO: Break up some of the code into different files to make it more managable
// Use "flutter run" in the shell when you need to debug
import 'dart:core';
import 'dart:math';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
// Needed to make API calls
import 'package:http/http.dart' as http;

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

// User Related Widgets
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPage();
}

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
          // Give a new user ability to register
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
                  // TODO: Call the API to register the user
                  // Also alert the user that they need to confirm w/ their email
                  // Then, direct them to the login to login
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// TODO: Could possibly be an overlay??
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

// Trip Related Widgets
class TripsPage extends StatelessWidget {
  // Grab the search field when we want to search
  final TextEditingController _searchQuery = TextEditingController();

  //FOR TESTING ONLY TODO: Perhaps create a 'model' folder and put models and fake data there
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
          // TODO: Put actual username here
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
                    // TODO: Perform a search and filter the matches to the top
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
  //For Testing Only TODO: Move to another folder for models if we can
  List<Expense> expenses = [
    Expense(
        id: "1",
        name: "Red Robins",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Burger King",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Five Guys",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Gas",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Hotel",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Souvenirs",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
    Expense(
        id: "1",
        name: "Disney World",
        tripId: "192381",
        cost: 15.09,
        description: "We ate at Mcdonalds",
        membersIds: ["13", "14"],
        payerId: "1451"),
  ];
  // Same as comment ^
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
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ElevatedButton(
                    onPressed: () {
                      // Navigate to the name and notes edit page
                      Navigator.push(
                          context,
                          // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                          MaterialPageRoute(
                              builder: (context) => EditNameNotesPage(trip)));
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
                  onPressed: () {
                    Navigator.push(
                        context,
                        // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                        MaterialPageRoute(
                            builder: (context) => AddMemberToTrip()));
                  },
                  style: ElevatedButton.styleFrom(
                    shape: CircleBorder(),
                    padding: EdgeInsets.all(10),
                  ),
                  child: Icon(Icons.add),
                ),
              ),
              // Display the members of the trip in a horizontal scroll format
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
                          onPressed: () {
                            Navigator.push(
                                context,
                                // Display the information of the member that was clicked on
                                MaterialPageRoute(
                                    builder: (context) =>
                                        ViewMemberPage(member)));
                          },
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
          // Add a new expense
          ElevatedButton(
            onPressed: () {
              // TODO: Navigate to add expense page. Will probably need to pass the current tripId so we can call the API
              Navigator.push(
                  context,
                  // Add a new expense to the trip
                  MaterialPageRoute(builder: (context) => AddExpensePage()));
            },
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30.0),
              ),
              padding: EdgeInsets.all(10),
            ),
            child: Container(
              width: double.infinity,
              height: 35,
              padding: EdgeInsets.all(10),
              child: Icon(Icons.add),
            ),
          ),
          // Display a ListView of the expenses associated with the trip
          Expanded(
              child: SizedBox(
            width: double.infinity,
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.vertical,
              // Callback to determine how to format each trip in the list
              itemBuilder: (context, index) {
                Expense expense = expenses[index];
                return ListTile(
                  title: Text(expense.name),
                  subtitle: Text(expense.description),
                  trailing: Text('\$${expense.cost}'),
                  onTap: () {
                    Navigator.push(
                        context,
                        // Display the information of the member that was clicked on
                        MaterialPageRoute(
                            builder: (context) => ViewExpensePage(expense)));
                  },
                );
              },
              itemCount: expenses.length,
            ),
          )),
          ElevatedButton(
              onPressed: () {
                // Pass the list of members & list of expenses to determine total cost and cost amongst members
                // TODO: Call the API to get the monetary details of the current trip. ie. who owes who what amount of money
                // Display a page where all this information will reside
                Navigator.push(
                    context,
                    // Generate a receipt for the current trip
                    MaterialPageRoute(builder: (context) => ReceiptPage()));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: Text(
                "Generate Receipt",
                style: TextStyle(color: Colors.white),
              )),
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
                  // TODO: Call the API to add the trip
                  // also figure out how to handel reading the emails properly
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Profile Page Widget
class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        // TODO: Place actual username here
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
                // TODO: Maybe have the ability to chang the user name?? (OPTIONAL)
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

// Name & Notes Widgets
class EditNameNotesPage extends StatefulWidget {
  // Each trip has both a name and notes associated with it
  final Trip trip;
  // Make sure to pass the name and notes of the trip to the function
  const EditNameNotesPage(this.trip);

  @override
  State<EditNameNotesPage> createState() => _EditNameNotesPage();
}

// TODO: This is kind of messed up...
// Could possibly be an overlay??
class _EditNameNotesPage extends State<EditNameNotesPage> {
  TextEditingController nameController = TextEditingController();
  TextEditingController notesController = TextEditingController();

  @override
  void initState() {
    // Set the text fields to the current values
    nameController.text = widget.trip.name;
    notesController.text = widget.trip.notes;
  }

  Widget build(BuildContext context) {
    // Build the page
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit Name and Notes'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextFormField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Trip Name',
              ),
            ),
            TextFormField(
              controller: notesController,
              decoration: InputDecoration(
                labelText: 'Notes',
              ),
              maxLines: null,
            ),
            SizedBox(height: 20.0),
            ElevatedButton(
              onPressed: () {
                // Save the changes and go back to the screen
                widget.trip.name = nameController.text;
                widget.trip.notes = notesController.text;
                // TODO: Write the changes with the API and reflect those changes on the page

                // Go back to the last screen
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor),
              child: Text(
                'Save',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void saveEdits() {
    // Call API
  }
}

// Member Related Widgets
class ViewMemberPage extends StatefulWidget {
  // Each trip has both a name and notes associated with it
  final User member;
  // Make sure to pass the name and notes of the trip to the function
  const ViewMemberPage(this.member);

  @override
  State<ViewMemberPage> createState() => _ViewMemberPage();
}

// TODO: Could be an overlay??
class _ViewMemberPage extends State<ViewMemberPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.member.name}'),
        centerTitle: true,
      ),
      body: Container(
        child: Center(
          child: Text(
            '${widget.member.email}',
            style: TextStyle(
              fontSize: 20,
            ),
          ),
        ),
      ),
    );
  }
}

// TODO: Could possibly be an overlay??
class AddMemberToTrip extends StatelessWidget {
  // Get the email of the person that you want to add
  final TextEditingController email = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: const Text("Add a Member"),
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
                controller: email,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Email',
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
                  'Add',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Call the API to add the member to the trip
                  // Ensure that the changes are reflected on the page

                  // Go back to the last screen
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Expense Related Widgets
class ViewExpensePage extends StatefulWidget {
  // Each trip has both a name and notes associated with it
  final Expense expense;
  // Make sure to pass the name and notes of the trip to the function
  const ViewExpensePage(this.expense);

  @override
  State<ViewExpensePage> createState() => _ViewExpensePage();
}

// TODO: Need to decide how we want to implement the edit functionality here...
class _ViewExpensePage extends State<ViewExpensePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: Text('${widget.expense.name}'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Display notes
            Container(
                padding: const EdgeInsets.all(10),
                child: ListTile(
                  leading: Text(
                    "Notes",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  trailing: Text(
                    "${widget.expense.description}",
                    style: TextStyle(fontSize: 15),
                  ),
                )),
            // Display cost
            Container(
                padding: const EdgeInsets.all(10),
                child: ListTile(
                  leading: Text(
                    "Dollar Amount",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  trailing: Text(
                    "\$${widget.expense.cost}",
                    style: TextStyle(fontSize: 15),
                  ),
                )),
            // Display Payer
            Container(
              padding: const EdgeInsets.all(10),
              child: ListTile(
                leading: Text(
                  "Who Payed",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                trailing: Text(
                  "${widget.expense.payerId} Payed",
                  style: TextStyle(fontSize: 15),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10),
              child: ListTile(
                leading: Text(
                  "Who Was Apart of This Expense?",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            // Display Members
            Expanded(
              // Build a list of all of the members in the trip
              child: ListView.builder(
                itemBuilder: (context, index) {
                  String member = widget.expense.membersIds[index];
                  return ListTile(
                    title: Text(
                      member,
                      style: TextStyle(fontSize: 15),
                    ),
                  );
                },
                itemCount: widget.expense.membersIds.length,
              ),
            ),
            // Confirm Edit
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Confirm Edit',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Call API to update the trip details.
                  // Again, this will depend on HOW we decide the edit function will work

                  // Go back to the last screen
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AddExpensePage extends StatelessWidget {
  // Grab text that will be entered by the user
  final TextEditingController name = TextEditingController();
  final TextEditingController notes = TextEditingController();
  final TextEditingController cost = TextEditingController();
  final TextEditingController payer = TextEditingController();
  final TextEditingController members = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: const Text("Add an Expense"),
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
                controller: cost,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Cost',
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: payer,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Payer',
                ),
              ),
            ),
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
                  'Add Expense',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Call the API to add the expense. Add that expense to the current trip
                  // Figure out best way to map how much each person spent...(HARD PART)

                  // Go back to the last screen
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Generate a receipt for the current trip, which includes all members and expenses up to this point
// TODO: Need to determine how to lay this out and complete the calculations
class ReceiptPage extends StatefulWidget {
  @override
  State<ReceiptPage> createState() => _ReceiptPage();
}

class _ReceiptPage extends State<ReceiptPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Generating A Receipt"),
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
