import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:dio/dio.dart';
import '../models/Trip.dart';

class TripCRUD {
  // Fetch a list of trips the user is in
  static Future<List<Trip>?> getTrips() async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      // Call the API
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.getTripsAPI}',
          data: jsonEncode(
              <String, String?>{'jwt': await Globals.storage.read(key: 'jwt')}),
          options: Options(responseType: ResponseType.plain));

      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Fetch Trips");
      }
      // Keep track of a list of trips that user is apart of
      List<Trip> tripList = tripListFromJson(response.data);

      // Get another response
      response = await dio.post(
          '${Config.remoteApiURL}${Config.getTripsOwnedAPI}',
          data: jsonEncode(
              <String, String?>{'jwt': await Globals.storage.read(key: 'jwt')}),
          options: Options(responseType: ResponseType.plain));

      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Fetch Trips");
      }
      List<Trip> ownedTrip = tripListFromJson(response.data);
      // Return both of the list of trips
      return tripList + ownedTrip;
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }

  // Create a trip with the current user as the leader
  static Future<int?> createTrip(String name, String notes) async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.createTripAPI}',
              data: jsonEncode(
                <String, String>{'name': name, 'notes': notes},
              ));
      if (response.statusCode != 200) {
        throw Exception("Error in Creating a Trip");
      }
      // Successfully added a trip
      return 200;
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }
}
