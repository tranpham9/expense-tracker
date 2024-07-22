import 'package:accountability_mobile_app/utility/helpers.dart';
import 'package:flutter/material.dart';
import '../../api/expense_crud.dart';
import '../../models/Expense.dart';
import '../../models/User.dart';

class ViewExpensePage extends StatefulWidget {
  // Each trip has both a nameController and descriptionController associated with it
  final Expense expense;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const ViewExpensePage(this.expense);

  @override
  State<ViewExpensePage> createState() => _ViewExpensePage();
}

// TODO: Need to decide how we want to implement the edit functionality here...
class _ViewExpensePage extends State<ViewExpensePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: Text(widget.expense.name),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Display descriptionController
            Container(
                padding: const EdgeInsets.all(10),
                child: ListTile(
                  leading: Text(
                    "Description",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  trailing: Text(
                    widget.expense.description,
                    style: TextStyle(fontSize: 15),
                  ),
                )),
            // Display costController
            Container(
                padding: const EdgeInsets.all(10),
                child: ListTile(
                  leading: Text(
                    "Cost",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  trailing: Text(
                    "\$${widget.expense.cost?.toDouble()}",
                    style: TextStyle(fontSize: 15),
                  ),
                )),
            // Display Payer
            // might not do this either
            // Container(
            //   padding: const EdgeInsets.all(10),
            //   child: ListTile(
            //     leading: Text(
            //       "Who Payed",
            //       style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            //     ),
            //     trailing: Text(
            //       "${widget.expense.payerId} Payed",
            //       style: TextStyle(fontSize: 15),
            //     ),
            //   ),
            // ),
            Container(
              padding: const EdgeInsets.all(10),
              child: ListTile(
                leading: Text(
                  "Members",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            // Display Members (might not do this)
            // Expanded(
            //   // Build a list of all of the members in the trip
            //   child: ListView.builder(
            //     itemBuilder: (context, index) {
            //       String member = widget.expense.membersIds[index];
            //       return ListTile(
            //         title: Text(
            //           member,
            //           style: TextStyle(fontSize: 15),
            //         ),
            //       );
            //     },
            //     itemCount: widget.expense.membersIds.length,
            //   ),
            // ),
            // Confirm Edit
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                child: const Text(
                  'Confirm Edit',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () {
                  // TODO: Call API to update the trip details.
                  // Again, this will depend on HOW we decide the edit function will work

                  // Go back to the last screen
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// TODO: Implement a check box sort of system to determine who was apart of the expense
// It is assumed that the person creating the expense is the payer
class AddExpensePage extends StatefulWidget {
  // Pass the member we want to look at
  final String tripId;
  // Our list of members (User objects)
  final List<User> members;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const AddExpensePage(this.tripId, this.members);

  @override
  State<AddExpensePage> createState() => _AddExpensePageState();
}

class _AddExpensePageState extends State<AddExpensePage> {
  // Grab text that will be entered by the user
  final TextEditingController nameController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController costController = TextEditingController();
  late List<bool> isChecked;

  @override
  void initState() {
    super.initState();
    isChecked = List.generate(widget.members.length, (index) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Display the title at the top of the screen
      appBar: AppBar(
        title: const Text("Add an Expense"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: ListView(
          // Have our list of containers that will take in text input
          children: <Widget>[
            // Enter nameController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Name',
                ),
              ),
            ),
            // Enter descriptionController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Description',
                ),
              ),
            ),
            // Enter costController
            Container(
              padding: const EdgeInsets.all(10),
              child: TextField(
                controller: costController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Cost',
                ),
              ),
            ),
            // Add Members to the Expense
            // TODO: Get this to be in some sort of grid view??
            SingleChildScrollView(
              child: SizedBox(
                height: 200,
                // Ensure we don't display if there aren't any members
                child: isChecked.isEmpty
                    ? null
                    : ListView.builder(
                        itemCount: widget.members.length,
                        itemBuilder: (context, index) {
                          return CheckboxListTile(
                            // The member that you want to add
                            title: Text(widget.members[index].name),
                            value: isChecked[index],
                            tristate: false,
                            // Switch the value when you click
                            onChanged: (bool? value) {
                              setState(() {
                                isChecked[index] = value!;
                              });
                            },
                            activeColor: Colors.white,
                            checkColor: Theme.of(context).primaryColor,
                          );
                        }),
              ),
            ),
            // Confirm Add Expense
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                child: const Text(
                  'Add Expense',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () async {
                  List<String> addMembers = [];
                  // Only add members if they are checked
                  for (int i = 0; i < isChecked.length; i++) {
                    if (isChecked[i]) {
                      addMembers.add(widget.members[i].userId!);
                      print('Adding ${widget.members[i].name}\n');
                    }
                  }
                  // Go through and collect the memberIds of the selected checkboxes
                  await ExpenseCRUD.create(
                          widget.tripId,
                          nameController.text,
                          descriptionController.text,
                          double.parse(costController.text).toDouble(),
                          addMembers)
                      .then((response) {
                    if (response == null) {
                      print("There was an error");
                      showOverlay(
                          "There Was an Error Create Expense. Try Again.",
                          context);
                      return;
                    }
                    // Go back to the last screen
                    Navigator.pop(context);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
