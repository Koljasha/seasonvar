import requests, re
from bs4 import BeautifulSoup

def coldfilm(url):
	storage = "s1.o2pmvb3c6o.ru"
	headers = {'referer':"http://s1.o2pmvb3c6o.ru/"}
	answer = []

	if url is None or re.match(r'http://coldfilm.*/news/', url) is None or requests.head(url).status_code != 200:
		return answer

	soup = BeautifulSoup(requests.get(url).text, "html.parser")

	# http://hdgo.cc/video/t/tjvrdh1ecb0u26bmlvorcufy/.....
	all_iframes = soup.find_all('iframe')
	for iframe in all_iframes:
		if re.search(r'hdgo.cc/video', iframe.get('src')) is not None:
			src = iframe.get('src').split('/')
			src[2] = storage
			src = '/'.join(src)

			# http://s2.o2pmvb3c6o.ru/video/t/tjvrdh1ecb0u26bmlvorcufy/.....
			soup = BeautifulSoup(requests.get(src).text, "html.parser")
			try:
				text = soup.find('script', text=re.compile(r'media')).text
			except:
				continue

			link = []
			while text.find('apollostream') != -1:
				text = text[text.find('apollostream'):]
				link.append('http://' + text[:text.find('mp4')+3])
				text = text[text.find('mp4'):]

			url = link[-1]
			res = requests.head(url, headers=headers)

			answer.append(res.headers.get('location'))

	return answer

def main():

	url = input("ColdFilm serial URL: ")
	
	import os, json
	
	if os.path.exists('data.json'):
		os.remove('data.json')
	
	with open('data.json', 'a', encoding="utf-8") as file:
		json.dump(coldfilm(url), file, indent=2, ensure_ascii=False)

	print("OK")

if __name__ == '__main__':
	main()
