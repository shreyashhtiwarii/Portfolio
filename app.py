from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    
    # In a real application, you would save this to a database or send an email.
    print(f"New contact message from {name} ({email}): {message}")
    
    return jsonify({"status": "success", "message": "Thank you for your message! We will get back to you soon."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
