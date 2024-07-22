// Display all of the different pages related to the different CRUD operations for each trip
import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
import '../../api/expense_crud.dart';
import '../../models/Expense.dart';
import '../../models/Trip.dart';
import '../../models/User.dart';
import '../../utility/helpers.dart';

// Create your own trip
class AddTripsPage extends StatefulWidget {
  @override
  State<AddTripsPage> createState() => _AddTripsPageState();
}

class _AddTripsPageState extends State<AddTripsPage> {
  // Grab text that will be entered by the user
  final TextEditingController nameController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  // The user can enter a trip code to join someone else's trip
  final TextEditingController code = TextEditingController();
  String? codeError;

  // Show a pop up overlay after a successful registration
  OverlayEntry? _overlayEntry;
  // Create a trip with the user as the leader
  Future<int?> createTrip(String nameController, String description) async {
    return await TripCRUD.createTrip(nameController, description);
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
        title: Text("Trip Creation"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: SingleChildScrollView(
          child: Column(
            // Have our list of containers that will take in text input
            children: <Widget>[
              ListTile(
                title: Center(
                    child: Text(
                  "Create a Trip",
                  style: TextStyle(fontSize: 20),
                )),
              ),
              // Enter nameController
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Name',
                  ),
                ),
              ),
              // Enter descriptionController
              Container(
                padding: const EdgeInsets.all(10),
                child: TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Description',
                  ),
                ),
              ),
              // Confirm Add Trip
              Container(
                height: 50,
                padding: const EdgeInsets.all(10),
                width: double.infinity,
                child: ElevatedButton(
                  child: const Text(
                    'Add Trip',
                    style: TextStyle(color: Colors.white),
                  ),
                  onPressed: () {
                    // Create a trip with the current user as the leader
                    createTrip(nameController.text, descriptionController.text)
                        .then((response) {
                      // Display an error message to the user
                      if (response == null) {
                        _showOverlay(
                            "There was an error creating your trip. Please try again.");
                        return;
                      }
                      // Display success to the user
                      _showOverlay(
                          "Successfully created ${nameController.text}!");
                      return;
                    });
                  },
                ),
              ),
              SizedBox(
                height: 150,
              ),
              // Allow others to join a trip by inputting a trip code
              JoinTrip(code: code, codeError: codeError),
            ],
          ),
        ),
      ),
    );
  }
}

// Input the invite code to join a trip
class JoinTrip extends StatefulWidget {
  final TextEditingController code;
  String? codeError;

  JoinTrip({super.key, required this.code, required this.codeError});

  @override
  State<JoinTrip> createState() => _JoinTripState();
}

class _JoinTripState extends State<JoinTrip> {
  // Join someone else's trip
  Future<int?> joinTrip(String inviteCode) async {
    return await TripCRUD.joinTrip(inviteCode);
  }

  // Show a given pop up overlay
  void _showOverlay(String message) {
    var _overlayEntry = createOverlayEntry(message);
    Overlay.of(context)!.insert(_overlayEntry!);
    Future.delayed(const Duration(seconds: 5), () {
      _overlayEntry?.remove();
    });
  }

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
              controller: widget.code,
              decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Trip Code',
                  errorText: widget.codeError),
            ),
            Container(
              height: 50,
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                child: const Text(
                  'Join Trip',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // Join another users trip
                  joinTrip(widget.code.text).then((response) {
                    if (response == null) {
                      setState(() {
                        widget.codeError = "That Trip Does Not Exist";
                      });
                      return;
                    }
                    setState(() {
                      widget.codeError = null;
                    });
                    // Show join successful overlay
                    _showOverlay("Successfully Joined!");
                  });
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

// TODO: Implement some realtime updating
// nameController & Description Widgets (Only for the owner of the trip)
class EditNameNotesPage extends StatefulWidget {
  // Each trip has both a nameController and descriptionController associated with it
  final Trip trip;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const EditNameNotesPage(this.trip);

  @override
  State<EditNameNotesPage> createState() => _EditNameNotesPage();
}

// TODO: This is kind of messed up... Should be an overlay
class _EditNameNotesPage extends State<EditNameNotesPage> {
  TextEditingController nameController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();

  @override
  void initState() {
    // Set the text fields to the current values
    nameController.text = widget.trip.name;
    descriptionController.text = widget.trip.description.isEmpty
        ? '"Empty Description"'
        : widget.trip.description;
  }

  static Future<int?> updateTrip(
      String tripId, String nameController, String description) async {
    return await TripCRUD.updateTrip(tripId, nameController, description);
  }

  Widget build(BuildContext context) {
    // Build the page
    return AlertDialog(
      title: Text("Edit nameController And Description"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(
              labelText: 'Trip nameController',
            ),
          ),
          SizedBox(
            height: 25,
          ),
          TextFormField(
            controller: descriptionController,
            decoration: InputDecoration(
              labelText: 'Description',
            ),
            maxLines: null,
          ),
          SizedBox(height: 20.0),
        ],
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed: () {
            // Save the changes and go back to the screen
            widget.trip.name = nameController.text;
            widget.trip.description = descriptionController.text;
            // TODO: Write the changes with the API and reflect those changes on the page
            updateTrip(widget.trip.id, nameController.text,
                    descriptionController.text)
                .then((response) {
              if (response == null) {
                print("Error editing nameControllers/descriptionController");
                return;
              }
            });
            // Go back to the last screen
            Navigator.pop(context);
          },
          child: Text(
            'Save',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ],
    );
  }
}

// Member Related Widgets
class ViewMemberPage extends StatefulWidget {
  // Pass the member we want to look at
  final User member;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const ViewMemberPage(this.member);

  @override
  State<ViewMemberPage> createState() => _ViewMemberPage();
}

// TODO: Could be an overlay??
class _ViewMemberPage extends State<ViewMemberPage> {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('${widget.member.name}'),
          Icon(widget.member.isLeader == true ? Icons.star : Icons.group),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            title: Text("${widget.member?.bio ?? "'Empty Bio'"}"),
            subtitle: Text("Bio"),
          ),
          // Email
          ListTile(
            title: Text("${widget.member?.email}"),
            subtitle: Text("Email"),
          ),
          // TODO: Add how much you owe them Here
        ],
      ),
    );
  }
}

