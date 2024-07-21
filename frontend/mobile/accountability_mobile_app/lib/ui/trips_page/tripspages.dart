// Show all of the trips you are a part of in a list format
import 'package:accountability_mobile_app/api/trip_crud.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';
import '../../models/Trip.dart';
import 'viewtrippage.dart';

// Trip Related Widgets
class TripsPage extends StatefulWidget {
  @override
  State<TripsPage> createState() => _TripsPageState();
}

class _TripsPageState extends State<TripsPage> {
  // Grab the search field when we want to search
  final TextEditingController _searchQuery = TextEditingController();

  // Get a list of trips a user is apart of
  Future<List<Trip>?> getTrips(int page, String query) async {
    return await TripCRUD.getTrips(page, query);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${Globals.user?.name}'s Trips"),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          children: [
            // Search Bar
            TextField(
              controller: _searchQuery,
              decoration: InputDecoration(
                hintText: 'Search...',
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () => _searchQuery.clear(),
                ),
                prefixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    // TODO: Perform a search and filter the matches to the top
                    // Call api to return a list of trips that match the search and redraw them to the screen
                    print(_searchQuery.text);
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
              ),
            ),
            Expanded(
              child: FutureBuilder<List<Trip>?>(
                future: getTrips(0, ""),
                builder: (context, snapshot) {
                  // Display the loading skeleton for the trips
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Skeletonizer(
                      child: ListView.builder(
                        itemCount: 10,
                        itemBuilder: (context, index) {
                          return TripsSkeleton();
                        },
                      ),
                    );
                  } else if (snapshot.hasData) {
                    List<Trip> trips = snapshot.data!;
                    return ListView.builder(
                      itemBuilder: (context, index) => ListTile(
                        title: Text(trips[index].name),
                        subtitle: Text(trips[index].description),
                        trailing: Icon(
                            trips[index].leaderId == Globals.user?.userId
                                ? Icons.star
                                : Icons.group),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    ViewTripPage(trip: trips[index])),
                          );
                        },
                      ),
                      itemCount: trips.length,
                    );
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text("Error loading trips"),
                    );
                  }
                  return Center(
                    child: Text("No trips found"),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TripsSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        title: Container(
          height: 16,
          width: 100,
          color: Colors.black.withOpacity(.04),
        ),
        subtitle: Container(
          height: 14,
          width: 200,
          color: Colors.black.withOpacity(.04),
        ),
      ),
    );
  }
}

// Generate a receipt for the current trip, which includes all members and expenses up to this point
// TODO: Need to determine how to lay this out and complete the calculations
class ReceiptPage extends StatefulWidget {
  final Trip trip;
  // Pass a trip to the widget
  const ReceiptPage({super.key, required this.trip});

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
