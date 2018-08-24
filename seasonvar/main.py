from flask import Flask, json, request

from seasonvar import SeasonvarFilms

application = Flask(__name__)
application.config.update( JSON_AS_ASCII = False )

@application.route('/api/')
def films():
	svfilms = SeasonvarFilms(request.args.get('seasonvar'))
	return json.dumps(svfilms.return_data())
	
if __name__ == '__main__':
    application.run(host="127.0.0.1", port="9020", debug=True)
