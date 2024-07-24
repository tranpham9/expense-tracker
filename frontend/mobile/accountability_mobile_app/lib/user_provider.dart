import 'package:flutter/material.dart';
import 'models/User.dart';

class UserProvider extends ChangeNotifier {
  User? _user;

  User? get user => _user;

  void setUser(User newUser) {
    _user = newUser;
    notifyListeners();
  }

  void updateName(String name) {
    if (_user != null) {
      _user!.name = name;
      notifyListeners();
    }
  }

  void updateEmail(String email) {
    if (_user != null) {
      _user!.email = email;
      notifyListeners();
    }
  }

  void updateBio(String bio) {
    if (_user != null) {
      _user!.bio = bio;
      notifyListeners();
    }
  }
}
