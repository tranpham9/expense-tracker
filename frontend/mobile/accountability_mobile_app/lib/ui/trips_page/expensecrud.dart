import 'package:accountability_mobile_app/utility/helpers.dart';
import 'package:intl/intl.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../../api/expense_crud.dart';
import '../../globals.dart';
import '../../models/Expense.dart';
import '../../models/User.dart';

class ViewExpensePage extends StatefulWidget {
  // Each trip has both a nameController and descriptionController associated with it
  final Expense expense;
  // Pass the list of ALL users in the TRIP (except yourself)
  final List<User> allMembers;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const ViewExpensePage(this.expense, this.allMembers);

  @override
  State<ViewExpensePage> createState() => _ViewExpensePage();
}

// TODO: Need to decide how we want to implement the edit functionality here...
class _ViewExpensePage extends State<ViewExpensePage> {
  // Keep a map of ALL members of the trip (w/o payer) and keep
  // track of who was in the expense to being with
  late Map<User?, bool?> expenseMembers;
  // Will find the payer of the tri
  late User payer;
  // Determine if you are apart of the expense. If so, you owe the payer
  bool inExpense = false;
  // Give us the ability to format the doubles as prices in USD
  final oCcy = new NumberFormat("#,##0.00", "en_US");

  // @override
  void initState() {
    super.initState();
    // You are the payer
    if (widget.expense.payerId == Globals.user?.userId) {
      payer = Globals.user!;
    } else {
      // Identify who paid the expense out of ALL the trip members
      payer = widget.allMembers
          .firstWhere((member) => member.userId == widget.expense.payerId);
      // Since the current user wasn't the payer, we need to add them to the 'allMembers' list before
      // we try and determine if they were in the expense or not
      widget.allMembers.add(Globals.user!);
      // Note that the user WAS apart of the expense
      if (widget.expense.memberIds.contains(Globals.user?.userId)) {
        inExpense = true;
      }
    }
    // Build a map which maps all users (w/o payer) who were either apart of the expense or weren't
    expenseMembers = {
      for (var user in widget.allMembers)
        if (user.userId != widget.expense.payerId)
          user: widget.expense.memberIds.contains(user.userId)
    };

    //TESTING: just print out the map
    // Create a new map with user names as keys
    Map<String, bool> expenseMembersWithNames = {
      for (var entry in expenseMembers.entries) entry.key!.name: entry.value!
    };
    print(
        "The Trip ${widget.expense.name}, payer ${payer.name}:\n $expenseMembersWithNames\n");
  }

