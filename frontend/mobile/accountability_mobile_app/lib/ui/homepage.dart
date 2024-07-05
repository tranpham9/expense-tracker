// homepage.dart is the main UI for the whole app. It allows the User to navigate to the different CRUD operation pages
import 'package:flutter/material.dart';
import './TripsPages.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePage();
}

class _HomePage extends State<HomePage> {
  // Determine the page that we want to route to
  var selectedIndex = 0;
  // We need a list of the different pages we can go to from the home screen
  final List<Widget> _tabs = [TripsPage(), AddTripsPage(), ProfilePage()];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      // Once the user logs in, they can no longer use the default back button on their system
      onWillPop: () async => false,
      child: Scaffold(
        // Determine which page to display
        body: _tabs[selectedIndex],
        // Place the search bar at the top of the screen
        bottomNavigationBar: BottomNavigationBar(
          // Keep track of the selected tab
          currentIndex: selectedIndex,
          onTap: (int index) {
            setState(() {
              selectedIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.map), label: "Trips"),
            BottomNavigationBarItem(icon: Icon(Icons.add), label: "Add"),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
          ],
        ),
      ),
    );
  }
}
