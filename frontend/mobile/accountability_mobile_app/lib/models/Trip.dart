// To parse this JSON data, do
//
//     final trip = tripFromJson(jsonString);

import 'dart:convert';
import 'Id.dart';

List<Trip> tripListFromJson(String str) =>
    List<Trip>.from(json.decode(str).map((x) => Trip.fromJson(x)));

Trip tripFromJson(String str) => Trip.fromJson(json.decode(str));

String tripToJson(Trip data) => json.encode(data.toJson());

class Trip {
  Id id;
  String name;
  String notes;

  Trip({
    required this.id,
    required this.name,
    required this.notes,
  });

  factory Trip.fromJson(Map<String, dynamic> json) => Trip(
        id: Id.fromJson(json["_id"]),
        name: json["name"],
        notes: json["notes"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id.toJson(),
        "name": name,
        "notes": notes,
      };
}
