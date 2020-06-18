from bs4 import BeautifulSoup
import requests as r
import urllib.request
from time import sleep
import os

full_link = "https://leagueoflegends.fandom.com"

def main():
    # response =  r.get("https://leagueoflegends.fandom.com/wiki/Category:Champion_squares")
    # soup = BeautifulSoup(response.text)
    # links = soup.select(".category-page__member-link")
    # for link in links[108:]:
    #     # if "Original" in link.get_text():
    #     print(link)
    #     href = link['href']
    #     full_path = full_link + href
    #     # save_image(download_link)
    #     response2 = r.get(full_path)
    #     soup = BeautifulSoup(response2.text)
    #     find = soup.select(".fullImageLink img")
    #     find_title = soup.select(".page-header__title")
    #     save_image(find[0].get("data-src"), find_title[0].get_text())
    #     sleep(0.5)
    for filename in os.listdir("./squares"):
        os.rename("./squares/" + filename, "./squares/" + filename + ".jpg")

def save_image(link, title):
    # filename = link.split('/')[-1]
    print(link)
    urllib.request.urlretrieve(link, filename="squares/" + title.split(" ")[0] + ".jpg")

if __name__ == "__main__":
    main()

