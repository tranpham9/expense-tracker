// To parse this JSON data, do
//
//     final expense = expenseFromJson(jsonString);

import 'dart:convert';

List<Expense> expenseListFromJson(String str) => List<Expense>.from(
    json.decode(str).map((x) => Expense.fromJson(x)).toList());

Expense expenseFromJson(String str) => Expense.fromJson(json.decode(str));

String expenseToJson(Expense data) => json.encode(data.toJson());

class Expense {
  String id;
  String name;
  String description;
  String? tripId;
  double? cost;

  Expense({
    required this.id,
    required this.name,
    required this.tripId,
    required this.cost,
    required this.description,
  });

  factory Expense.fromJson(Map<String, dynamic> json) => Expense(
        id: json["_id"],
        name: json["name"],
        tripId: json["tripId"],
        cost: json["cost"],
        description: json["description"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "tripId": tripId,
        "cost": cost,
        "description": description,
      };
}
