// Needed to make API calls
import 'dart:convert';

import 'package:accountability_mobile_app/api/config.dart';
import 'package:http/http.dart' as http;
import '../models/User.dart';
import '../models/Id.dart';

class LoginUser {
  static Future<User> login(String email, String password) async {
    // Establish a connection
    var url = Uri.parse(Config.localApiURL + Config.loginAPI);
    // Our request body
    var sendBody = {"email": email, "password": password};
    // Send the request
    var response = await http.post(url, body: json.encode(sendBody));

    // Look at the response
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    return userFromJson(response as String);
  }
}
