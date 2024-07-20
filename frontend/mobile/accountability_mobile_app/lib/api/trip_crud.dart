import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:accountability_mobile_app/models/UserManager.dart';
import 'package:dio/dio.dart';
import '../models/Trip.dart';

class TripCRUD {
  // Create a trip with the current user as the leader
  static Future<int?> createTrip(String name, String description) async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.createTripAPI}',
              data: jsonEncode(
                <String, String?>{
                  'jwt': await UserManager.getJwt(),
                  'name': name,
                  'description': description
                },
              ));
      if (response.statusCode != 200) {
        throw Exception("Error in Creating a Trip");
      }

      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Successfully added a trip
      return 200;
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }

  // Fetch a list of trips the user is in
  static Future<List<Trip>?> getTrips(int page, String query) async {
    // Create a connection client
    final Dio dio = new Dio();

    try {
      // Call the API
      Response response = await dio.post(
        '${Config.remoteApiURL}${Config.searchTripsAPI}',
        data: jsonEncode(<String, dynamic>{
          'jwt': await UserManager.getJwt(),
          'page': page,
          "query": query
        }),
      );

      // If there was an error, return an error
      if (response.statusCode != 200) {
        throw Exception("Failed to Fetch Trips");
      }
      // Keep track of a list of trips that user is apart of
      List<Trip> tripList = tripListFromJson(jsonEncode(response.data));
      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);

      // Return the list of found trips
      return tripList;
    } on DioException catch (e) {
      print('Error: $e');
      // return nothing
      return null;
    }
  }

  // update trip (Only for owner)
  static Future<int?> updateTrip(
      String tripId, String name, String description) async {
    final Dio dio = new Dio();

    try {
      // TODO: Need to put the correct url's here
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.updateTripAPI}',
              data: jsonEncode(<String, String?>{
                'jwt': await UserManager.getJwt(),
                'tripId': tripId,
                'name': name,
                'description': description
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
  // delete trip (Only for the owner)

  // join a trip TODO: implement checking if the trip even exists
  static Future<int?> joinTrip(String inviteCode) async {
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.joinTripAPI}',
              data: jsonEncode(<String, String?>{
                'jwt': await UserManager.getJwt(),
                'inviteCode': inviteCode,
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
