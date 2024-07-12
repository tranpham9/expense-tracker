// NOTE: Really only used to see what layout looks like, NOT FOR PROD
// Data Models for Trips and Expenses
class Expense {
  // Instance variables for an expense
  String id;
  String name;
  String tripId;
  double cost;
  String description;
  List<String> membersIds;
  String payerId;
  // Constructor for an expense
  Expense(
      {required this.id,
      required this.name,
      required this.tripId,
      required this.cost,
      required this.description,
      required this.membersIds,
      required this.payerId});
}

class Trip {
  // Instance variables for a trip
  String id;
  String name;
  String notes;
  List<String> membersIds;
  String leaderId;
  // Constructor for a Trip
  Trip(
      {required this.id,
      required this.name,
      required this.notes,
      required this.membersIds,
      required this.leaderId,
      required});
}

class User {
  // Instance variables for a user
  String id;
  String name;
  String email;
  List<String> trips;
  // Constructor for a User
  User(
      {required this.id,
      required this.name,
      required this.email,
      required this.trips});
}
