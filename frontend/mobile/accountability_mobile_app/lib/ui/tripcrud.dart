// Display all of the different pages related to the different CRUD operations for each trip
import 'package:flutter/material.dart';
import '../models/models.dart';

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
