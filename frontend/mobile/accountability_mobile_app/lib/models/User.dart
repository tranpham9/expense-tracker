// To parse this JSON data, do
//
//     final user = userFromJson(jsonString);

import 'dart:convert';
import 'Id.dart';

User userFromJson(String str) => User.fromJson(json.decode(str));

String userToJson(User data) => json.encode(data.toJson());

class User {
  Id id;
  String name;
  String email;
  String? password;
  List<Id>? trips;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.password,
    this.trips,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: Id.fromJson(json["_id"]),
        name: json["name"],
        email: json["email"],
        password: json["password"],
        trips: List<Id>.from(json["trips"].map((x) => Id.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "_id": id.toJson(),
        "name": name,
        "email": email,
        "password": password,
        "trips": List<dynamic>.from(trips!.map((x) => x.toJson())),
      };
}
