// Needed to make API calls
import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';
import '../models/User.dart';

class LoginUser {
  static Future<User?> login(String email, String password) async {
    // Create a connection client
    final Dio dio = new Dio();
    // Send a request to the API
    try {
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.loginAPI}',
          data: jsonEncode(
              <String, String>{'email': email, 'password': password}));
      // Just see what was returned
      print(
          "Response Code = ${response.statusCode}\nResponse Data:\n${response.data}");
      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Log User in");
      }

      // _JsonMap is returned and needs to be converted to map
      print(
          "\nWhat is the type of response? ${Map.from(response.data).runtimeType}");
      // Return a user TODO: This is causing an error
      String jsonMap = jsonEncode(response.data);
      // Try to de-string-ify manually and plug the values in
      // "TypeError: Instance of '_JsonMap': type '_JsonMap' is not a subtype of type 'String'"
      return userFromJson(jsonMap);
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }
}
