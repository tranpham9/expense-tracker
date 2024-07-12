import 'dart:convert';

import 'package:accountability_mobile_app/api/config.dart';
import 'package:dio/dio.dart';
import '../models/models.dart';

class TripCRUD {
  // Fetch a list of trips the user is in
  static Future<List<Trip>?> getTrips(String userId) async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.getTripsAPI}',
          data: jsonEncode(<String, String>{'userId': userId}));
      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Fetch Trips");
      }
      // Stringify the data
      String trips = jsonEncode(response.data);
      return null;
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }
}
