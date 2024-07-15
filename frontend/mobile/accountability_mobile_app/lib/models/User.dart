// To parse this JSON data, do
//
//     final user = userFromJson(jsonString);

import 'dart:convert';

User userFromJson(String str) => User.fromJson(json.decode(str));

String userToJson(User data) => json.encode(data.toJson());

class User {
  String name;
  String email;
  String jwt;

  User({
    required this.name,
    required this.email,
    required this.jwt,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        name: json["name"],
        email: json["email"],
        jwt: json["jwt"],
      );

  Map<String, dynamic> toJson() => {
        "name": name,
        "email": email,
        "jwt": jwt,
      };
}
