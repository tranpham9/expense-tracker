// Needed to make API calls
import 'package:http/http.dart' as http;
//
import '../models/User.dart';
import '../models/Id.dart';

class LoginUser {
  static Future<User> login(String email, String password) async {
    // URL's
    const String baseUrl = 'http://localhost:5000/api/login';
    var path = 'api/login';
    // Establish a connection
    var url = Uri.parse(baseUrl);
    // Our request body
    var sendBody = {"email": email, "password": password};
    // Send the request
    var response = await http.post(url, body: sendBody);

    // Look at the response
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    return userFromJson(response as String);
  }
}
