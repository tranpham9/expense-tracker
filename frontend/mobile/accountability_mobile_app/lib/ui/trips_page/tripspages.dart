// Display information about the different trips
import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../models/models.dart';

// Trip Related Widgets
// TODO: Fix this so a loading animation occurs while data is being fetched
class TripsPage extends StatefulWidget {
  @override
  State<TripsPage> createState() => _TripsPageState();
}

class _TripsPageState extends State<TripsPage> {
  // Grab the search field when we want to search
  final TextEditingController _searchQuery = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "${Globals.user?.name}'s Trips",
        ),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        // Store the search bar and ListView of the trips
        child: Column(
          children: [
            // Search Bar
            TextField(
              controller: _searchQuery,
              decoration: InputDecoration(
                hintText: 'Search...',
                // Clear the search field
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () => _searchQuery.clear(),
                ),
                prefixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    // TODO: Perform a search and filter the matches to the top
                    print(_searchQuery.text);
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
              ),
            ),
            // List of Trips
            FutureBuilder(
                future: TripCRUD.getTrips(Globals.user!.id),
                builder: (context, snapshot) {
                  // Display the loading skeleton for the trips
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Expanded(
                      child: ListView.separated(
                          itemBuilder: (context, index) => TripsSkeleton(),
                          separatorBuilder: (context, index) => const SizedBox(
                                height: 16,
                              ),
                          itemCount: 10),
                    );
                  } else if (snapshot.hasData) {
                    List<Trip> trips = snapshot.data!;
                    return Expanded(
                        child: ListView.builder(
                      itemBuilder: (context, index) => ListTile(
                        title: Text(trips[index].name),
                        subtitle: Text(trips[index].notes),
                        trailing: Text('${trips[index].membersIds.length}'),
                        onTap: () {
                          // Navigator.push(
                          //   context,
                          //   // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                          //   MaterialPageRoute(
                          //       builder: (context) =>
                          //           ViewTripPage(trips[index])),
                          // );
                        },
                      ),
                      itemCount: trips.length,
                    ));
                  }
                  return Text("");
                }),
          ],
        ),
      ),
    );
  }
}

// TODO: Needs to look like the ListTile while loading
class TripsSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 16,
      width: 16,
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(.04),
      ),
    );
  }
}

/*
class ViewTripPage extends StatefulWidget {
  final Trip trip;
  // Pass the trip that you clicked on to the view page
  const ViewTripPage(this.trip);

  @override
  State<ViewTripPage> createState() => _ViewTripPage();
}

class _ViewTripPage extends State<ViewTripPage> {
  //For Testing Only TODO: Move to another folder for models if we can

  @override
  Widget build(BuildContext context) {
    Trip trip = widget.trip;
    return Scaffold(
      appBar: AppBar(
        title: Text('${trip.name}'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // List the notes of the trip
          ListTile(
            title: Text('${trip.notes}'),
            subtitle: Text('Notes'),
            // List the edit button
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ElevatedButton(
                    onPressed: () {
                      // Navigate to the name and notes edit page
                      Navigator.push(
                          context,
                          // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                          MaterialPageRoute(
                              builder: (context) => EditNameNotesPage(trip)));
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
            title: Text(
              "Members",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          // Display the members of the trip
          Row(
            children: [
              // Plus button to add a member
              SizedBox(
                width: 75,
                height: 75,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                        MaterialPageRoute(
                            builder: (context) => AddMemberToTrip()));
                  },
                  style: ElevatedButton.styleFrom(
                    shape: CircleBorder(),
                    padding: EdgeInsets.all(10),
                  ),
                  child: Icon(Icons.add),
                ),
              ),
              // Display the members of the trip in a horizontal scroll format
              Expanded(
                child: SizedBox(
                  width: 75,
                  height: 75,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: members.length,
                    itemBuilder: (context, index) {
                      User member = members[index];
                      return SizedBox(
                        width: 100,
                        height: 100,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                // Display the information of the member that was clicked on
                                MaterialPageRoute(
                                    builder: (context) =>
                                        ViewMemberPage(member)));
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
              Navigator.push(
                  context,
                  // Add a new expense to the trip
                  MaterialPageRoute(builder: (context) => AddExpensePage()));
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
            child: ListView.builder(
              scrollDirection: Axis.vertical,
              // Callback to determine how to format each trip in the list
              itemBuilder: (context, index) {
                Expense expense = expenses[index];
                return ListTile(
                  title: Text(expense.name),
                  subtitle: Text(expense.description),
                  trailing: Text('\$${expense.cost}'),
                  onTap: () {
                    Navigator.push(
                        context,
                        // Display the information of the member that was clicked on
                        MaterialPageRoute(
                            builder: (context) => ViewExpensePage(expense)));
                  },
                );
              },
              itemCount: expenses.length,
            ),
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

// Generate a receipt for the current trip, which includes all members and expenses up to this point
// TODO: Need to determine how to lay this out and complete the calculations
class ReceiptPage extends StatefulWidget {
  @override
  State<ReceiptPage> createState() => _ReceiptPage();
}

class _ReceiptPage extends State<ReceiptPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Generating A Receipt"),
      ),
    );
  }
}
*/
