import os

SECTION_URL_TEMPLATE = "https://courses.students.ubc.ca/cs/courseschedule?" \
                       "sesscd={}&pname=subjarea&tname=subj-section&sessyr={}&dept={}&course={}&section={}"
EMAIL_CONTENT = "There is a spot available for {}! Grab it quick before it's gone!\n{}"
notified = []


def notify_by_email(emails, course_name, course_link):
    msg = EMAIL_CONTENT.format(course_name, course_link)
    for email in emails:
        # Send email
        print(msg)
        continue

def get_section_string(section_data, template="{} {} {} {} {}"):
    return template.format(
        section_data['session'],
        int(os.environ['CURRENT_SCHOOL_YEAR']) + (0 if section_data['session'] == 'W' else 1),
        section_data['department'],
        section_data['number'],
        section_data['section']
    )

def notify(to_notify):
    for notify_dict in to_notify:
        section = notify_dict['course']
        emails = notify_dict['emails']

        course_name = get_section_string(section)
        course_link = get_section_string(section, SECTION_URL_TEMPLATE)
        if not section['restricted_only']:
            print("\tBegin notifying all contacts for '{}'...".format(course_name))
        else:
            print("\tBegin notifying restricted-seat contacts for '{}'...".format(course_name))

        notify_by_email(emails, course_name, course_link)

def handler(event, context):
    notify(event['data'])
    return {
        'statusCode': 200,
        'body': event['data']
    }
