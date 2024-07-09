// Needed to make API calls
import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:http/http.dart' as http;
import 'package:dio/dio.dart';
import '../models/User.dart';

class LoginUser {
  static Future<User?> login(String email, String password) async {
    // // Establish a connection
    // var url = Uri.http(Config.localApiURL, Config.loginAPI);
    // // Our request body
    // var sendBody = {email: email, password: password};

    // Send the request
    //   try {
    //     // Construct the URI
    //     var url = Uri.parse('${Config.remoteApiURL}${Config.loginAPI}');

    //     // Send the request
    //     var response = await http.post(
    //       url,
    //       headers: {"Content-Type": "application/json; charset=UTF-8"},
    //       body:
    //           jsonEncode(<String, String>{'email': email, 'password': password}),
    //     );

    //     if (response.statusCode == 200) {
    //       // Look at the response
    //       print('Response status: ${response.statusCode}');
    //       print('Response body: ${response.body}');

    //       return User.fromJson(jsonDecode(response.body));
    //     } else {
    //       throw Exception("Failed to Log user in");
    //     }
    //   } catch (e) {
    //     throw Exception('Error: $e');
    //   }
    // }

    final Dio dio = new Dio();

    try {
      var response = await dio.post('${Config.remoteApiURL}/login',
          data: jsonEncode(
              <String, String>{'email': email, 'password': password}));
      print("${response.statusCode} and ${response.data}");

      if (response.statusCode != 200) {
        throw Exception("Failed to log user in");
      }
      // Return a user
      return userFromJson(response.data);
    } on DioException catch (e) {
      print('Error: $e');
    }
  }
}
