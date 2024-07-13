// Needed to make API calls
import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';

class RegisterUser {
  static Future<int?> register(
      String name, String email, String password) async {
    // Create a connection client
    final Dio dio = new Dio();
    Response? response;
    try {
      // Call the API
      response = await dio.post(
        '${Config.remoteApiURL}${Config.registerAPI}',
        data: jsonEncode(<String, String>{
          "name": name,
          "email": email,
          "password": password
        }),
      );

      // If the response isn't 200, set the status code to the error
      if (response.statusCode != 200) {
        throw Exception("Failed to Register User");
      }

      // Response was successful
      return response.statusCode;
    } on DioException catch (e) {
      // Either malformed request or email is already taken
      print("Error $e");
      if (e.response?.statusCode == 401) return 401;
    } catch (e) {
      print("Error $e");
      return response?.statusCode;
    }
  }
}
