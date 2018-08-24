from flask import Flask, json, request

from coldfilm import coldfilm
from seasonvar import seasonvar

application = Flask(__name__)
application.config.update( JSON_AS_ASCII = False )

@application.route('/api/')
def films():
	if request.args.get('seasonvar') is not None:
		return json.dumps(seasonvar(request.args.get('seasonvar')))
	return json.dumps(coldfilm(request.args.get('coldfilm')))
	
if __name__ == '__main__':
    application.run(host="127.0.0.1", port="9020", debug=True)