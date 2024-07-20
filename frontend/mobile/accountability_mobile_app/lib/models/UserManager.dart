// Store JWT
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserManager {
  static const _storage = FlutterSecureStorage();

  static Future<void> saveJwt(String jwt) async {
    await _storage.write(key: 'jwt', value: jwt);
  }

  static Future<String?> getJwt() async {
    return await _storage.read(key: 'jwt');
  }

  static Future<void> deleteJwt() async {
    await _storage.delete(key: 'jwt');
  }
}
