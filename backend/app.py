from flask import Flask, request, jsonify
from chesscog.chesscog.recognition.recognition import recognize_chess_position

app = Flask(__name__)

@app.route('/recognize', methods=['POST'])
def recognize():
    # Check if image_path is present in the request files
    if 'image_path' not in request.files:
        return jsonify({'error': 'No image found'}), 400
    
    image = request.files['image_path']
    perspective = request.form.get('perspective', '--white')  # Default perspective if not provided

    try:
        # Perform chess piece recognition
        # Replace this line with your recognition code
        result = recognize_chess_position(image, perspective)
        
        # Return the recognized result as JSON response
        return jsonify({'result': result}), 200
    except Exception as e:
        # If there's an error during recognition, return an error message
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
