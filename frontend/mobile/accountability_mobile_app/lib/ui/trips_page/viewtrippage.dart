import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:accountability_mobile_app/ui/trips_page/tripspages.dart';
import 'package:flutter/material.dart';
import '../../models/Trip.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.trip.name}'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // List the notes of the trip
          ListTile(
            title: Text('${widget.trip.description}'),
            subtitle: Text('Notes'),
            trailing: ElevatedButton(
              onPressed: () {
                // Navigate to the name and notes edit page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EditNameNotesPage(widget.trip),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: Text(
                "Edit",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
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
            onPressed: () {
              // Generate a receipt for the current trip
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ReceiptPage(trip: widget.trip),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).primaryColor,
            ),
            child: Text(
              "Generate Receipt",
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
