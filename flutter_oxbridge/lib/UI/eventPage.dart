import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_oxbridge/Model/event.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class EventPage extends StatefulWidget {
  @override
  _EventState createState() => _EventState();
}

class _EventState extends State<EventPage> {
  List<dynamic> _events = [];

  @override
  void initState() {
    fetchData().then((value) {
      _events.addAll(value);
    });
  }

  // Events fetch method
  Future<List<dynamic>> fetchData() async {
    var events = [];
    var url = 'http://10.0.2.2:3000/api/events';
    var response = await http.get(Uri.parse(url));
    var jsonMembers = json.decode(response.body);
    setState(() {
      events =
          jsonMembers.map<Event>((json) => new Event.fromJson(json)).toList();
    });
    return events;
  }

  @override
  Widget build(BuildContext context) {
    print(_events.length);
    return Scaffold(
      appBar: AppBar(
        title: Text('EVENTS'),
      ),
      body: ListView.builder(
        itemBuilder: (context, index) {
          return Card(
            child: Container(
              //height: 1
              padding: EdgeInsets.all(15),
              child: Column(
                children: <Widget>[
                  Text(_events[index].eventId.toString()),
                  Text(_events[index].name),
                  Text(_events[index].eventStart),
                  Text(_events[index].eventEnd),
                  Text(_events[index].city),
                  Text(_events[index].eventCode),
                  Text(_events[index].messages.toString()),
                ],
              ),
            ),
          );
        },
        itemCount: _events.length,
      ),
    );
  }
}
