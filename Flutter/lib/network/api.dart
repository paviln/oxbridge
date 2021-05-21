import 'dart:convert';
import 'package:http/http.dart';

class API{
  // 10.0.2.2 can be used instead of localhost if we are using emulator
  static String _baseUrl = 'http://localhost:3000'; 
  static Future<Response> createUser(String firstname, String lastname, String emailUsername, String password) async {
   final Response response = await post(Uri.parse('$_baseUrl/users/register'),
    headers: <String, String>{
      'Content-Type':'application/json;charset=UTF-8'
    },
    body: jsonEncode(<String, String>{
      "firstName":firstname, "lastName": lastname, "email": emailUsername, "password": password}));
  if(response.statusCode == 200){
    print(response.body);
  }else{
    print('error');
  }
  return response;
  }
}