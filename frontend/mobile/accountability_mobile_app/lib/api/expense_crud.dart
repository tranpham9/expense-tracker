import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
import 'package:accountability_mobile_app/globals.dart';
import 'package:dio/dio.dart';
import '../models/Expense.dart';
import '../models/UserManager.dart';

class ExpenseCRUD {
  static Future<int?> create(String tripId, String name, String description,
      double cost, List<String> memberIds) async {
    final Dio dio = new Dio();

    try {
      Response response =
          await dio.post('${Config.remoteApiURL}${Config.createExpenseAPI}',
              data: jsonEncode(<String, dynamic?>{
                'jwt': await UserManager.getJwt(),
                'tripId': tripId,
                'name': name,
                'description': description,
                'cost': cost,
                'memberIds': memberIds
              }));
      // If there was an error, don't refresh jwt
      if (response.statusCode != 200) {
        throw Exception("Error in Creating Expense");
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