// Expense Related Widgets
class ViewExpensePage extends StatefulWidget {
  // Each trip has both a nameController and descriptionController associated with it
  final Expense expense;
  // Make sure to pass the nameController and descriptionController of the trip to the function
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
            // Display descriptionController
            Container(
                padding: const EdgeInsets.all(10),
                child: ListTile(
                  leading: Text(
                    "descriptionController",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  trailing: Text(
                    "${widget.expense.description}",
                    style: TextStyle(fontSize: 15),
                  ),
                )),
            // Display costController
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
                  "Members",
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

// TODO: Implement a check box sort of system to determine who was apart of the expense
// It is assumed that the person creating the expense is the payer
class AddExpensePage extends StatefulWidget {
  // Pass the member we want to look at
  final String tripId;
  // Our list of members (User objects)
  final List<User> members;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const AddExpensePage(this.tripId, this.members);

  @override
  State<AddExpensePage> createState() => _AddExpensePageState();
}

class _AddExpensePageState extends State<AddExpensePage> {
  // Grab text that will be entered by the user
  final TextEditingController nameController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController costController = TextEditingController();
  late List<bool> isChecked;

  @override
  void initState() {
    super.initState();
    isChecked = List.generate(widget.members.length, (index) => false);
  }

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
            // Enter nameController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'nameController',
                ),
              ),
            ),
            // Enter descriptionController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'descriptionController',
                ),
              ),
            ),
            // Enter costController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                obscureText: true,
                controller: costController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'costController',
                ),
              ),
            ),
            // Add Members to the Expense
            // TODO: Get this to be in some sort of grid view??
            SizedBox(
              height: 200,
              // Ensure we don't display if there aren't any members
              child: isChecked.isEmpty
                  ? null
                  : ListView.builder(
                      itemCount: widget.members.length,
                      itemBuilder: (context, index) {
                        return CheckboxListTile(
                          // The member that you want to add
                          title: Text(widget.members[index].name),
                          value: isChecked[index],
                          tristate: false,
                          // Switch the value when you click
                          onChanged: (bool? value) {
                            setState(() {
                              isChecked[index] = value!;
                            });
                          },
                          activeColor: Colors.white,
                          checkColor: Theme.of(context).primaryColor,
                        );
                      }),
            ),
            // Confirm Add Expense
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                child: const Text(
                  'Add Expense',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () async {
                  List<String> addMembers = [];
                  // Only add members if they are checked
                  for (int i = 0; i < isChecked.length; i++) {
                    if (isChecked[i]) {
                      addMembers.add(widget.members[i].userId!);
                      print('Adding ${widget.members[i].name}\n');
                    }
                  }
                  // Go through and collect the memberIds of the selected checkboxes
                  await ExpenseCRUD.create(
                          widget.tripId,
                          nameController.text,
                          descriptionController.text,
                          double.parse(costController.text),
                          addMembers)
                      .then((response) {
                    // Go back to the last screen
                    Navigator.pop(context);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
