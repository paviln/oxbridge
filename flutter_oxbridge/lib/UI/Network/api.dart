import 'dart:convert';
import 'package:flutter_oxbridge/Model/event.dart';
import 'package:flutter_oxbridge/Model/user.dart';
import 'package:http/http.dart' as http;
import 'dart:async';

// Has all the methods to connect to the server
class API {
  // 10.0.2.2 can be used instead of localhost for emulator to connect
  static Future<User> createUser(String firstname, String lastname,
      String emailUsername, String password) async {
    final String url = "http://10.0.2.2:3000/users/register";
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

  Future<List<Event>> fetchEvent() async {
    // Events fetch method
    //'https://jsonplaceholder.typicode.com/users'
    //final response = await http.get(Uri.http('jsonplaceholder.typicode.com', '/users'));
      final response = await http.get(Uri.http('10.0.2.2:3000', '/events'));
      var responseData = json.decode(response.body);
      List<Event> events = [];
    for (var singleUser in responseData) {
      Event event = Event(
       // name: singleUser["name"],
       // email: singleUser["email"],
       // username: singleUser["username"],
        eventId: singleUser["eventId"],
        eventStart: singleUser["eventStart"],
        eventEnd: singleUser["eventEnd"],
        city: singleUser["city"],
        eventCode: singleUser["eventCode"],
        actualEventStart: singleUser["actualEventStart"],
        isLive: singleUser["isLive"],

      );

      //Adding user to the list.
      events.add(event);
    }
    return events;
  }
}
