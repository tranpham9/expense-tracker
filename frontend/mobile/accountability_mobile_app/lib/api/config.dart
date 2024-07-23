// Important URL's for talking to the endpoints
class Config {
  // Base URL
  static const String localApiURL = 'http://192.168.1.128:5000/api';
  static const String remoteApiURL =
      'https://accountability-190955e8b06f.herokuapp.com/api';
  // Login/Register
  static const String loginAPI = '/users/login';
  static const String registerAPI = '/users/register';
  // User
  static const String forgotPasswordAPI = '/users/forgotPassword';
  static const String updateUserAPI = '/users/update';
  // Trips
  static const String searchTripsAPI = '/trips/search';
  static const String createTripAPI = '/trips/create';
  static const String getTripAPI = '/trips/get';
  static const String updateTripAPI = '/trips/update';
  static const String deleteTripAPI = '/trips/delete';
  static const String joinTripAPI = '/trips/join';
  static const String listExpenseAPI = '/trips/listExpenses';
  static const String getMembersAPI = '/trips/getMembers';
  // Expenses
  static const String createExpenseAPI = '/expenses/create';
  static const String getExpenseAPI = '/expenses/get';
  static const String updateExpenseAPI = '/expenses/update';
}
