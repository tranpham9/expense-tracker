// profilepage.dart
import 'package:accountability_mobile_app/api/user_crud.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:flutter/material.dart';
import '../../utility/helpers.dart';
import '../../models/User.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: ValueListenableBuilder<User?>(
          valueListenable: Globals.userNotifier,
          builder: (context, user, _) {
            return Text("${user?.name}'s Profile");
          },
        ),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          Expanded(
            child: Column(
              children: [
                // Name
                ValueListenableBuilder<User?>(
                  valueListenable: Globals.userNotifier,
                  builder: (context, user, _) {
                    return ListTile(
                      title: Text("${user?.name}"),
                      subtitle: Text("Name"),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => EditProfile(
                                    credType: "name",
                                    intiCred: user?.name,
                                  ),
                                ),
                              );
                            },
                            child: Icon(Icons.edit),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                // Bio
                ValueListenableBuilder<User?>(
                  valueListenable: Globals.userNotifier,
                  builder: (context, user, _) {
                    return ListTile(
                      title: Text("${user?.bio ?? "'Empty Bio'"}"),
                      subtitle: Text("Bio"),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => EditProfile(
                                    credType: "bio",
                                    intiCred: user?.bio ?? "",
                                  ),
                                ),
                              );
                            },
                            child: Icon(Icons.edit),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                // Email
                ValueListenableBuilder<User?>(
                  valueListenable: Globals.userNotifier,
                  builder: (context, user, _) {
                    return ListTile(
                      title: Text("${user?.email}"),
                      subtitle: Text("Email"),
                    );
                  },
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

  const EditProfile({super.key, required this.credType, required this.intiCred});

  @override
  State<EditProfile> createState() => _EditProfile();
}

class _EditProfile extends State<EditProfile> {
  final TextEditingController credentialController = TextEditingController();
  String? credentialError = null;

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
      credentialError = validateText(widget.credType, credentialController.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,  // Set the theme color
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
          onPressed: disableButton([credentialError], [credentialController.text])
              ? null
              : () {
                  update(credentialController.text, widget.credType)
                      .then((response) {
                    if (response == null) {
                      setState(() {
                        credentialError = "There Was An Error Updating Your ${capitalize(widget.credType)}";
                      });
                      return;
                    }
                    if (widget.credType == 'email') {
                      Globals.user?.email = credentialController.text;
                    } else if (widget.credType == 'name') {
                      Globals.user?.name = credentialController.text;
                    } else if (widget.credType == 'bio') {
                      Globals.user?.bio = credentialController.text;
                    }
                    Globals.userNotifier.notifyListeners();
                    Navigator.pop(context);
                  });
                },
          child: Text('Change ${capitalize(widget.credType)}'),
        ),
      ],
    );
  }
}
