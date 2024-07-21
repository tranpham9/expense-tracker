import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:accountability_mobile_app/ui/trips_page/tripspages.dart';
import 'package:flutter/material.dart';
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

  @override
  void initState() {
    super.initState();
    // TODO: Fetch members and expenses from the API
  }

  static Future<List<Trip>?> listExpenses(String tripId) async {
    return await TripCRUD.listExpenses(tripId);
  }

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
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: widget.trip.memberIds.length,
              itemBuilder: (context, index) {
                // Grab the member
                print("got before member");
                // TODO: Gonna need an endpoint that gets the name associated with the user id
                User member = userFromJson(widget.trip.memberIds[index]);
                print("got after member");
                return SizedBox(
                  width: 100,
                  height: 100,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ViewMemberPage(member),
                        ),
                      );
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
          // TODO: Fix this, cause it doesn't work
          Expanded(
            child: ListView.builder(
              scrollDirection: Axis.vertical,
              itemCount: expenses.length,
              itemBuilder: (context, index) {
                Expense expense = expenses[index];
                return ListTile(
                  title: Text(expense.name),
                  subtitle: Text(expense.description),
                  trailing: Text('\$${expense.cost}'),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ViewExpensePage(expense),
                      ),
                    );
                  },
                );
              },
            ),
          ),
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
