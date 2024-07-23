import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';
import '../globals.dart';
import '../models/User.dart';
import '../models/UserManager.dart';
import 'user_crud.dart';

class LoginUser {
  static Future<int?> login(String email, String password) async {
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
      // Store the user object
      Globals.user = userFromJson(jsonEncode(response.data));
      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Grab the bio too (change maybe at some point)
      Globals.user!.bio = await UserCRUD.getBio(Globals.user!.userId);

      // Successful login
      return 200;
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }
}
