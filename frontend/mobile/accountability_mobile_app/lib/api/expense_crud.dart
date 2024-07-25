import 'dart:convert';
import 'package:accountability_mobile_app/api/config.dart';
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
                'cost': cost.toDouble(),
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

  static Future<Expense?>? get(String? id) async {
    final Dio dio = new Dio();

    try {
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.getExpenseAPI}',
          data: jsonEncode(<String, dynamic?>{
            'jwt': await UserManager.getJwt(),
            'expenseId': id
          }));
      // If there was an error, don't refresh jwt
      if (response.statusCode != 200) {
        throw Exception("Error in Get Expense");
      }

      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Successful edit
      return expenseFromJson(jsonEncode(response.data['expense']));
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }

  static Future<bool> update(String expenseId, String name, String description,
    double? cost, List<String>? memberIds) async {
  final Dio dio = new Dio();

  try {
    Response response =
        await dio.post('${Config.remoteApiURL}${Config.updateExpenseAPI}',
            data: jsonEncode(<String, dynamic?>{
              'jwt': await UserManager.getJwt(),
              'expenseId': expenseId,
              'name': name,
              'description': description,
              'cost': cost,
              'memberIds': memberIds
            }));
    // If there was an error, don't refresh jwt
    if (response.statusCode != 200) {
      throw Exception("Error in Updating Expense");
    }

    // Store the jwt
    await UserManager.saveJwt(response.data['jwt']);
    // Successful edit
    return true;
  } catch (e) {
    // Display error message to the console
    print('Error: $e');
  }
  return false;
}

  // Delete an expense
  static Future<Expense?>? delete(String? id) async {
    final Dio dio = new Dio();

    try {
      Response response = await dio.post(
          '${Config.remoteApiURL}${Config.deleteExpenseAPI}',
          data: jsonEncode(<String, String?>{
            'jwt': await UserManager.getJwt(),
            'expenseId': id
          }));
      // If there was an error, don't refresh jwt
      if (response.statusCode != 200) {
        throw Exception("Error in Get Expense");
      }

      // Store the jwt
      await UserManager.saveJwt(response.data['jwt']);
      // Successful edit
      return expenseFromJson(jsonEncode(response.data['expense']));
    } catch (e) {
      print('Error: $e');
    }
    return null;
  }
}
