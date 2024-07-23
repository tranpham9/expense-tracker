// To parse this JSON data, do
//
//     final expense = expenseFromJson(jsonString);

import 'dart:convert';

//
List<Expense> expenseListFromJson(String str) => List<Expense>.from(
    json.decode(str).map((x) => Expense.fromJson(x)).toList());
// CONSIDER: Adding a field call "mode" that determines whether you read in 'memberIds' or not
Expense expenseFromJson(String str) => Expense.fromJson(json.decode(str));

String expenseToJson(Expense data) => json.encode(data.toJson());

class Expense {
  String id;
  String name;
  String description;
  String? tripId;
  double? cost;
  List<String> memberIds;

  Expense(
      {required this.id,
      required this.name,
      required this.tripId,
      required this.cost,
      required this.description,
      required this.memberIds});

  factory Expense.fromJson(Map<dynamic, dynamic> json) => Expense(
      id: json["_id"],
      name: json["name"],
      tripId: json["tripId"],
      cost: double.parse(json["cost"].toString()),
      description: json["description"],
      memberIds: json["memberIds"] != null
          ? List<String>.from(json["memberIds"])
          : []);

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "tripId": tripId,
        "cost": cost,
        "description": description,
      };
}
