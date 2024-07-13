// TODO: Call API here? To fill in the data about the user
import 'package:accountability_mobile_app/globals.dart';
import 'package:flutter/material.dart';

// Profile Page Widget
class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: Text("${Globals.user?.name}'s Profile"),
        centerTitle: true,
        // We don't need a back button to go to some main page
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          Expanded(
            child: Column(
              children: [
                // TODO: Maybe have the ability to change the user name?? (OPTIONAL)
                ListTile(
                  title: Text("${Globals.user?.name}"),
                  subtitle: Text("Name"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ElevatedButton(
                          onPressed: () {
                            // Navigate to the name and notes edit page
                            // Navigator.push(
                            //     context,
                            //     // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                            //     MaterialPageRoute(
                            //         builder: (context) =>
                            //             ));
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
                  title: Text("${Globals.user?.email}"),
                  subtitle: Text("Email"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ElevatedButton(
                          onPressed: () {
                            // Navigate to the name and notes edit page
                            // Navigator.push(
                            //     context,
                            //     // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                            //     MaterialPageRoute(
                            //         builder: (context) =>
                            //             ));
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
              ],
            ),
          ),
          Container(
            height: 50,
            width: 400,
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
              ),
              child: const Text(
                'Logout',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () {
                // TODO: Log the user out
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
            ),
          ),
        ],
      ),
    );
  }
}
