// Important URL's for talking to the endpoints
class Config {
  // Base URL
  static const String localApiURL = 'http://192.168.1.128:5000/api';
  static const String remoteApiURL =
      'https://accountability-190955e8b06f.herokuapp.com/api';
  // Login/Register
  static const String loginAPI = '/login';
  static const String registerAPI = '/registerUser';
  // Trips
  static const String getTripsAPI = '/trips/getTripsForUser';
  // Expenses
}
