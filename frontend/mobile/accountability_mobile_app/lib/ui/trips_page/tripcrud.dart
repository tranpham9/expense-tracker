// Display all of the different pages related to the different CRUD operations for each trip
import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
import '../../models/Expense.dart';
import '../../models/Trip.dart';
import '../../models/User.dart';
import '../../utility/helpers.dart';

class AddTripsPage extends StatefulWidget {
  @override
  State<AddTripsPage> createState() => _AddTripsPageState();
}

class _AddTripsPageState extends State<AddTripsPage> {
  // Grab text that will be entered by the user
  final TextEditingController name = TextEditingController();
  final TextEditingController notes = TextEditingController();
  // The user can enter a trip code to join someone else's trip
  final TextEditingController code = TextEditingController();

  // Show a pop up overlay after a successful registration
  OverlayEntry? _overlayEntry;

  Future<int?> createTrip(String name, String notes) async {
    return await TripCRUD.createTrip(name, notes);
  }

  // Show a given pop up overlay
  void _showOverlay(String message) {
    _overlayEntry = createOverlayEntry(message);
    Overlay.of(context)!.insert(_overlayEntry!);
    Future.delayed(const Duration(seconds: 5), () {
      _overlayEntry?.remove();
    });
  }

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
        child: Column(
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
            // Confirm Add Trip
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Add Trip',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // Create a trip with the current user as the leader
                  createTrip(name.text, notes.text).then((response) {
                    // Display an error message to the user
                    if (response == null) {
                      _showOverlay(
                          "There was an error creating your trip. Please try again.");
                      return;
                    }
                    // Display success to the user
                    _showOverlay("Successfully create ${name.text}!");
                    return;
                  });
                },
              ),
            ),
            SizedBox(
              height: 150,
            ),
            // TODO: Call the join trip endpoint to add a user to a trip
            // Allow others to join a trip by inputting a trip code
            JoinTrip(code: code),
          ],
        ),
      ),
    );
  }
}

// Input the UUID code for a trip in order to join it
class JoinTrip extends StatelessWidget {
  final TextEditingController code;

  const JoinTrip({super.key, required this.code});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          children: [
            ListTile(
              title: Center(
                  child: Text(
                "Join a Trip",
                style: TextStyle(fontSize: 20),
              )),
            ),
            TextField(
              controller: code,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Trip Code',
              ),
            ),
            Container(
              height: 50,
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                ),
                child: const Text(
                  'Join Trip',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Add the user to the trip if it exists
                  // alert the user that they are added to the trip with an overlay notification
                },
              ),
            )
          ],
        ),
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

// TODO: This is kind of messed up... Should be an overlay
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
// Since there won't be much info display could possibly be a pop up or overlay
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
            // might not do this either
            // Container(
            //   padding: const EdgeInsets.all(10),
            //   child: ListTile(
            //     leading: Text(
            //       "Who Payed",
            //       style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            //     ),
            //     trailing: Text(
            //       "${widget.expense.payerId} Payed",
            //       style: TextStyle(fontSize: 15),
            //     ),
            //   ),
            // ),
            Container(
              padding: const EdgeInsets.all(10),
              child: ListTile(
                leading: Text(
                  "Who Was Apart of This Expense?",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            // Display Members (might not do this)
            // Expanded(
            //   // Build a list of all of the members in the trip
            //   child: ListView.builder(
            //     itemBuilder: (context, index) {
            //       String member = widget.expense.membersIds[index];
            //       return ListTile(
            //         title: Text(
            //           member,
            //           style: TextStyle(fontSize: 15),
            //         ),
            //       );
            //     },
            //     itemCount: widget.expense.membersIds.length,
            //   ),
            // ),
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

// TODO: Might change since we might not be storing this amount of information
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
            // Enter Cost
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
            // Container(
            //   padding: const EdgeInsets.all(10),
            //   child: TextField(
            //     obscureText: true,
            //     controller: payer,
            //     decoration: const InputDecoration(
            //       border: OutlineInputBorder(),
            //       labelText: 'Payer',
            //     ),
            //   ),
            // ),
            // Container(
            //   padding: const EdgeInsets.all(10),
            //   child: TextField(
            //     obscureText: true,
            //     controller: members,
            //     decoration: const InputDecoration(
            //       border: OutlineInputBorder(),
            //       labelText: 'Members',
            //     ),
            //   ),
            // ),
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
