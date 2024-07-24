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
  final TextEditingController _searchQuery = TextEditingController();
  late List<Trip> trips;
  int page = 1;

  @override
  void initState() {
    super.initState();
    _search();
  }

  void _search() async {
    print("searching with page number $page");
    List<Trip>? searchTrips =
        await TripCRUD.search(page, _searchQuery.text) ?? [];
    setState(() {
      trips = searchTrips;
    });
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
                  onPressed: () async {
                    _search();
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
              ),
            ),
            // Display Pagination controls
            ButtonBar(
              children: [
                // Page back
                TextButton(
                  onPressed: () {
                    if (page > 1) {
                      setState(() {
                        page--;
                        _search();
                      });
                    }
                  },
                  child: Icon(Icons.arrow_back_ios),
                ),
                // Page forward
                TextButton(
                  onPressed: () {
                    if (page < Globals.totalPage) {
                      setState(() {
                        page++;
                        _search();
                      });
                    }
                  },
                  child: Icon(Icons.arrow_forward_ios),
                ),
              ],
            ),
            Expanded(
              child: FutureBuilder<List<Trip>?>(
                future: TripCRUD.search(page, _searchQuery.text),
                builder: (context, snapshot) {
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
                    trips = snapshot.data!;
                    return ListView.builder(
                      itemBuilder: (context, index) => ListTile(
                        title: Text(trips[index].name),
                        subtitle: Text(trips[index].description),
                        trailing: Icon(
                          trips[index].leaderId == Globals.user?.userId
                              ? Icons.star
                              : Icons.group,
                        ),
                        onTap: () async {
                          final result = await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ViewTripPage(trip: trips[index]),
                            ),
                          );
                          if (result == true) {
                            _search();
                          }
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

// Skeleton for the shape a trip bar
class TripsSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Container(
          height: 16, width: 100, color: Colors.black.withOpacity(.04)),
      subtitle: Container(
        height: 14,
        width: 200,
        color: Colors.black.withOpacity(.04),
      ),
      trailing: Container(
        height: 25,
        width: 25,
        color: Colors.black.withOpacity(.04),
      ),
      onTap: () {},
    );
  }
}
