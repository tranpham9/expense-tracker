import 'dart:convert';

List<User> userListFromJson(String str) =>
    List<User>.from(json.decode(str).map((x) => User.fromJson(x)).toList());

User userFromJson(String str) => User.fromJson(json.decode(str));

String userToJson(User data) => json.encode(data.toJson());

// Store basic user information
class User {
  String? userId;
  String name;
  String email;
  String? bio;
  bool? isLeader;

  User(
      {required this.userId,
      required this.name,
      required this.email,
      required this.isLeader});

  factory User.fromJson(Map<String, dynamic> json) => User(
      userId: json["userId"],
      name: json["name"],
      email: json["email"],
      isLeader: json["isLeader"]);

  Map<String, dynamic> toJson() =>
      {"userId": userId, "name": name, "email": email, "isLeader": isLeader};
}
