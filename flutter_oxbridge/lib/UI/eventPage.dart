import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_oxbridge/UI/Network/api.dart';
class ShowEvent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    
    API api = new API(); // API object to call getEvent() method
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("EVENTS"),
      ),
      
      body: Container(
          padding: EdgeInsets.all(16.0),
          child: FutureBuilder(
            future: api.fetchEvent(),
            builder: (BuildContext ctx, AsyncSnapshot snapshot) {
              if (snapshot.data == null) {
                return Container(
                  child: Center(
                    child: CircularProgressIndicator(),
                  ),
                );
              } else {
                return ListView.builder(
                  itemCount: snapshot.data.length,
                  itemBuilder: (ctx, index) => ListTile(
                    title: Text(snapshot.data[index].eventId),
                    subtitle: Text(snapshot.data[index].eventStart),
                    contentPadding: EdgeInsets.only(bottom: 20.0),
                  ),
                );
              }
            },
          ),
        ),
    );
  }
}
