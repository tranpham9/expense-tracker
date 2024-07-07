// To parse this JSON data, do
//
//     final expense = expenseFromJson(jsonString);

import 'dart:convert';
import 'Id.dart';

Expense expenseFromJson(String str) => Expense.fromJson(json.decode(str));

String expenseToJson(Expense data) => json.encode(data.toJson());

class Expense {
  Id id;
  String name;
  Id tripId;
  String cost;
  String description;
  List<Id> memberIds;
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
        id: Id.fromJson(json["_id"]),
        name: json["name"],
        tripId: Id.fromJson(json["tripId"]),
        cost: json["cost"],
        description: json["description"],
        memberIds: List<Id>.from(json["memberIds"].map((x) => Id.fromJson(x))),
        payerId: json["payerId"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id.toJson(),
        "name": name,
        "tripId": tripId.toJson(),
        "cost": cost,
        "description": description,
        "memberIds": List<dynamic>.from(memberIds.map((x) => x.toJson())),
        "payerId": payerId,
      };
}
