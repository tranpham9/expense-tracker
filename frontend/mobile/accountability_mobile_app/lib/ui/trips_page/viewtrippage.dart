import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../globals.dart';
import '../../models/Trip.dart';
import '../../utility/helpers.dart';
import 'expensecrud.dart';
import 'tripcrud.dart';
import '../../models/Expense.dart';
import '../../models/User.dart';

class ViewTripPage extends StatefulWidget {
  final Trip trip;
  // Pass a trip to the widget
  const ViewTripPage({super.key, required this.trip});

  @override
  State<ViewTripPage> createState() => _ViewTripsPage();
}

class _ViewTripsPage extends State<ViewTripPage> {
  // Keep track of the members (beside the current user) of the trip
  late List<User> members = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.trip.name),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    title: Text(
                      "Trip Details",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  // Edit the name and description of the trip
                  EditNameNotes(trip: widget.trip),
                  // Trip Code
                  Row(
                    children: [
                      Expanded(
                        child: ListTile(
                          title: Text(widget.trip.inviteCode),
                          subtitle: Text('Trip Code'),
                        ),
                      ),
                      ElevatedButton(
                          onPressed: () {
                            Clipboard.setData(
                                ClipboardData(text: widget.trip.inviteCode));
                          },
                          child: Icon(Icons.copy))
                    ],
                  ),
                  ListTile(
                    title: Text(
                      "Members",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  // Display the members of the trip
                  FutureBuilder<List<User>?>(
                    future: TripCRUD.getMembers(widget.trip.id),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Skeletonizer(
                          child: SizedBox(
                            height: 120.0,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: 5,
                              itemBuilder: (context, index) {
                                return MemberSkeleton();
                              },
                            ),
                          ),
                        );
                      } else if (snapshot.data!.isEmpty) {
                        return Center(
                          child: Text("No Members Found"),
                        );
                      } else if (snapshot.hasData) {
                        // Save the members of the **WHOLE** trip
                        members = snapshot.data!;
                        return SizedBox(
                          height: 90,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: members.length,
                            itemBuilder: (context, index) {
                              // Grab the member
                              return Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8.0),
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            ViewMemberPage(members[index]),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    fixedSize: const Size(90, 90),
                                    shape: const CircleBorder(),
                                  ),
                                  child: Text(
                                    members[index]
                                        .name
                                        .substring(0, 2)
                                        .toUpperCase(),
                                    style: TextStyle(
                                        fontSize: 24,
                                        decoration: TextDecoration.underline,
                                        decorationThickness: 2.0),
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      }
                      return Center(
                        child: Text("Error Loading Members"),
                      );
                    },
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
                      // Navigate to add expense page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                AddExpensePage(widget.trip.id, members)),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30.0),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                    ),
                    child: Container(
                      width: double.infinity,
                      height: 50,
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Icon(Icons.add),
                    ),
                  ),
                  // Display a ListView of the expenses associated with the trip
                  FutureBuilder<List<Expense>?>(
                    // TODO: This will be changed
                    future: TripCRUD.listExpenses(widget.trip.id),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Skeletonizer(
                          child: SizedBox(
                            height: 300.0, // Adjust height as necessary
                            child: ListView.builder(
                              scrollDirection: Axis.vertical,
                              itemCount: 5,
                              itemBuilder: (context, index) {
                                return ExpenseSkeleton();
                              },
                            ),
                          ),
                        );
                      } else if (snapshot.data!.isEmpty) {
                        return Center(
                          child: Text("No Expenses Found"),
                        );
                      } else if (snapshot.hasData) {
                        List<Expense> expenses = snapshot.data!;
                        return SizedBox(
                          height: 300.0, // Adjust height as necessary
                          child: ListView.builder(
                            scrollDirection: Axis.vertical,
                            itemCount: expenses.length,
                            itemBuilder: (context, index) {
                              // Grab the member
                              return Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 8.0),
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        // just pass the expense it self along with ALL of the members of the trip
                                        // so that way we can add/remove people should we chose to
                                        builder: (context) => ViewExpensePage(
                                            expenses[index], members),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30.0),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8.0),
                                  ),
                                  child: Container(
                                    width: double.infinity,
                                    height: 50,
                                    padding: EdgeInsets.all(10),
                                    child: Text(
                                      expenses[index].name,
                                      textAlign: TextAlign.center,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      }
                      return Center(
                        child: Text("Error Loading Expenses"),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          Center(
            child: ElevatedButton(
              // Navigate to confirm delete delete
              onPressed: Globals.user?.userId != widget.trip.leaderId
                  ? null
                  : () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => DeleteTripWidget(
                              tripId: widget.trip.id, name: widget.trip.name),
                        ),
                      );
                    },
              child: Icon(Icons.delete),
            ),
          ),
        ],
      ),
    );
  }
}

class MemberSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            fixedSize: const Size(90, 90),
            shape: const CircleBorder(),
          ),
          child: Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 178, 178, 178),
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
    );
  }
}

class ExpenseSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30.0),
          ),
          padding: const EdgeInsets.symmetric(vertical: 8.0),
        ),
        child: Container(
          width: double.infinity,
          height: 67,
          padding: EdgeInsets.all(10),
          decoration: BoxDecoration(
              color: Colors.grey,
              shape: BoxShape.rectangle,
              borderRadius: BorderRadius.circular(30.0)),
        ),
      ),
    );
  }
}

// Display the name and description and allow editing
class EditNameNotes extends StatelessWidget {
  final Trip trip;
  // Pass a trip to the widget
  EditNameNotes({super.key, required this.trip});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            children: [
              ListTile(
                title: Text(trip.name),
                subtitle: Text('Name'),
              ),
              ListTile(
                title: Text(trip.description.isEmpty
                    ? '"Empty Description"'
                    : trip.description),
                subtitle: Text('Description'),
              )
            ],
          ),
        ),
        ElevatedButton(
            onPressed: Globals.user?.userId != trip.leaderId
                ? null
                : () {
                    // Navigate to the name and notes edit page
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EditNameNotesPage(trip),
                      ),
                    );
                  },
            child: Icon(Icons.edit))
      ],
    );
  }
}

class DeleteTripWidget extends StatefulWidget {
  final String tripId;
  final String name;
  // Pass a trip to the widget
  const DeleteTripWidget({super.key, required this.tripId, required this.name});

  @override
  State<DeleteTripWidget> createState() => _DeleteTripWidget();
}

class _DeleteTripWidget extends State<DeleteTripWidget> {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Confirm Trip Deletion"),
      content: Text(
          'Are you sure you want to delete "${widget.name}"?\nThis will also delete all associated expenses.'),
      actions: <Widget>[
        TextButton(
          child: const Text('NO'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed: () async {
            // Call the API
            await TripCRUD.deleteTrip(widget.tripId).then((response) {
              if (response == null) {
                showOverlay("There Was an Error Deleting Your Trip.", context);
                return;
              }
              // Go back to the last screen
              Navigator.pop(context);
            });
            // Success! Show success overlay
            showOverlay('Successfully Deleted "${widget.name}"', context);
            Navigator.pop(context);
          },
          child: const Text('YES'),
        ),
      ],
    );
  }
}
