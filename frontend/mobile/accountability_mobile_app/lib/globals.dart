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
}
