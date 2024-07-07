// To parse this JSON data, do
//
//     final trip = tripFromJson(jsonString);

import 'dart:convert';
import 'Id.dart';

Trip tripFromJson(String str) => Trip.fromJson(json.decode(str));

String tripToJson(Trip data) => json.encode(data.toJson());

class Trip {
  Id id;
  String name;
  String notes;
  List<Id> memberIds;
  Id leaderId;

  Trip({
    required this.id,
    required this.name,
    required this.notes,
    required this.memberIds,
    required this.leaderId,
  });

  factory Trip.fromJson(Map<String, dynamic> json) => Trip(
        id: Id.fromJson(json["_id"]),
        name: json["name"],
        notes: json["notes"],
        memberIds: List<Id>.from(json["memberIds"].map((x) => Id.fromJson(x))),
        leaderId: Id.fromJson(json["leaderId"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id.toJson(),
        "name": name,
        "notes": notes,
        "memberIds": List<dynamic>.from(memberIds.map((x) => x.toJson())),
        "leaderId": leaderId.toJson(),
      };
}
