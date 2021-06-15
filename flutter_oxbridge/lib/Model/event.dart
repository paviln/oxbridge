
class Event {
   int eventId;
   String name, city, eventCode;
   String eventStart, eventEnd;
  // bool isLive, checked;
  // int eventRegId;
   var messages = [];

  Event({
       required this.eventId,
       required this.name,
       required this.eventStart,
       required this.eventEnd,
       required this.city,
       required this.eventCode,
     //required this.actualEventStart,
     //required this.isLive,
     //required this.checked,
     //required this.eventRegId,
        required this.messages});

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      eventId: json['eventId']as int,
      name: json['name'] as String,
      eventStart: json['eventStart'] as String,
      eventEnd: json['eventEnd'] as String,
      city: json['city'] as String,
      eventCode: json['eventCode'] as String,
      //actualEventStart:json['actualEventStart'] as String,
      // checked:json['checked'] as bool,
     // eventRegId: json['eventRegId'] as int,
      messages: json['messages'],
      );
    }
}
