// Needed to make API calls
import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';

class RegisterUser {
  static Future<int?> register(
      String name, String email, String password) async {
    final Dio dio = new Dio();
    int? statusCode = 0;
    // Attempt to register with the info
    try {
      Response response = await dio.post(
        '${Config.remoteApiURL}${Config.registerAPI}',
        data: jsonEncode(<String, String>{
          "name": name,
          "email": email,
          "password": password
        }),
      );
      // Display the response code and body
      print(
          "Response Code = ${response.statusCode}\nResponse Data:\n${response.data}");
      // If the response isn't 200, set the status code to the error
      if (response.statusCode != 200) {
        statusCode = response.statusCode;
        throw Exception("Failed to Register User");
      }
      // response was successful
      statusCode = 200;
      return statusCode;
    } catch (e) {
      print("Error $e");
      return statusCode;
    }
  }
}
