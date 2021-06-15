import 'dart:convert';
import 'package:flutter_oxbridge/Model/event.dart';
import 'package:flutter_oxbridge/Model/user.dart';
import 'package:http/http.dart' as http;
import 'dart:async';

import 'package:http/http.dart';

class Resource<T> {
  final String url;
  T Function(Response response) parse;

  Resource({required this.url, required this.parse});
}

// Has all the methods to connect to the server
class API {
  static String apiurl = "http://10.0.2.2:3000/api/";
  // 10.0.2.2 can be used instead of localhost for emulator to connect
  static Future<User> createUser(String firstname, String lastname,
    String emailUsername, String password) async {
    final String url = "http://10.0.2.2:3000/api/users/register";
    final response = await http.post(Uri.parse(url),
        headers: <String, String>{
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: jsonEncode(<String, String>{
          "firstname": firstname,
          "lastname": lastname,
          "emailUsername": emailUsername,
          "password": password
        }));
    if (response.statusCode == 200) {
      // print(response.body);
      return User.fromJson(json.decode(response.body));
    } else {
      // print('error');
      throw Exception(response.body);
    }
  }

  Future<T> load<T>(Resource<T> resource) async {
    final uri = Uri.parse(resource.url);
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      return resource.parse(response);
    } else {
      throw Exception('Failed to load data!');
    }
  }

  static Resource<List<Event>> get all {
    return Resource(
        url: apiurl + "event",
        parse: (response) {
          final result = json.decode(response.body);
          Iterable list = result['events'];
          return list.map((model) => Event.fromJson(model)).toList();
        });
  }
}
