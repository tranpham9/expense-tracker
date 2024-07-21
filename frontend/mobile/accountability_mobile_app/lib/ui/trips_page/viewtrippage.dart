import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../globals.dart';
import '../../models/Trip.dart';
import '../../utility/helpers.dart';
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
  List<Expense> expenses = []; // Placeholder for expenses list
  List<User> members = []; // Placeholder for members list

  // static Future<List<Trip>?> listExpenses(String tripId) async {
  //   return await TripCRUD.listExpenses(tripId);
  // }

  static Future<int?> deleteTrip(String tripId) async {
    return await TripCRUD.deleteTrip(tripId);
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
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.trip.name}'),
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
          EditNameNotes(trip: widget.trip),
          ListTile(
            title: Text("${widget.trip.inviteCode}"),
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
                  List<User> members = snapshot.data!;
                  return ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: members.length,
                    itemBuilder: (context, index) {
                      // Grab the member
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: SizedBox(
                          width: 100,
                          height: 100,
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
                MaterialPageRoute(builder: (context) => AddExpensePage()),
              );
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
          // TODO: Fix the distance between the add button and expense
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
                            padding: EdgeInsets.all(10),
                          ),
                          child: Container(
                            width: double.infinity,
                            height: 35,
                            padding: EdgeInsets.all(10),
                            child: Text(expenses[index].name),
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
                : () {
                    deleteTrip(widget.trip.id).then((response) {
                      if (response == null) {
                        _showOverlay("There Was an Error Deleting Your Trip.");
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
          child: Container(
            child: Column(
              children: [
                ListTile(
                  title: Text('${trip.name}'),
                  subtitle: Text('Name'),
                ),
                ListTile(
                  title: Text('${trip.description}'),
                  subtitle: Text('Description'),
                )
              ],
            ),
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
