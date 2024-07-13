// To parse this JSON data, do
//
//     final expense = expenseFromJson(jsonString);

import 'dart:convert';

Expense expenseFromJson(String str) => Expense.fromJson(json.decode(str));

String expenseToJson(Expense data) => json.encode(data.toJson());

class Expense {
  String id;
  String name;
  String tripId;
  String cost;
  String description;
  List<String> memberIds;
  String payerId;

  Expense({
    required this.id,
    required this.name,
    required this.tripId,
    required this.cost,
    required this.description,
    required this.memberIds,
    required this.payerId,
  });

  factory Expense.fromJson(Map<String, dynamic> json) => Expense(
        id: json["_id"],
        name: json["name"],
        tripId: json["tripId"],
        cost: json["cost"],
        description: json["description"],
        // FIXME: Since Id will now be a String
        memberIds:
            List<String>.from(json["memberIds"].map((x) => String.fromJson(x))),
        payerId: json["payerId"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "tripId": tripId,
        "cost": cost,
        "description": description,
        // FIXME: Id is a string
        "memberIds": List<dynamic>.from(memberIds.map((x) => x.toJson())),
        "payerId": payerId,
      };
}
