import os


def notify_by_email(emails):
    for email in emails:
        # Send email
        print(email)
        continue

def get_section_string(section_data, template="{} {} {} {} {}"):
    return template.format(
        'W' if section_data['is_winter'] else 'S',
        os.environ['CURRENT_SCHOOL_YEAR'] + (0 if section_data['is_winter'] else 1),
        section_data['dept'],
        section_data['number'],
        section_data['section']
    )

def get_emails_for_section(section_data):
    # Query contacts for section with restricted? = section_data['restricted_only']
    # Return as array of emails
    return

def notify(sections):

    for section in sections:
        if not section['restricted_only']:
            print("\tBegin notifying all contacts for '{}'...".format(get_section_string(section)))
        else:
            print("\tBegin notifying restricted-seat contacts for '{}'...".format(get_section_string(section)))

        emails = get_emails_for_section(section)
        notify_by_email(emails)

def handler(event, context):
    notify(event['sections'])
