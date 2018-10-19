from selenium import webdriver
from urllib.parse import unquote
from time import sleep
import requests, re

###################### Errors List ######################

errors_list = {
		'01' : {'id' : '01', 'text' : 'invalid link'},
		'02' : {'id' : '02', 'text' : 'errors playlist: no playls2)'},
		'03' : {'id' : '03', 'text' : 'errors playlist: invalid link in playls2'},
		'04' : {'id' : '04', 'text' : 'errors promotion: promotion video pause'},
		'05' : {'id' : '05', 'text' : 'errors video parsing: select playlist'},
		'06' : {'id' : '06', 'text' : 'errors video parsing: series click'},
		'07' : {'id' : '07', 'text' : 'errors video parsing: translates'},
		'08' : {'id' : '08', 'text' : 'errors playlist or change Proxy'}
	}

######################### Class #########################

class SeasonvarFilms():
	
	# инициализация webdriver and переменных
	def __init__(self, url):

		# other options
		options = webdriver.ChromeOptions()

		# Headless Mode
		# options.set_headless()

		# Proxy settings
		# from selenium.webdriver.common.proxy import Proxy, ProxyType
		# proxy = Proxy()
		# proxy.proxy_type = ProxyType.MANUAL
		# proxy.http_proxy = "195.239.196.226:61536"

		# capabilities = webdriver.DesiredCapabilities.CHROME
		# proxy.add_to_capabilities(capabilities)
		
		# With Proxy and/or headless
		self.driver = webdriver.Chrome(chrome_options=options)

		# первичная проверка ссылки
		if url is None or re.match(r'http://seasonvar.ru/serial-', url) is None or requests.head(url).status_code != 200:
			self.errors = {'errors' : errors_list['01']}
			return

		# отрабатываем ссылки .html#rewind=13_seriya
		self.url = url.split('#')[0]
		self.data = []
		self.errors = None

		# получаем данные
		self.make_data()
		# self.print_data()
	#######

	# получение массива из плейлистов
	def make_data(self):
		self.driver.get(self.url)

		# клик для блокировки рекламы
		try:
			self.driver.find_element_by_css_selector('#htmlPlayer_playlist > pjsdiv[fid]').click()
		except Exception:
			self.errors = {'errors' : errors_list['08']}
			return

		sleep(0.5)	
		try:
			els = self.driver.find_elements_by_tag_name('video')
			if len(els) == 2:
				self.driver.execute_script("return arguments[0].pause();", els[1])
			else:
				self.driver.execute_script("return arguments[0].pause();", els[0])
		except Exception:
			self.errors = {'errors' : errors_list['04']}
			return
		
		# получаем все <script pl = "/playls2....>
		els = self.driver.find_elements_by_xpath("//*[contains(text(), 'playls2')]")

		if len(els) == 0:
			self.errors = {'errors' : errors_list['02']}
			return
		
		# id для Vuejs v-for
		id_el = 0

		for el in els:
			# получаем каждую "чистую" ссылку
			link = self.driver.execute_script("return arguments[0].textContent;", el)
			link = unquote("http://seasonvar.ru" + link.split('"')[1].split('?')[0])

			translation = self.get_translation(link)

			# Трейлеры не добавляем
			if translation == 'Трейлеры':
				continue

			# получаем данные по ссылке
			res = requests.get(link)

			if res.status_code != 200:
				self.errors = {'errors' : errors_list['03']}
				return

			# объект ответа
			obj = {
				# 'link' : link,
				'id' : id_el,
				'translation' : translation,
				# 'length' : self.get_length(res),
				'series' : self.get_series(res),
			}

			# добавляем объект в список
			self.data.append(obj)
			id_el += 1

		# вызывем получение прямых ссылок
		self.make_data_link()
	#######

	# парсинг для получения ссылок видео
	def make_data_link(self):
			for i in range(len(self.data)):
				if len(self.data) != 1:
					try:
						translates = self.driver.find_elements_by_css_selector('.pgs-trans > li[data-click]')
						self.driver.execute_script("return arguments[0].click();", translates[i])
					except Exception:
						self.errors = {'errors' : errors_list['07']}
						return	
					sleep(0.5)
				
				try:
					els = self.driver.find_elements_by_css_selector('#htmlPlayer_playlist > pjsdiv[fid]')
				except Exception:
					self.errors = {'errors' : errors_list['05']}
					return
				
				for j in range(len(els)):
					sleep(0.1)
					try:
						self.driver.execute_script("return arguments[0].click();", els[j])
					except Exception:
						self.errors = {'errors' : errors_list['06']}
						return	
					
					link = self.driver.find_element_by_tag_name('video').get_attribute('currentSrc')
					self.data[i]['series'][j]['link'] = self.link_hd(link)
	#######

	# получаем и проверяем ссылки hd
	def link_hd(self, link):
		ll = link.split('/')
		ll[5] = 'hd' + ll[5][2:]

		ll[2] = 'data-hd.datalock.ru'
		link_n = "/".join(ll)
		if requests.head(link_n).status_code == 200:
			return link_n

		ll[2] = 'data-hd-temp.datalock.ru'
		link_n = "/".join(ll)
		if requests.head(link_n).status_code == 200:
			return link_n

		return link
#######

	# перевод для ссылки
	def get_translation(self, link):
		translation = link.split('/')[5].split('trans')[1]
		if len(translation) == 0:
			translation = "Стандартный"
		translation = re.sub(r'\+', ' ', translation)
		return translation
	#######

	# серий в сезоне
	def get_length(self, res):
		return len(res.json())
	#######

	# получаем серии
	def get_series(self, res):
		data = []

		# id для Vuejs v-for
		id_el = 0
		
		for r in res.json():
			title = r.get('title').split('<br>')[0]
			try:
				in_trans = r.get('title').split('<br>')[1]
			except IndexError:
				in_trans = None
			subtitle = r.get('subtitle')[4:].split('?')[0]
			obj = {
				'id' : id_el,
				'in_trans': in_trans,
				'title' : title,
				'subtitle' : subtitle
			}
			data.append(obj)
			id_el += 1
		return data
	#######

	# возвращаем json
	def return_data(self):
		if self.errors is not None:
			return self.errors
		return {'films' : self.data}
	#######
	
	# удаление webdriver
	def __del__(self):
		self.driver.quit()
	#######
	
######################### End Class #########################


def main():
	
	url = input("Seasonvar serial URL: ")
	sv = SeasonvarFilms(url)

	import os, json
	
	if os.path.exists('data.json'):
		os.remove('data.json')
	
	with open('data.json', 'a', encoding="utf-8") as file:
		json.dump(sv.return_data(), file, indent=2, ensure_ascii=False)

	print("OK")

##############################
# document.querySelectorAll('.pgs-trans > li[data-click]') - переводы
# document.querySelectorAll('#htmlPlayer_playlist > pjsdiv[fid]') - серии
# document.querySelectorAll('video')[1].pause() - стоп реклама
# document.querySelectorAll('video')[0].currentSrc - адрес видео
##############################


if __name__ == '__main__':
	main()
