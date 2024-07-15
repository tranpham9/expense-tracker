import 'package:accountability_mobile_app/ui/trips_page/tripspages.dart';
import 'package:flutter/material.dart';
import '../../models/Trip.dart';

class ViewTripPage extends StatefulWidget {
  final Trip trip;
  // Pass a trip to the widget
  const ViewTripPage({super.key, required this.trip});

  @override
  State<ViewTripPage> createState() => _ViewTripsPage();
}

class _ViewTripsPage extends State<ViewTripPage> {
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
            title: Text('${widget.trip.notes}'),
            subtitle: Text('Notes'),
            // List the edit button
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ElevatedButton(
                    onPressed: () {
                      // TODO: Call API to edit the notes of an app (Overlay/Pop up to fill in)
                      // Navigate to the name and notes edit page
                      // Navigator.push(
                      //     context,
                      //     // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                      //     MaterialPageRoute(
                      //         builder: (context) => EditNameNotesPage(trip)));
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
            title: Text('Trip Code'),
            subtitle: Text('Trip Code'),
            // List the edit button
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
              // Display the members of the trip in a horizontal scroll format
              // TODO: Apply skeletonizer here for loading animation and load all members of this trip
              Expanded(
                child: SizedBox(
                  width: 75,
                  height: 75,
                  // child: ListView.builder(
                  //   scrollDirection: Axis.horizontal,
                  //   itemCount: members.length,
                  //   itemBuilder: (context, index) {
                  //     User member = members[index];
                  //     return SizedBox(
                  //       width: 100,
                  //       height: 100,
                  //       child: ElevatedButton(
                  //         onPressed: () {
                  //           Navigator.push(
                  //               context,
                  //               // Display the information of the member that was clicked on
                  //               MaterialPageRoute(
                  //                   builder: (context) =>
                  //                       ViewMemberPage(member)));
                  //         },
                  //         style: ElevatedButton.styleFrom(
                  //           shape: CircleBorder(),
                  //           padding: EdgeInsets.all(10),
                  //         ),
                  //         child: Text('${member.name}'),
                  //       ),
                  //     );
                  //   },
                  // ),
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
              // Navigator.push(
              //     context,
              //     // Add a new expense to the trip
              //     MaterialPageRoute(builder: (context) => AddExpensePage()));
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
            // TODO: Skeletonizer here too to display all expenses.
            // Display all expenses by getting all of the expenses for a related trip
            // child: ListView.builder(
            //   scrollDirection: Axis.vertical,
            //   // Callback to determine how to format each trip in the list
            //   itemBuilder: (context, index) {
            //     Expense expense = expenses[index];
            //     return ListTile(
            //       title: Text(expense.name),
            //       subtitle: Text(expense.description),
            //       trailing: Text('\$${expense.cost}'),
            //       onTap: () {
            //         Navigator.push(
            //             context,
            //             // Display the information of the member that was clicked on
            //             MaterialPageRoute(
            //                 builder: (context) => ViewExpensePage(expense)));
            //       },
            //     );
            //   },
            //   itemCount: expenses.length,
            // ),
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
