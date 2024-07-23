// Allow the user to change their personal information

import 'dart:convert';

import 'package:dio/dio.dart';

import '../models/UserManager.dart';
import 'config.dart';

class UserCRUD {
  // Update the users information
  // Determine which credential you are updating by using 'type'
  static Future<int?> update(String? text, String type) async {
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.updateUserAPI}',
              data: jsonEncode(<String, String?>{
                'jwt': await UserManager.getJwt(),
                '$type': text,
              }));

      if (response.statusCode != 200) {
        throw Exception("Error in Updating User");
      }

      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Successful edit
      return 200;
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }

  static Future<String?> getBio(String? userId) async {
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.getUserAPI}',
              data: jsonEncode(<String, String?>{
                'jwt': await UserManager.getJwt(),
                'userId': userId,
              }));

      if (response.statusCode != 200) {
        throw Exception("Error in Updating User");
      }

      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Successful edit
      return response.data['bio'];
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }
}
