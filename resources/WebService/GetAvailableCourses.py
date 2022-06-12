import os
import random
import requests
from bs4 import BeautifulSoup

CURRENT_SCHOOL_YEAR = int(os.environ['CURRENT_SCHOOL_YEAR'])
SECTION_URL_TEMPLATE = "https://courses.students.ubc.ca/cs/courseschedule?" \
                       "sesscd={}&pname=subjarea&tname=subj-section&sessyr={}&dept={}&course={}&section={}"

MOCK_DATA = [
    {
        'session': 'S',
        'department': 'COMM',
        'number': '390',
        'section': '971'
    },
    {
        'session': 'S',
        'department': 'INVALID',
        'number': '305A',
        'section': '921'
    },
    {
        'session': 'S',
        'department': 'PSYC',
        'number': '305A',
        'section': '921'
    },
    {
        'session': 'S',
        'department': 'CPSC',
        'number': '103',
        'section': '9W1'
    },
    {
        'session': 'S',
        'department': 'CPSC',
        'number': '103',
        'section': 'V01'
    },
    {
        'session': 'W',
        'department': 'CLST',
        'number': '301',
        'section': 'T05'
    }
]


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


def get_seat_summary(section_data):
    soup = get_section_soup(section_data)
    title = soup.find('h4')
    description = soup.find('h5')

    if "no longer offered" in soup.text:
        raise InvalidSectionError("Section does not exist")
    
    if "Out of Service" in soup.find('div', attrs={'class': 'content expand'}).text:
        raise OutOfServiceException()
    
    if not title or not description:
        raise MissingAttributeException(soup.text)

    seat_summary = {
        'title': title.text,
        'description': description.text
    }
    for x in soup.find('table', attrs={'class': '\'table'}).contents:
        try:
            # Set first word of each row as dict key
            seat_summary[x.td.text.split()[0]] = int(x.strong.text)
        except AttributeError:
            pass
        except ValueError:
            pass
    return seat_summary


def get_available_sections(sections):
    if not sections:
        return
    sections_to_refresh = sections

    available_sections = []
    invalid_sections = []

    print(":: get_available_sections: Seat summaries")

    for section in sections_to_refresh:
        try:
            seat_summary = get_seat_summary(section)
            section['title'] = seat_summary['title']
            section['description'] = seat_summary['description']
            print("\t{}:\t".format(get_section_string(section)) + str(seat_summary))

            if seat_summary['General'] > 0:
                section['restricted_only'] = False
                available_sections.append(section)
            elif seat_summary['Restricted'] > 0:
                section['restricted_only'] = True
                available_sections.append(section)

        except InvalidSectionError as e:
            invalid_sections.append({
                'course': section,
                'reason': e.args[0]
            })
        except OutOfServiceException:
            pass
        except MissingAttributeException as e:
            print(":: Unable to get info for " + get_section_string(section) + ", dumping soup...")
            print(str(e))
            pass
        except requests.exceptions.RequestException as e:
            # print(e)
            pass

    if invalid_sections:
        print(":: get_available_sections: Invalid section(s): " + str(invalid_sections))
        pass

    return { 
        'availableCourses': available_sections,
        'invalidCourses': invalid_sections
    }


def format_section(section_string):
    arr = section_string.split()
    return {
        'session': arr[0],
        'department': arr[1],
        'number': arr[2],
        'section': arr[3] 
    }


def handler(event, context):
    return get_available_sections(map(format_section, event.get('sections')))