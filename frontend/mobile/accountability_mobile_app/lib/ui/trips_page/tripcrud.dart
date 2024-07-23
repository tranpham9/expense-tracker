// Display all of the different pages related to the different CRUD operations for each trip
import 'package:accountability_mobile_app/api/expense_crud.dart';
import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
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
                  onPressed: () async {
                    // Create a trip with the current user as the leader
                    await TripCRUD.createTrip(
                            nameController.text, descriptionController.text)
                        .then((response) {
                      // Display an error message to the user
                      if (response == null) {
                        showOverlay(
                            "There was an error creating your trip. Please try again.",
                            context);
                        return;
                      }
                      // Display success to the user
                      showOverlay(
                          "Successfully created ${nameController.text}!",
                          context);
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
                onPressed: () async {
                  // Join another users trip
                  await TripCRUD.joinTrip(widget.code.text).then((response) {
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
                    showOverlay("Successfully Joined!", context);
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
// Either pass a trip or an expense. Either one you will be able to update the name and description
class EditNameNotesPage extends StatefulWidget {
  // Each trip has both a nameController and descriptionController associated with it
  final Trip? trip;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const EditNameNotesPage(this.trip);

  @override
  State<EditNameNotesPage> createState() => _EditNameNotesPage();
}

class _EditNameNotesPage extends State<EditNameNotesPage> {
  TextEditingController nameController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();

  @override
  void initState() {
    // We are editing a trip
    if (widget.trip != null) {
      // Set the text fields to the current values
      nameController.text = widget.trip!.name;
      descriptionController.text = widget.trip!.description.isEmpty
          ? '"Empty Description"'
          : widget.trip!.description;
      return;
    }
  }

  Widget build(BuildContext context) {
    // Build the page
    return AlertDialog(
      title: Text("Edit Name And Description"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(
              labelText: 'Name',
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
          onPressed: () async {
            // Save the changes for the trip
            if (widget.trip != null) {
              widget.trip!.name = nameController.text;
              widget.trip!.description = descriptionController.text;
              await TripCRUD.updateTrip(widget.trip!.id, nameController.text,
                      descriptionController.text)
                  .then((response) {
                if (response == null) {
                  print("Error editing Name/Description");
                  return;
                }
              });
              // Go back to the last screen
              Navigator.pop(context);
              return;
            }
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

// TODO: When you click you can't see the main app, the background becomes white
class _ViewMemberPage extends State<ViewMemberPage> {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      surfaceTintColor: Colors.transparent,
      title: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(widget.member.name),
          Icon(widget.member.isLeader == true ? Icons.star : Icons.group),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          ListTile(
            title: Text(widget.member.bio ?? "'Empty Bio'"),
            subtitle: Text("Bio"),
          ),
          // Email
          ListTile(
            title: Text(widget.member.email),
            subtitle: Text("Email"),
          ),
          // TODO: Add how much you owe them Here
        ],
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        )
      ],
    );
  }
}
