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
        throw Exception("Error in Creating a Trip");
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
}
