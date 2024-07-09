// Needed to make API calls
import 'dart:convert';

import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;

class RegisterUser {
  static void register(String name, String email, String password) async {
    final Dio dio = new Dio();

    try {
      var response = await dio.post(
          '${Config.remoteApiURL}${Config.registerAPI}',
          data: jsonEncode(<String, String>{
            "name": name,
            "email": email,
            "password": password
          }),
          options: Options(
            contentType: Headers.jsonContentType,
            responseType: ResponseType.json,
          ));

      if (response.statusCode != 200) {
        throw Exception("Failed to Register User");
      }

      print(response.statusCode);
      return;
    } catch (e) {
      print("Error $e");
    }
  }
}
