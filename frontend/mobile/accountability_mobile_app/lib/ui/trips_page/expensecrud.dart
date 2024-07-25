import 'package:accountability_mobile_app/utility/helpers.dart';
import 'package:intl/intl.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../../api/expense_crud.dart';
import '../../globals.dart';
import '../../models/Expense.dart';
import '../../models/User.dart';
import 'package:flutter/services.dart';

// TODO: Need to decide how we want to implement the edit functionality here...
class ViewExpensePage extends StatefulWidget {
  final Expense expense;
  final List<User> allMembers;
  const ViewExpensePage(this.expense, this.allMembers);

  @override
  State<ViewExpensePage> createState() => _ViewExpensePage();
}

class _ViewExpensePage extends State<ViewExpensePage> {
  late Map<User?, bool?> expenseMembers;
  late User payer;
  bool inExpense = false;
  final oCcy = new NumberFormat("#,##0.00", "en_US");

  @override
  void initState() {
    super.initState();
    initializeData();
  }

  void initializeData() {
    if (widget.expense.payerId == Globals.user?.userId) {
      payer = Globals.user!;
    } else {
      payer = widget.allMembers
          .firstWhere((member) => member.userId == widget.expense.payerId);
      widget.allMembers.add(Globals.user!);
      if (widget.expense.memberIds.contains(Globals.user?.userId)) {
        inExpense = true;
      }
    }
    expenseMembers = {
      for (var user in widget.allMembers)
        if (user.userId != widget.expense.payerId)
          user: widget.expense.memberIds.contains(user.userId)
    };

    Map<String, bool> expenseMembersWithNames = {
      for (var entry in expenseMembers.entries) entry.key!.name: entry.value!
    };
    print(
        "The Trip ${widget.expense.name}, payer ${payer.name}:\n $expenseMembersWithNames\n");
  }

  String determinePayment(int membersLen, double? cost) {
    return "\$${oCcy.format(cost! / (membersLen + 1))}";
  }

  void updateExpense() {
    setState(() {
      widget.expense.memberIds = expenseMembers.entries
          .where((entry) => entry.value!)
          .map((entry) => entry.key!.userId!)
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.expense.name),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
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
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EditExpenseNameNotesPage(
                          widget.expense,
                        ),
                      ),
                    ).then((updated) {
                      if (updated == true) {
                        setState(() {});
                      }
                    });
                  },
                  child: Icon(Icons.edit),
                )
              ],
            ),
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
                    ).then((updated) {
                      if (updated == true) {
                        setState(() {});
                      }
                    });
                  },
                  child: Icon(Icons.attach_money),
                )
              ],
            ),
            ListTile(
              title: Text(
                "${payer.name}",
              ),
              subtitle: Text("Who paid this expense?"),
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
                            title: Text(user!.name),
                            value: expenseMembers.values.elementAt(index),
                            tristate: false,
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
            Container(
              height: 50,
              width: double.infinity,
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
                  await ExpenseCRUD.update(
                          widget.expense.id,
                          widget.expense.name,
                          widget.expense.description,
                          widget.expense.cost,
                          updatedMembers)
                      .then((response) {
                    if (response == true) {
                      setState(() {
                        widget.expense.memberIds = updatedMembers;
                      });
                      Navigator.pop(context);
                    } else {
                      print("There was an Error Updating Expense Members");
                    }
                  });
                },
              ),
            ),
            Center(
              child: ElevatedButton(
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
  final Expense? expense;
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
            if (nameController.text.isEmpty ||
                descriptionController.text.isEmpty) {
              return;
            }

            widget.expense!.name = nameController.text;
            widget.expense!.description = descriptionController.text;
            await ExpenseCRUD.update(
                    widget.expense!.id,
                    widget.expense!.name,
                    widget.expense!.description,
                    widget.expense!.cost,
                    widget.expense!.memberIds)
                .then((response) {
              if (response == true) {
                Navigator.pop(context, true);
              } else {
                print("Error editing name or description");
              }
            });
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
  final Expense? expense;
  const EditExpenseCost(this.expense);

  @override
  State<EditExpenseCost> createState() => _EditExpenseCost();
}

class _EditExpenseCost extends State<EditExpenseCost> {
  TextEditingController costController = TextEditingController();
  String? costError;

  @override
  void initState() {
    costController.text = widget.expense!.cost.toString();
  }

  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Edit Cost"),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            controller: costController,
            decoration: InputDecoration(
              labelText: 'Cost',
              errorText: costError,
            ),
            maxLines: null,
            keyboardType: TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [
              FilteringTextInputFormatter.allow(
                RegExp(r'^\d+\.?\d{0,2}'),
              ),
            ],
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
            double? newCost = double.tryParse(costController.text);
            if (newCost == null || newCost <= 0) {
              setState(() {
                costError = 'Invalid cost';
              });
              return;
            }
            widget.expense!.cost = newCost;
            await ExpenseCRUD.update(
                    widget.expense!.id,
                    widget.expense!.name,
                    widget.expense!.description,
                    widget.expense!.cost,
                    widget.expense!.memberIds)
                .then((response) {
              if (response == true) {
                Navigator.pop(context, true);
              } else {
                print("Error editing cost");
              }
            });
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
