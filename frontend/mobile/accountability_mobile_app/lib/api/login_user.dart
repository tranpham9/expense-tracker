import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';
import '../models/User.dart';

class LoginUser {
  static Future<User?> login(String email, String password) async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      // Call the API
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.loginAPI}',
          data: jsonEncode(
              <String, String>{'email': email, 'password': password}));
      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Log User in");
      }

      // Return the user information back
      return userFromJson(jsonEncode(response.data));
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }
}
