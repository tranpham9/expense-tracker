// Display information about the different trips
import 'package:flutter/material.dart';
import '../models/models.dart';
import 'tripcrud.dart';

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
