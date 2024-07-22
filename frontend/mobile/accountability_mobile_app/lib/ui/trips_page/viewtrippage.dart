import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
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
          ListTile(
            title: Text(
              "Trip Details",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          // Edit the name and description of the trip
          EditNameNotes(trip: widget.trip),
          // Trip Code
          ListTile(
            title: Text(widget.trip.inviteCode),
            subtitle: Text('Trip Code'),
          ),
          ListTile(
            title: Text(
              "Members",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          // Display the members of the trip
          Expanded(
            child: FutureBuilder<List<User>?>(
              future: TripCRUD.getMembers(widget.trip.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Skeletonizer(
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return MemberSkeleton();
                      },
                    ),
                  );
                } else if (snapshot.data!.isEmpty) {
                  return Center(
                    child: Text("No Members Found"),
                  );
                } else if (snapshot.hasData) {
                  // List<User> members = snapshot.data!;
                  members = snapshot.data!;
                  return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: members.length,
                    itemBuilder: (context, index) {
                      // Grab the member
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
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
                            fixedSize: const Size(100, 100),
                            shape: const CircleBorder(),
                          ),
                          child: Text(
                            members[index].name.substring(0, 2).toUpperCase(),
                            style: TextStyle(
                                fontSize: 24,
                                decoration: TextDecoration.underline,
                                decorationThickness: 2.0),
                          ),
                        ),
                      );
                    },
                  );
                }
                return Center(
                  child: Text("Error Loading Members"),
                );
              },
            ),
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
          Expanded(
            child: FutureBuilder<List<Expense>?>(
              future: TripCRUD.listExpenses(widget.trip.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Skeletonizer(
                    child: ListView.builder(
                      scrollDirection: Axis.vertical,
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return ExpenseSkeleton();
                      },
                    ),
                  );
                } else if (snapshot.data!.isEmpty) {
                  return Center(
                    child: Text("No Expenses Found"),
                  );
                } else if (snapshot.hasData) {
                  List<Expense> expenses = snapshot.data!;
                  return ListView.builder(
                    scrollDirection: Axis.vertical,
                    itemCount: expenses.length,
                    itemBuilder: (context, index) {
                      // Grab the member
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    ViewExpensePage(expenses[index]),
                              ),
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
                            padding: EdgeInsets.all(10),
                            child: Text(
                              expenses[index].name,
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }
                return Center(
                  child: Text("Error Loading Expenses"),
                );
              },
            ),
          ),
          // Delete Trip
          ElevatedButton(
            onPressed: Globals.user?.userId != widget.trip.leaderId
                ? null
                : () async {
                    await TripCRUD.deleteTrip(widget.trip.id).then((response) {
                      if (response == null) {
                        showOverlay(
                            "There Was an Error Deleting Your Trip.", context);
                        return;
                      }
                      // Go back to the last screen
                      Navigator.pop(context);
                    });
                  },
            child: Icon(Icons.delete),
          ),
        ],
      ),
    );
  }
}

class MemberSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: Colors.grey,
          shape: BoxShape.circle,
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
      child: Container(
        width: double.infinity,
        height: 50,
        decoration: BoxDecoration(
            color: Colors.grey,
            shape: BoxShape.rectangle,
            borderRadius: BorderRadius.circular(18.0)),
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
