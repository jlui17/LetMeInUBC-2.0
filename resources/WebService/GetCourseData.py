from multiprocessing.sharedctypes import Value
import os
import requests
import random
from bs4 import BeautifulSoup

CURRENT_SCHOOL_YEAR = int(os.environ['CURRENT_SCHOOL_YEAR'])
SECTION_URL_TEMPLATE = "https://courses.students.ubc.ca/cs/courseschedule?" \
                       "sesscd={}&pname=subjarea&tname=subj-section&sessyr={}&dept={}&course={}&section={}"


class InvalidSectionError(Exception):
    pass


class OutOfServiceException(Exception):
    pass


class MissingAttributeException(Exception):
    pass


# From https://www.jcchouinard.com/random-user-agent-with-python-and-beautifulsoup/
def get_random_ua():
    ua_strings = [
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10) AppleWebKit/600.1.25 (KHTML, like Gecko) Version/8.0 "
        "Safari/600.1.25",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0",
        "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 "
        "Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 "
        "Safari/537.85.10",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
        "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36"
    ]
    return random.choice(ua_strings)


def get_section_string(section_data, template="{} {} {} {} {}"):
    return template.format(
        section_data['session'],
        CURRENT_SCHOOL_YEAR + (0 if section_data['session'] == 'W' else 1),
        section_data['department'],
        section_data['number'],
        section_data['section']
    )


def get_section_soup(section_data):
    headers = {'User-Agent': get_random_ua()}
    url = get_section_string(section_data, SECTION_URL_TEMPLATE)

    r = requests.get(url, headers=headers)
    return BeautifulSoup(r.content, 'html.parser')


def get_section_data(section):
    soup = get_section_soup(section)
    title = soup.find('h4')
    description = soup.find('h5')

    if "no longer offered" in soup.text:
        raise InvalidSectionError("Section does not exist")
    
    if "Out of Service" in soup.find('div', attrs={'class': 'content expand'}).text:
        raise OutOfServiceException()
    
    if not title or not description:
        raise MissingAttributeException(str(soup))

    section_data = {
        'title': title.text,
        'description': description.text,
        'session': section['session'],
        'department': section['department'],
        'number': section['number'],
        'section': section['section'],
    }
    return section_data


def handler(event, context):
    try:
        return get_section_data(event)
    except KeyError as e:
        return {
            'error': "Invalid query parameters"
        }
    except InvalidSectionError as e:
        return {
            'error': "Section does not exist"
        }
    except OutOfServiceException as e:
        return {
            'error': "Please try again"
        }
    except MissingAttributeException as e:
        return {
            'error': "Unable to parse data (Most likely CAPTCHA)"
        }
    except Exception as e:
        return {
            'error': "Unknown error"
        }