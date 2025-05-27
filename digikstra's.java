import 'package:flutter/material.dart';

void main() {
  runApp(SmartIrrigationApp());
}

class SmartIrrigationApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Report Issue',
      theme: ThemeData(primarySwatch: Colors.green),
      home: FieldScreen(),
    );
  }
}

class FieldScreen extends StatelessWidget {
  final List<FieldNode> nodes = List.generate(
    16,
    (index) => FieldNode(
      id: 'Z${index + 1}',
      weight: (index + 1) * 2,
      emoji: index % 5 == 0
          ? '💧'
          : index % 7 == 0
              ? '🐛'
              : '',
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Farm Field Map')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text('Menu')),
            ListTile(
              title: Text('Basin Feedback'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => FeedbackForm()),
                );
              },
            ),
          ],
        ),
      ),
      body: GridView.count(
        crossAxisCount: 4,
        padding: EdgeInsets.all(8),
        children: nodes.map((node) => FieldTile(node)).toList(),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Dijkstra optimization triggered')),
          );
        },
        child: Icon(Icons.route),
        tooltip: 'Run Dijkstra',
      ),
    );
  }
}

class FieldNode {
  final String id;
  final int weight;
  final String emoji;
  FieldNode({required this.id, required this.weight, required this.emoji});
}

class FieldTile extends StatelessWidget {
  final FieldNode node;
  FieldTile(this.node);

  @override
  Widget build(BuildContext context) {
    Color bgColor = node.weight > 20
        ? Colors.red.shade200
        : node.weight > 10
            ? Colors.orange.shade200
            : Colors.green.shade200;
    return Card(
      color: bgColor,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(node.id, style: TextStyle(fontWeight: FontWeight.bold)),
            Text('Weight: ${node.weight}'),
            Text(node.emoji, style: TextStyle(fontSize: 24)),
          ],
        ),
      ),
    );
  }
}

class FeedbackForm extends StatefulWidget {
  @override
  _FeedbackFormState createState() => _FeedbackFormState();
}

class _FeedbackFormState extends State<FeedbackForm> {
  final _formKey = GlobalKey<FormState>();
  String selectedZone = 'Z1';
  String selectedFeedback = 'Dry';
  final TextEditingController notesController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Basin Feedback Form')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField(
                value: selectedZone,
                items: List.generate(
                  16,
                  (index) => DropdownMenuItem(
                    value: 'Z${index + 1}',
                    child: Text('Z${index + 1}'),
                  ),
                ),
                onChanged: (value) {
                  setState(() {
                    selectedZone = value as String;
                  });
                },
                decoration: InputDecoration(labelText: 'Select Zone'),
              ),
              DropdownButtonFormField(
                value: selectedFeedback,
                items: ['Dry', 'Pest', 'Overwatered', 'Healthy']
                    .map((fb) => DropdownMenuItem(
                          value: fb,
                          child: Text(fb),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    selectedFeedback = value as String;
                  });
                },
                decoration: InputDecoration(labelText: 'Feedback Type'),
              ),
              TextFormField(
                controller: notesController,
                decoration: InputDecoration(labelText: 'Additional Notes'),
                maxLines: 3,
              ),
              SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Feedback Submitted')),
                      );
                      Navigator.pop(context);
                    }
                  },
                  child: Text('Submit'),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}