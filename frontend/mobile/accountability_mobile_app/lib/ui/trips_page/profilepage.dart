// TODO:Need to fix updating the global user in real time. Also fix the weird pop up to white
import 'package:accountability_mobile_app/api/user_crud.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:flutter/material.dart';
import '../../utility/helpers.dart';
import 'package:flutter/cupertino.dart';

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
                // Name
                ListTile(
                  title: Text("${Globals.user?.name}"),
                  subtitle: Text("Name"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ElevatedButton(
                          onPressed: () {
                            // Navigate to the edit name pop up
                            Navigator.push(
                                context,
                                // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                                MaterialPageRoute(
                                    builder: (context) => EditProfile(
                                          credType: "name",
                                          intiCred: Globals.user?.name,
                                        )));
                          },
                          child: Icon(Icons.edit)),
                    ],
                  ),
                ),
                // Bio
                ListTile(
                  title: Text("${Globals.user?.bio ?? "'Empty Bio'"}"),
                  subtitle: Text("Bio"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ElevatedButton(
                          onPressed: () {
                            // Navigate to the edit name pop up
                            Navigator.push(
                                context,
                                // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                                MaterialPageRoute(
                                    builder: (context) => EditProfile(
                                        credType: "bio",
                                        intiCred: Globals.user!.bio ?? "")));
                          },
                          child: Icon(Icons.edit)),
                    ],
                  ),
                ),
                // Email
                ListTile(
                  title: Text("${Globals.user?.email}"),
                  subtitle: Text("Email"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ElevatedButton(
                          onPressed: () {
                            // Navigate to the edit name pop up
                            Navigator.push(
                                context,
                                // Once you click on a Trip, navigate to 'ViewTripPage' to display all of the information
                                MaterialPageRoute(
                                    builder: (context) => EditProfile(
                                          credType: "email",
                                          intiCred: Globals.user?.email,
                                        )));
                          },
                          child: Icon(Icons.edit)),
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
              child: const Text(
                'Logout',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
            ),
          ),
        ],
      ),
    );
  }
}

class EditProfile extends StatefulWidget {
  final String credType;
  final String? intiCred;

  const EditProfile(
      {super.key, required this.credType, required this.intiCred});

  @override
  State<EditProfile> createState() => _EditProfile();
}

class _EditProfile extends State<EditProfile> {
  final TextEditingController credentialController = TextEditingController();
  String? credentialError = null;

  // Update the user's information
  static Future<int?> update(String? text, String type) async {
    return await UserCRUD.update(text, type);
  }

  @override
  void initState() {
    super.initState();
    credentialController.text = widget.intiCred ?? '';
    credentialController.addListener(validateCred);
  }

  void validateCred() {
    setState(() {
      credentialError =
          validateText(widget.credType, credentialController.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Change Your ${widget.credType}"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextField(
            controller: credentialController,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Your ${capitalize(widget.credType)}',
              errorText: credentialError,
            ),
          ),
        ],
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed:
              disableButton([credentialError], [credentialController.text])
                  ? null
                  : () {
                      update(credentialController.text, widget.credType)
                          .then((response) {
                        if (response == null) {
                          // TODO: Show there was an error
                          setState(() {
                            credentialError =
                                "There Was An Error Updating Your ${capitalize(widget.credType)}";
                          });
                          return;
                        }
                        // Update the user's credentials within the app
                        if (widget.credType == 'email') {
                          Globals.user?.email = credentialController.text;
                        } else if (widget.credType == 'name') {
                          Globals.user?.name = credentialController.text;
                        } else if (widget.credType == 'bio') {
                          Globals.user?.bio = credentialController.text;
                        }
                        // Go back to the last screen
                        Navigator.pop(context);
                      });
                    },
          child: Text('Change ${capitalize(widget.credType)}'),
        ),
      ],
    );
  }
}
