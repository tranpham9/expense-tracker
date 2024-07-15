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
  String notes;
  int inviteCode;

  Trip(
      {required this.id,
      required this.name,
      required this.notes,
      required this.inviteCode});

  factory Trip.fromJson(Map<String, dynamic> json) => Trip(
      // id: Id.fromJson(json["_id"]),
      id: json["_id"],
      name: json["name"],
      notes: json["notes"],
      inviteCode: json["inviteCode"]);

  Map<String, dynamic> toJson() =>
      {"_id": id, "name": name, "notes": notes, "inviteCode": inviteCode};
}
