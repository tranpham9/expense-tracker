// To parse this JSON data, do
//
//     final user = userFromJson(jsonString);

import 'dart:convert';

User userFromJson(String str) => User.fromJson(json.decode(str));

String userToJson(User data) => json.encode(data.toJson());

class User {
  String id;
  String name;
  String email;
  Token token;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["id"],
        name: json["name"],
        email: json["email"],
        token: Token.fromJson(json["token"]),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "email": email,
        "token": token.toJson(),
      };
}

class Token {
  String accessToken;

  Token({
    required this.accessToken,
  });

  factory Token.fromJson(Map<String, dynamic> json) => Token(
        accessToken: json["accessToken"],
      );

  Map<String, dynamic> toJson() => {
        "accessToken": accessToken,
      };
}
