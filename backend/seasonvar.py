import requests

# получаем и проверяем ссылки hd
def hd(link):
	ll = link.split('/')
	ll[2] = 'data-hd.datalock.ru'
	ll[5] = 'hd' + ll[5][2:]
	link_n = "/".join(ll)
	if requests.head(link_n).status_code != 200:
		return link
	return link_n
#######

def seasonvar(url):
	link = []
	try:
		link.append(hd(url))
	except Exception:
		pass
	return link

def main():
	url = input("Seasonvar serial URL: ")
	link = seasonvar(url)
	print(link)

if __name__ == '__main__':
	main()
