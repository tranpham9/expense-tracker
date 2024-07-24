// To parse this JSON data, do
//
//     final trip = tripFromJson(jsonString);

import 'dart:convert';

List<Trip> tripListFromJson(String str) =>
    List<Trip>.from(json.decode(str).map((x) => Trip.fromJson(x)).toList());

Trip tripFromJson(String str) => Trip.fromJson(json.decode(str));

String tripToJson(Trip data) => json.encode(data.toJson());

class Trip {
  String id;
  String name;
  String description;
  List<String> memberIds;
  String leaderId;
  String inviteCode;

  Trip({
    required this.id,
    required this.name,
    required this.description,
    required this.memberIds,
    required this.leaderId,
    required this.inviteCode,
  });

  factory Trip.fromJson(Map<String, dynamic> json) => Trip(
        id: json["_id"],
        name: json["name"],
        description: json["description"],
        memberIds: List<String>.from(json["memberIds"].map((x) => x)),
        leaderId: json["leaderId"],
        inviteCode: json["inviteCode"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "name": name,
        "description": description,
        "memberIds": List<dynamic>.from(memberIds.map((x) => x)),
        "leaderId": leaderId,
        "inviteCode": inviteCode,
      };
}
