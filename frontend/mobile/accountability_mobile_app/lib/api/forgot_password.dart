import 'dart:convert';
import 'package:dio/dio.dart';
import 'config.dart';

class ForgotPassword {
  static Future<int?> forgotPassword(String email) async {
    final Dio dio = new Dio();
    Response? response;

    try {
      // Call the API
      response = await dio.post(
        '${Config.remoteApiURL}${Config.forgotPasswordAPI}',
        data: jsonEncode(<String, String>{
          "email": email,
        }),
      );

      // If the response isn't 200, set the status code to the error
      if (response.statusCode != 200) {
        throw Exception("Failed to Register User");
      }

      // Response was successful
      return response.statusCode;
    } catch (e) {
      print("Error $e");
      return response?.statusCode;
    }
  }
}