  // Given the amount cost and number of people in the expense, divide the cost
  // amongst all of the members of the trip
  String determinePayment(int membersLen, double? cost) {
    return "\$${oCcy.format(cost! / (membersLen + 1))}";
  }

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
            Row(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      ListTile(
                        title: Text(widget.expense.name),
                        subtitle: Text('Name'),
                      ),
                      ListTile(
                        title: Text(widget.expense.description.isEmpty
                            ? '"Empty Description"'
                            : widget.expense.description),
                        subtitle: Text('Description'),
                      )
                    ],
                  ),
                ),
                // Edit Name and Description of the expense
                ElevatedButton(
                    onPressed: () {
                      // Navigate to the name and notes edit page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => EditExpenseNameNotesPage(
                            widget.expense,
                          ),
                        ),
                      );
                    },
                    child: Icon(Icons.edit))
              ],
            ),
            // Display Cost
            Row(
              children: [
                Expanded(
                  child: ListTile(
                    title: Text('\$${oCcy.format(widget.expense.cost)}'),
                    subtitle: Text('Cost'),
                  ),
                ),
                ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => EditExpenseCost(
                            widget.expense,
                          ),
                        ),
                      );
                    },
                    child: Icon(Icons.attach_money))
              ],
            ),
            // Display Payer
            ListTile(
              title: Text(
                "${payer.name}",
              ),
              subtitle: Text("Who paid this expense?"),
              // Display how much you will owe the payer
              trailing: Text(
                style: TextStyle(fontSize: 15),
                inExpense == false
                    ? "You Owe \$0.00"
                    : "You Owe ${determinePayment(widget.expense.memberIds.length, widget.expense.cost)}",
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10),
              child: ListTile(
                leading: Text(
                  "Members",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            // TODO: Display ALL members as check boxes and allow the user to select/deselect to edit this table
            SingleChildScrollView(
              child: expenseMembers.isEmpty
                  ? SizedBox.shrink()
                  : SizedBox(
                      height: 200,
                      child: ListView.builder(
                        itemCount: expenseMembers.length,
                        itemBuilder: (context, index) {
                          User? user = expenseMembers.keys.elementAt(index);
                          return CheckboxListTile(
                            // The member that you want to add
                            title: Text(user!.name),
                            // Were they in the expense originally
                            value: expenseMembers.values.elementAt(index),
                            tristate: false,
                            // Switch the value when you click
                            onChanged: (bool? value) {
                              setState(() {
                                expenseMembers.update(
                                    user, (existingValue) => value!);
                              });
                            },
                            activeColor: Colors.white,
                            checkColor: Theme.of(context).primaryColor,
                          );
                        },
                      ),
                    ),
            ),
            // Confirm Edit (for the user)
            Container(
              height: 50,
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                child: const Text(
                  'Confirm Edit',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () async {
                  List<String>? updatedMembers = [];
                  expenseMembers.forEach((key, value) =>
                      value == true ? updatedMembers.add(key!.userId!) : "");
                  updatedMembers.remove("");
                  // Update the list of members within the trip
                  await ExpenseCRUD.update(
                          widget.expense.id,
                          widget.expense.name,
                          widget.expense.description,
                          widget.expense.cost,
                          updatedMembers)
                      .then((response) {
                    if (response == null) {
                      print("There was an Error Updating Expense Members");
                      return;
                    }
                    // Go back to the last screen
                    Navigator.pop(context);
                  });
                },
              ),
            ),
            Center(
              child: ElevatedButton(
                // Navigate to confirm delete delete
                onPressed: () async {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => DeleteExpenseWidget(
                          expenseId: widget.expense.id,
                          name: widget.expense.name),
                    ),
                  );
                },
                child: Icon(Icons.delete),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EditExpenseNameNotesPage extends StatefulWidget {
  // Pass the expense that you want to change to
  final Expense? expense;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const EditExpenseNameNotesPage(this.expense);

  @override
  State<EditExpenseNameNotesPage> createState() => _EditExpenseNameNotesPage();
}

class _EditExpenseNameNotesPage extends State<EditExpenseNameNotesPage> {
  TextEditingController nameController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();

  @override
  void initState() {
    nameController.text = widget.expense!.name;
    descriptionController.text = widget.expense!.description.isEmpty
        ? '"Empty Description"'
        : widget.expense!.description;
  }

  Widget build(BuildContext context) {
    // Build the page
    return AlertDialog(
      title: Text("Edit Name And Description"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(
              labelText: 'Name',
            ),
          ),
          SizedBox(
            height: 25,
          ),
          TextFormField(
            controller: descriptionController,
            decoration: InputDecoration(
              labelText: 'Description',
            ),
            maxLines: null,
          ),
          SizedBox(height: 20.0),
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
          onPressed: () async {
            widget.expense!.name = nameController.text;
            widget.expense!.description = descriptionController.text;
            // We ONLY send the updated name and description because those are the only things that changed
            await ExpenseCRUD.update(
                    widget.expense!.id,
                    widget.expense!.name,
                    widget.expense!.description,
                    widget.expense!.cost,
                    widget.expense!.memberIds)
                .then((response) {
              if (response == null) {
                print("Error editing Name/Description");
                return;
              }
            });
            // Go back to the last screen
            Navigator.pop(context);
            return;
          },
          child: Text(
            'Save',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ],
    );
  }
}

class EditExpenseCost extends StatefulWidget {
  // Pass the expense that you want to change to
  final Expense? expense;
  // Make sure to pass the nameController and descriptionController of the trip to the function
  const EditExpenseCost(this.expense);

  @override
  State<EditExpenseCost> createState() => _EditExpenseCost();
}

class _EditExpenseCost extends State<EditExpenseCost> {
  TextEditingController costController = TextEditingController();
  String? costError;
  @override
  void initState() {
    // Make sure we display the current cost of the expense
    costController.text = widget.expense!.cost.toString();
    costController.addListener(() {
      setState(() {
        costError = validateText("cost", costController.text);
      });
    });
  }

  Widget build(BuildContext context) {
    // Build the page
    return AlertDialog(
      title: Text("Edit Cost"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            keyboardType: TextInputType.number,
            controller: costController,
            decoration: InputDecoration(
              labelText: 'Cost',
              errorText: costError,
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
          onPressed: () async {
            // Convert the text to a double
            widget.expense!.cost = double.parse(costController.text);
            // We ONLY send the updated name and description because those are the only things that changed
            await ExpenseCRUD.update(
                    widget.expense!.id,
                    widget.expense!.name,
                    widget.expense!.description,
                    widget.expense!.cost,
                    widget.expense!.memberIds)
                .then((response) {
              if (response == null) {
                print("Error editing Name/Description");
                return;
              }
            });
            // Go back to the last screen
            Navigator.pop(context);
            return;
          },
          child: Text(
            'Save',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ],
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
  String? nameError;
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController costController = TextEditingController();
  String? costError;
  late List<bool> isChecked;

  @override
  void initState() {
    super.initState();
    nameController.addListener(() {
      setState(() {
        nameError = validateText("description", nameController.text);
      });
    });
    costController.addListener(() {
      setState(() {
        costError = validateText("cost", costController.text);
      });
    });
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
      body: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: ListView(
                // Have our list of containers that will take in text input
                children: <Widget>[
                  // Enter Name
                  Container(
                    padding: const EdgeInsets.all(10),
                    child: TextField(
                      controller: nameController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Name',
                        errorText: nameError,
                      ),
                    ),
                  ),
                  // Enter Description
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
                  // Enter Cost
                  Container(
                    padding: const EdgeInsets.all(10),
                    child: TextField(
                      keyboardType: TextInputType.number,
                      controller: costController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Cost',
                        errorText: costError,
                      ),
                    ),
                  ),
                  // Add Members to the Expense
                  // TODO: Get this to be in some sort of grid view??
                  SingleChildScrollView(
                    child: isChecked.isEmpty
                        ? SizedBox.shrink()
                        : SizedBox(
                            height: 200,
                            child: ListView.builder(
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
                              },
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
          // Confirm Add Expense
          Container(
            height: 50,
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            child: ElevatedButton(
              onPressed: (disableButton([nameError, costError],
                      [nameController.text, costController.text]))
                  ? null
                  : () async {
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
                              double.parse(
                                      costController.text.replaceAll(',', ''))
                                  .toDouble(),
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
              child: const Text(
                'Add Expense',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class DeleteExpenseWidget extends StatefulWidget {
  final String expenseId;
  final String name;
  // Pass a trip to the widget
  const DeleteExpenseWidget(
      {super.key, required this.expenseId, required this.name});

  @override
  State<DeleteExpenseWidget> createState() => _DeleteExpenseWidget();
}

class _DeleteExpenseWidget extends State<DeleteExpenseWidget> {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Confirm Expense Deletion"),
      content: Text('Are you sure you want to delete "${widget.name}"?'),
      actions: <Widget>[
        TextButton(
          child: const Text('NO'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed: () async {
            // Call the API
            await ExpenseCRUD.delete(widget.expenseId)!.then((response) {
              if (response == null) {
                showOverlay(
                    "There Was an Error Deleting Your Expense.", context);
                return;
              }
              // Go back to the last screen
              Navigator.pop(context);
            });
            // Success! Show success overlay
            showOverlay('Successfully Deleted "${widget.name}"', context);
            Navigator.pop(context);
          },
          child: const Text('YES'),
        ),
      ],
    );
  }
}
