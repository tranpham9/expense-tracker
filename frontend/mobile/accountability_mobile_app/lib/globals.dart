// globals.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'models/User.dart';

class Globals {
  static final FlutterSecureStorage storage = FlutterSecureStorage();

  static final ValueNotifier<User?> _userNotifier = ValueNotifier<User?>(null);

  static User? get user => _userNotifier.value;

  static set user(User? newUser) {
    _userNotifier.value = newUser;
  }

  static ValueNotifier<User?> get userNotifier => _userNotifier;

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


