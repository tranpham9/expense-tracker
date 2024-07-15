// Important URL's for talking to the endpoints
class Config {
  // Base URL
  static const String localApiURL = 'http://192.168.1.128:5000/api';
  static const String remoteApiURL =
      'https://accountability-190955e8b06f.herokuapp.com/api';
  // Login/Register
  static const String loginAPI = '/users/login';
  static const String registerAPI = 'users/register';
  // User
  static const String joinTripAPI = '/users/joinTrip';
  // Trips
  static const String getTripsAPI = '/trips/listMemberOf';
  static const String getTripsOwnedAPI = '/trips/listOwnerOf';
  static const String createTripAPI = '/trips/create';
  static const String getTripAPI = '/trips/get';
  static const String updateTripAPI = '/trips/update';
  // Expenses
}
