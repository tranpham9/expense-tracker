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
  Ret ret;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.ret,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["id"],
        name: json["name"],
        email: json["email"],
        ret: Ret.fromJson(json["ret"]),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "email": email,
        "ret": ret.toJson(),
      };
}

class Ret {
  String accessToken;

  Ret({
    required this.accessToken,
  });

  factory Ret.fromJson(Map<String, dynamic> json) => Ret(
        accessToken: json["accessToken"],
      );

  Map<String, dynamic> toJson() => {
        "accessToken": accessToken,
      };
}
