// NOTE: I'm not sure if this is the best way.
// Store the current user's information here so it can be accessed in ALL of the widgets
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'models/User.dart';

class Globals {
  // Give us the ability to securely store the jwt
  static final FlutterSecureStorage storage = FlutterSecureStorage();

  // Private static variable to store the current user
  static User? _user;
  // Getter for the user
  static User? get user => _user;
  // Setter for the user
  static set user(User? newUser) {
    _user = newUser;
  }

  // Keep track of the pages that we are looking at as well as the total page count for search
  static int _unpaginatedTripCount = 0;
  static int _totalPage = 0;
  // Getters
  static int get unpaginatedTripCount => _unpaginatedTripCount;
  static int get totalPage => _totalPage;
  // Setters
  static set unpaginatedTripCount(int unpaginatedTripCount) =>
      _unpaginatedTripCount = unpaginatedTripCount;
  static set totalPage(int totalPage) => _totalPage = totalPage;
}
